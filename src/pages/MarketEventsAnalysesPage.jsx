import { useState, useEffect } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { getAllAnalyses } from "../services/marketEventAnalysisService";

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

<<<<<<< Updated upstream
    const [items, setItems]           = useState([]);
    const [loading, setLoading]       = useState(true);
    const [search, setSearch]         = useState("");
    const [searchInput, setSearchInput] = useState("");
    const [sortUrgence, setSortUrgence] = useState("");
    const [activeIndex, setActiveIndex] = useState(0);
    const [propIndex, setPropIndex]   = useState(0);   // index proposition courante
=======
const FAMILLE_PALETTES = [
    { bg: "#F0FDF4", color: "#15803D", border: "#BBF7D0" },
    { bg: "#EFF6FF", color: "#1D4ED8", border: "#DBEAFE" },
    { bg: "#FFF7ED", color: "#C2410C", border: "#FED7AA" },
    { bg: "#FAF5FF", color: "#7E22CE", border: "#E9D5FF" },
    { bg: "#F0F9FF", color: "#0369A1", border: "#BAE6FD" },
];
const familleColor = (famille = "") => FAMILLE_PALETTES[Math.abs(
    [...famille].reduce((acc, c) => acc + c.charCodeAt(0), 0)
) % FAMILLE_PALETTES.length];

const urgenceColor = (urgence) => {
    if (!urgence) return { bg: "#F1F5F9", color: "#64748B", border: "#E2E8F0" };
    const u = urgence.toLowerCase();
    if (u === "haute") return { bg: "#FEF2F2", color: "#A32D2D", border: "#FECACA" };
    if (u === "moyenne") return { bg: "#FFF7ED", color: "#C2410C", border: "#FED7AA" };
    if (u === "faible") return { bg: "#F0FDF4", color: "#15803D", border: "#BBF7D0" };
    return { bg: "#F1F5F9", color: "#64748B", border: "#E2E8F0" };
};

const MarketEventsAnalysesPage = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [searchInput, setSearchInput] = useState("");
    const [sortUrgence, setSortUrgence] = useState("");
    const [sortFamille, setSortFamille] = useState("");

    // ✅ listes dynamiques extraites des données
    const [familles, setFamilles] = useState([]);
    const [urgences, setUrgences] = useState([]);
