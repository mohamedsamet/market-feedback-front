
import { ClockCircleOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import logo from "../assets/logo.png";
const Header = () => {

    const [time, setTime] = useState(new Date());

    // met à jour l'heure chaque seconde
    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const formattedDate = time.toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric"
    });

    const formattedTime = time.toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    });

    return (
        <div style={styles.header}>

            {/* logo + nom */}
            <div style={styles.brand}>
                <img src={logo} alt="logo" style={styles.logo} />
                <div style={styles.brandText}>
                    <span style={styles.brandName}>Market Feedback</span>
                    <span style={styles.brandSub}>Data Collection Platform</span>
                </div>
            </div>

            {/* date et heure en temps réel */}
            <div style={styles.dateContainer}>
                <ClockCircleOutlined style={{ fontSize: "14px", color: "#888" }} />
                <span style={styles.date}>{formattedDate}</span>
                <span style={styles.time}>{formattedTime}</span>
            </div>

        </div>
    );
};

const styles = {
    header: {
        height: "56px",
        backgroundColor: "white",
        borderBottom: "0.5px solid #E0E0E0",
        padding: "0 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        zIndex: 100
    },
    brand: {
        display: "flex",
        alignItems: "center",
        gap: "12px"
    },
    
    brandText: {
        display: "flex",
        flexDirection: "column"
    },
    brandName: {
        fontSize: "15px",
        fontWeight: "500",
        color: "#1A1A1A",
        lineHeight: "1.2"
    },
    brandSub: {
        fontSize: "11px",
        color: "#888",
        lineHeight: "1.2"
    },
    dateContainer: {
        display: "flex",
        alignItems: "center",
        gap: "8px"
    },
    date: {
        fontSize: "13px",
        color: "#888"
    },
    logo: {
     width: "40px",
    height: "40px",
    objectFit: "contain",
    marginRight: "4px"
},
    time: {
        fontSize: "13px",
        fontWeight: "500",
        color: "#185FA5"
    }
};

export default Header;