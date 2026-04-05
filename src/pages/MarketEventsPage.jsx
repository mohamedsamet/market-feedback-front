import { useState, useEffect } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import MarketEventModal from "../components/MarketEventModal";
import { getAllMarketEvents } from "../services/marketEventService";
import StatsCards from "../components/StatsCards";

const MarketEventsPage = () => {

    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        getAllMarketEvents()
            .then(data => {
                setEvents(data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Erreur chargement :", error);
                setLoading(false);
            });
    }, []);

    const handleClose = () => setSelectedEvent(null);

    const filteredEvents = events.filter(event =>
        event.content?.toLowerCase().includes(search.toLowerCase()) ||
        event.sourceUrl?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div style={styles.page}>

            <Header />

            <div style={styles.body}>

                <Sidebar activePage="events" />

                <div style={styles.main}>

                    <p style={styles.title}>Market Events</p>

                    <StatsCards events={events} />

                    <div style={styles.tableContainer}>

                        <div style={styles.toolbar}>
                            <input
                                type="text"
                                placeholder="Rechercher..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                style={styles.search}
                            />
                            <span style={styles.count}>
                                {filteredEvents.length} événements
                            </span>
                        </div>

                        {loading ? (
                            <p style={styles.loading}>Chargement...</p>
                        ) : (
                            <table style={styles.table}>
                                <thead>
                                    <tr style={styles.headerRow}>
                                        <th style={{ ...styles.th, width: "100px" }}>ID</th>
                                        <th style={styles.th}>Titre</th>
                                        <th style={{ ...styles.th, width: "150px" }}>Source</th>
                                        <th style={{ ...styles.th, width: "120px" }}>Date</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {filteredEvents.map((event, index) => (
                                        <tr
                                            key={event.id}
                                            style={{
                                                ...styles.row,
                                                backgroundColor: index % 2 === 0 ? "white" : "#F9F9F9"
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.backgroundColor = "#F0F7FF";
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.backgroundColor =
                                                    index % 2 === 0 ? "white" : "#F9F9F9";
                                            }}
                                            onClick={() => setSelectedEvent(event)}
                                        >
                                            {/* ID */}
                                            <td style={{ ...styles.td, ...styles.id }} title={event.id}>
                                                {event.id}
                                            </td>

                                            {/* TITLE */}
                                            <td style={{ ...styles.td, ...styles.titleCell }}>
                                                {event.content?.substring(0, 80)}
                                            </td>

                                            {/* SOURCE */}
                                            <td style={styles.td}>
                                                <span style={styles.source}>
                                                    {new URL(event.sourceUrl).hostname}
                                                </span>
                                            </td>

                                            {/* DATE */}
                                            <td style={{ ...styles.td, ...styles.date }}>
                                                {new Date(event.creationDate).toLocaleDateString("fr-FR")}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>

            <MarketEventModal
                event={selectedEvent}
                onClose={handleClose}
            />
        </div>
    );
    
};
const styles = {
    page: {
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#F5F5F5",
        fontFamily: "Arial, sans-serif"
    },

    body: {
        display: "flex",
        flex: 1,
        overflow: "hidden"
    },

    main: {
        flex: 1,
        padding: "24px",
        overflowY: "auto"
    },

    title: {
        fontSize: "18px",
        fontWeight: "500",
        color: "#1A1A1A",
        margin: "0 0 20px"
    },

    tableContainer: {
        backgroundColor: "white",
        border: "0.5px solid #E0E0E0",
        borderRadius: "12px",
        overflow: "hidden"
    },

    toolbar: {
        padding: "12px 20px",
        borderBottom: "0.5px solid #E0E0E0",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between"
    },

    search: {
        fontSize: "13px",
        padding: "6px 12px",
        border: "0.5px solid #E0E0E0",
        borderRadius: "6px",
        width: "200px",
        outline: "none"
    },

    count: {
        fontSize: "12px",
        color: "#888"
    },

    table: {
        width: "100%",
        borderCollapse: "collapse",
        tableLayout: "fixed"
    },

   headerRow: {
    backgroundColor: "#E6E6E6", 
},

th: {
    color: "#111111",   
    fontWeight: "500",       
    padding: "12px",
    textAlign: "center",
    borderBottom: "2px solid #CCC"
},

    row: {
        borderBottom: "0.5px solid #F0F0F0",
        cursor: "pointer",
        transition: "0.2s"
    },

    td: {
        padding: "12px 20px",
        fontSize: "13px",
        color: "#333",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap"
    },

    loading: {
        textAlign: "center",
        padding: "40px",
        color: "#888"
    },

    id: {
        fontFamily: "monospace",
        fontWeight: "600",
        color: "#1A1A1A"
    },

    titleCell: {
        fontWeight: "500",
        color: "#222"
    },

    source: {
        backgroundColor: "#EEF3FF",
        color: "#185FA5",
        padding: "4px 8px",
        borderRadius: "6px",
        fontSize: "12px",
        fontWeight: "500"
    },

    date: {
        color: "#555",
        fontWeight: "500"
    }
};

export default MarketEventsPage;