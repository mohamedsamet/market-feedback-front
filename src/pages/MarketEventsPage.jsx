import { useState, useEffect } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import MarketEventModal from "../components/MarketEventModal";
import StatsCards from "../components/StatsCards";
import { getAllMarketEvents, fetchStats } from "../services/marketEventService";

const MarketEventsPage = () => {
    const [sourcesCount, setSourcesCount] = useState(0);
    const [events, setEvents]                   = useState([]);
    const [selectedEvent, setSelectedEvent]     = useState(null);
    const [loading, setLoading]                 = useState(true);
    const [search, setSearch]                   = useState("");
    const [source, setSource]                   = useState("");
    const [availableSources, setAvailableSources] = useState([]);
    const [page, setPage]                       = useState(0);
    const [size]                                = useState(10);
    const [totalPages, setTotalPages]           = useState(0);
    const [totalElements, setTotalElements]     = useState(0);
    const [todayCount, setTodayCount]           = useState(0);

    useEffect(() => {
        fetchStats()
            .then(data => {
                setTodayCount(data.today);
                setSourcesCount(data.sources);
            })
            .catch(err => console.error("Erreur stats :", err));
    }, []);

    useEffect(() => {
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

                setAvailableSources(prev =>
                    [...new Set([...prev, ...newSources])]
                );
            })
            .catch(error => {
                console.error("Erreur chargement :", error);
                setLoading(false);
            });
    }, [search, source, page]);

    const handleClose = () => setSelectedEvent(null);

    const handleSearch = (e) => {
        setSearch(e.target.value);
        setPage(0);
    };

    const handleSource = (e) => {
        setSource(e.target.value);
        setPage(0);
    };

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
                                onChange={handleSearch}
                                style={styles.search}
                            />

                            <select
                                value={source}
                                onChange={handleSource}
                                style={styles.select}
                            >
                                <option value="">Toutes les sources</option>
                                {availableSources.map(s => (
                                    <option key={s} value={s}>{s}</option>
                                ))}
                            </select>

                            <span style={styles.count}>{totalElements} événements</span>
                        </div>

                        {loading ? (
                            <p style={styles.loading}>Chargement...</p>
                        ) : (
                            <>
                                <table style={styles.table}>
                                    <thead>
                                        <tr style={styles.headerRow}>
                                            <th style={{ ...styles.th, width: "100px" }}>ID</th>
                                            <th style={styles.th}>Contenu</th>
                                            <th style={{ ...styles.th, width: "180px" }}>Source</th>
                                            <th style={{ ...styles.th, width: "120px" }}>Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {events.map((event, index) => (
                                            <tr
                                                key={event.id}
                                                style={{
                                                    ...styles.row,
                                                    backgroundColor: index % 2 === 0 ? "white" : "#F9F9F9"
                                                }}
                                                onMouseEnter={e => e.currentTarget.style.backgroundColor = "#F0F7FF"}
                                                onMouseLeave={e => e.currentTarget.style.backgroundColor = index % 2 === 0 ? "white" : "#F9F9F9"}
                                                onClick={() => setSelectedEvent(event)}
                                            >
                                                <td style={{ ...styles.td, ...styles.id, ...styles.right }}>
                                                    {event.id}
                                                </td>
                                                <td style={{ ...styles.td, ...styles.titleCell, ...styles.left }}>
                                                    {event.content?.substring(0, 80)}
                                                </td>
                                                <td style={{ ...styles.td, ...styles.left }}>
                                                    <span style={styles.source}>
                                                        {event.sourceUrl
                                                            ? new URL(event.sourceUrl).hostname
                                                            : "N/A"}
                                                    </span>
                                                </td>
                                                <td style={{ ...styles.td, ...styles.date, ...styles.right }}>
                                                    {event.creationDate
                                                        ? new Date(event.creationDate).toLocaleDateString("fr-FR")
                                                        : "N/A"}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                <div style={styles.pagination}>
                                    <button
                                        onClick={() => setPage(page - 1)}
                                        disabled={page === 0}
                                        style={styles.pageBtn}
                                    >
                                        Précédent
                                    </button>
                                    <span style={styles.pageInfo}>
                                        Page {page + 1} / {totalPages}
                                    </span>
                                    <button
                                        onClick={() => setPage(page + 1)}
                                        disabled={page + 1 >= totalPages}
                                        style={styles.pageBtn}
                                    >
                                        Suivant
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <MarketEventModal event={selectedEvent} onClose={handleClose} />
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
    pageInfo:       { fontSize: "13px", color: "#555" }
};

export default MarketEventsPage;