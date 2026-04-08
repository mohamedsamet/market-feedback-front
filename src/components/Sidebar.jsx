import {
    DashboardOutlined,
    FileTextOutlined,
    ApiOutlined,
    CheckCircleFilled,
    SettingOutlined
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom"; // Import de la logique

const Sidebar = ({ activePage }) => {
    const navigate = useNavigate(); // Initialisation du navigateur

    const menuItems = [
        { id: "dashboard", label: "Dashboard", icon: <DashboardOutlined />, path: "/" },
        { id: "events", label: "Market Events", icon: <FileTextOutlined />, path: "/" },
        { id: "sources", label: "Sources", icon: <ApiOutlined />, path: "/" }
    ];

    return (
        <div style={styles.sidebar}>

            {menuItems.map(item => (
                <div
                    key={item.id}
                    onClick={() => navigate(item.path)} // Navigation au clic
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

            <div style={styles.bottom}>
                <div 
                    onClick={() => navigate('/settings')} // Navigation vers Settings
                    style={{ 
                        ...styles.menuItem, 
                        ...styles.settingsItem,
                        backgroundColor: activePage === 'settings' ? '#EBF3FB' : '#F3F4F6' // État actif visuel
                    }}
                >
                    <SettingOutlined style={{
                        ...styles.icon,
                        color: activePage === 'settings' ? "#185FA5" : "#444"
                    }} />
                    <span style={{
                        ...styles.label,
                        color: activePage === 'settings' ? "#185FA5" : "#444"
                    }}>
                        Settings
                    </span>
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
        height: "100%",
        position: "relative"
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
    settingsItem: {
        backgroundColor: "#F3F4F6",   
        border: "1px solid #E5E7EB",
        margin: "0 10px", // Petit ajustement pour ne pas coller aux bords si besoin
        borderRadius: "4px"
    },
    bottom: {
        position: "absolute",
        bottom: "20px",
        width: "100%",
    }
};

export default Sidebar;