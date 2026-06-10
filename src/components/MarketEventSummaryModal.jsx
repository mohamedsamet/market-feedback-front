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
        width: "62%", maxWidth: "720px", maxHeight: "82vh",
        overflowY: "auto", display: "flex", flexDirection: "column",
        boxShadow: "0 20px 60px rgba(15,23,42,0.18)",
        border: "1px solid #E2E8F0",
    },
    header: {
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "22px 28px 18px", borderBottom: "1px solid #F1F5F9",
    },
    headerLeft:   { display: "flex", alignItems: "center", gap: "14px" },
    iconWrap: {
        width: "40px", height: "40px", borderRadius: "10px",
        backgroundColor: "#EFF6FF", border: "1px solid #DBEAFE",
        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
    },
    title:        { fontSize: "15px", fontWeight: "600", color: "#0F172A", margin: 0 },
    subtitle:     { fontSize: "12px", color: "#94A3B8", margin: "2px 0 0", fontWeight: "400", display: "flex", alignItems: "center", gap: "6px" },
    familleTag:   { display: "inline-block", padding: "2px 8px", borderRadius: "5px", fontSize: "11px", fontWeight: "600", backgroundColor: "#F0FDF4", color: "#15803D", border: "1px solid #BBF7D0" },
    closeIconBtn: {
        background: "none", border: "1px solid #E2E8F0", borderRadius: "8px",
        padding: "6px", cursor: "pointer", display: "flex",
        alignItems: "center", justifyContent: "center", flexShrink: 0,
    },
    section:      { padding: "20px 28px 0" },
    sectionLabel: { fontSize: "11px", color: "#94A3B8", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 10px" },
    contentBox: {
        backgroundColor: "#F8FAFC", border: "1px solid #E2E8F0",
        borderRadius: "10px", padding: "16px 20px",
        fontSize: "13.5px", lineHeight: "1.75", color: "#334155",
        whiteSpace: "pre-wrap", wordBreak: "break-word",
    },
    naText:       { fontSize: "13px", color: "#CBD5E1" },
    footer: {
        display: "flex", justifyContent: "flex-end",
        padding: "20px 28px", borderTop: "1px solid #F1F5F9", marginTop: "20px",
    },
    closeBtn: {
        padding: "8px 20px", fontSize: "13px", fontWeight: "500",
        border: "1px solid #E2E8F0", borderRadius: "8px",
        cursor: "pointer", backgroundColor: "white", color: "#475569",
    },
};

const MarketEventSummaryModal = ({ event, onClose }) => {
    if (!event) return null;

    const theme     = event._activeTheme ?? event.themes?.[0] ?? {};
    const titleFr   = theme.theme ?? "—";
    const contenuFr = theme.contenuFr ?? theme.contenu_fr ?? "";
    const contenuEn = theme.contenuEn ?? theme.contenu_en ?? "";
    const fmtDate   = (d) => d ? new Date(d).toLocaleString("fr-FR") : "N/A";

    return (
        <div style={s.overlay} onClick={onClose}>
            <div style={s.modal} onClick={e => e.stopPropagation()}>

                <div style={s.header}>
                    <div style={s.headerLeft}>
                        <div style={s.iconWrap}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ color: "#2563EB" }}>
                                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 012-2h2a2 2 0 012 2M9 5h6"
                                    stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
                            </svg>
                        </div>
                        <div>
                            <h2 style={s.title}>{titleFr}</h2>
                            <p style={s.subtitle}>
                                {event.famille && <span style={s.familleTag}>{event.famille}</span>}
                                · {fmtDate(event.genereLe)}
                            </p>
                        </div>
                    </div>
                    <button style={s.closeIconBtn} onClick={onClose} title="Fermer">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ color: "#94A3B8" }}>
                            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                    </button>
                </div>

                <div style={s.section}>
                    <p style={s.sectionLabel}>Résumé · Français</p>
                    <div style={s.contentBox}>
                        {contenuFr || <span style={s.naText}>Aucun contenu disponible.</span>}
                    </div>
                </div>

                {contenuEn && (
                    <div style={{ ...s.section, marginTop: "16px" }}>
                        <p style={s.sectionLabel}>Summary · English</p>
                        <div style={{ ...s.contentBox, color: "#64748B" }}>
                            {contenuEn}
                        </div>
                    </div>
                )}

                <div style={s.footer}>
                    <button style={s.closeBtn} onClick={onClose}>Fermer</button>
                </div>
            </div>
        </div>
    );
};

export default MarketEventSummaryModal;