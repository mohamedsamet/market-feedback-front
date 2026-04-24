import { useState, useEffect } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import StatsCards from "../components/StatsCards";
import MarketEventSummaryModal from "../components/MarketEventSummaryModal";
import { getAllMarketEventsSummary, fetchSummaryStats, fetchThemes, deleteMarketEventSummary, deleteMarketEventsSummary } from "../services/marketEventSummaryService";
import { DeleteOutlined } from '@ant-design/icons';

const fmtDate = (d) => d ? new Date(d).toLocaleDateString("fr-FR") : "N/A";

/* ─── theme badge colors (cycling palette) ─────────────────────────────────── */
const THEME_PALETTES = [
    { bg: "#EFF6FF", color: "#1D4ED8", border: "#DBEAFE" },
    { bg: "#F0FDF4", color: "#15803D", border: "#BBF7D0" },
    { bg: "#FFF7ED", color: "#C2410C", border: "#FED7AA" },
    { bg: "#FAF5FF", color: "#7E22CE", border: "#E9D5FF" },
    { bg: "#FFF1F2", color: "#BE123C", border: "#FECDD3" },
    { bg: "#F0F9FF", color: "#0369A1", border: "#BAE6FD" },
];
const themeColor = (theme = "") => THEME_PALETTES[Math.abs(
    [...theme].reduce((acc, c) => acc + c.charCodeAt(0), 0)
) % THEME_PALETTES.length];

