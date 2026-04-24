import { useState, useEffect } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import StatsCards from "../components/StatsCards";

const EVENTS_URL  = "http://localhost:9060/api/market-events";
const SUMMARY_URL = "http://localhost:9060/api/market-events-summary";
const SOURCES_URL  = "http://localhost:9060/api/sources";

const DashboardPage = () => {
    const [stats, setStats] = useState({
        events: { total: 0, today: 0 },
        summaries: { total: 0 },
        sources: { active: 0, all: [] }
    });
    const [recentEvents, setRecentEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [ePages, eStats, sPages, src, recent] = await Promise.all([
                    fetch(`${EVENTS_URL}?page=0&size=1`).then(r => r.json()),
                    fetch(`${EVENTS_URL}/stats`).then(r => r.json()),
                    fetch(`${SUMMARY_URL}?page=0&size=1`).then(r => r.json()),
                    fetch(SOURCES_URL).then(r => r.json()),
                    fetch(`${EVENTS_URL}?page=0&size=5`).then(r => r.json()),
                ]);

                setStats({
                    events: { total: ePages.totalElements || 0, today: eStats.today || 0 },
                    summaries: { total: sPages.totalElements || 0 },
                    sources: { active: src.filter(s => s.enabled).length, all: src }
                });
                setRecentEvents(recent.content || []);
            } catch (err) {
                console.error("Erreur dashboard :", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const typeColor = (type) => {
        const types = {
            "RSS":      { bg: "#EEF3FF", color: "#185FA5" },
            "REST":     { bg: "#F0F7EB", color: "#3B6D11" },
            "SCRAPING": { bg: "#FEF3E2", color: "#A05C00" }
        };
        return types[type] || { bg: "#F5F5F5", color: "#555" };
    };

    const cleanContent = (raw) => {
        if (!raw) return "Aucun contenu disponible";
        const descMatch = raw.match(/description=([^,}\]]+)/);
        if (descMatch) return descMatch[1].trim();
        try {
            const parsed = JSON.parse(raw);
            return parsed.description || parsed.content || parsed.text || raw;
        } catch (_) { return raw; }
    };

    if (loading) return (
        <div style={styles.page}>
            <Header />
            <div style={styles.body}>
                <Sidebar activePage="dashboard" />
                <div style={styles.main}>
                    <p style={styles.loading}>Synchronisation des modules...</p>
                </div>
            </div>
        </div>
    );

    return (
        <div style={styles.page}>
            <Header />
            <div style={styles.body}>
                <Sidebar activePage="dashboard" />
                <div style={styles.main}>
                    <div style={styles.headerRow}>
                        <p style={styles.title}>Dashboard Opérationnel</p>
                        <span style={styles.dateBadge}>
                            {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
                        </span>
                    </div>

                    <div style={styles.statsGrid}>
                        <div style={styles.statsSection}>
                            <p style={styles.sectionLabel}>événements de marché</p>
                            <StatsCards 
                                totalEvents={stats.events.total} 
                                todayCount={stats.events.today} 
                                sourcesCount={stats.sources.active} 
                            />
                        </div>
                        <div style={styles.statsSection}>
                            <p style={styles.sectionLabel}>Résumés thématiques des événements de marché</p>
                            <StatsCards 
                                totalEvents={stats.summaries.total} 
                                todayCount={0} 
                                sourcesCount={stats.sources.active} 
                            />
                        </div>
                    </div>

                    <div style={styles.bottomGrid}>
                        {/* Panel des événements récents */}
                        <div style={styles.panel}>
                            <p style={styles.panelTitle}>Activités récentes</p>
                            {recentEvents.length === 0 ? (
                                <p style={styles.empty}>Aucune donnée capturée.</p>
                            ) : (
                                recentEvents.map((event, index) => (
                                    <div key={event.id || `event-${index}`} style={styles.eventRow}>
                                        <div style={styles.eventContent}>
                                            <p style={styles.eventText}>{cleanContent(event.content)?.substring(0, 85)}...</p>
                                            <p style={styles.eventMeta}>
                                                {event.creationDate 
                                                    ? new Date(event.creationDate).toLocaleTimeString("fr-FR", { hour: '2-digit', minute: '2-digit' }) 
                                                    : "--:--"}
                                            </p>
                                        </div>
                                        <span style={{ ...styles.typeBadge, ...typeColor(event.sourceType) }}>
                                            {event.sourceType}
                                        </span>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Panel de l'infrastructure des sources */}
                        <div style={styles.panel}>
                            <p style={styles.panelTitle}>État des Connecteurs</p>
                            {(() => {
                                const grouped = stats.sources.all.reduce((acc, s) => {
                                    acc[s.type] = (acc[s.type] || 0) + 1;
                                    return acc;
                                }, {});
                                return Object.entries(grouped).map(([type, count]) => {
                                    const c = typeColor(type);
                                    const pct = stats.sources.all.length > 0 ? Math.round((count / stats.sources.all.length) * 100) : 0;
                                    return (
                                        <div key={`stat-${type}`} style={styles.barRow}>
                                            <div style={styles.barLabel}>
                                                <span style={{ ...styles.typeBadge, backgroundColor: c.bg, color: c.color }}>{type}</span>
                                                <span style={styles.barCount}>{count} actif(s)</span>
                                            </div>
                                            <div style={styles.barTrack}>
                                                <div style={{ ...styles.barFill, width: `${pct}%`, backgroundColor: c.color }} />
                                            </div>
                                        </div>
                                    );
                                });
                            })()}
                            
                            <div style={styles.sourceScrollArea}>
                                <p style={styles.panelSubTitle}>Détail technique</p>
                                {stats.sources.all.map((s, index) => (
                                    <div key={s.id || `src-${index}`} style={styles.sourceRow}>
                                        <span style={{ ...styles.statusDot, backgroundColor: s.enabled ? "#4CAF50" : "#F44336" }} />
                                        <span style={styles.sourceName}>{s.description || s.url}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const styles = {
    page: { height: "100vh", display: "flex", flexDirection: "column", backgroundColor: "#F8F9FA", fontFamily: "'Inter', sans-serif" },
    body: { display: "flex", flex: 1, overflow: "hidden" },
    main: { flex: 1, padding: "32px", overflowY: "auto" },
    headerRow: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" },
    title: { fontSize: "20px", fontWeight: "700", color: "#111827", margin: 0 },
    dateBadge: { fontSize: "12px", color: "#6B7280", backgroundColor: "#FFF", padding: "6px 12px", borderRadius: "20px", border: "1px solid #E5E7EB" },
    statsGrid: { display: "flex", flexDirection: "column", gap: "20px", marginBottom: "24px" },
    sectionLabel: { fontSize: "11px", fontWeight: "700", color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "12px" },
    loading: { textAlign: "center", padding: "100px", color: "#6B7280" },
    bottomGrid: { display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "24px" },
    panel: { 
        backgroundColor: "white", 
        borderRadius: "16px", 
        padding: "24px", 
        boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
        borderWidth: "1px",
        borderStyle: "solid",
        borderColor: "#F3F4F6"
    },
    panelTitle: { fontSize: "15px", fontWeight: "600", color: "#111827", marginBottom: "20px" },
    panelSubTitle: { fontSize: "11px", fontWeight: "700", color: "#9CA3AF", textTransform: "uppercase", marginTop: "24px", marginBottom: "12px" },
    eventRow: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid #F3F4F6" },
    eventText: { fontSize: "13px", color: "#374151", margin: "0 0 4px" },
    eventMeta: { fontSize: "11px", color: "#9CA3AF" },
    barRow: { marginBottom: "16px" },
    barLabel: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" },
    barCount: { fontSize: "12px", color: "#6B7280" },
    barTrack: { height: "6px", backgroundColor: "#F3F4F6", borderRadius: "10px" },
    barFill: { height: "100%", borderRadius: "10px" },
    sourceScrollArea: { maxHeight: "180px", overflowY: "auto", marginTop: "10px" },
    sourceRow: { display: "flex", alignItems: "center", gap: "10px", padding: "8px 0" },
    statusDot: { width: "7px", height: "7px", borderRadius: "50%" },
    sourceName: { fontSize: "12px", color: "#4B5563", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
    typeBadge: { fontSize: "10px", fontWeight: "700", padding: "4px 10px", borderRadius: "6px" },
    empty: { textAlign: "center", color: "#9CA3AF", fontSize: "13px" }
};

export default DashboardPage;