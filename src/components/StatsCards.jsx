const StatsCards = ({ totalEvents = 0, todayCount = 0, sourcesCount = 0 }) => {

    const cards = [
        { label: "Total collecté",  value: totalEvents,  color: "#4F46E5" },
        { label: "Aujourd'hui",     value: todayCount,   color: "#4F46E5" },
        { label: "Sources actives", value: sourcesCount, color: "#4F46E5" }
    ];

    return (
        <div style={styles.container}>
            {cards.map(card => (
                <div key={card.label} style={{ ...styles.card, borderLeft: `6px solid ${card.color}` }}>
                    <div>
                        <p style={styles.label}>{card.label}</p>
                        <p style={styles.value}>{card.value}</p>
                    </div>
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
        alignItems: "center",
        transition: "0.2s ease",
        cursor: "pointer"
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