import { useState, useEffect } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Carousel from 'react-bootstrap/Carousel';
import { getAllAnalyses } from "../services/marketEventAnalysisService";

const MarketEventsAnalysesPage = () => {

    const [items, setItems]             = useState([]);
    const [loading, setLoading]         = useState(true);
    const [search, setSearch]           = useState("");
    const [searchInput, setSearchInput] = useState("");
    const [sortUrgence, setSortUrgence] = useState("");

    const loadData = () => {
        setLoading(true);
        getAllAnalyses({ search, sortUrgence })
            .then(data => {
                setItems(Array.isArray(data) ? data : data.content || []);
                setLoading(false);
            })
            .catch(err => {
                console.error("Erreur carousel :", err);
                setLoading(false);
            });
    };

    useEffect(() => { loadData(); }, [search, sortUrgence]);

    const handleSearch = () => setSearch(searchInput);

    const urgenceColor = (urgence) => {
        if (!urgence) return { bg: "#F5F5F5", color: "#555" };
        const u = urgence.toLowerCase();
        if (u === "haute")   return { bg: "#FEE2E2", color: "#A32D2D" };
        if (u === "moyenne") return { bg: "#FEF3E2", color: "#A05C00" };
        if (u === "faible")  return { bg: "#F0F7EB", color: "#3B6D11" };
        return { bg: "#F5F5F5", color: "#555" };
    };

    return (
        <div style={styles.page}>
            <Header />
            <div style={styles.body}>
                <Sidebar activePage="analyses" />
                <div style={styles.main}>
                    <p style={styles.title}>Market Events Analyses</p>

                    <div style={styles.toolbar}>
                        <input
                            type="text"
                            placeholder="Rechercher dans les prédictions et propositions..."
                            value={searchInput}
                            onChange={e => setSearchInput(e.target.value)}
                            onKeyDown={e => e.key === "Enter" && handleSearch()}
                            style={styles.search}
                        />
                        <button onClick={handleSearch} style={styles.searchBtn}>
                            Rechercher
                        </button>
                        {search && (
                            <button
                                onClick={() => { setSearch(""); setSearchInput(""); }}
                                style={styles.clearBtn}
                            >
                                Effacer
                            </button>
                        )}
                        <select
                            value={sortUrgence}
                            onChange={e => setSortUrgence(e.target.value)}
                            style={styles.select}
                        >
                            <option value="">Toutes les urgences</option>
                            <option value="haute">Haute</option>
                            <option value="moyenne">Moyenne</option>
                            <option value="faible">Faible</option>
                        </select>
                        <span style={styles.count}>{items.length} analyses</span>
                    </div>

                    {loading ? (
                        <p style={styles.loading}>Chargement...</p>
                    ) : items.length === 0 ? (
                        <p style={styles.empty}>Aucune analyse trouvée</p>
                    ) : (
                        <Carousel data-bs-theme="dark" interval={null}>
                            {items.map((item, i) => (
                                <Carousel.Item key={i}>
                                    <div style={styles.card}>

                                        <div style={styles.cardHeader}>
                                            <div style={styles.cardHeaderLeft}>
                                                <span style={styles.theme}>{item.theme}</span>
                                                <span style={styles.type}>{item.type}</span>
                                            </div>
                                            <div style={styles.cardHeaderRight}>
                                                <span style={{
                                                    ...styles.urgenceBadge,
                                                    backgroundColor: urgenceColor(item.urgence).bg,
                                                    color: urgenceColor(item.urgence).color
                                                }}>
                                                    ⚡ {item.urgence ?? "N/A"}
                                                </span>
                                                <span style={styles.categorie}>{item.categorie ?? "N/A"}</span>
                                            </div>
                                        </div>

                                        <div style={styles.metaRow}>
                                            <span style={styles.meta}>
                                                Généré le : {item.genereLe
                                                    ? new Date(item.genereLe).toLocaleDateString("fr-FR")
                                                    : "N/A"}
                                            </span>
                                            <span style={styles.meta}>
                                                Analysé le : {item.analyseEl
                                                    ? new Date(item.analyseEl).toLocaleDateString("fr-FR")
                                                    : "N/A"}
                                            </span>
                                            <span style={styles.meta}>Ton : {item.ton ?? "N/A"}</span>
                                        </div>

                                        <div style={styles.divider} />

                                        <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                                            <p style={styles.bold}>
                                                {item.prediction ?? "N/A"}
                                            </p>
                                            <p style={styles.text}>
                                                {item.proposition ?? "N/A"}
                                            </p>
                                        </div>

                                        <p style={styles.position}>{i + 1} / {items.length}</p>
                                    </div>
                                </Carousel.Item>
                            ))}
                        </Carousel>
                    )}
                </div>
            </div>
        </div>
    );
};

