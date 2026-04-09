import { useState, useEffect } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import MarketEventModal from "../components/MarketEventModal";
import StatsCards from "../components/StatsCards";
import { getAllMarketEvents, fetchStats, deleteMarketEvent, deleteMarketEvents } from "../services/marketEventService";
import { DeleteOutlined } from '@ant-design/icons';
const MarketEventsPage = () => {

    const [events, setEvents]                     = useState([]);
    const [selectedEvent, setSelectedEvent]       = useState(null);
    const [loading, setLoading]                   = useState(true);
    const [search, setSearch]                     = useState("");
    const [source, setSource]                     = useState("");
    const [availableSources, setAvailableSources] = useState([]);
    const [page, setPage]                         = useState(0);
    const [size]                                  = useState(10);
    const [totalPages, setTotalPages]             = useState(0);
    const [totalElements, setTotalElements]       = useState(0);
    const [todayCount, setTodayCount]             = useState(0);
    const [sourcesCount, setSourcesCount]         = useState(0);

    // ← nouveaux states pour selection + confirmation
    const [selectedIds, setSelectedIds]           = useState(new Set());
    const [confirmModal, setConfirmModal]         = useState(null);
    // confirmModal = null | { type: "one", id } | { type: "many" }

    useEffect(() => {
        fetchStats()
            .then(data => {
                setTodayCount(data.today);
                setSourcesCount(data.sources);
            })
            .catch(err => console.error("Erreur stats :", err));
    }, []);

    const loadEvents = () => {
        setLoading(true);
        getAllMarketEvents({ search, source, page, size })
            .then(data => {
                setEvents(data.content);
                setTotalPages(data.totalPages);
                setTotalElements(data.totalElements);
                setLoading(false);

                const newSources = data.content
                    .filter(e => e.sourceUrl)
                    .map(e => {
                        try { return new URL(e.sourceUrl).hostname; }
                        catch { return null; }
                    })
                    .filter(Boolean);

                setAvailableSources(prev => [...new Set([...prev, ...newSources])]);
            })
            .catch(error => {
                console.error("Erreur chargement :", error);
                setLoading(false);
            });
    };

    useEffect(() => {
        loadEvents();
    }, [search, source, page]);

    // ── selection ──────────────────────────────────────────────

    const toggleOne = (id) => {
        setSelectedIds(prev => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    const toggleAll = () => {
        if (selectedIds.size === events.length) {
            setSelectedIds(new Set()); // tout décocher
        } else {
            setSelectedIds(new Set(events.map(e => e.id))); // tout cocher
        }
    };

    // ── suppression ────────────────────────────────────────────

    const confirmDeleteOne = (id) => {
        setConfirmModal({ type: "one", id });
    };

    const confirmDeleteMany = () => {
        setConfirmModal({ type: "many" });
    };

    const handleConfirm = async () => {
        try {
            if (confirmModal.type === "one") {
                await deleteMarketEvent(confirmModal.id);
                setSelectedIds(prev => {
                    const next = new Set(prev);
                    next.delete(confirmModal.id);
                    return next;
                });
            } else {
                await deleteMarketEvents([...selectedIds]);
                setSelectedIds(new Set());
            }
            setConfirmModal(null);
            loadEvents();      // recharger la page
            fetchStats()       // mettre à jour les cartes
                .then(data => {
                    setTodayCount(data.today);
                    setSourcesCount(data.sources);
                });
        } catch (err) {
            console.error("Erreur suppression :", err);
        }
    };

    const handleClose = () => setSelectedEvent(null);

    const allChecked = events.length > 0 && selectedIds.size === events.length;
    const someChecked = selectedIds.size > 0;

    return (
        <div style={styles.page}>
            <Header />
            <div style={styles.body}>
                <Sidebar activePage="events" />
                <div style={styles.main}>
                    <p style={styles.title}>Market Events</p>

                    <StatsCards
                        totalEvents={totalElements}
                        todayCount={todayCount}
                        sourcesCount={sourcesCount}
                    />

                    <div style={styles.tableContainer}>
                        <div style={styles.toolbar}>
                            <input
                                type="text"
                                placeholder="Rechercher..."
                                value={search}
                                onChange={e => { setSearch(e.target.value); setPage(0); }}
                                style={styles.search}
                            />

                            <select
                                value={source}
                                onChange={e => { setSource(e.target.value); setPage(0); }}
                                style={styles.select}
                            >
                                <option value="">Toutes les sources</option>
                                {availableSources.map(s => (
                                    <option key={s} value={s}>{s}</option>
                                ))}
                            </select>

                            {/* bouton supprimer sélection — visible seulement si selection */}
                            {someChecked && (
    <button onClick={confirmDeleteMany} style={styles.deleteBtn}>
        <DeleteOutlined style={{ marginRight: "6px" }} />
        Supprimer ({selectedIds.size})
    </button>
)}

                            <span style={styles.count}>{totalElements} événements</span>
                        </div>

                        {loading ? (
                            <p style={styles.loading}>Chargement...</p>
                        ) : (
                            <>
                                <table style={styles.table}>
                                    <thead>
                                        <tr style={styles.headerRow}>

                                            {/* checkbox tout sélectionner */}
                                            <th style={{ ...styles.th, width: "40px" }}>
                                                <input
                                                    type="checkbox"
                                                    checked={allChecked}
                                                    onChange={toggleAll}
                                                />
                                            </th>

                                            <th style={{ ...styles.th, width: "100px" }}>ID</th>
                                            <th style={styles.th}>Contenu</th>
                                            <th style={{ ...styles.th, width: "180px" }}>Source</th>
                                            <th style={{ ...styles.th, width: "120px" }}>Date</th>
                                            <th style={{ ...styles.th, width: "60px" }}></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {events.map((event, index) => (
                                            <tr
                                                key={event.id}
                                                style={{
                                                    ...styles.row,
                                                    backgroundColor: selectedIds.has(event.id)
                                                        ? "#EEF3FF"
                                                        : index % 2 === 0 ? "white" : "#F9F9F9"
                                                }}
                                                onMouseEnter={e => {
                                                    if (!selectedIds.has(event.id))
                                                        e.currentTarget.style.backgroundColor = "#F0F7FF";
                                                }}
                                                onMouseLeave={e => {
                                                    if (!selectedIds.has(event.id))
                                                        e.currentTarget.style.backgroundColor = index % 2 === 0 ? "white" : "#F9F9F9";
                                                }}
                                            >
                                                {/* checkbox ligne */}
                                                <td style={{ ...styles.td, textAlign: "center" }}
                                                    onClick={e => e.stopPropagation()}>
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedIds.has(event.id)}
                                                        onChange={() => toggleOne(event.id)}
                                                    />
                                                </td>

                                                <td style={{ ...styles.td, ...styles.id, ...styles.right }}
                                                    onClick={() => setSelectedEvent(event)}>
                                                    {event.id}
                                                </td>
                                                <td style={{ ...styles.td, ...styles.titleCell, ...styles.left }}
                                                    onClick={() => setSelectedEvent(event)}>
                                                    {event.content?.substring(0, 80)}
                                                </td>
                                                <td style={{ ...styles.td, ...styles.left }}
                                                    onClick={() => setSelectedEvent(event)}>
                                                    <span style={styles.source}>
                                                        {event.sourceUrl
                                                            ? new URL(event.sourceUrl).hostname
                                                            : "N/A"}
                                                    </span>
                                                </td>
                                                <td style={{ ...styles.td, ...styles.date, ...styles.right }}
                                                    onClick={() => setSelectedEvent(event)}>
                                                    {event.creationDate
                                                        ? new Date(event.creationDate).toLocaleDateString("fr-FR")
                                                        : "N/A"}
                                                </td>

                                                {/* bouton supprimer ligne */}
                                                <td style={{ ...styles.td, textAlign: "center" }}
                                                    onClick={e => e.stopPropagation()}>
                                                    <button
    onClick={() => confirmDeleteOne(event.id)}
    style={styles.deleteRowBtn}
    title="Supprimer"
>
    <DeleteOutlined style={{ fontSize: "15px", color: "#A32D2D" }} />
</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                <div style={styles.pagination}>
                                    <button onClick={() => setPage(page - 1)} disabled={page === 0} style={styles.pageBtn}>
                                        Précédent
                                    </button>
                                    <span style={styles.pageInfo}>Page {page + 1} / {totalPages}</span>
                                    <button onClick={() => setPage(page + 1)} disabled={page + 1 >= totalPages} style={styles.pageBtn}>
                                        Suivant
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* modal détail */}
            <MarketEventModal event={selectedEvent} onClose={handleClose} />

            {/* popup confirmation suppression */}
            {confirmModal && (
                <div style={styles.overlay}>
                    <div style={styles.confirmBox}>
                        <p style={styles.confirmTitle}>Confirmer la suppression</p>
                        <p style={styles.confirmText}>
                            {confirmModal.type === "one"
                                ? "Supprimer cet événement ?"
                                : `Supprimer ${selectedIds.size} événement(s) sélectionné(s) ?`}
                        </p>
                        <div style={styles.confirmActions}>
                            <button
                                onClick={() => setConfirmModal(null)}
                                style={styles.cancelBtn}
                            >
                                Annuler
                            </button>
                            <button
                                onClick={handleConfirm}
                                style={styles.confirmBtn}
                            >
                                Supprimer
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const styles = {
    page:           { height: "100vh", display: "flex", flexDirection: "column", backgroundColor: "#F5F5F5", fontFamily: "Arial, sans-serif" },
    body:           { display: "flex", flex: 1, overflow: "hidden" },
    main:           { flex: 1, padding: "24px", overflowY: "auto" },
    left:           { textAlign: "left" },
    right:          { textAlign: "right" },
    title:          { fontSize: "18px", fontWeight: "bold", color: "#1A1A1A", margin: "0 0 20px", textAlign: "left" },
    tableContainer: { backgroundColor: "white", border: "0.5px solid #E0E0E0", borderRadius: "12px", overflow: "hidden" },
    toolbar:        { padding: "12px 20px", borderBottom: "0.5px solid #E0E0E0", display: "flex", alignItems: "center", gap: "12px" },
    search:         { fontSize: "13px", padding: "6px 12px", border: "0.5px solid #E0E0E0", borderRadius: "6px", width: "200px", outline: "none" },
    select:         { fontSize: "13px", padding: "6px 12px", border: "0.5px solid #E0E0E0", borderRadius: "6px", outline: "none", cursor: "pointer", backgroundColor: "white" },
    deleteBtn:      { fontSize: "13px", padding: "6px 14px", backgroundColor: "#FEE2E2", color: "#A32D2D", border: "0.5px solid #F09595", borderRadius: "6px", cursor: "pointer" },
    deleteRowBtn:   { background: "none", border: "none", cursor: "pointer", fontSize: "14px", padding: "2px 6px", borderRadius: "4px" },
    count:          { fontSize: "12px", color: "#888", marginLeft: "auto" },
    table:          { width: "100%", borderCollapse: "collapse", tableLayout: "fixed" },
    headerRow:      { backgroundColor: "#E6E6E6" },
    th:             { color: "#111111", fontWeight: "700", padding: "12px", textAlign: "center", borderBottom: "2px solid #CCC" },
    row:            { borderBottom: "0.5px solid #F0F0F0", cursor: "pointer", transition: "0.2s" },
    td:             { padding: "12px 20px", fontSize: "13px", color: "#333", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
    loading:        { textAlign: "center", padding: "40px", color: "#888" },
    id:             { fontFamily: "monospace", fontWeight: "600", color: "#1A1A1A" },
    titleCell:      { fontWeight: "500", color: "#222" },
    source:         { backgroundColor: "#EEF3FF", color: "#185FA5", padding: "4px 8px", borderRadius: "6px", fontSize: "12px", fontWeight: "500" },
    date:           { color: "#555", fontWeight: "500" },
    pagination:     { display: "flex", justifyContent: "center", alignItems: "center", gap: "12px", padding: "12px" },
    pageBtn:        { padding: "6px 14px", fontSize: "13px", border: "0.5px solid #E0E0E0", borderRadius: "6px", cursor: "pointer", backgroundColor: "white" },
    pageInfo:       { fontSize: "13px", color: "#555" },

    // popup confirmation
    overlay:        { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 },
    confirmBox:     { backgroundColor: "white", borderRadius: "12px", padding: "28px 32px", width: "360px", boxShadow: "0 8px 32px rgba(0,0,0,0.15)" },
    confirmTitle:   { fontSize: "16px", fontWeight: "700", color: "#1A1A1A", margin: "0 0 10px" },
    confirmText:    { fontSize: "14px", color: "#555", margin: "0 0 24px" },
    confirmActions: { display: "flex", justifyContent: "flex-end", gap: "10px" },
    cancelBtn:      { padding: "8px 18px", fontSize: "13px", border: "0.5px solid #E0E0E0", borderRadius: "6px", cursor: "pointer", backgroundColor: "white", color: "#333" },
    confirmBtn:     { padding: "8px 18px", fontSize: "13px", border: "none", borderRadius: "6px", cursor: "pointer", backgroundColor: "#A32D2D", color: "white" },
};

export default MarketEventsPage;