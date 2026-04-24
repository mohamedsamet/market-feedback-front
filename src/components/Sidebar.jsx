import {
    DashboardOutlined,
    FileTextOutlined,
    ApiOutlined,
    SettingOutlined,
    BarChartOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const NAV_ITEMS = [
    { id: "dashboard", label: "Dashboard",      icon: DashboardOutlined, path: "/dashboard" },
    { id: "events",    label: "Market Events",  icon: FileTextOutlined,  path: "/"          },
    { id: "summary",   label: "Events Summary", icon: BarChartOutlined,  path: "/summary"   },
    { id: "sources",   label: "Sources",        icon: ApiOutlined,       path: "/sources"   },
];

const Sidebar = ({ activePage }) => {
    const navigate = useNavigate();

    const NavItem = ({ id, label, IconComp, path }) => {
        const isActive = activePage === id;
        return (
            <div
                onClick={() => navigate(path)}
                style={{
                    ...s.item,
                    backgroundColor: isActive ? "#EFF6FF" : "transparent",
                    borderLeft: `2px solid ${isActive ? "#2563EB" : "transparent"}`,
                }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.backgroundColor = "#F8FAFC"; }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.backgroundColor = "transparent"; }}
            >
                <span style={{ ...s.icon, color: isActive ? "#2563EB" : "#94A3B8" }}>
                    <IconComp />
                </span>
                <span style={{ ...s.label, color: isActive ? "#1D4ED8" : "#475569", fontWeight: isActive ? "500" : "400" }}>
                    {label}
                </span>
                {isActive && <div style={s.activeDot} />}
            </div>
        );
    };

    const isSettings = activePage === "settings";

    return (
        <aside style={s.sidebar}>

            {/* ── Nav section label ── */}
            <div style={s.sectionLabel}>Navigation</div>

            {/* ── Main nav ── */}
            <nav style={s.nav}>
                {NAV_ITEMS.map(({ id, label, icon: IconComp, path }) => (
                    <NavItem key={id} id={id} label={label} IconComp={IconComp} path={path} />
                ))}
            </nav>

            {/* ── Bottom: Settings ── */}
            <div style={s.bottom}>
                <div style={s.bottomDivider} />
                <div
                    onClick={() => navigate("/settings")}
                    style={{
                        ...s.item,
                        ...s.settingsItem,
                        backgroundColor: isSettings ? "#EFF6FF" : "#F8FAFC",
                        borderLeft: `2px solid ${isSettings ? "#2563EB" : "transparent"}`,
                        borderColor: isSettings ? "#2563EB" : undefined,
                    }}
                    onMouseEnter={e => { if (!isSettings) e.currentTarget.style.backgroundColor = "#F1F5F9"; }}
                    onMouseLeave={e => { if (!isSettings) e.currentTarget.style.backgroundColor = "#F8FAFC"; }}
                >
                    <span style={{ ...s.icon, color: isSettings ? "#2563EB" : "#94A3B8" }}>
                        <SettingOutlined />
                    </span>
                    <span style={{ ...s.label, color: isSettings ? "#1D4ED8" : "#475569", fontWeight: isSettings ? "500" : "400" }}>
                        Settings
                    </span>
                </div>
            </div>

        </aside>
    );
};

const s = {
    sidebar: {
        width: "210px", flexShrink: 0,
        backgroundColor: "white",
        borderRight: "1px solid #E2E8F0",
        display: "flex", flexDirection: "column",
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        boxShadow: "1px 0 3px rgba(15,23,42,0.03)",
    },

    sectionLabel: {
        fontSize: "10.5px", fontWeight: "600",
        textTransform: "uppercase", letterSpacing: "0.07em",
        color: "#CBD5E1", padding: "20px 18px 8px",
    },

    nav:   { display: "flex", flexDirection: "column", gap: "2px", padding: "0 8px" },

    item: {
        display: "flex", alignItems: "center", gap: "10px",
        padding: "9px 12px", borderRadius: "8px",
        cursor: "pointer", transition: "background-color 0.12s",
        borderLeft: "2px solid transparent",
        position: "relative",
    },
    icon:        { fontSize: "15px", display: "flex", alignItems: "center", flexShrink: 0 },
    label:       { fontSize: "13px", flex: 1 },
    activeDot: {
        width: "5px", height: "5px", borderRadius: "50%",
        backgroundColor: "#2563EB", flexShrink: 0,
    },

    /* settings */
    bottom: { marginTop: "auto", padding: "0 8px 16px" },
    bottomDivider: { height: "1px", backgroundColor: "#F1F5F9", margin: "12px 0" },
    settingsItem:  { borderRadius: "8px" },
};

export default Sidebar;