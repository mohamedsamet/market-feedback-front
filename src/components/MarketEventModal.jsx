// Fenêtre qui s'ouvre quand on clique sur une ligne du tableau
const MarketEventModal = ({ event, onClose }) => {

    // si pas d'événement sélectionné → on affiche rien
    if (!event) return null;

    return (
        // fond sombre derrière la fenêtre
        <div style={styles.overlay} onClick={onClose}>

            // la fenêtre elle-même
            <div style={styles.modal} onClick={e => e.stopPropagation()}>

                <h2 style={styles.title}>Détail de l'événement</h2>

                <div style={styles.field}>
                    <span style={styles.label}>Source :</span>
                    <span style={styles.value}>{event.sourceUrl}</span>
                </div>

                <div style={styles.field}>
                    <span style={styles.label}>Date :</span>
                    <span style={styles.value}>{event.creationDate}</span>
                </div>

                <div style={styles.field}>
                    <span style={styles.label}>Contenu :</span>
                    <p style={styles.content}>{event.content}</p>
                </div>

                <button style={styles.closeButton} onClick={onClose}>
                    Fermer
                </button>
            </div>
        </div>
    );
};

// styles
const styles = {
    overlay: {
        position: "fixed",
        top: 0, left: 0,
        width: "100%", height: "100%",
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000
    },
    modal: {
        backgroundColor: "white",
        borderRadius: "8px",
        padding: "30px",
        width: "60%",
        maxHeight: "80vh",
        overflowY: "auto",
        boxShadow: "0 4px 20px rgba(0,0,0,0.3)"
    },
    title: {
        marginBottom: "20px",
        color: "#1E3A5F",
        borderBottom: "2px solid #2E86C1",
        paddingBottom: "10px"
    },
    field: {
        marginBottom: "15px"
    },
    label: {
        fontWeight: "bold",
        color: "#1E3A5F",
        marginRight: "10px"
    },
    value: {
        color: "#2C3E50"
    },
    content: {
        backgroundColor: "#F2F4F4",
        padding: "15px",
        borderRadius: "5px",
        lineHeight: "1.6",
        color: "#2C3E50"
    },
    closeButton: {
        marginTop: "20px",
        padding: "10px 20px",
        backgroundColor: "#2E86C1",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        float: "right"
    }
};

export default MarketEventModal;