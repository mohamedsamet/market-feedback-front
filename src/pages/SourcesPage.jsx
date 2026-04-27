import { useState, useEffect } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

const API_URL = "http://localhost:9060/api/sources";

/* ── badge palette by type ── */
const TYPE_STYLES = {
    RSS:      { bg: "#EFF6FF", color: "#1D4ED8", border: "#DBEAFE" },
    REST:     { bg: "#F0FDF4", color: "#15803D", border: "#BBF7D0" },
    SCRAPING: { bg: "#FFF7ED", color: "#C2410C", border: "#FED7AA" },
    DEFAULT:  { bg: "#F1F5F9", color: "#475569", border: "#E2E8F0" },
};
const typeStyle = (type) => TYPE_STYLES[type] ?? TYPE_STYLES.DEFAULT;

/* ── Source card ── */
const SourceCard = ({ source }) => {
    const ts = typeStyle(source.type);
    const [hovered, setHovered] = useState(false);

    return (
        <div
            style={{ ...s.card, ...(hovered ? s.cardHover : {}) }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {/* top row */}
            <div style={s.cardTop}>
                <span style={{ ...s.typeBadge, backgroundColor: ts.bg, color: ts.color, borderColor: ts.border }}>
                    {source.type}
                </span>
                <span style={s.description}>{source.description}</span>
            </div>

            {/* url */}
            <div style={s.urlRow}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" style={{ color: "#94A3B8", flexShrink: 0 }}>
                    <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"
                        stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
                    <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"
                        stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
                </svg>
                <span style={s.url} title={source.url}>{source.url}</span>
            </div>

            {/* footer */}
            <div style={s.cardFooter}>
                <div style={s.metaPill}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" style={{ color: "#94A3B8" }}>
                        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.75"/>
                        <path d="M12 7v5l3 3" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
                    </svg>
                    <span>Timeout : {source.timeout}ms</span>
                </div>
                <div style={s.metaPill}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" style={{ color: "#94A3B8" }}>
                        <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                            stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
                    </svg>
                    <span>Retry : {source.retry}</span>
                </div>
            </div>
        </div>
    );
};

/* ── Section block ── */
const Section = ({ label, count, dotColor, empty, children }) => (
    <div style={s.section}>
        <div style={s.sectionHeader}>
            <div style={{ ...s.sectionDot, backgroundColor: dotColor }} />
            <h2 style={s.sectionTitle}>{label}</h2>
            <span style={s.sectionCount}>{count}</span>
        </div>
        {empty
            ? <div style={s.emptyState}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" style={{ color: "#CBD5E1" }}>
                    <path d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0H4"
                        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                <p style={s.emptyText}>Aucune source dans cette catégorie</p>
              </div>
            : <div style={s.grid}>{children}</div>
        }
    </div>
);

/* ── Page ── */
const SourcesPage = () => {
    const [sources, setSources] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(API_URL)
            .then(res => res.json())
            .then(data => { setSources(data); setLoading(false); })
            .catch(err  => { console.error("Erreur sources :", err); setLoading(false); });
    }, []);

    const active   = sources.filter(src => src.enabled);
    const inactive = sources.filter(src => !src.enabled);

    return (
        <div style={s.page}>
            <Header />
            <div style={s.body}>
                <Sidebar activePage="sources" />

                <main style={s.main}>

                    {/* ── Page header ── */}
                    <div style={s.pageHeader}>
                        <div>
                            <h1 style={s.pageTitle}>Sources de collecte</h1>
                            <p style={s.pageSubtitle}>Gestion des connecteurs et flux de données</p>
                        </div>
                        {!loading && (
                            <div style={s.summaryPills}>
                                <span style={s.pillGreen}>
                                    <div style={{ ...s.pillDot, backgroundColor: "#16A34A" }} />
                                    {active.length} active{active.length !== 1 ? "s" : ""}
                                </span>
                                <span style={s.pillRed}>
                                    <div style={{ ...s.pillDot, backgroundColor: "#DC2626" }} />
                                    {inactive.length} inactive{inactive.length !== 1 ? "s" : ""}
                                </span>
                            </div>
                        )}
                    </div>

                    {loading ? (
                        <div style={s.loadingWrap}>
                            <div style={s.spinner} />
                            <span style={s.loadingText}>Chargement…</span>
                        </div>
                    ) : (
                        <>
                            <Section
                                label="Sources actives"
                                count={active.length}
                                dotColor="#16A34A"
                                empty={active.length === 0}
                            >
                                {active.map((src, i) => <SourceCard key={i} source={src} />)}
                            </Section>

                            <Section
                                label="Sources inactives"
                                count={inactive.length}
                                dotColor="#DC2626"
                                empty={inactive.length === 0}
                            >
                                {inactive.map((src, i) => <SourceCard key={i} source={src} />)}
                            </Section>
                        </>
                    )}
                </main>
            </div>
        </div>
    );
};

