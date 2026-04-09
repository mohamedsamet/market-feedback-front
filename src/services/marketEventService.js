const API_URL = "http://localhost:9060/api/market-events";

export const getAllMarketEvents = async ({ search = '', source = '', page = 0, size = 10 } = {}) => {
    try {
        const params = new URLSearchParams({ search, source, page, size });
        const response = await fetch(`${API_URL}?${params}`);
        if (!response.ok) throw new Error(`Erreur serveur : ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error("Erreur lors de la récupération :", error.message);
        throw error;
    }
};
//stats
export const fetchStats = async () => {
    try {
        const response = await fetch(`${API_URL}/stats`);

        if (!response.ok) {
            throw new Error(`Erreur serveur : ${response.status}`);
        }

        return await response.json();

    } catch (error) {
        console.error("Erreur lors du chargement des stats :", error.message);
        throw error;
    }
};
// supprimer un seul
export const deleteMarketEvent = async (id) => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
    });
    if (!response.ok) throw new Error(`Erreur suppression : ${response.status}`);
};

// supprimer plusieurs
export const deleteMarketEvents = async (ids) => {
    const response = await fetch(API_URL, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ids)
    });
    if (!response.ok) throw new Error(`Erreur suppression : ${response.status}`);
};