>>>>>>> Stashed changes

    const loadData = () => {
        setLoading(true);
        getAllAnalyses({ search, urgence: sortUrgence, famille: sortFamille })
            .then(data => {
<<<<<<< Updated upstream
                const list = Array.isArray(data) ? data : data.content || [];
                setItems(list);
=======
                const content = Array.isArray(data) ? data : data.content || [];
                setItems(content);

                // ✅ extraire toutes les familles uniques
                const famillesSet = new Set();
                content.forEach(item => {
                    if (item.famille) famillesSet.add(item.famille.trim());
                });
                setFamilles(prev => {
                    const merged = new Set([...prev, ...famillesSet]);
                    return [...merged].sort();
                });

                // ✅ extraire toutes les urgences uniques
                const urgencesSet = new Set();
                content.forEach(item => {
                    if (item.themes && item.themes.length > 0) {
                        item.themes.forEach(t => {
                            if (t.urgence) urgencesSet.add(t.urgence.trim());
                        });
                    } else if (item.urgence) {
                        urgencesSet.add(item.urgence.trim());
                    }
                });
                setUrgences(prev => {
                    const merged = new Set([...prev, ...urgencesSet]);
                    return [...merged].sort();
                });

>>>>>>> Stashed changes
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

    useEffect(() => { loadData(); }, [search, sortUrgence, sortFamille]);

    const handleSearch = () => setSearch(searchInput);

<<<<<<< Updated upstream
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
=======
    const slides = items.flatMap(item => {
        if (item.themes && item.themes.length > 0) {
            return item.themes.map(theme => ({
                famille: item.famille,
                genereLe: item.genereLe,
                analyseEl: item.analyseEl,
                theme: theme.theme,
                prediction: theme.prediction,
                proposition: theme.proposition,
                ton: theme.ton,
                urgence: theme.urgence,
                categorie: theme.categorie,
            }));
        }
        return [{
            famille: item.famille || "N/A",
            genereLe: item.genereLe,
            analyseEl: item.analyseEl,
            theme: item.theme,
            prediction: item.prediction,
            proposition: item.proposition,
            ton: item.ton,
            urgence: item.urgence,
            categorie: item.categorie,
        }];
    });
>>>>>>> Stashed changes

    const fmt = (d) => d ? new Date(d).toLocaleDateString("fr-FR") : "N/A";

    const currentItem = items[activeIndex] || null;
    const propositions = currentItem ? getPropositions(currentItem) : [];
    const propTotal = propositions.length;

    return (
        <div style={s.page}>
            <Header />
            <div style={s.body}>
                <Sidebar activePage="analyses" />
<<<<<<< Updated upstream
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
=======
                <main style={s.main}>
                    <div style={s.pageHeader}>
                        <div>
                            <h1 style={s.pageTitle}>Market Events Analyses</h1>
                            <p style={s.pageSubtitle}>Analyses prédictives et propositions par thème</p>
                        </div>
                    </div>

                    <div style={s.card}>
                        {/* toolbar */}
                        <div style={s.toolbar}>
                            <div style={s.toolbarLeft}>
                                <div style={s.searchWrap}>
                                    <svg style={s.searchIcon} viewBox="0 0 16 16" fill="none">
                                        <circle cx="6.5" cy="6.5" r="4.5" stroke="currentColor" strokeWidth="1.25" />
                                        <path d="M10 10l3.5 3.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
                                    </svg>
                                    <input
                                        type="text"
                                        placeholder="Rechercher dans les thèmes, prédictions…"
                                        value={searchInput}
                                        onChange={e => setSearchInput(e.target.value)}
                                        onKeyDown={e => e.key === "Enter" && handleSearch()}
                                        style={s.search}
                                    />
                                </div>
                                <button onClick={handleSearch} style={s.searchBtn}>Rechercher</button>
                                {search && (
                                    <button onClick={() => { setSearch(""); setSearchInput(""); }} style={s.clearBtn}>
                                        Effacer
                                    </button>
                                )}

                                {/* ✅ select famille dynamique */}
                                <select value={sortFamille} onChange={e => setSortFamille(e.target.value)} style={s.select}>
                                    <option value="">Toutes les familles</option>
                                    {familles.map(f => (
                                        <option key={f} value={f}>{f}</option>
                                    ))}
                                </select>

                                {/* ✅ select urgence dynamique */}
                                <select value={sortUrgence} onChange={e => setSortUrgence(e.target.value)} style={s.select}>
                                    <option value="">Toutes les urgences</option>
                                    {urgences.map(u => (
                                        <option key={u} value={u}>{u}</option>
                                    ))}
                                </select>
                            </div>
                            <div style={s.toolbarRight}>
                                <span style={s.countBadge}>{slides.length} thèmes</span>
                            </div>
                        </div>

                        {/* content */}
                        {loading ? (
                            <div style={s.loadingWrap}>
                                <div style={s.spinner} />
                                <span style={s.loadingText}>Chargement…</span>
                            </div>
                        ) : slides.length === 0 ? (
                            <div style={s.emptyWrap}>
                                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" style={{ color: "#CBD5E1" }}>
                                    <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 012-2h2a2 2 0 012 2M9 5h6M9 12h6M9 16h4"
                                        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                </svg>
                                <p style={s.emptyText}>Aucune analyse trouvée</p>
                            </div>
                        ) : (
                            <div style={s.carouselWrap}>
                                <Carousel data-bs-theme="dark" interval={null}>
                                    {slides.map((slide, i) => {
                                        const tPalette = themeColor(slide.theme ?? "");
                                        const fPalette = familleColor(slide.famille ?? "");
                                        const uPalette = urgenceColor(slide.urgence);
                                        return (
                                            <Carousel.Item key={i}>
                                                <div style={s.slideCard}>
                                                    {/* card header */}
                                                    <div style={s.cardHeader}>
                                                        <div style={s.cardHeaderLeft}>
                                                            {slide.famille && (
                                                                <span style={{ ...s.familleBadge, backgroundColor: fPalette.bg, color: fPalette.color, borderColor: fPalette.border }}>
                                                                    {slide.famille}
                                                                </span>
                                                            )}
                                                            {slide.theme && (
                                                                <span style={{ ...s.themeBadge, backgroundColor: tPalette.bg, color: tPalette.color, borderColor: tPalette.border }}>
                                                                    {slide.theme}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div style={s.cardHeaderRight}>
                                                            {slide.urgence && (
                                                                <span style={{ ...s.urgenceBadge, backgroundColor: uPalette.bg, color: uPalette.color, borderColor: uPalette.border }}>
                                                                    ⚡ {slide.urgence}
                                                                </span>
                                                            )}
                                                            {slide.categorie && (
                                                                <span style={s.categorieBadge}>{slide.categorie}</span>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* meta */}
                                                    <div style={s.metaRow}>
                                                        <span style={s.metaItem}>
                                                            Généré le : {slide.genereLe ? new Date(slide.genereLe).toLocaleDateString("fr-FR") : "N/A"}
                                                        </span>
                                                        <span style={s.metaItem}>
                                                            Analysé le : {slide.analyseEl ? new Date(slide.analyseEl).toLocaleDateString("fr-FR") : "N/A"}
                                                        </span>
                                                        <span style={s.metaItem}>Ton : {slide.ton ?? "N/A"}</span>
                                                    </div>

                                                    <div style={s.divider} />

                                                    {/* body */}
                                                    <div style={s.cardBody}>
                                                        <p style={s.prediction}>{slide.prediction ?? "N/A"}</p>
                                                        <p style={s.proposition}>{slide.proposition ?? "N/A"}</p>
                                                    </div>

                                                    <p style={s.position}>{i + 1} / {slides.length}</p>
                                                </div>
                                            </Carousel.Item>
                                        );
                                    })}
                                </Carousel>
                            </div>
                        )}
                    </div>
                </main>
>>>>>>> Stashed changes
            </div>
        </div>
    );
};

<<<<<<< Updated upstream
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
=======
const s = {
    page: { minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: "#F8FAFC", fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" },
    body: { display: "flex", flex: 1, overflow: "hidden" },
    main: { flex: 1, padding: "28px 32px", overflowY: "auto" },
    pageHeader: { display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "24px" },
    pageTitle: { fontSize: "20px", fontWeight: "600", color: "#0F172A", margin: 0, letterSpacing: "-0.3px" },
    pageSubtitle: { fontSize: "13px", color: "#94A3B8", margin: "3px 0 0", fontWeight: "400" },

    card: { backgroundColor: "white", border: "1px solid #E2E8F0", borderRadius: "12px", overflow: "hidden", boxShadow: "0 1px 3px rgba(15,23,42,0.04)" },
    toolbar: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px", borderBottom: "1px solid #F1F5F9", gap: "12px", flexWrap: "wrap" },
    toolbarLeft: { display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" },
    toolbarRight: { display: "flex", alignItems: "center", gap: "10px" },

    searchWrap: { position: "relative", display: "flex", alignItems: "center" },
    searchIcon: { position: "absolute", left: "10px", width: "14px", height: "14px", color: "#94A3B8", pointerEvents: "none" },
    search: { fontSize: "13px", padding: "7px 12px 7px 32px", border: "1px solid #E2E8F0", borderRadius: "8px", width: "260px", outline: "none", color: "#0F172A", backgroundColor: "#FAFAFA" },
    searchBtn: { fontSize: "13px", padding: "6px 14px", backgroundColor: "#2563EB", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "500" },
    clearBtn: { fontSize: "13px", padding: "6px 14px", backgroundColor: "white", color: "#475569", border: "1px solid #E2E8F0", borderRadius: "8px", cursor: "pointer", fontWeight: "500" },
    select: { fontSize: "13px", padding: "6px 10px", border: "1px solid #E2E8F0", borderRadius: "8px", outline: "none", cursor: "pointer", backgroundColor: "#FAFAFA", color: "#0F172A" },
    countBadge: { fontSize: "12px", color: "#64748B", fontWeight: "500", backgroundColor: "#F1F5F9", padding: "4px 10px", borderRadius: "20px", border: "1px solid #E2E8F0" },

    loadingWrap: { display: "flex", flexDirection: "column", alignItems: "center", gap: "12px", padding: "60px 0" },
    spinner: { width: "24px", height: "24px", border: "2.5px solid #E2E8F0", borderTop: "2.5px solid #2563EB", borderRadius: "50%", animation: "spin 0.7s linear infinite" },
    loadingText: { fontSize: "13px", color: "#94A3B8" },
    emptyWrap: { display: "flex", flexDirection: "column", alignItems: "center", gap: "10px", padding: "60px 0" },
    emptyText: { fontSize: "14px", color: "#94A3B8" },

    carouselWrap: { padding: "20px 0 28px" },
    slideCard: { backgroundColor: "white", border: "1px solid #E2E8F0", borderRadius: "12px", padding: "24px 28px", margin: "0 56px 8px", minHeight: "380px", display: "flex", flexDirection: "column", boxShadow: "0 1px 3px rgba(15,23,42,0.04)" },

    cardHeader: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" },
    cardHeaderLeft: { display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" },
    cardHeaderRight: { display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 },

    familleBadge: { display: "inline-block", padding: "3px 9px", borderRadius: "6px", fontSize: "11.5px", fontWeight: "600", border: "1px solid", whiteSpace: "nowrap" },
    themeBadge: { display: "inline-block", padding: "3px 9px", borderRadius: "6px", fontSize: "11.5px", fontWeight: "500", border: "1px solid", whiteSpace: "nowrap" },
    urgenceBadge: { display: "inline-block", padding: "3px 9px", borderRadius: "6px", fontSize: "11.5px", fontWeight: "500", border: "1px solid", whiteSpace: "nowrap" },
    categorieBadge: { fontSize: "12px", color: "#94A3B8", fontStyle: "italic", fontWeight: "400" },

    metaRow: { display: "flex", gap: "20px", marginBottom: "14px", flexWrap: "wrap" },
    metaItem: { fontSize: "12px", color: "#94A3B8", fontWeight: "500" },

    divider: { height: "1px", backgroundColor: "#F1F5F9", margin: "0 0 16px" },

    cardBody: { flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "10px" },
    prediction: { fontSize: "14px", fontWeight: "600", color: "#0F172A", margin: 0, lineHeight: "1.6" },
    proposition: { fontSize: "13px", color: "#475569", margin: 0, lineHeight: "1.7", fontWeight: "400" },

    position: { textAlign: "center", fontSize: "12px", color: "#94A3B8", margin: "16px 0 0", fontWeight: "500" },
>>>>>>> Stashed changes
};

if (typeof document !== "undefined" && !document.getElementById("mea-spin-style")) {
    const style = document.createElement("style");
    style.id = "mea-spin-style";
    style.textContent = "@keyframes spin { to { transform: rotate(360deg); } }";
    document.head.appendChild(style);
}

export default MarketEventsAnalysesPage;