/* ── styles ── */
const s = {
    page:         { minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: "#F8FAFC", fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" },
    body:         { display: "flex", flex: 1, overflow: "hidden" },
    main:         { flex: 1, padding: "28px 32px", overflowY: "auto" },

    pageHeader:   { display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "28px", flexWrap: "wrap", gap: "12px" },
    pageTitle:    { fontSize: "20px", fontWeight: "600", color: "#0F172A", margin: 0, letterSpacing: "-0.3px" },
    pageSubtitle: { fontSize: "13px", color: "#94A3B8", margin: "3px 0 0" },

    summaryPills: { display: "flex", gap: "8px", alignItems: "center" },
    pillGreen:    { display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", fontWeight: "500", color: "#15803D", backgroundColor: "#F0FDF4", border: "1px solid #BBF7D0", padding: "5px 12px", borderRadius: "20px" },
    pillRed:      { display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", fontWeight: "500", color: "#A32D2D", backgroundColor: "#FEF2F2", border: "1px solid #FECACA", padding: "5px 12px", borderRadius: "20px" },
    pillDot:      { width: "6px", height: "6px", borderRadius: "50%", flexShrink: 0 },

    /* loading */
    loadingWrap:  { display: "flex", flexDirection: "column", alignItems: "center", gap: "12px", paddingTop: "60px" },
    spinner:      { width: "24px", height: "24px", border: "2.5px solid #E2E8F0", borderTop: "2.5px solid #2563EB", borderRadius: "50%", animation: "spin 0.7s linear infinite" },
    loadingText:  { fontSize: "13px", color: "#94A3B8" },

    /* section */
    section:       { marginBottom: "36px" },
    sectionHeader: { display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" },
    sectionDot:    { width: "8px", height: "8px", borderRadius: "50%", flexShrink: 0 },
    sectionTitle:  { fontSize: "14px", fontWeight: "600", color: "#0F172A", margin: 0 },
    sectionCount:  { fontSize: "12px", fontWeight: "500", color: "#64748B", backgroundColor: "#F1F5F9", border: "1px solid #E2E8F0", padding: "2px 9px", borderRadius: "20px" },

    /* grid */
    grid:         { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "14px" },

    /* card */
    card: {
        backgroundColor: "white", border: "1px solid #E2E8F0",
        borderRadius: "12px", padding: "16px 18px",
        display: "flex", flexDirection: "column", gap: "10px",
        boxShadow: "none",
        transition: "box-shadow 0.15s, border-color 0.15s",
        cursor: "default",
    },
    cardHover: {
        boxShadow: "0 4px 14px rgba(15,23,42,0.12)",
    },
    cardTop:     { display: "flex", alignItems: "center", gap: "10px" },
    typeBadge: {
        fontSize: "10.5px", fontWeight: "600", padding: "3px 8px",
        borderRadius: "6px", border: "1px solid", flexShrink: 0,
        letterSpacing: "0.04em",
    },
    description: { fontSize: "13px", fontWeight: "500", color: "#1E293B", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },

    urlRow:  { display: "flex", alignItems: "center", gap: "6px" },
    url:     { fontSize: "12px", color: "#2563EB", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 },

    cardFooter: { display: "flex", gap: "8px", flexWrap: "wrap", paddingTop: "4px", borderTop: "1px solid #F1F5F9" },
    metaPill: {
        display: "flex", alignItems: "center", gap: "5px",
        fontSize: "11.5px", color: "#64748B",
        backgroundColor: "#F8FAFC", border: "1px solid #E2E8F0",
        padding: "3px 9px", borderRadius: "20px",
    },

    /* empty */
    emptyState:  { display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", padding: "36px 0" },
    emptyText:   { fontSize: "13px", color: "#94A3B8" },
};

if (typeof document !== "undefined" && !document.getElementById("sources-spin-style")) {
    const style = document.createElement("style");
    style.id = "sources-spin-style";
    style.textContent = "@keyframes spin { to { transform: rotate(360deg); } }";
    document.head.appendChild(style);
}

export default SourcesPage;