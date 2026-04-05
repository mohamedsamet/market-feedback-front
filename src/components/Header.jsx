import { ClockCircleOutlined, UserOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import logo from "../assets/logo.png";
import { LogoutOutlined } from "@ant-design/icons";
const Header = () => {

    const [time, setTime] = useState(new Date());

    // heure live
    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const logout = () => {
        console.log("Déconnexion...");
       
        navigate("/login");
    };

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

            <div style={styles.brand}>
                <img src={logo} alt="logo" style={styles.logo} />
                <div style={styles.brandText}>
                    <span style={styles.brandName}>Market Feedback</span>
                    <span style={styles.brandSub}>Data Collection Platform</span>
                </div>
            </div>

            <div style={styles.dateContainer}>
                <ClockCircleOutlined style={{ fontSize: "14px", color: "#888" }} />
                <span style={styles.date}>{formattedDate}</span>
                <span style={styles.time}>{formattedTime}</span>
           </div>
            {/* RIGHT - USER AREA */}
            <div style={styles.userArea}>

                {/* PROFILE */}
                <div
                    style={styles.userInfo}
                    onClick={() => navigate("/profile")}
                >
                    <div style={styles.avatar}>
                        <UserOutlined style={{ fontSize: "14px", color: "white" }} />
                    </div>

                    <span style={styles.userName}>
                        Nom prenom
                    </span>
                </div>

                {/* LOGOUT */}
                <div
    style={styles.logoutBox}
    onClick={logout}
    title="Se déconnecter"
>
    <LogoutOutlined style={{ fontSize: "16px", color: "#333" }} />
</div>


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

    logo: {
        width: "40px",
        height: "40px",
        objectFit: "contain"
    },

    brandText: {
        display: "flex",
        flexDirection: "column"
    },

    brandName: {
        fontSize: "15px",
        fontWeight: "500",
        color: "#1A1A1A"
    },

    brandSub: {
        fontSize: "11px",
        color: "#888"
    },

    dateContainer: {
        display: "flex",
        alignItems: "center",
        gap: "10px"
    },

    date: {
        fontSize: "13px",
        color: "#888"
    },

    time: {
        fontSize: "13px",
        fontWeight: "500",
        color: "#185FA5"
    },

    userArea: {
        display: "flex",
        alignItems: "center",
        gap: "10px"
    },

    userInfo: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "6px 12px",
        borderRadius: "20px",
        cursor: "pointer",
        transition: "0.2s",
    },
 
    avatar: {
        width: "32px",
        height: "32px",
        borderRadius: "50%",
        backgroundColor: "#185FA5",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    },

    userName: {
        fontSize: "13px",
        fontWeight: "500",
        color: "#333"
    },

    logoutBox: {
        width: "34px",
        height: "34px",
        borderRadius: "8px",
        backgroundColor: "#f5f5f5",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        color: "#333",
        fontSize: "15px",
        transition: "0.2s"
    }

}



export default Header;