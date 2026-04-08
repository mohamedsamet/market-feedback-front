import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircleFilled, ArrowLeftOutlined } from '@ant-design/icons';

const SettingsPage = () => {
    const navigate = useNavigate();

    return (
        <div style={{ padding: '40px', maxWidth: '600px', margin: '0 auto' }}>
            <button 
                onClick={() => navigate('/')} 
                style={{ marginBottom: '20px', border: 'none', background: 'none', cursor: 'pointer', color: '#2E86C1', display: 'flex', alignItems: 'center', gap: '5px' }}
            >
                <ArrowLeftOutlined /> Retour au tableau
            </button>

            <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
                <h2 style={{ marginTop: 0, color: '#1E3A5F' }}>Configuration Système</h2>
                
                <p style={{ color: '#666', fontSize: '14px' }}>État de la connexion avec les serveurs de market events :</p>

                {/* --- TON CODE DE STATUT --- */}
                <div style={sStyle.statusSection}>
                    <div style={sStyle.statusRow}>
                        <CheckCircleFilled style={{ color: "#3B6D11", fontSize: "14px" }} />
                        <span style={sStyle.statusText}>Collecte active</span>
                    </div>
                </div>

                <div style={{ marginTop: '30px' }}>
                    <h4 style={{ marginBottom: '10px' }}>Options de synchronisation</h4>
                    <div style={{ padding: '15px', border: '1px solid #eee', borderRadius: '8px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                            <span>Auto-actualisation</span>
                            <input type="checkbox" defaultChecked />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>Notifications de nouveaux events</span>
                            <input type="checkbox" defaultChecked />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const sStyle = {
    statusSection: {
        backgroundColor: "#F0F7EB",
        padding: "10px 15px",
        borderRadius: "6px",
        display: "inline-block",
        border: "1px solid #D3E6CD"
    },
    statusRow: {
        display: "flex",
        alignItems: "center",
        gap: "10px"
    },
    statusText: {
        color: "#3B6D11",
        fontSize: "14px",
        fontWeight: "bold"
    }
};

export default SettingsPage;