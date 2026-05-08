import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircleFilled, CloseCircleFilled, ArrowLeftOutlined } from '@ant-design/icons';
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

const API_URL       = "http://localhost:9060/api/settings";
const SCHEDULER_URL = "http://localhost:9060/api/settings/scheduler";

// Convertit (valeur, unité) → expression cron 6 champs
const buildCron = (value, unit) => {
    if (unit === "minutes") return `0 */${value} * * * *`;
    if (unit === "heures")  return `0 0 */${value} * * *`;
    if (unit === "jours")   return `0 0 0 */${value} * *`;
    return "";
};

// Lecture humaine d'un cron (pour afficher la fréquence courante)
const parseCron = (cron) => {
    if (!cron) return "N/A";
    const parts = cron.trim().split(" ");
    if (parts.length === 6) {
        const minutes = parts[1];
        const hours   = parts[2];
        const days    = parts[3];
        if (days.startsWith("*/"))    return `Tous les ${days.replace("*/", "")} jour(s)`;
        if (hours.startsWith("*/"))   return `Toutes les ${hours.replace("*/", "")} heure(s)`;
        if (minutes.startsWith("*/")) return `Toutes les ${minutes.replace("*/", "")} minute(s)`;
        if (hours !== "*" && minutes === "0") return `Tous les jours à ${hours}h00`;
    }
    return cron;
};

// ── Scheduler widget ────────────────────────────────────────────────────────
const UNITS = [
    { key: "minutes", label: "Minutes", icon: "⚡" },
    { key: "heures",  label: "Heures",  icon: "🕐" },
    { key: "jours",   label: "Jours",   icon: "📅" },
];

const UNIT_CONFIG = {
    minutes: { label: "minute(s)", min: 5,  max: 60,  step: 5,  def: 30,
        presets: [{ label: "5 min", val: 5 }, { label: "15 min", val: 15 }, { label: "30 min", val: 30 }] },
    heures:  { label: "heure(s)",  min: 1,  max: 24,  step: 1,  def: 1,
        presets: [{ label: "1 h", val: 1 }, { label: "3 h", val: 3 }, { label: "6 h", val: 6 }, { label: "12 h", val: 12 }] },
    jours:   { label: "jour(s)",   min: 1,  max: 30,  step: 1,  def: 1,
        presets: [{ label: "1 jour", val: 1 }, { label: "3 jours", val: 3 }, { label: "1 semaine", val: 7 }] },
};

const buildSummary = (value, unit) => {
    if (unit === "minutes") return `Collecte toutes les ${value} minute${value > 1 ? "s" : ""}`;
    if (unit === "heures")  return value === 1 ? "Collecte toutes les heures" : `Collecte toutes les ${value} heures`;
    if (unit === "jours")   return value === 1 ? "Collecte tous les jours" : `Collecte tous les ${value} jours`;
    return "";
};

// Tente de déduire unité + valeur depuis un cron existant
const parseCronToState = (cron) => {
    if (!cron) return { unit: "heures", value: 1 };
    const parts = cron.trim().split(" ");
    if (parts.length === 6) {
        const min   = parts[1];
        const hours = parts[2];
        const days  = parts[3];
        if (days.startsWith("*/"))    return { unit: "jours",   value: parseInt(days.replace("*/", ""))   || 1 };
        if (hours.startsWith("*/"))   return { unit: "heures",  value: parseInt(hours.replace("*/", ""))  || 1 };
        if (min.startsWith("*/"))     return { unit: "minutes", value: parseInt(min.replace("*/", ""))    || 5 };
    }
    return { unit: "heures", value: 1 };
};