/* ─── component ────────────────────────────────────────────────────────────── */
const MarketEventsSummaryPage = () => {
    const [events,           setEvents]           = useState([]);
    const [selectedEvent,    setSelectedEvent]    = useState(null);
    const [loading,          setLoading]          = useState(true);
    const [search,           setSearch]           = useState("");
    const [theme,            setTheme]            = useState("");
    const [availableThemes,  setAvailableThemes]  = useState([]);
    const [page,             setPage]             = useState(0);
    const [size]                                  = useState(10);
    const [totalPages,       setTotalPages]       = useState(0);
    const [totalElements,    setTotalElements]    = useState(0);
    const [todayCount,       setTodayCount]       = useState(0);
    const [sourcesCount,     setSourcesCount]     = useState(0);
    const [selectedIds,      setSelectedIds]      = useState(new Set());
    const [confirmModal,     setConfirmModal]     = useState(null);
    const [hoveredRow,       setHoveredRow]       = useState(null);

    useEffect(() => {
        fetchThemes()
            .then(data => setAvailableThemes(data))
            .catch(err  => console.error("Erreur thèmes :", err));
    }, []);

    useEffect(() => {
        fetchSummaryStats()
            .then(data => { setTodayCount(data.today); setSourcesCount(data.sources); })
            .catch(err  => console.error("Erreur stats :", err));
    }, []);

    const loadEvents = () => {
        setLoading(true);
        getAllMarketEventsSummary({ search, theme, page, size })
            .then(data => {
                setEvents(data.content);
                setTotalPages(data.totalPages);
                setTotalElements(data.totalElements);
                setLoading(false);
            })
            .catch(error => { console.error("Erreur chargement :", error); setLoading(false); });
    };

    useEffect(() => { loadEvents(); }, [search, theme, page]);

    useEffect(() => {
        const enabled  = localStorage.getItem("autoRefresh") === "true";
        const interval = parseInt(localStorage.getItem("refreshInterval") || "30") * 1000;
        if (!enabled) return;
        const timer = setInterval(loadEvents, interval);
        return () => clearInterval(timer);
    }, [page, search]);

    const toggleOne = (id) =>
        setSelectedIds(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });

    const toggleAll = () =>
        setSelectedIds(selectedIds.size === events.length ? new Set() : new Set(events.map(e => e.id)));

    const confirmDeleteOne  = (id) => setConfirmModal({ type: "one", id });
    const confirmDeleteMany = ()   => setConfirmModal({ type: "many" });

    const handleConfirm = async () => {
        try {
            if (confirmModal.type === "one") {
                await deleteMarketEventSummary(confirmModal.id);
                setSelectedIds(prev => { const n = new Set(prev); n.delete(confirmModal.id); return n; });
            } else {
                await deleteMarketEventsSummary([...selectedIds]);
                setSelectedIds(new Set());
            }
            setConfirmModal(null);
            loadEvents();
            fetchSummaryStats().then(data => { setTodayCount(data.today); setSourcesCount(data.sources); });
        } catch (err) { console.error("Erreur suppression :", err); }
    };

    const allChecked  = events.length > 0 && selectedIds.size === events.length;
    const someChecked = selectedIds.size > 0;

    return (
        <div style={s.page}>
            <Header />
            <div style={s.body}>
                <Sidebar activePage="summary" />

                <main style={s.main}>

                    {/* ── Page header ── */}
                    <div style={s.pageHeader}>
                        <div>
                            <h1 style={s.pageTitle}>Market Events Summary</h1>
                            <p style={s.pageSubtitle}>Résumés thématiques des événements de marché</p>
                        </div>
                    </div>

                    {/* ── Stats ── */}
                    <StatsCards
                        totalEvents={totalElements}
                        todayCount={todayCount}
                        sourcesCount={sourcesCount}
                    />

                    {/* ── Table card ── */}
                    <div style={s.card}>

                        {/* toolbar */}
                        <div style={s.toolbar}>
                            <div style={s.toolbarLeft}>
                                <div style={s.searchWrap}>
                                    <svg style={s.searchIcon} viewBox="0 0 16 16" fill="none">
                                        <circle cx="6.5" cy="6.5" r="4.5" stroke="currentColor" strokeWidth="1.25"/>
                                        <path d="M10 10l3.5 3.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round"/>
                                    </svg>
                                    <input
                                        type="text"
                                        placeholder="Rechercher un résumé…"
                                        value={search}
                                        onChange={e => { setSearch(e.target.value); setPage(0); }}
                                        style={s.search}
                                    />
                                </div>

                                <select
                                    value={theme}
                                    onChange={e => { setTheme(e.target.value); setPage(0); }}
                                    style={s.select}
                                >
                                    <option value="">Tous les thèmes</option>
                                    {availableThemes.map(t => (
                                        <option key={t} value={t}>{t}</option>
                                    ))}
                                </select>
                            </div>

                            <div style={s.toolbarRight}>
                                {someChecked && (
                                    <button onClick={confirmDeleteMany} style={s.deleteBulkBtn}>
                                        <DeleteOutlined style={{ fontSize: "13px" }} />
                                        Supprimer ({selectedIds.size})
                                    </button>
                                )}
                                <span style={s.countBadge}>{totalElements} résumés</span>
                            </div>
                        </div>

                        {/* content */}
                        {loading ? (
                            <div style={s.loadingWrap}>
                                <div style={s.spinner} />
                                <span style={s.loadingText}>Chargement…</span>
                            </div>
                        ) : events.length === 0 ? (
                            <div style={s.emptyWrap}>
                                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" style={{ color: "#CBD5E1" }}>
                                    <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 012-2h2a2 2 0 012 2M9 5h6M9 12h6M9 16h4"
                                        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                                </svg>
                                <p style={s.emptyText}>Aucun résumé trouvé</p>
                            </div>
                        ) : (
                            <>
                                <div style={s.tableWrap}>
                                    <table style={s.table}>
                                        <thead>
                                            <tr style={s.thead}>
                                                <th style={{ ...s.th, width: 44 }}>
                                                    <input
                                                        type="checkbox"
                                                        checked={allChecked}
                                                        onChange={toggleAll}
                                                        style={s.checkbox}
                                                    />
                                                </th>
                                                <th style={{ ...s.th, width: 80 }}>ID</th>
                                                <th style={{ ...s.th, width: 190, textAlign: "left" }}>Thème</th>
                                                <th style={{ ...s.th, width: 110 }}>Date</th>
                                                <th style={{ ...s.th, textAlign: "left" }}>Résumé</th>
                                                <th style={{ ...s.th, width: 52 }}></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {events.map((event) => {
                                                const isSelected = selectedIds.has(event.id);
                                                const isHovered  = hoveredRow === event.id;
                                                const palette    = themeColor(event.theme);
                                                const rowBg = isSelected
                                                    ? "#EFF6FF"
                                                    : isHovered ? "#F8FAFC" : "white";

                                                return (
                                                    <tr
                                                        key={event.id}
                                                        style={{ ...s.row, backgroundColor: rowBg }}
                                                        onMouseEnter={() => setHoveredRow(event.id)}
                                                        onMouseLeave={() => setHoveredRow(null)}
                                                    >
                                                        <td style={{ ...s.td, textAlign: "center", width: 44 }}
                                                            onClick={e => e.stopPropagation()}>
                                                            <input
                                                                type="checkbox"
                                                                checked={isSelected}
                                                                onChange={() => toggleOne(event.id)}
                                                                style={s.checkbox}
                                                            />
                                                        </td>

                                                        <td style={{ ...s.td, ...s.tdId }} onClick={() => setSelectedEvent(event)}>
                                                            #{event.id}
                                                        </td>

                                                        <td style={{ ...s.td, textAlign: "left" }} onClick={() => setSelectedEvent(event)}>
                                                            {event.theme
                                                                ? <span style={{ ...s.themeBadge, backgroundColor: palette.bg, color: palette.color, borderColor: palette.border }}>
                                                                    {event.theme.substring(0, 48)}
                                                                  </span>
                                                                : <span style={s.naText}>—</span>}
                                                        </td>

                                                        <td style={{ ...s.td, ...s.tdDate }} onClick={() => setSelectedEvent(event)}>
                                                            {fmtDate(event.genereLe)}
                                                        </td>

                                                        <td style={{ ...s.td, ...s.tdSummary }} onClick={() => setSelectedEvent(event)}>
                                                            {event.contenuFr?.substring(0, 110)}
                                                        </td>

                                                        <td style={{ ...s.td, textAlign: "center" }} onClick={e => e.stopPropagation()}>
                                                            <button
                                                                onClick={() => confirmDeleteOne(event.id)}
                                                                style={{
                                                                    ...s.deleteRowBtn,
                                                                    opacity: isHovered ? 1 : 0,
                                                                }}
                                                                title="Supprimer"
                                                            >
                                                                <DeleteOutlined style={{ fontSize: "13px", color: "#A32D2D" }} />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>

                                {/* pagination */}
                                <div style={s.pagination}>
                                    <button
                                        onClick={() => setPage(p => p - 1)}
                                        disabled={page === 0}
                                        style={{ ...s.pageBtn, opacity: page === 0 ? 0.4 : 1 }}
                                    >
                                        ← Précédent
                                    </button>

                                    <div style={s.pageNumbers}>
                                        {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => (
                                            <button
                                                key={i}
                                                onClick={() => setPage(i)}
                                                style={{ ...s.pageNum, ...(i === page ? s.pageNumActive : {}) }}
                                            >
                                                {i + 1}
                                            </button>
                                        ))}
                                        {totalPages > 7 && <span style={s.pageDots}>…</span>}
                                    </div>

                                    <button
                                        onClick={() => setPage(p => p + 1)}
                                        disabled={page + 1 >= totalPages}
                                        style={{ ...s.pageBtn, opacity: page + 1 >= totalPages ? 0.4 : 1 }}
                                    >
                                        Suivant →
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </main>
            </div>

            {/* ── Detail modal ── */}
            <MarketEventSummaryModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />

            {/* ── Confirm modal ── */}
            {confirmModal && (
                <div style={s.overlay}>
                    <div style={s.confirmBox}>
                        <div style={s.confirmIconWrap}>
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" style={{ color: "#A32D2D" }}>
                                <path d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
                                    stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </div>
                        <p style={s.confirmTitle}>Confirmer la suppression</p>
                        <p style={s.confirmText}>
                            {confirmModal.type === "one"
                                ? "Ce résumé sera définitivement supprimé. Cette action est irréversible."
                                : `${selectedIds.size} résumé(s) sélectionné(s) seront définitivement supprimés.`}
                        </p>
                        <div style={s.confirmActions}>
                            <button onClick={() => setConfirmModal(null)} style={s.cancelBtn}>Annuler</button>
                            <button onClick={handleConfirm} style={s.confirmBtn}>
                                <DeleteOutlined style={{ fontSize: "12px" }} /> Supprimer
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

/* ─── styles ───────────────────────────────────────────────────────────────── */
const s = {
    page:           { minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: "#F8FAFC", fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" },
    body:           { display: "flex", flex: 1, overflow: "hidden" },
    main:           { flex: 1, padding: "28px 32px", overflowY: "auto" },

    pageHeader:     { display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "24px" },
    pageTitle:      { fontSize: "20px", fontWeight: "600", color: "#0F172A", margin: 0, letterSpacing: "-0.3px" },
    pageSubtitle:   { fontSize: "13px", color: "#94A3B8", margin: "3px 0 0", fontWeight: "400" },

    card:           { backgroundColor: "white", border: "1px solid #E2E8F0", borderRadius: "12px", overflow: "hidden", boxShadow: "0 1px 3px rgba(15,23,42,0.04)" },

    toolbar:        { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px", borderBottom: "1px solid #F1F5F9", gap: "12px", flexWrap: "wrap" },
    toolbarLeft:    { display: "flex", alignItems: "center", gap: "10px" },
    toolbarRight:   { display: "flex", alignItems: "center", gap: "10px" },

    searchWrap:     { position: "relative", display: "flex", alignItems: "center" },
    searchIcon:     { position: "absolute", left: "10px", width: "14px", height: "14px", color: "#94A3B8", pointerEvents: "none" },
    search: {
        fontSize: "13px", padding: "7px 12px 7px 32px",
        border: "1px solid #E2E8F0", borderRadius: "8px",
        width: "220px", outline: "none", color: "#0F172A",
        backgroundColor: "#FAFAFA",
    },
    select: {
        fontSize: "13px", padding: "7px 30px 7px 12px",
        border: "1px solid #E2E8F0", borderRadius: "8px",
        outline: "none", cursor: "pointer", backgroundColor: "#FAFAFA",
        color: "#0F172A", appearance: "none", maxWidth: "200px",
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none'%3E%3Cpath d='M6 9l6 6 6-6' stroke='%2394A3B8' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E")`,
        backgroundRepeat: "no-repeat", backgroundPosition: "right 10px center",
    },

    countBadge:     { fontSize: "12px", color: "#64748B", fontWeight: "500", backgroundColor: "#F1F5F9", padding: "4px 10px", borderRadius: "20px", border: "1px solid #E2E8F0" },
    deleteBulkBtn: {
        display: "flex", alignItems: "center", gap: "6px",
        fontSize: "13px", padding: "6px 13px",
        backgroundColor: "#FEF2F2", color: "#A32D2D",
        border: "1px solid #FECACA", borderRadius: "8px",
        cursor: "pointer", fontWeight: "500",
    },

    tableWrap:      { overflowX: "auto" },
    table:          { width: "100%", borderCollapse: "collapse", tableLayout: "fixed" },
    thead:          { backgroundColor: "#F8FAFC" },
    th: {
        color: "#64748B", fontWeight: "600", fontSize: "11px",
        letterSpacing: "0.06em", textTransform: "uppercase",
        padding: "11px 16px", textAlign: "center",
        borderBottom: "1px solid #E2E8F0", whiteSpace: "nowrap",
    },
    row:            { borderBottom: "1px solid #F1F5F9", cursor: "pointer", transition: "background-color 0.1s" },
    td:             { padding: "13px 16px", fontSize: "13px", color: "#334155", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },

    tdId:           { fontFamily: "ui-monospace, 'SF Mono', monospace", fontSize: "12px", color: "#64748B", textAlign: "right", fontWeight: "500" },
    tdDate:         { color: "#94A3B8", fontSize: "12px", fontWeight: "500", textAlign: "center" },
    tdSummary:      { color: "#475569", fontWeight: "400", textAlign: "left" },

    themeBadge: {
        display: "inline-block", padding: "3px 9px", borderRadius: "6px",
        fontSize: "11.5px", fontWeight: "500", border: "1px solid",
        maxWidth: "100%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
    },
    naText:         { color: "#CBD5E1" },
    checkbox:       { width: "15px", height: "15px", accentColor: "#2563EB", cursor: "pointer" },

    deleteRowBtn: {
        background: "none", border: "1px solid #FECACA", cursor: "pointer",
        borderRadius: "6px", padding: "4px 6px", display: "flex",
        alignItems: "center", justifyContent: "center",
        transition: "opacity 0.15s", backgroundColor: "#FEF2F2",
    },

    loadingWrap:    { display: "flex", flexDirection: "column", alignItems: "center", gap: "12px", padding: "60px 0" },
    spinner: {
        width: "24px", height: "24px",
        border: "2.5px solid #E2E8F0", borderTop: "2.5px solid #2563EB",
        borderRadius: "50%", animation: "spin 0.7s linear infinite",
    },
    loadingText:    { fontSize: "13px", color: "#94A3B8" },
    emptyWrap:      { display: "flex", flexDirection: "column", alignItems: "center", gap: "10px", padding: "60px 0" },
    emptyText:      { fontSize: "14px", color: "#94A3B8" },

    pagination:     { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 20px", borderTop: "1px solid #F1F5F9" },
    pageBtn: {
        fontSize: "13px", padding: "6px 14px",
        border: "1px solid #E2E8F0", borderRadius: "8px",
        cursor: "pointer", backgroundColor: "white", color: "#475569", fontWeight: "500",
    },
    pageNumbers:    { display: "flex", gap: "4px", alignItems: "center" },
    pageNum: {
        width: "32px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "13px", border: "1px solid transparent", borderRadius: "8px",
        cursor: "pointer", backgroundColor: "transparent", color: "#64748B", fontWeight: "500",
    },
    pageNumActive:  { backgroundColor: "#2563EB", color: "white", border: "1px solid #2563EB" },
    pageDots:       { fontSize: "13px", color: "#94A3B8", padding: "0 4px" },

    overlay: {
        position: "fixed", inset: 0,
        backgroundColor: "rgba(15,23,42,0.45)",
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 1000, backdropFilter: "blur(2px)",
    },
    confirmBox: {
        backgroundColor: "white", borderRadius: "14px",
        padding: "28px 32px", width: "380px",
        boxShadow: "0 20px 60px rgba(15,23,42,0.18)",
        border: "1px solid #E2E8F0",
    },
    confirmIconWrap: {
        width: "44px", height: "44px", borderRadius: "10px",
        backgroundColor: "#FEF2F2", border: "1px solid #FECACA",
        display: "flex", alignItems: "center", justifyContent: "center",
        marginBottom: "16px",
    },
    confirmTitle:   { fontSize: "15px", fontWeight: "600", color: "#0F172A", margin: "0 0 8px" },
    confirmText:    { fontSize: "13px", color: "#64748B", margin: "0 0 24px", lineHeight: "1.6" },
    confirmActions: { display: "flex", justifyContent: "flex-end", gap: "10px" },
    cancelBtn: {
        padding: "8px 18px", fontSize: "13px",
        border: "1px solid #E2E8F0", borderRadius: "8px",
        cursor: "pointer", backgroundColor: "white", color: "#475569", fontWeight: "500",
    },
    confirmBtn: {
        display: "flex", alignItems: "center", gap: "6px",
        padding: "8px 18px", fontSize: "13px",
        border: "none", borderRadius: "8px",
        cursor: "pointer", backgroundColor: "#A32D2D", color: "white", fontWeight: "500",
    },
};

if (typeof document !== "undefined" && !document.getElementById("mes-spin-style")) {
    const style = document.createElement("style");
    style.id = "mes-spin-style";
    style.textContent = "@keyframes spin { to { transform: rotate(360deg); } }";
    document.head.appendChild(style);
}

export default MarketEventsSummaryPage;