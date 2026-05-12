const API_URL = "http://localhost:9060/api/carousel";

export const getAllAnalyses = async ({ search = '', urgence = '', famille = '' } = {}) => {
    try {
        const params = new URLSearchParams();
        if (search) params.append("search", search);
        if (urgence) params.append("urgence", urgence);
        if (famille) params.append("famille", famille);

        const response = await fetch(`${API_URL}?${params}`);
        if (!response.ok) throw new Error(`Erreur serveur : ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error("Erreur lors de la récupération :", error.message);
        throw error;
    }
};