const SchedulerWidget = ({ initialCron, onSave }) => {
    const init = parseCronToState(initialCron);
    const [unit,        setUnitState] = useState(init.unit);
    const [value,       setValue]     = useState(init.value);
    const [saving,      setSaving]    = useState(false);
    const [saved,       setSaved]     = useState(false);
    const [error,       setError]     = useState("");

    const cfg = UNIT_CONFIG[unit];

    const changeUnit = (u) => {
        setUnitState(u);
        setValue(UNIT_CONFIG[u].def);
        setSaved(false);
        setError("");
    };

    const step = (delta) => {
        setValue(prev => {
            const next = prev + delta * cfg.step;
            return Math.max(cfg.min, Math.min(cfg.max, next));
        });
        setSaved(false);
        setError("");
    };

    const selectPreset = (val) => {
        setValue(val);
        setSaved(false);
        setError("");
    };

   const handleSave = () => {
        const cron = buildCron(value, unit);
        setSaving(true);
        setError("");
        setSaved(false);
        fetch(SCHEDULER_URL, {
            method:  "POST",
            headers: { "Content-Type": "application/json" },
            body:    JSON.stringify({ cron }),
        })
            .then(res => res.json())
            .then(data => {
                if (data.error) {
                    setError(data.error);
                } else {
                    setSaved(true);
                    onSave && onSave(cron);
                    setTimeout(() => setSaved(false), 3000);
                }
            })
            .catch(() => setError("Erreur de connexion au serveur."))
            .finally(() => setSaving(false));
    };
 
    return (
        <div style={sw.wrap}>
            {/* Unité */}
            <p style={sw.sectionLabel}>Unité de temps</p>
            <div style={sw.unitGrid}>
                {UNITS.map(u => (
                    <button
                        key={u.key}
                        style={{ ...sw.unitBtn, ...(unit === u.key ? sw.unitBtnActive : {}) }}
                        onClick={() => changeUnit(u.key)}
                    >
                        <span style={sw.unitIcon}>{u.icon}</span>
                        {u.label}
                    </button>
                ))}
            </div>
 
            {/* Stepper */}
            <p style={sw.sectionLabel}>Fréquence</p>
            <div style={sw.stepperRow}>
                <button
                    style={sw.stepBtn}
                    onClick={() => step(-1)}
                    disabled={value <= cfg.min}
                    aria-label="Diminuer"
                >
                    −
                </button>
                <div style={sw.stepDisplay}>
                    <span style={sw.stepValue}>{value}</span>
                    <span style={sw.stepUnitLabel}>{cfg.label}</span>
                </div>
                <button
                    style={sw.stepBtn}
                    onClick={() => step(1)}
                    disabled={value >= cfg.max}
                    aria-label="Augmenter"
                >
                    +
                </button>
            </div>
 
            {/* Raccourcis */}
            <div style={sw.presetsRow}>
                {cfg.presets.map(p => (
                    <button
                        key={p.val}
                        style={{ ...sw.presetChip, ...(value === p.val ? sw.presetChipActive : {}) }}
                        onClick={() => selectPreset(p.val)}
                    >
                        {p.label}
                    </button>
                ))}
            </div>
 
            {/* Résumé */}
            <div style={sw.summaryBox}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ color: "#2563EB", flexShrink: 0 }}>
                    <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                        stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
                </svg>
                <span style={sw.summaryText}>
                    {buildSummary(value, unit)}
                </span>
            </div>
 
            {/* Erreur / Succès */}
            {error && (
                <div style={sw.errorBox}>
                    <CloseCircleFilled style={{ color: "#DC2626", fontSize: "13px" }} />
                    <span style={sw.errorText}>{error}</span>
                </div>
            )}
            {saved && (
                <div style={sw.successBox}>
                    <CheckCircleFilled style={{ color: "#16A34A", fontSize: "13px" }} />
                    <span style={sw.successText}>Fréquence de collecte mise à jour avec succès !</span>
                </div>
            )}
 
            {/* Bouton */}
            <div style={{ marginTop: "16px", display: "flex", justifyContent: "flex-end" }}>
                <button
                    style={{ ...sw.saveBtn, ...(saving ? sw.saveBtnDisabled : {}) }}
                    onClick={handleSave}
                    disabled={saving}
                >
                    {saving ? (
                        <>
                            <div style={{ ...sw.spinner, borderTopColor: "white" }} />
                            Enregistrement…
                        </>
                    ) : "Enregistrer"}
                </button>
            </div>
        </div>
    );
};
// ── fin SchedulerWidget ─────────────────────────────────────────────────────
 