const styles = {
    page:            { height: "100vh", display: "flex", flexDirection: "column", backgroundColor: "#F5F5F5", fontFamily: "Arial, sans-serif" },
    body:            { display: "flex", flex: 1, overflow: "hidden" },
    main:            { flex: 1, padding: "24px", overflowY: "auto" },
    title:           { fontSize: "18px", fontWeight: "bold", color: "#1A1A1A", margin: "0 0 20px" },
    toolbar:         { display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" },
    search:          { fontSize: "13px", padding: "8px 14px", border: "0.5px solid #E0E0E0", borderRadius: "6px", width: "340px", outline: "none", backgroundColor: "white" },
    searchBtn:       { fontSize: "13px", padding: "8px 16px", backgroundColor: "#185FA5", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" },
    clearBtn:        { fontSize: "13px", padding: "8px 16px", backgroundColor: "#F5F5F5", color: "#555", border: "0.5px solid #E0E0E0", borderRadius: "6px", cursor: "pointer" },
    select:          { fontSize: "13px", padding: "8px 12px", border: "0.5px solid #E0E0E0", borderRadius: "6px", outline: "none", cursor: "pointer", backgroundColor: "white" },
    count:           { fontSize: "12px", color: "#888", marginLeft: "auto" },
    loading:         { textAlign: "center", padding: "40px", color: "#888" },
    empty:           { textAlign: "center", padding: "40px", color: "#999", fontStyle: "italic" },
    card: { 
    backgroundColor: "white", border: "0.5px solid #E0E0E0", borderRadius: "16px", 
    padding: "28px", boxShadow: "0 4px 16px rgba(0,0,0,0.06)", margin: "0 60px 40px",
    height: "420px",           // ← hauteur fixe
    display: "flex", flexDirection: "column",  // ← layout interne flex
    overflow: "hidden"         // ← coupe ce qui dépasse
},
    cardHeader:      { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" },
    cardHeaderLeft:  { display: "flex", alignItems: "center", gap: "10px" },
    cardHeaderRight: { display: "flex", alignItems: "center", gap: "8px" },
    theme:           { fontSize: "16px", fontWeight: "700", color: "#1A1A1A" },
    type:            { fontSize: "11px", fontWeight: "600", padding: "3px 8px", borderRadius: "5px", backgroundColor: "#EEF3FF", color: "#185FA5" },
    urgenceBadge:    { fontSize: "12px", fontWeight: "600", padding: "4px 10px", borderRadius: "6px" },
    categorie:       { fontSize: "12px", color: "#888", fontStyle: "italic" },
    metaRow:         { display: "flex", gap: "20px", marginBottom: "16px" },
    meta:            { fontSize: "11px", color: "#AAA" },    
    position:        { textAlign: "center", fontSize: "12px", color: "#AAA", margin: "16px 0 0" },
    bold: { fontWeight: "700", color: "#1A1A1A" },
    text: { fontSize: "14px", color: "#333", lineHeight: "1.7", margin: "0 0 12px" },
};

export default MarketEventsAnalysesPage;