import { ClockCircleOutlined, UserOutlined, LogoutOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

const Header = () => {
    const [time, setTime] = useState(new Date());
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const logout = () => {
        console.log("Déconnexion...");
        navigate("/login");
    };

    const formattedDate = time.toLocaleDateString("fr-FR", {
        day: "numeric", month: "long", year: "numeric"
    });

    const formattedTime = time.toLocaleTimeString("fr-FR", {
        hour: "2-digit", minute: "2-digit", second: "2-digit"
    });

    return (
        <header style={s.header}>

            {/* ── Brand ── */}
            <div style={s.brand}>
                <img src={logo} alt="logo" style={s.logo} />
                <div style={s.brandText}>
                    <span style={s.brandName}>Market Feedback</span>
                    <span style={s.brandSub}>Data Collection Platform</span>
                </div>
            </div>

            {/* ── Clock ── */}
            <div style={s.clock}>
                <ClockCircleOutlined style={{ fontSize: "13px", color: "#94A3B8" }} />
                <span style={s.date}>{formattedDate}</span>
                <span style={s.separator}>·</span>
                <span style={s.time}>{formattedTime}</span>
            </div>

            {/* ── User area ── */}
            <div style={s.userArea}>
                <div style={s.userInfo} onClick={() => navigate("/profile")}>
                    <div style={s.avatar}>
                        <UserOutlined style={{ fontSize: "13px", color: "white" }} />
                    </div>
                    <div style={s.userText}>
                        <span style={s.userName}>Nom Prénom</span>
                        <span style={s.userRole}>Décideur</span>
                    </div>
                </div>

                <div style={s.divider} />

                <button style={s.logoutBtn} onClick={logout} title="Se déconnecter">
                    <LogoutOutlined style={{ fontSize: "14px", color: "#64748B" }} />
                </button>
            </div>

        </header>
    );
};

const s = {
    header: {
        height: "58px", backgroundColor: "white",
        borderBottom: "1px solid #E2E8F0",
        padding: "0 24px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        position: "sticky", top: 0, zIndex: 100,
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        boxShadow: "0 1px 3px rgba(15,23,42,0.04)",
    },

    /* brand */
    brand:      { display: "flex", alignItems: "center", gap: "12px" },
    logo:       { width: "36px", height: "36px", objectFit: "contain", borderRadius: "8px" },
    brandText:  { display: "flex", flexDirection: "column", gap: "1px" },
    brandName:  { fontSize: "14px", fontWeight: "600", color: "#0F172A", letterSpacing: "-0.2px" },
    brandSub:   { fontSize: "11px", color: "#94A3B8", fontWeight: "400" },

    /* clock */
    clock: {
        display: "flex", alignItems: "center", gap: "8px",
        backgroundColor: "#F8FAFC", border: "1px solid #E2E8F0",
        borderRadius: "8px", padding: "6px 14px",
    },
    date:       { fontSize: "12.5px", color: "#64748B" },
    separator:  { fontSize: "12px", color: "#CBD5E1" },
    time:       { fontSize: "12.5px", fontWeight: "600", color: "#2563EB", fontVariantNumeric: "tabular-nums" },

    /* user area */
    userArea:   { display: "flex", alignItems: "center", gap: "4px" },
    userInfo: {
        display: "flex", alignItems: "center", gap: "10px",
        padding: "5px 10px 5px 6px", borderRadius: "10px",
        cursor: "pointer", transition: "background-color 0.15s",
        border: "1px solid transparent",
    },
    avatar: {
        width: "30px", height: "30px", borderRadius: "50%",
        background: "linear-gradient(135deg, #2563EB, #1D4ED8)",
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0,
    },
    userText:   { display: "flex", flexDirection: "column", gap: "1px" },
    userName:   { fontSize: "13px", fontWeight: "500", color: "#1E293B", lineHeight: 1 },
    userRole:   { fontSize: "11px", color: "#94A3B8", lineHeight: 1 },

    divider:    { width: "1px", height: "22px", backgroundColor: "#E2E8F0", margin: "0 6px" },

    logoutBtn: {
        width: "34px", height: "34px", borderRadius: "8px",
        backgroundColor: "white", border: "1px solid #E2E8F0",
        display: "flex", alignItems: "center", justifyContent: "center",
        cursor: "pointer", transition: "background-color 0.15s",
    },
};

export default Header;