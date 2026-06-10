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
    headerLeft:  { display: "flex", alignItems: "center", gap: "14px" },
    iconWrap: {
        width: "40px", height: "40px", borderRadius: "10px",
        backgroundColor: "#EFF6FF", border: "1px solid #DBEAFE",
        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
    },
    title:       { fontSize: "15px", fontWeight: "600", color: "#0F172A", margin: 0 },
    subtitle:    { fontSize: "12px", color: "#94A3B8", margin: "2px 0 0", fontWeight: "400" },
    closeIconBtn: {
        background: "none", border: "1px solid #E2E8F0", borderRadius: "8px",
        padding: "6px", cursor: "pointer", display: "flex",
        alignItems: "center", justifyContent: "center", flexShrink: 0,
    },
    metaGrid: {
        display: "grid", gridTemplateColumns: "1fr 1fr",
        gap: "10px", margin: "20px 28px",
    },
    metaItem:    { backgroundColor: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: "10px", padding: "12px 16px", display: "flex", flexDirection: "column", gap: "4px" },
    metaLabel:   { fontSize: "11px", color: "#94A3B8", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.05em" },
    metaValue:   { fontSize: "13px", color: "#1E293B", fontWeight: "500", wordBreak: "break-word" },
    link:        { fontSize: "13px", color: "#2563EB", fontWeight: "500", textDecoration: "none", wordBreak: "break-all" },
    naText:      { fontSize: "13px", color: "#CBD5E1" },
    imgWrap:     { margin: "0 28px 20px", borderRadius: "10px", overflow: "hidden", border: "1px solid #E2E8F0" },
    img:         { width: "100%", maxHeight: "220px", objectFit: "cover", display: "block" },
    section:      { padding: "0 28px 8px" },
    sectionLabel: { fontSize: "11px", color: "#94A3B8", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 10px" },
    contentBox: {
        backgroundColor: "#F8FAFC", border: "1px solid #E2E8F0",
        borderRadius: "10px", padding: "16px 20px",
        fontSize: "13.5px", lineHeight: "1.75", color: "#334155",
        whiteSpace: "pre-wrap", wordBreak: "break-word",
    },
    footer: {
        display: "flex", justifyContent: "flex-end",
        padding: "18px 28px", borderTop: "1px solid #F1F5F9", marginTop: "8px",
    },
    closeBtn: {
        padding: "8px 20px", fontSize: "13px", fontWeight: "500",
        border: "1px solid #E2E8F0", borderRadius: "8px",
        cursor: "pointer", backgroundColor: "white", color: "#475569",
    },
};

// Parse la string Java-like : "title=Foo, url=http://..., content=blah"
const parseJavaToString = (str = "") => {
    const result = {};
    const keys = ["source", "author", "title", "description", "url", "urlToImage", "publishedAt", "content"];
    keys.forEach((key, i) => {
        const nextKey = keys[i + 1];
        const start = str.indexOf(`${key}=`);
        if (start === -1) return;
        const valueStart = start + key.length + 1;
        const end = nextKey ? str.indexOf(`, ${nextKey}=`) : str.lastIndexOf("}");
        result[key] = end !== -1 ? str.slice(valueStart, end).trim() : str.slice(valueStart).trim();
    });
    return result;
};

const MarketEventModal = ({ event, onClose }) => {
    if (!event) return null;

    const fmtDate = (d) => d ? new Date(d).toLocaleString("fr-FR") : "N/A";

    // Parser le content brut
    const raw = event.content ?? "";
    // Enlever l'enveloppe extérieure { ... }
    const inner = raw.startsWith("{") ? raw.slice(1, raw.lastIndexOf("}")) : raw;
    const parsed = parseJavaToString(inner);

    const title       = parsed.title       ?? "—";
    const author      = parsed.author      ?? "—";
    const description = parsed.description ?? "";
    const content     = parsed.content     ?? "";
    const url         = parsed.url         ?? "";
    const urlToImage  = parsed.urlToImage  ?? "";
    const publishedAt = parsed.publishedAt ?? "";
    const sourceName  = parsed.source
        ? (parsed.source.match(/name=([^,}]+)/)?.[1] ?? parsed.source)
        : "—";

    return (
        <div style={s.overlay} onClick={onClose}>
            <div style={s.modal} onClick={e => e.stopPropagation()}>

                {/* Header */}
                <div style={s.header}>
                    <div style={s.headerLeft}>
                        <div style={s.iconWrap}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ color: "#2563EB" }}>
                                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 012-2h2a2 2 0 012 2M9 5h6"
                                    stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
                            </svg>
                        </div>
                        <div>
                            <h2 style={s.title}>{title}</h2>
                            <p style={s.subtitle}>ID #{event.id} · {sourceName}</p>
                        </div>
                    </div>
                    <button style={s.closeIconBtn} onClick={onClose} title="Fermer">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ color: "#94A3B8" }}>
                            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                    </button>
                </div>

                

                {/* Meta grid */}
                <div style={s.metaGrid}>
                    <div style={s.metaItem}>
                        <span style={s.metaLabel}>Auteur</span>
                        <span style={s.metaValue}>{author}</span>
                    </div>
                    <div style={s.metaItem}>
                        <span style={s.metaLabel}>Publié le</span>
                        <span style={s.metaValue}>{publishedAt ? fmtDate(publishedAt) : "—"}</span>
                    </div>
                    <div style={s.metaItem}>
                        <span style={s.metaLabel}>Date d'import</span>
                        <span style={s.metaValue}>{fmtDate(event.creationDate)}</span>
                    </div>
                    <div style={s.metaItem}>
                        <span style={s.metaLabel}>URL source</span>
                        {url && url !== "null"
                            ? <a href={url} target="_blank" rel="noreferrer" style={s.link}>Ouvrir l'article ↗</a>
                            : <span style={s.naText}>—</span>}
                    </div>
                </div>

                

                {/* Contenu complet */}
<div style={s.section}>
    <p style={s.sectionLabel}>Contenu</p>
    <div style={s.contentBox}>
        {[description, content].filter(Boolean).join("\n\n") || <span style={s.naText}>Aucun contenu disponible.</span>}
    </div>
</div>

                {/* Footer */}
                <div style={s.footer}>
                    <button style={s.closeBtn} onClick={onClose}>Fermer</button>
                </div>
            </div>
        </div>
    );
};

export default MarketEventModal;