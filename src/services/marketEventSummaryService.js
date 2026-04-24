const API_URL = "http://localhost:9060/api/market-events-summary";

export const getAllMarketEventsSummary = async ({ search = '', theme = '', page = 0, size = 10 } = {}) => {
    try {
        const params = new URLSearchParams({ search, theme, page, size });
        const response = await fetch(`${API_URL}?${params}`);
        if (!response.ok) throw new Error(`Erreur serveur : ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error("Erreur lors de la récupération :", error.message);
        throw error;
    }
};

export const fetchThemes = async () => {
    try {
        const response = await fetch(`${API_URL}/themes`);
        if (!response.ok) throw new Error(`Erreur serveur : ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error("Erreur lors du chargement des thèmes :", error.message);
        throw error;
    }
};

export const fetchSummaryStats = async () => {
    try {
        const response = await fetch(`${API_URL}/stats`);
        if (!response.ok) throw new Error(`Erreur serveur : ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error("Erreur lors du chargement des stats :", error.message);
        throw error;
    }
};

export const deleteMarketEventSummary = async (id) => {
    const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error(`Erreur suppression : ${response.status}`);
};

export const deleteMarketEventsSummary = async (ids) => {
    const response = await fetch(API_URL, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ids)
    });
    if (!response.ok) throw new Error(`Erreur suppression : ${response.status}`);
};