const SettingsPage = () => {
    const navigate = useNavigate();
    const [status,          setStatus]          = useState(null);
    const [loading,         setLoading]         = useState(true);
    const [autoRefresh,     setAutoRefresh]     = useState(false);
    const [refreshInterval, setRefreshInterval] = useState(30);
    const [currentCron,     setCurrentCron]     = useState("");
 
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
 
    useEffect(() => {
        fetch(SCHEDULER_URL)
            .then(res => res.json())
            .then(data => setCurrentCron(data.cron || ""))
            .catch(() => {});
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
                                            <span style={s.freqLabel}>Fréquence actuelle :</span>
                                            <span style={s.freqValue}>{parseCron(currentCron || status?.cron)}</span>
                                        </div>
 
                                        <div style={s.cardDivider} />
 
                                        <p style={s.schedulerTitle}>Planification de la collecte</p>
 
                                        {/* ── Nouveau widget scheduler ── */}
                                        <SchedulerWidget
                                            initialCron={currentCron || status?.cron}
                                            onSave={(cron) => setCurrentCron(cron)}
                                        />
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
 
// ── Styles SettingsPage ─────────────────────────────────────────────────────
const s = {
    page:         { minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: "#F8FAFC", fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" },
    body:         { display: "flex", flex: 1, overflow: "hidden" },
    main:         { flex: 1, padding: "28px 32px", overflowY: "auto", display: "flex", flexDirection: "column", alignItems: "center" },
    inner:        { width: "100%", maxWidth: "760px" },
 
    pageHeader:   { display: "flex", flexDirection: "column", gap: "12px", marginBottom: "28px" },
    backBtn:      { display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "#64748B", fontWeight: "500", background: "none", border: "none", cursor: "pointer", padding: 0 },
    pageTitle:    { fontSize: "20px", fontWeight: "600", color: "#0F172A", margin: 0, letterSpacing: "-0.3px" },
    pageSubtitle: { fontSize: "13px", color: "#94A3B8", margin: "3px 0 0" },
 
    grid:         { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "20px", maxWidth: "760px", margin: "0 auto" },
 
    card:         { backgroundColor: "white", border: "1px solid #E2E8F0", borderRadius: "12px", padding: "22px 24px", boxShadow: "0 1px 3px rgba(15,23,42,0.04)", display: "flex", flexDirection: "column", gap: "0" },
    cardHeader:   { display: "flex", alignItems: "flex-start", gap: "14px", marginBottom: "16px" },
    cardIconWrap: { width: "38px", height: "38px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
    cardTitle:    { fontSize: "14px", fontWeight: "600", color: "#0F172A", margin: 0 },
    cardSubtitle: { fontSize: "12px", color: "#94A3B8", margin: "2px 0 0" },
    cardDivider:  { height: "1px", backgroundColor: "#F1F5F9", margin: "0 0 18px" },
 
    loadingRow:   { display: "flex", alignItems: "center", gap: "10px" },
    spinner:      { width: "18px", height: "18px", border: "2px solid #E2E8F0", borderTop: "2px solid #2563EB", borderRadius: "50%", animation: "spin 0.7s linear infinite" },
    loadingText:  { fontSize: "13px", color: "#94A3B8" },
 
    statusSection:      { display: "flex", flexDirection: "column", gap: "12px" },
    statusBadge:        { display: "inline-flex", alignItems: "center", gap: "8px", padding: "8px 14px", borderRadius: "8px", border: "1px solid", alignSelf: "flex-start" },
    statusBadgeActive:  { backgroundColor: "#F0FDF4", borderColor: "#BBF7D0" },
    statusBadgeInactive:{ backgroundColor: "#FEF2F2", borderColor: "#FECACA" },
    statusDot:          { width: "7px", height: "7px", borderRadius: "50%", flexShrink: 0 },
    statusText:         { fontSize: "13px", fontWeight: "600" },
    freqRow:            { display: "flex", alignItems: "center", gap: "6px" },
    freqLabel:          { fontSize: "12px", color: "#64748B" },
    freqValue:          { fontSize: "12px", fontWeight: "500", color: "#1E293B" },
    schedulerTitle:     { fontSize: "13px", fontWeight: "600", color: "#0F172A", margin: "0 0 4px" },
 
    toggleRow:    { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0" },
    toggleLabel:  { fontSize: "13px", fontWeight: "500", color: "#1E293B", margin: 0 },
    toggleDesc:   { fontSize: "12px", color: "#94A3B8", margin: "2px 0 0" },
    switchWrap:   { cursor: "pointer", flexShrink: 0 },
    switchTrack:  { width: "42px", height: "24px", borderRadius: "12px", position: "relative", transition: "background-color 0.2s" },
    switchThumb:  { position: "absolute", top: "2px", width: "20px", height: "20px", borderRadius: "50%", backgroundColor: "white", boxShadow: "0 1px 3px rgba(0,0,0,0.2)", transition: "transform 0.2s" },
 
    intervalBox:       { marginTop: "14px", backgroundColor: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: "10px", padding: "14px 16px", display: "flex", flexDirection: "column", gap: "12px" },
    intervalRow:       { display: "flex", alignItems: "center", justifyContent: "space-between" },
    intervalLabel:     { fontSize: "13px", fontWeight: "500", color: "#1E293B", margin: 0 },
    intervalHint:      { fontSize: "11px", color: "#94A3B8", margin: "2px 0 0" },
    intervalInputWrap: { display: "flex", alignItems: "center", gap: "6px" },
    intervalInput:     { width: "64px", padding: "6px 10px", textAlign: "center", border: "1px solid #E2E8F0", borderRadius: "8px", fontSize: "13px", fontWeight: "500", color: "#1E293B", outline: "none", backgroundColor: "white" },
    intervalUnit:      { fontSize: "12px", color: "#94A3B8" },
    intervalInfo:      { display: "flex", alignItems: "center", gap: "6px" },
    intervalInfoText:  { fontSize: "12px", color: "#64748B" },
};
 
// ── Styles SchedulerWidget ──────────────────────────────────────────────────
const sw = {
    wrap:         { display: "flex", flexDirection: "column", gap: "12px" },
    sectionLabel: { fontSize: "11px", fontWeight: "600", color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.5px", margin: 0 },
 
    unitGrid:     { display: "flex", gap: "8px" },
    unitBtn:      { flex: 1, padding: "10px 6px", borderRadius: "10px", border: "1px solid transparent", backgroundColor: "#F8FAFC", color: "#475569", fontSize: "12px", fontWeight: "500", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", transition: "all 0.15s" },
    unitBtnActive:{ backgroundColor: "#F8FAFC", border: "1px solid #0F172A", color: "#0F172A", fontWeight: "600" },
    unitIcon:     { fontSize: "16px" },
 
    stepperRow:   { display: "flex", alignItems: "center", gap: "12px" },
    stepBtn:      { width: "36px", height: "36px", borderRadius: "50%", border: "1px solid #E2E8F0", backgroundColor: "white", color: "#1E293B", fontSize: "20px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, lineHeight: 1 },
    stepDisplay:  { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", padding: "8px 0", borderBottom: "2px solid #2563EB" },
    stepValue:    { fontSize: "28px", fontWeight: "600", color: "#0F172A", lineHeight: 1.1 },
    stepUnitLabel:{ fontSize: "11px", color: "#94A3B8", marginTop: "2px" },
 
    presetsRow:   { display: "flex", flexWrap: "wrap", gap: "6px" },
    presetChip:   { padding: "5px 14px", borderRadius: "99px", border: "1px solid transparent", backgroundColor: "#F8FAFC", color: "#64748B", fontSize: "12px", cursor: "pointer", transition: "all 0.15s" },
    presetChipActive: { backgroundColor: "#F8FAFC", border: "1px solid #0F172A", color: "#0F172A", fontWeight: "600" },
 
    summaryBox:   { display: "flex", alignItems: "center", gap: "10px", padding: "10px 14px", backgroundColor: "#EFF6FF", border: "1px solid #DBEAFE", borderRadius: "8px" },
    summaryText:  { fontSize: "12px", color: "#1E40AF", fontWeight: "500" },
 
    errorBox:     { display: "flex", alignItems: "center", gap: "8px", padding: "10px 14px", backgroundColor: "#FEF2F2", border: "1px solid #FECACA", borderRadius: "8px" },
    errorText:    { fontSize: "12px", color: "#DC2626" },
    successBox:   { display: "flex", alignItems: "center", gap: "8px", padding: "10px 14px", backgroundColor: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: "8px" },
    successText:  { fontSize: "12px", color: "#16A34A" },
 
    saveBtn:      { display: "inline-flex", alignItems: "center", gap: "8px", padding: "8px 20px", fontSize: "13px", fontWeight: "600", color: "white", backgroundColor: "#2563EB", border: "none", borderRadius: "8px", cursor: "pointer" },
    saveBtnDisabled: { backgroundColor: "#93C5FD", cursor: "not-allowed" },
    spinner:      { width: "13px", height: "13px", border: "2px solid rgba(255,255,255,0.3)", borderTop: "2px solid white", borderRadius: "50%", animation: "spin 0.7s linear infinite" },
};
 
if (typeof document !== "undefined" && !document.getElementById("settings-spin-style")) {
    const style = document.createElement("style");
    style.id = "settings-spin-style";
    style.textContent = "@keyframes spin { to { transform: rotate(360deg); } }";
    document.head.appendChild(style);
}
 
export default SettingsPage;