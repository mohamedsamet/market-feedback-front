import { useState, useEffect } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { getAllAnalyses } from "../services/marketEventAnalysisService";

const MarketEventsAnalysesPage = () => {

    const [items, setItems]           = useState([]);
    const [loading, setLoading]       = useState(true);
    const [search, setSearch]         = useState("");
    const [searchInput, setSearchInput] = useState("");
    const [sortUrgence, setSortUrgence] = useState("");
    const [activeIndex, setActiveIndex] = useState(0);
    const [propIndex, setPropIndex]   = useState(0);   // index proposition courante

    const loadData = () => {
        setLoading(true);
        getAllAnalyses({ search, sortUrgence })
            .then(data => {
                const list = Array.isArray(data) ? data : data.content || [];
                setItems(list);
                setLoading(false);
                setPropIndex(0);

                const params = new URLSearchParams(window.location.search);
                const targetId = params.get("id");
                if (targetId) {
                    const index = list.findIndex(item => item.id === targetId);
                    if (index > -1) setActiveIndex(index);
                }
            })
            .catch(err => {
                console.error("Erreur carousel :", err);
                setLoading(false);
            });
    };

    useEffect(() => { loadData(); }, [search, sortUrgence]);

    const handleSearch = () => setSearch(searchInput);

    const goToItem = (index) => {
        setActiveIndex(index);
        setPropIndex(0);
    };

    // Normalise : string ou array → toujours array
    const getPropositions = (item) => {
        if (Array.isArray(item.propositions) && item.propositions.length > 0)
            return item.propositions;
        if (typeof item.proposition === "string" && item.proposition)
            return [item.proposition];
        return [];
    };

    const urgenceStyle = (urgence) => {
        if (!urgence) return { bg: "#F5F5F5", color: "#888" };
        const u = urgence.toLowerCase();
        if (u === "haute")   return { bg: "#FEE2E2", color: "#A32D2D" };
        if (u === "moyenne") return { bg: "#FEF3E2", color: "#A05C00" };
        if (u === "faible")  return { bg: "#EAF3DE", color: "#3B6D11" };
        return { bg: "#F5F5F5", color: "#888" };
    };

    const fmt = (d) => d ? new Date(d).toLocaleDateString("fr-FR") : "N/A";

    const currentItem = items[activeIndex] || null;
    const propositions = currentItem ? getPropositions(currentItem) : [];
    const propTotal = propositions.length;

    return (
        <div style={styles.page}>
            <Header />
            <div style={styles.body}>
                <Sidebar activePage="analyses" />
                <div style={styles.main}>
                    <p style={styles.title}>Market Events Analyses</p>

                    {/* ── Toolbar ── */}
                    <div style={styles.toolbar}>
                        <input
                            type="text"
                            placeholder="Rechercher dans les prédictions et propositions..."
                            value={searchInput}
                            onChange={e => setSearchInput(e.target.value)}
                            onKeyDown={e => e.key === "Enter" && handleSearch()}
                            style={styles.search}
                        />
                        <button onClick={handleSearch} style={styles.searchBtn}>Rechercher</button>
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

                    {/* ── States ── */}
                    {loading ? (
                        <p style={styles.empty}>Chargement...</p>
                    ) : items.length === 0 ? (
                        <p style={styles.empty}>Aucune analyse trouvée</p>
                    ) : (
                        <div style={styles.wrapper}>

                            {/* ══════════════ CARD ══════════════ */}
                            <div style={styles.card}>

                                {/* Header */}
                                <div style={styles.cardHeader}>
                                    <div style={styles.cardHeaderLeft}>
                                        <span style={styles.theme}>{currentItem.theme}</span>
                                        <span style={styles.typeBadge}>{currentItem.type}</span>
                                    </div>
                                    <div style={styles.cardHeaderRight}>
                                        <span style={{
                                            ...styles.urgenceBadge,
                                            backgroundColor: urgenceStyle(currentItem.urgence).bg,
                                            color: urgenceStyle(currentItem.urgence).color,
                                        }}>
                                            ⚡ {currentItem.urgence ?? "N/A"}
                                        </span>
                                        <span style={styles.categorie}>{currentItem.categorie ?? "N/A"}</span>
                                    </div>
                                </div>

                                {/* Meta */}
                                <div style={styles.metaRow}>
                                    <span style={styles.meta}>Généré le : {fmt(currentItem.genereLe)}</span>
                                    <span style={styles.meta}>Analysé le : {fmt(currentItem.analyseEl)}</span>
                                    <span style={styles.meta}>Ton : {currentItem.ton ?? "N/A"}</span>
                                </div>

                                <div style={styles.divider} />

                                {/* Prédiction */}
                                <p style={styles.predictionLabel}>Prédiction</p>
                                <p style={styles.prediction}>{currentItem.prediction ?? "N/A"}</p>

                                <div style={styles.divider} />

                                {/* ── Propositions stepper ── */}
                                <div style={styles.propSection}>
                                    <div style={styles.propHeader}>
                                        <span style={styles.propLabel}>Propositions</span>
                                        <span style={styles.propCount}>
                                            {propTotal > 0 ? `${propIndex + 1} / ${propTotal}` : "—"}
                                        </span>
                                    </div>

                                    {propTotal === 0 ? (
                                        <div style={styles.propCard}>
                                            <p style={styles.propText}>Aucune proposition disponible</p>
                                        </div>
                                    ) : (
                                        <>
                                            <div style={styles.propCard}>
                                                <p style={styles.propText}>{propositions[propIndex]}</p>
                                            </div>

                                            {/* Stepper controls */}
                                            {propTotal > 1 && (
                                                <div style={styles.stepper}>
                                                    <button
                                                        style={{
                                                            ...styles.stepBtn,
                                                            opacity: propIndex === 0 ? 0.3 : 1,
                                                            cursor: propIndex === 0 ? "default" : "pointer",
                                                        }}
                                                        disabled={propIndex === 0}
                                                        onClick={() => setPropIndex(p => p - 1)}
                                                    >
                                                        ‹
                                                    </button>

                                                    <div style={styles.dots}>
                                                        {propositions.map((_, i) => (
                                                            <span
                                                                key={i}
                                                                onClick={() => setPropIndex(i)}
                                                                style={{
                                                                    ...styles.dot,
                                                                    backgroundColor: i === propIndex ? "#185FA5" : "#D0D0D0",
                                                                    cursor: "pointer",
                                                                }}
                                                            />
                                                        ))}
                                                    </div>

                                                    <button
                                                        style={{
                                                            ...styles.stepBtn,
                                                            opacity: propIndex === propTotal - 1 ? 0.3 : 1,
                                                            cursor: propIndex === propTotal - 1 ? "default" : "pointer",
                                                        }}
                                                        disabled={propIndex === propTotal - 1}
                                                        onClick={() => setPropIndex(p => p + 1)}
                                                    >
                                                        ›
                                                    </button>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                            {/* ══════════════ FIN CARD ══════════════ */}

                            {/* Navigation analyses */}
                            <div style={styles.nav}>
                                <button
                                    style={{
                                        ...styles.navBtn,
                                        opacity: activeIndex === 0 ? 0.35 : 1,
                                        cursor: activeIndex === 0 ? "default" : "pointer",
                                    }}
                                    disabled={activeIndex === 0}
                                    onClick={() => goToItem(activeIndex - 1)}
                                >
                                    ← Précédente
                                </button>

                                <span style={styles.navCount}>
                                    Analyse {activeIndex + 1} / {items.length}
                                </span>

                                <button
                                    style={{
                                        ...styles.navBtn,
                                        opacity: activeIndex === items.length - 1 ? 0.35 : 1,
                                        cursor: activeIndex === items.length - 1 ? "default" : "pointer",
                                    }}
                                    disabled={activeIndex === items.length - 1}
                                    onClick={() => goToItem(activeIndex + 1)}
                                >
                                    Suivante →
                                </button>
                            </div>

                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const styles = {
    page:           { height: "100vh", display: "flex", flexDirection: "column", backgroundColor: "#F5F5F5", fontFamily: "Arial, sans-serif" },
    body:           { display: "flex", flex: 1, overflow: "hidden" },
    main:           { flex: 1, padding: "24px", overflowY: "auto" },
    title:          { fontSize: "18px", fontWeight: "bold", color: "#1A1A1A", margin: "0 0 20px" },

    // Toolbar
    toolbar:        { display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px", flexWrap: "wrap" },
    search:         { fontSize: "13px", padding: "8px 14px", border: "0.5px solid #E0E0E0", borderRadius: "6px", width: "340px", outline: "none", backgroundColor: "white" },
    searchBtn:      { fontSize: "13px", padding: "8px 16px", backgroundColor: "#185FA5", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" },
    clearBtn:       { fontSize: "13px", padding: "8px 16px", backgroundColor: "#F5F5F5", color: "#555", border: "0.5px solid #E0E0E0", borderRadius: "6px", cursor: "pointer" },
    select:         { fontSize: "13px", padding: "8px 12px", border: "0.5px solid #E0E0E0", borderRadius: "6px", outline: "none", cursor: "pointer", backgroundColor: "white" },
    count:          { fontSize: "12px", color: "#888", marginLeft: "auto" },
    empty:          { textAlign: "center", padding: "40px", color: "#999", fontStyle: "italic" },

    // Wrapper
    wrapper:        { display: "flex", flexDirection: "column", gap: "16px", maxWidth: "860px", margin: "0 auto" },

    // Card
    card:           { backgroundColor: "white", border: "0.5px solid #E0E0E0", borderRadius: "16px", padding: "28px", boxShadow: "0 4px 16px rgba(0,0,0,0.06)", display: "flex", flexDirection: "column", gap: "14px" },
    cardHeader:     { display: "flex", justifyContent: "space-between", alignItems: "flex-start" },
    cardHeaderLeft: { display: "flex", alignItems: "center", gap: "10px" },
    cardHeaderRight:{ display: "flex", alignItems: "center", gap: "8px" },
    theme:          { fontSize: "16px", fontWeight: "700", color: "#1A1A1A" },
    typeBadge:      { fontSize: "11px", fontWeight: "600", padding: "3px 8px", borderRadius: "5px", backgroundColor: "#EEF3FF", color: "#185FA5" },
    urgenceBadge:   { fontSize: "12px", fontWeight: "600", padding: "4px 10px", borderRadius: "6px" },
    categorie:      { fontSize: "12px", color: "#888", fontStyle: "italic" },
    metaRow:        { display: "flex", gap: "20px", flexWrap: "wrap" },
    meta:           { fontSize: "11px", color: "#AAA" },
    divider:        { height: "1px", backgroundColor: "#F0F0F0" },

    // Prédiction
    predictionLabel:{ fontSize: "12px", fontWeight: "600", color: "#888", margin: 0 },
    prediction:     { fontSize: "14px", fontWeight: "700", color: "#1A1A1A", lineHeight: "1.65", margin: 0 },

    // Propositions
    propSection:    { display: "flex", flexDirection: "column", gap: "10px" },
    propHeader:     { display: "flex", justifyContent: "space-between", alignItems: "center" },
    propLabel:      { fontSize: "12px", fontWeight: "600", color: "#888" },
    propCount:      { fontSize: "12px", color: "#AAA" },
    propCard:       { backgroundColor: "#F8F9FC", border: "0.5px solid #E8EAF0", borderRadius: "10px", padding: "14px 16px", minHeight: "80px" },
    propText:       { fontSize: "14px", color: "#333", lineHeight: "1.7", margin: 0 },

    // Stepper
    stepper:        { display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" },
    stepBtn:        { background: "none", border: "0.5px solid #D0D0D0", borderRadius: "6px", padding: "2px 12px", fontSize: "20px", lineHeight: "1.4", color: "#555" },
    dots:           { display: "flex", gap: "6px", alignItems: "center" },
    dot:            { width: "7px", height: "7px", borderRadius: "50%", transition: "background-color 0.2s" },

    // Navigation analyses
    nav:            { display: "flex", justifyContent: "space-between", alignItems: "center" },
    navBtn:         { fontSize: "13px", padding: "8px 18px", backgroundColor: "white", color: "#1A1A1A", border: "0.5px solid #E0E0E0", borderRadius: "8px" },
    navCount:       { fontSize: "12px", color: "#AAA" },
};

export default MarketEventsAnalysesPage;