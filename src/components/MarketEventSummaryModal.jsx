const MarketEventSummaryModal = ({ event, onClose }) => {
    if (!event) return null;

    const activeTheme = event.activeTheme ?? event.themes?.[0] ?? null;
    const allThemes = event.themes ?? [];

    const getContenuFr = (t) => t?.contenuFr ?? t?.contenu_fr ?? null;
    const getContenuEn = (t) => t?.contenuEn ?? t?.contenu_en ?? null;

    const cleanEnContent = (raw) => {
        if (!raw) return null;
        const colonIndex = raw.indexOf(":");
        if (colonIndex !== -1) return raw.substring(colonIndex + 1).trim();
        return raw;
    };

    const fmtDate = (d) => d ? new Date(d).toLocaleString("fr-FR") : "N/A";

    const PALETTES = [
        { bg: "#EFF6FF", color: "#1D4ED8", border: "#DBEAFE" },
        { bg: "#F0FDF4", color: "#15803D", border: "#BBF7D0" },
        { bg: "#FFF7ED", color: "#C2410C", border: "#FED7AA" },
        { bg: "#FAF5FF", color: "#7E22CE", border: "#E9D5FF" },
        { bg: "#FFF1F2", color: "#BE123C", border: "#FECDD3" },
        { bg: "#F0F9FF", color: "#0369A1", border: "#BAE6FD" },
    ];
    const FAMILLE_PALETTES = [
        { bg: "#F0FDF4", color: "#15803D", border: "#BBF7D0" },
        { bg: "#EFF6FF", color: "#1D4ED8", border: "#DBEAFE" },
        { bg: "#FFF7ED", color: "#C2410C", border: "#FED7AA" },
        { bg: "#FAF5FF", color: "#7E22CE", border: "#E9D5FF" },
        { bg: "#F0F9FF", color: "#0369A1", border: "#BAE6FD" },
    ];

    const hashStr = (str = "") =>
        Math.abs([...str].reduce((acc, c) => acc + c.charCodeAt(0), 0));

    const themePalette = activeTheme
        ? PALETTES[hashStr(activeTheme.theme ?? "") % PALETTES.length]
        : PALETTES[0];

    const famillePalette = event.famille
        ? FAMILLE_PALETTES[hashStr(event.famille) % FAMILLE_PALETTES.length]
        : FAMILLE_PALETTES[0];

    const frContent = getContenuFr(activeTheme);
    const enContent = cleanEnContent(getContenuEn(activeTheme));

    return (
        <div style={s.overlay} onClick={onClose}>
            <div style={s.modal} onClick={e => e.stopPropagation()}>

                {/* ── Header ── */}
                <div style={s.header}>
                    <div style={s.headerLeft}>
                        <div style={s.iconWrap}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ color: "#2563EB" }}>
                                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 012-2h2a2 2 0 012 2M9 5h6M9 12h6M9 16h4"
                                    stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
                            </svg>
                        </div>
                        <div>
                            <h2 style={s.title}>Détail du résumé</h2>
                            <p style={s.subtitle}>ID #{event.id}</p>
                        </div>
                    </div>
                    <button style={s.closeIconBtn} onClick={onClose} title="Fermer">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ color: "#94A3B8" }}>
                            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                    </button>
                </div>

                {/* ── Meta row ── */}
                <div style={s.metaRow}>
                    <div style={s.metaItem}>
                        <span style={s.metaLabel}>Famille</span>
                        {event.famille
                            ? <span style={{ ...s.badge, backgroundColor: famillePalette.bg, color: famillePalette.color, borderColor: famillePalette.border }}>
                                {event.famille}
                            </span>
                            : <span style={s.naText}>—</span>}
                    </div>
                    <div style={s.metaDivider} />
                    <div style={s.metaItem}>
                        <span style={s.metaLabel}>Thème</span>
                        {activeTheme?.theme
                            ? <span style={{ ...s.badge, backgroundColor: themePalette.bg, color: themePalette.color, borderColor: themePalette.border }}>
                                {activeTheme.theme}
                            </span>
                            : <span style={s.naText}>—</span>}
                    </div>
                    <div style={s.metaDivider} />
                    <div style={s.metaItem}>
                        <span style={s.metaLabel}>Généré le</span>
                        <span style={s.metaValue}>{fmtDate(event.genereLe)}</span>
                    </div>
                </div>

                {/* ── Tous les thèmes si > 1 ── */}
                {allThemes.length > 1 && (
                    <div style={s.section}>
                        <div style={s.sectionHeader}>
                            <p style={s.sectionLabel}>Tous les thèmes ({allThemes.length})</p>
                        </div>
                        <div style={s.tagsWrap}>
                            {allThemes.map((t, i) => {
                                const p = PALETTES[hashStr(t.theme ?? "") % PALETTES.length];
                                const isActive = t === activeTheme;
                                return (
                                    <span key={i} style={{
                                        ...s.badge,
                                        backgroundColor: p.bg,
                                        color: p.color,
                                        borderColor: isActive ? p.color : p.border,
                                        fontWeight: isActive ? "600" : "500",
                                        boxShadow: isActive ? `0 0 0 2px ${p.border}` : "none",
                                    }}>
                                        {t.theme}
                                    </span>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* ── FR Content ── */}
                <div style={{ ...s.section, marginTop: "16px" }}>
                    <div style={s.sectionHeader}>
                        <span style={s.langFlag}>🇫🇷</span>
                        <p style={s.sectionLabel}>Résumé en Français</p>
                    </div>
                    <div style={s.contentBox}>
                        {frContent
                            ? frContent
                            : <span style={s.naText}>Aucun contenu disponible.</span>}
                    </div>
                </div>

                {/* ── EN Content ── */}
                <div style={{ ...s.section, marginTop: "16px", marginBottom: "4px" }}>
                    <div style={s.sectionHeader}>
                        <span style={s.langFlag}>🇬🇧</span>
                        <p style={s.sectionLabel}>Résumé en Anglais</p>
                    </div>
                    <div style={s.contentBox}>
                        {enContent
                            ? enContent
                            : <span style={s.naText}>Aucun contenu disponible.</span>}
                    </div>
                </div>

                {/* ── Footer ── */}
                <div style={s.footer}>
                    <button style={s.closeBtn} onClick={onClose}>Fermer</button>
                </div>
            </div>
        </div>
    );
};

const s = {
    overlay: {
        position: "fixed", inset: 0,
        backgroundColor: "rgba(15,23,42,0.45)",
        display: "flex", justifyContent: "center", alignItems: "center",
        zIndex: 1000, backdropFilter: "blur(2px)",
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    },
    modal: {
        backgroundColor: "white", borderRadius: "14px",
        width: "64%", maxWidth: "760px", maxHeight: "85vh",
        overflowY: "auto", display: "flex", flexDirection: "column",
        boxShadow: "0 20px 60px rgba(15,23,42,0.18)",
        border: "1px solid #E2E8F0",
    },
    header: {
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "22px 28px 18px", borderBottom: "1px solid #F1F5F9",
        position: "sticky", top: 0, backgroundColor: "white", zIndex: 1,
    },
    headerLeft: { display: "flex", alignItems: "center", gap: "14px" },
    iconWrap: {
        width: "40px", height: "40px", borderRadius: "10px",
        backgroundColor: "#EFF6FF", border: "1px solid #DBEAFE",
        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
    },
    title: { fontSize: "15px", fontWeight: "600", color: "#0F172A", margin: 0 },
    subtitle: { fontSize: "12px", color: "#94A3B8", margin: "2px 0 0", fontWeight: "400" },
    closeIconBtn: {
        background: "none", border: "1px solid #E2E8F0", borderRadius: "8px",
        padding: "6px", cursor: "pointer", display: "flex",
        alignItems: "center", justifyContent: "center", flexShrink: 0,
    },
    metaRow: {
        display: "flex", alignItems: "stretch",
        margin: "20px 28px", backgroundColor: "#F8FAFC",
        border: "1px solid #E2E8F0", borderRadius: "10px", overflow: "hidden",
    },
    metaItem: { flex: 1, padding: "14px 18px", display: "flex", flexDirection: "column", gap: "6px", alignItems: "center" },
    metaDivider: { width: "1px", backgroundColor: "#E2E8F0", flexShrink: 0 },
    metaLabel: { fontSize: "11px", color: "#94A3B8", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.05em" },
    metaValue: { fontSize: "13px", color: "#1E293B", fontWeight: "500", textAlign: "center" },
    badge: {
        display: "inline-block", padding: "3px 10px", borderRadius: "6px",
        fontSize: "12px", fontWeight: "500", border: "1px solid",
    },
    naText: { fontSize: "13px", color: "#CBD5E1" },
    section: { padding: "0 28px" },
    sectionHeader: { display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" },
    langFlag: { fontSize: "16px", lineHeight: 1 },
    sectionLabel: { fontSize: "11px", color: "#94A3B8", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.05em", margin: 0 },
    tagsWrap: { display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "16px" },
    contentBox: {
        backgroundColor: "#F8FAFC", border: "1px solid #E2E8F0",
        borderRadius: "10px", padding: "16px 20px",
        fontSize: "13.5px", lineHeight: "1.8", color: "#334155",
        whiteSpace: "pre-wrap", wordBreak: "break-word",
    },
    footer: {
        display: "flex", justifyContent: "flex-end",
        padding: "18px 28px", borderTop: "1px solid #F1F5F9", marginTop: "20px",
        position: "sticky", bottom: 0, backgroundColor: "white",
    },
    closeBtn: {
        padding: "8px 20px", fontSize: "13px", fontWeight: "500",
        border: "1px solid #E2E8F0", borderRadius: "8px",
        cursor: "pointer", backgroundColor: "white", color: "#475569",
    },
};

export default MarketEventSummaryModal;