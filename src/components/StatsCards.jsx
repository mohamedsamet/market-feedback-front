const StatsCards = ({ events }) => {
    const total = events.length;

    const today = events.filter(event => {
        const eventDate = new Date(event.creationDate).toDateString();
        const todayDate = new Date().toDateString();
        return eventDate === todayDate;
    }).length;

    const sources = [...new Set(events.map(e => new URL(e.sourceUrl).hostname))].length;

    const cards = [
        { label: "Total collecté", value: total, color: "#4F46E5" },
        { label: "Aujourd'hui", value: today, color: "#4F46E5" },
        { label: "Sources actives", value: sources, color: "#4F46E5" }
    ];

    return (
        <div style={styles.container}>
            {cards.map(card => (
                <div key={card.label} style={{ ...styles.card, borderLeft: `6px solid ${card.color}` }}>
                    
                    <p style={styles.label}>{card.label}</p>

                    <p style={styles.valueRight}>{card.value}</p>

                </div>
            ))}
        </div>
    );
};
const styles = {
    container: {
        display: "grid",
        gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
        gap: "16px",
        marginBottom: "24px"
    },

    card: {
    backgroundColor: "#ffffff",
    borderRadius: "14px",
    padding: "18px",
    boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
    border: "1px solid #F0F0F0",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    transition: "0.2s ease",
    cursor: "pointer"
},
valueRight: {
    fontSize: "28px",
    fontWeight: "600",
    color: "#111827",
    margin: "0",
    textAlign: "right"
},

    label: {
        fontSize: "12px",
        color: "#6B7280",
        margin: "0 0 6px"
    },

    value: {
        fontSize: "28px",
        fontWeight: "800",
        color: "#111827",
        margin: "0"
    }
};
export default StatsCards;