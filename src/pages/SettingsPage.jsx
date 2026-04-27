import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircleFilled, CloseCircleFilled, ArrowLeftOutlined } from '@ant-design/icons';
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

const API_URL = "http://localhost:9060/api/settings";

const parseCron = (cron) => {
    if (!cron) return "N/A";
    const parts = cron.trim().split(" ");
    if (parts.length === 6) {
        const minutes = parts[1];
        const hours   = parts[2];
        if (hours.startsWith("*/"))    return `Toutes les ${hours.replace("*/", "")} heure(s)`;
        if (minutes.startsWith("*/"))  return `Toutes les ${minutes.replace("*/", "")} minute(s)`;
        if (hours !== "*" && minutes === "0") return `Tous les jours à ${hours}h00`;
    }
    return cron;
};

const SettingsPage = () => {
    const navigate = useNavigate();
    const [status,          setStatus]          = useState(null);
    const [loading,         setLoading]         = useState(true);
    const [autoRefresh,     setAutoRefresh]     = useState(false);
    const [refreshInterval, setRefreshInterval] = useState(30);

    useEffect(() => {
        fetch(`${API_URL}/status`)
            .then(res => res.json())
            .then(data => { setStatus(data); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);

    useEffect(() => {
        setAutoRefresh(localStorage.getItem("autoRefresh") === "true");
        setRefreshInterval(parseInt(localStorage.getItem("refreshInterval") || "30"));
    }, []);

    const handleAutoRefreshChange = (e) => {
        setAutoRefresh(e.target.checked);
        localStorage.setItem("autoRefresh", e.target.checked);
    };

    const handleIntervalChange = (e) => {
        const val = Math.max(10, Math.min(300, parseInt(e.target.value) || 30));
        setRefreshInterval(val);
        localStorage.setItem("refreshInterval", val);
    };

    const isActive = status?.active === true;

    return (
        <div style={s.page}>
            <Header />
            <div style={s.body}>
                <Sidebar activePage="settings" />

                <main style={s.main}>
                  <div style={s.inner}>

                    {/* ── Page header ── */}
                    <div style={s.pageHeader}>
                        <button style={s.backBtn} onClick={() => navigate("/")}>
                            <ArrowLeftOutlined style={{ fontSize: "13px" }} />
                            Retour
                        </button>
                        <div>
                            <h1 style={s.pageTitle}>Paramètres</h1>
                            <p style={s.pageSubtitle}>Configuration et préférences de la plateforme</p>
                        </div>
                    </div>

                    <div style={s.grid}>

                        {/* ── System status card ── */}
                        <div style={s.card}>
                            <div style={s.cardHeader}>
                                <div style={{ ...s.cardIconWrap, backgroundColor: "#EFF6FF", border: "1px solid #DBEAFE" }}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ color: "#2563EB" }}>
                                        <path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18"
                                            stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
                                    </svg>
                                </div>
                                <div>
                                    <p style={s.cardTitle}>Configuration Système</p>
                                    <p style={s.cardSubtitle}>Connexion avec les serveurs de market events</p>
                                </div>
                            </div>

                            <div style={s.cardDivider} />

                            {loading ? (
                                <div style={s.loadingRow}>
                                    <div style={s.spinner} />
                                    <span style={s.loadingText}>Chargement…</span>
                                </div>
                            ) : (
                                <div style={s.statusSection}>
                                    {/* Status badge */}
                                    <div style={{ ...s.statusBadge, ...(isActive ? s.statusBadgeActive : s.statusBadgeInactive) }}>
                                        <div style={{ ...s.statusDot, backgroundColor: isActive ? "#16A34A" : "#DC2626" }} />
                                        <span style={{ ...s.statusText, color: isActive ? "#15803D" : "#A32D2D" }}>
                                            {isActive ? "Collecte active" : "Collecte inactive"}
                                        </span>
                                        {isActive
                                            ? <CheckCircleFilled style={{ color: "#16A34A", fontSize: "14px" }} />
                                            : <CloseCircleFilled style={{ color: "#DC2626", fontSize: "14px" }} />
                                        }
                                    </div>

                                    {/* Frequency row */}
                                    <div style={s.freqRow}>
                                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" style={{ color: "#94A3B8", flexShrink: 0 }}>
                                            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.75"/>
                                            <path d="M12 7v5l3 3" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
                                        </svg>
                                        <span style={s.freqLabel}>Fréquence :</span>
                                        <span style={s.freqValue}>{parseCron(status?.cron)}</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* ── Sync preferences card ── */}
                        <div style={s.card}>
                            <div style={s.cardHeader}>
                                <div style={{ ...s.cardIconWrap, backgroundColor: "#F0FDF4", border: "1px solid #BBF7D0" }}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ color: "#16A34A" }}>
                                        <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                            stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
                                    </svg>
                                </div>
                                <div>
                                    <p style={s.cardTitle}>Synchronisation</p>
                                    <p style={s.cardSubtitle}>Options d'actualisation automatique</p>
                                </div>
                            </div>

                            <div style={s.cardDivider} />

                            {/* Toggle row */}
                            <div style={s.toggleRow}>
                                <div>
                                    <p style={s.toggleLabel}>Auto-actualisation</p>
                                    <p style={s.toggleDesc}>Recharger les données automatiquement</p>
                                </div>
                                <label style={s.switchWrap}>
                                    <input
                                        type="checkbox"
                                        checked={autoRefresh}
                                        onChange={handleAutoRefreshChange}
                                        style={{ display: "none" }}
                                        id="autoRefreshToggle"
                                    />
                                    <div style={{
                                        ...s.switchTrack,
                                        backgroundColor: autoRefresh ? "#2563EB" : "#E2E8F0",
                                    }}>
                                        <div style={{
                                            ...s.switchThumb,
                                            transform: autoRefresh ? "translateX(20px)" : "translateX(2px)",
                                        }} />
                                    </div>
                                </label>
                            </div>

                            {/* Interval picker — shown only when active */}
                            {autoRefresh && (
                                <div style={s.intervalBox}>
                                    <div style={s.intervalRow}>
                                        <div>
                                            <p style={s.intervalLabel}>Intervalle (secondes)</p>
                                            <p style={s.intervalHint}>Min : 10s — Max : 300s</p>
                                        </div>
                                        <div style={s.intervalInputWrap}>
                                            <input
                                                type="number"
                                                min="10"
                                                max="300"
                                                value={refreshInterval}
                                                onChange={handleIntervalChange}
                                                style={s.intervalInput}
                                            />
                                            <span style={s.intervalUnit}>s</span>
                                        </div>
                                    </div>
                                    <div style={s.intervalInfo}>
                                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" style={{ color: "#2563EB", flexShrink: 0 }}>
                                            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.75"/>
                                            <path d="M12 8v4m0 4h.01" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
                                        </svg>
                                        <span style={s.intervalInfoText}>
                                            Actualisation toutes les <strong>{refreshInterval}s</strong>
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                  </div>
                </main>
            </div>
        </div>
    );
};

const s = {
    page:         { minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: "#F8FAFC", fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" },
    body:         { display: "flex", flex: 1, overflow: "hidden" },
    main:         { flex: 1, padding: "28px 32px", overflowY: "auto", display: "flex", flexDirection: "column", alignItems: "center" },
    inner:        { width: "100%", maxWidth: "760px" },

    pageHeader:   { display: "flex", flexDirection: "column", gap: "12px", marginBottom: "28px" },
    backBtn: {
        display: "inline-flex", alignItems: "center", gap: "6px",
        fontSize: "13px", color: "#64748B", fontWeight: "500",
        background: "none", border: "none", cursor: "pointer", padding: 0,
    },
    pageTitle:    { fontSize: "20px", fontWeight: "600", color: "#0F172A", margin: 0, letterSpacing: "-0.3px" },
    pageSubtitle: { fontSize: "13px", color: "#94A3B8", margin: "3px 0 0" },

    grid:         { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "20px", maxWidth: "760px", margin: "0 auto" },

    /* card */
    card: {
        backgroundColor: "white", border: "1px solid #E2E8F0",
        borderRadius: "12px", padding: "22px 24px",
        boxShadow: "0 1px 3px rgba(15,23,42,0.04)",
        display: "flex", flexDirection: "column", gap: "0",
    },
    cardHeader:   { display: "flex", alignItems: "flex-start", gap: "14px", marginBottom: "16px" },
    cardIconWrap: { width: "38px", height: "38px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
    cardTitle:    { fontSize: "14px", fontWeight: "600", color: "#0F172A", margin: 0 },
    cardSubtitle: { fontSize: "12px", color: "#94A3B8", margin: "2px 0 0" },
    cardDivider:  { height: "1px", backgroundColor: "#F1F5F9", margin: "0 0 18px" },

    /* loading */
    loadingRow:   { display: "flex", alignItems: "center", gap: "10px" },
    spinner:      { width: "18px", height: "18px", border: "2px solid #E2E8F0", borderTop: "2px solid #2563EB", borderRadius: "50%", animation: "spin 0.7s linear infinite" },
    loadingText:  { fontSize: "13px", color: "#94A3B8" },

    /* status */
    statusSection: { display: "flex", flexDirection: "column", gap: "12px" },
    statusBadge:   { display: "inline-flex", alignItems: "center", gap: "8px", padding: "8px 14px", borderRadius: "8px", border: "1px solid", alignSelf: "flex-start" },
    statusBadgeActive:   { backgroundColor: "#F0FDF4", borderColor: "#BBF7D0" },
    statusBadgeInactive: { backgroundColor: "#FEF2F2", borderColor: "#FECACA" },
    statusDot:     { width: "7px", height: "7px", borderRadius: "50%", flexShrink: 0 },
    statusText:    { fontSize: "13px", fontWeight: "600" },
    freqRow:       { display: "flex", alignItems: "center", gap: "6px" },
    freqLabel:     { fontSize: "12px", color: "#64748B" },
    freqValue:     { fontSize: "12px", fontWeight: "500", color: "#1E293B" },

    /* toggle */
    toggleRow:    { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0" },
    toggleLabel:  { fontSize: "13px", fontWeight: "500", color: "#1E293B", margin: 0 },
    toggleDesc:   { fontSize: "12px", color: "#94A3B8", margin: "2px 0 0" },
    switchWrap:   { cursor: "pointer", flexShrink: 0 },
    switchTrack:  { width: "42px", height: "24px", borderRadius: "12px", position: "relative", transition: "background-color 0.2s" },
    switchThumb:  { position: "absolute", top: "2px", width: "20px", height: "20px", borderRadius: "50%", backgroundColor: "white", boxShadow: "0 1px 3px rgba(0,0,0,0.2)", transition: "transform 0.2s" },

    /* interval */
    intervalBox:  { marginTop: "14px", backgroundColor: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: "10px", padding: "14px 16px", display: "flex", flexDirection: "column", gap: "12px" },
    intervalRow:  { display: "flex", alignItems: "center", justifyContent: "space-between" },
    intervalLabel: { fontSize: "13px", fontWeight: "500", color: "#1E293B", margin: 0 },
    intervalHint: { fontSize: "11px", color: "#94A3B8", margin: "2px 0 0" },
    intervalInputWrap: { display: "flex", alignItems: "center", gap: "6px" },
    intervalInput: {
        width: "64px", padding: "6px 10px", textAlign: "center",
        border: "1px solid #E2E8F0", borderRadius: "8px",
        fontSize: "13px", fontWeight: "500", color: "#1E293B",
        outline: "none", backgroundColor: "white",
    },
    intervalUnit:  { fontSize: "12px", color: "#94A3B8" },
    intervalInfo:  { display: "flex", alignItems: "center", gap: "6px" },
    intervalInfoText: { fontSize: "12px", color: "#64748B" },
};

if (typeof document !== "undefined" && !document.getElementById("settings-spin-style")) {
    const style = document.createElement("style");
    style.id = "settings-spin-style";
    style.textContent = "@keyframes spin { to { transform: rotate(360deg); } }";
    document.head.appendChild(style);
}

export default SettingsPage;