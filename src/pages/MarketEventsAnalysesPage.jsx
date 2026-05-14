import { useState, useEffect } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { getAllAnalyses } from "../services/marketEventAnalysisService";

const MarketEventsAnalysesPage = () => {

    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [searchInput, setSearchInput] = useState("");
    const [searchField, setSearchField] = useState("all");
    const [sortUrgence, setSortUrgence] = useState("");
    const [sortFamille, setSortFamille] = useState("");
    const [docIndex, setDocIndex] = useState(0);
    const [themeIndex, setThemeIndex] = useState(0);
    const [propIndex, setPropIndex] = useState(0);

    const loadData = () => {
        setLoading(true);
        getAllAnalyses()
            .then(data => {
                const list = Array.isArray(data) ? data : data.content || [];
                setDocuments(list);
                setLoading(false);
            })
            .catch(err => {
                console.error("Erreur chargement :", err);
                setLoading(false);
            });
    };

    useEffect(() => { loadData(); }, []);

    useEffect(() => {
        setDocIndex(0);
        setThemeIndex(0);
        setPropIndex(0);
    }, [search, sortUrgence, sortFamille, searchField]);

    useEffect(() => {
        if (documents.length === 0) return;
        const params = new URLSearchParams(window.location.search);
        const targetId = params.get("id");
        if (targetId) {
            const idx = documents.findIndex(doc => doc.id === targetId);
            if (idx > -1) setDocIndex(idx);
        }
    }, [documents]);

    const handleSearch = () => setSearch(searchInput);

    const familles = [...new Set(documents.map(doc => doc.famille).filter(Boolean))];
    const urgences = [...new Set(
        documents.flatMap(doc => doc.themes ?? [])
            .map(t => t.urgence)
            .filter(Boolean)
    )];

    const getPropositions = (theme) => {
        if (!theme?.propositions) return [];
        if (Array.isArray(theme.propositions)) return theme.propositions;
        if (typeof theme.propositions === "object")
            return Object.values(theme.propositions).filter(Boolean);
        return [];
    };

    const filteredDocuments = documents.filter(doc => {
        if (sortFamille && doc.famille !== sortFamille) return false;

        if (search) {
            const q = search.toLowerCase();
            if (searchField === "famille") {
                return doc.famille?.toLowerCase().includes(q);
            }
            if (searchField === "theme") {
                return doc.themes?.some(t => t.theme?.toLowerCase().includes(q));
            }
            if (searchField === "contenu") {
                return doc.themes?.some(t =>
                    t.prediction?.toLowerCase().includes(q) ||
                    getPropositions(t).some(p => p?.toLowerCase().includes(q))
                );
            }
            // "all"
            return (
                doc.famille?.toLowerCase().includes(q) ||
                doc.themes?.some(t =>
                    t.theme?.toLowerCase().includes(q) ||
                    t.prediction?.toLowerCase().includes(q) ||
                    getPropositions(t).some(p => p?.toLowerCase().includes(q))
                )
            );
        }
        return true;
    });

    const safeDocIndex = Math.min(docIndex, Math.max(0, filteredDocuments.length - 1));

    const goToDoc = (idx) => {
        setDocIndex(idx);
        setThemeIndex(0);
        setPropIndex(0);
    };

    const goToTheme = (idx) => {
        setThemeIndex(idx);
        setPropIndex(0);
    };

    const urgenceStyle = (urgence) => {
        if (!urgence) return { bg: "#F5F5F5", color: "#888" };
        const u = urgence.toLowerCase();
        if (u === "haute") return { bg: "#FEE2E2", color: "#A32D2D" };
        if (u === "moyenne") return { bg: "#FEF3E2", color: "#A05C00" };
        if (u === "faible") return { bg: "#EAF3DE", color: "#3B6D11" };
        return { bg: "#F5F5F5", color: "#888" };
    };

    const fmt = (d) => d ? new Date(d).toLocaleDateString("fr-FR") : "N/A";

    const currentDoc = filteredDocuments[safeDocIndex] || null;

    const themes = (currentDoc?.themes || []).filter(t => {
        return !sortUrgence || t.urgence?.toLowerCase() === sortUrgence.toLowerCase();
    });

    const themeTotal = themes.length;
    const safeThemeIndex = Math.min(themeIndex, Math.max(0, themeTotal - 1));
    const currentTheme = themes[safeThemeIndex] || null;
    const propositions = currentTheme ? getPropositions(currentTheme) : [];
    const propTotal = propositions.length;
    const safePropIndex = Math.min(propIndex, Math.max(0, propTotal - 1));

    return (
        <div style={styles.page}>
            <Header />
            <div style={styles.body}>
                <Sidebar activePage="analyses" />
                <div style={styles.main}>
                    <p style={styles.title}>Market Events Analyses</p>

                    {/* Toolbar */}
                    <div style={styles.toolbar}>

                        <select
                            value={searchField}
                            onChange={e => setSearchField(e.target.value)}
                            style={styles.select}
                        >
                            <option value="all">Tous les champs</option>
                            <option value="famille">Famille</option>
                            <option value="theme">Thème</option>
                            <option value="contenu">Contenu</option>
                        </select>

                        <input
                            type="text"
                            placeholder="Rechercher..."
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
                            {urgences.map(u => (
                                <option key={u} value={u}>{u}</option>
                            ))}
                        </select>

                        <select
                            value={sortFamille}
                            onChange={e => setSortFamille(e.target.value)}
                            style={styles.select}
                        >
                            <option value="">Toutes les familles</option>
                            {familles.map(f => (
                                <option key={f} value={f}>{f}</option>
                            ))}
                        </select>

                        <span style={styles.count}>{filteredDocuments.length} documents</span>
                    </div>

                    {/* States */}
                    {loading ? (
                        <p style={styles.empty}>Chargement...</p>
                    ) : filteredDocuments.length === 0 ? (
                        <p style={styles.empty}>Aucune analyse trouvée</p>
                    ) : (
                        <div style={styles.wrapper}>

                            <div style={styles.card}>

                                <div style={styles.docHeader}>
                                    <div style={styles.docHeaderLeft}>
                                        <span style={styles.famille}>{currentDoc.famille ?? "N/A"}</span>
                                        <span style={styles.totalBadge}>
                                            {themeTotal} thème{themeTotal > 1 ? "s" : ""}
                                            {sortUrgence ? ` · ${sortUrgence}` : ""}
                                        </span>
                                    </div>
                                    <div style={styles.docHeaderRight}>
                                        <span style={styles.metaSmall}>
                                            Page {currentDoc.pageDB ?? "?"} / {currentDoc.totalPagesDB ?? "?"}
                                        </span>
                                    </div>
                                </div>

                                <div style={styles.metaRow}>
                                    <span style={styles.meta}>Généré le : {fmt(currentDoc.genereLe)}</span>
                                    <span style={styles.meta}>Analysé le : {fmt(currentDoc.analyseLe)}</span>
                                </div>

                                <div style={styles.divider} />

                                {themeTotal === 0 ? (
                                    <p style={styles.empty}>
                                        {sortUrgence
                                            ? `Aucun thème avec urgence "${sortUrgence}"`
                                            : "Aucun thème disponible"}
                                    </p>
                                ) : (
                                    <>
                                        <div style={styles.themeNav}>
                                            <span style={styles.sectionLabel}>
                                                Thème {safeThemeIndex + 1} / {themeTotal}
                                            </span>
                                            <div style={styles.themeDots}>
                                                {themes.map((t, i) => (
                                                    <span
                                                        key={i}
                                                        onClick={() => goToTheme(i)}
                                                        title={t.theme}
                                                        style={{
                                                            ...styles.themeDot,
                                                            backgroundColor: i === safeThemeIndex
                                                                ? urgenceStyle(t.urgence).color
                                                                : "#D0D0D0",
                                                        }}
                                                    />
                                                ))}
                                            </div>
                                        </div>

                                        <div style={styles.themeCard}>

                                            <div style={styles.cardHeader}>
                                                <div style={styles.cardHeaderLeft}>
                                                    <span style={styles.theme}>{currentTheme.theme}</span>
                                                </div>
                                                <div style={styles.cardHeaderRight}>
                                                    <span style={{
                                                        ...styles.urgenceBadge,
                                                        backgroundColor: urgenceStyle(currentTheme.urgence).bg,
                                                        color: urgenceStyle(currentTheme.urgence).color,
                                                    }}>
                                                        ⚡ {currentTheme.urgence ?? "N/A"}
                                                    </span>
                                                    <span style={styles.categorie}>{currentTheme.categorie ?? "N/A"}</span>
                                                </div>
                                            </div>

                                            <div style={styles.metaRow}>
                                                <span style={styles.meta}>Analysé le : {fmt(currentTheme.analyseLe)}</span>
                                                <span style={styles.meta}>Ton : {currentTheme.ton ?? "N/A"}</span>
                                            </div>

                                            <div style={styles.divider} />

                                            <p style={styles.predictionLabel}>Prédiction</p>
                                            <p style={styles.prediction}>{currentTheme.prediction ?? "N/A"}</p>

                                            <div style={styles.divider} />

                                            <div style={styles.propSection}>
                                                <div style={styles.propHeader}>
                                                    <span style={styles.propLabel}>Propositions</span>
                                                    <span style={styles.propCount}>
                                                        {propTotal > 0 ? `${safePropIndex + 1} / ${propTotal}` : "—"}
                                                    </span>
                                                </div>

                                                {propTotal === 0 ? (
                                                    <div style={styles.propCard}>
                                                        <p style={styles.propText}>Aucune proposition disponible</p>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <div style={styles.propCard}>
                                                            <p style={styles.propText}>{propositions[safePropIndex]}</p>
                                                        </div>

                                                        {propTotal > 1 && (
                                                            <div style={styles.stepper}>
                                                                <button
                                                                    style={{
                                                                        ...styles.stepBtn,
                                                                        opacity: safePropIndex === 0 ? 0.3 : 1,
                                                                        cursor: safePropIndex === 0 ? "default" : "pointer",
                                                                    }}
                                                                    disabled={safePropIndex === 0}
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
                                                                                backgroundColor: i === safePropIndex ? "#185FA5" : "#D0D0D0",
                                                                                cursor: "pointer",
                                                                            }}
                                                                        />
                                                                    ))}
                                                                </div>

                                                                <button
                                                                    style={{
                                                                        ...styles.stepBtn,
                                                                        opacity: safePropIndex === propTotal - 1 ? 0.3 : 1,
                                                                        cursor: safePropIndex === propTotal - 1 ? "default" : "pointer",
                                                                    }}
                                                                    disabled={safePropIndex === propTotal - 1}
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

                                        {themeTotal > 1 && (
                                            <div style={styles.nav}>
                                                <button
                                                    style={{
                                                        ...styles.navBtn,
                                                        opacity: safeThemeIndex === 0 ? 0.35 : 1,
                                                        cursor: safeThemeIndex === 0 ? "default" : "pointer",
                                                    }}
                                                    disabled={safeThemeIndex === 0}
                                                    onClick={() => goToTheme(safeThemeIndex - 1)}
                                                >
                                                    ← Thème préc.
                                                </button>
                                                <span style={styles.navCount}>
                                                    Thème {safeThemeIndex + 1} / {themeTotal}
                                                </span>
                                                <button
                                                    style={{
                                                        ...styles.navBtn,
                                                        opacity: safeThemeIndex === themeTotal - 1 ? 0.35 : 1,
                                                        cursor: safeThemeIndex === themeTotal - 1 ? "default" : "pointer",
                                                    }}
                                                    disabled={safeThemeIndex === themeTotal - 1}
                                                    onClick={() => goToTheme(safeThemeIndex + 1)}
                                                >
                                                    Thème suiv. →
                                                </button>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>

                            <div style={styles.nav}>
                                <button
                                    style={{
                                        ...styles.navBtn,
                                        opacity: safeDocIndex === 0 ? 0.35 : 1,
                                        cursor: safeDocIndex === 0 ? "default" : "pointer",
                                    }}
                                    disabled={safeDocIndex === 0}
                                    onClick={() => goToDoc(safeDocIndex - 1)}
                                >
                                    ← Document préc.
                                </button>
                                <span style={styles.navCount}>
                                    Document {safeDocIndex + 1} / {filteredDocuments.length}
                                </span>
                                <button
                                    style={{
                                        ...styles.navBtn,
                                        opacity: safeDocIndex === filteredDocuments.length - 1 ? 0.35 : 1,
                                        cursor: safeDocIndex === filteredDocuments.length - 1 ? "default" : "pointer",
                                    }}
                                    disabled={safeDocIndex === filteredDocuments.length - 1}
                                    onClick={() => goToDoc(safeDocIndex + 1)}
                                >
                                    Document suiv. →
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
    page: { height: "100vh", display: "flex", flexDirection: "column", backgroundColor: "#F5F5F5", fontFamily: "Arial, sans-serif" },
    body: { display: "flex", flex: 1, overflow: "hidden" },
    main: { flex: 1, padding: "24px", overflowY: "auto" },
    title: { fontSize: "18px", fontWeight: "bold", color: "#1A1A1A", margin: "0 0 20px" },

    toolbar: { display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px", flexWrap: "wrap" },
    search: { fontSize: "13px", padding: "8px 14px", border: "0.5px solid #E0E0E0", borderRadius: "6px", width: "260px", outline: "none", backgroundColor: "white", color: "#1A1A1A" },
    searchBtn: { fontSize: "13px", padding: "8px 16px", backgroundColor: "#185FA5", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" },
    clearBtn: { fontSize: "13px", padding: "8px 16px", backgroundColor: "#F5F5F5", color: "#555", border: "0.5px solid #E0E0E0", borderRadius: "6px", cursor: "pointer" },
    select: { fontSize: "13px", padding: "8px 12px", border: "0.5px solid #E0E0E0", borderRadius: "6px", outline: "none", cursor: "pointer", backgroundColor: "white", color: "#1A1A1A", appearance: "auto", WebkitAppearance: "auto" },
    count: { fontSize: "12px", color: "#888", marginLeft: "auto" },
    empty: { textAlign: "center", padding: "40px", color: "#999", fontStyle: "italic" },

    wrapper: { display: "flex", flexDirection: "column", gap: "16px", maxWidth: "860px", margin: "0 auto" },

    card: { backgroundColor: "white", border: "0.5px solid #E0E0E0", borderRadius: "16px", padding: "28px", boxShadow: "0 4px 16px rgba(0,0,0,0.06)", display: "flex", flexDirection: "column", gap: "14px" },
    themeCard: { backgroundColor: "#FAFBFF", border: "0.5px solid #E8EAF0", borderRadius: "12px", padding: "20px", display: "flex", flexDirection: "column", gap: "12px" },

    docHeader: { display: "flex", justifyContent: "space-between", alignItems: "center" },
    docHeaderLeft: { display: "flex", alignItems: "center", gap: "10px" },
    docHeaderRight: { display: "flex", alignItems: "center", gap: "8px" },
    famille: { fontSize: "17px", fontWeight: "700", color: "#1A1A1A" },
    totalBadge: { fontSize: "11px", fontWeight: "600", padding: "3px 8px", borderRadius: "5px", backgroundColor: "#EEF3FF", color: "#185FA5" },
    metaSmall: { fontSize: "11px", color: "#AAA" },

    themeNav: { display: "flex", justifyContent: "space-between", alignItems: "center" },
    sectionLabel: { fontSize: "12px", fontWeight: "600", color: "#888" },
    themeDots: { display: "flex", gap: "6px", alignItems: "center" },
    themeDot: { width: "9px", height: "9px", borderRadius: "50%", cursor: "pointer", transition: "background-color 0.2s" },

    cardHeader: { display: "flex", justifyContent: "space-between", alignItems: "flex-start" },
    cardHeaderLeft: { display: "flex", alignItems: "center", gap: "10px" },
    cardHeaderRight: { display: "flex", alignItems: "center", gap: "8px" },
    theme: { fontSize: "15px", fontWeight: "700", color: "#1A1A1A" },
    urgenceBadge: { fontSize: "12px", fontWeight: "600", padding: "4px 10px", borderRadius: "6px" },
    categorie: { fontSize: "12px", color: "#888", fontStyle: "italic" },
    metaRow: { display: "flex", gap: "20px", flexWrap: "wrap" },
    meta: { fontSize: "11px", color: "#AAA" },
    divider: { height: "1px", backgroundColor: "#F0F0F0" },

    predictionLabel: { fontSize: "12px", fontWeight: "600", color: "#888", margin: 0 },
    prediction: { fontSize: "14px", fontWeight: "700", color: "#1A1A1A", lineHeight: "1.65", margin: 0 },

    propSection: { display: "flex", flexDirection: "column", gap: "10px" },
    propHeader: { display: "flex", justifyContent: "space-between", alignItems: "center" },
    propLabel: { fontSize: "12px", fontWeight: "600", color: "#888" },
    propCount: { fontSize: "12px", color: "#AAA" },
    propCard: { backgroundColor: "#F8F9FC", border: "0.5px solid #E8EAF0", borderRadius: "10px", padding: "14px 16px", minHeight: "80px" },
    propText: { fontSize: "14px", color: "#333", lineHeight: "1.7", margin: 0 },

    stepper: { display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" },
    stepBtn: { background: "none", border: "0.5px solid #D0D0D0", borderRadius: "6px", padding: "2px 12px", fontSize: "20px", lineHeight: "1.4", color: "#555", cursor: "pointer" },
    dots: { display: "flex", gap: "6px", alignItems: "center" },
    dot: { width: "7px", height: "7px", borderRadius: "50%", transition: "background-color 0.2s" },

    nav: { display: "flex", justifyContent: "space-between", alignItems: "center" },
    navBtn: { fontSize: "13px", padding: "8px 18px", backgroundColor: "white", color: "#1A1A1A", border: "0.5px solid #E0E0E0", borderRadius: "8px", cursor: "pointer" },
    navCount: { fontSize: "12px", color: "#AAA" },
};

export default MarketEventsAnalysesPage;