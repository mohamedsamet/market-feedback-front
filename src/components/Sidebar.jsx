import {
    DashboardOutlined,
    FileTextOutlined,
    ApiOutlined,
    CheckCircleFilled
} from "@ant-design/icons";

const Sidebar = ({ activePage }) => {

    const menuItems = [
        { id: "dashboard", label: "Dashboard", icon: <DashboardOutlined /> },
        { id: "events", label: "Market Events", icon: <FileTextOutlined /> },
        { id: "sources", label: "Sources", icon: <ApiOutlined /> }
    ];

    return (
        <div style={styles.sidebar}>

            <p style={styles.sectionTitle}>NAVIGATION</p>

            {menuItems.map(item => (
                <div
                    key={item.id}
                    style={{
                        ...styles.menuItem,
                        ...(activePage === item.id ? styles.activeItem : {})
                    }}
                >
                    <span style={{
                        ...styles.icon,
                        color: activePage === item.id ? "#185FA5" : "#888"
                    }}>
                        {item.icon}
                    </span>
                    <span style={{
                        ...styles.label,
                        color: activePage === item.id ? "#185FA5" : "#444",
                        fontWeight: activePage === item.id ? "500" : "400"
                    }}>
                        {item.label}
                    </span>
                </div>
            ))}

            <div style={styles.statusSection}>
                <p style={styles.sectionTitle}>STATUT</p>
                <div style={styles.statusRow}>
                    <CheckCircleFilled style={{ color: "#3B6D11", fontSize: "14px" }} />
                    <span style={styles.statusText}>Collecte active</span>
                </div>
            </div>

        </div>
    );
};

const styles = {
    sidebar: {
        width: "200px",
        backgroundColor: "white",
        borderRight: "0.5px solid #E0E0E0",
        padding: "16px 0",
        flexShrink: 0,
        height: "100%"
    },
    sectionTitle: {
        fontSize: "11px",
        color: "#AAAAAA",
        padding: "0 16px",
        margin: "0 0 8px",
        letterSpacing: "0.05em"
    },
    menuItem: {
        padding: "8px 16px",
        display: "flex",
        alignItems: "center",
        gap: "10px",
        cursor: "pointer",
        borderLeft: "2px solid transparent"
    },
    activeItem: {
        backgroundColor: "#EBF3FB",
        borderLeft: "2px solid #185FA5"
    },
    icon: {
        fontSize: "16px"
    },
    label: {
        fontSize: "13px"
    },
    statusSection: {
        marginTop: "24px"
    },
    statusRow: {
        padding: "8px 16px",
        display: "flex",
        alignItems: "center",
        gap: "8px"
    },
    statusText: {
        fontSize: "12px",
        color: "#666"
    }
};

export default Sidebar;