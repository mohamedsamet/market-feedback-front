const API_URL = "http://localhost:9060/api/carousel";

export const getAllAnalyses = async () => {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error(`Erreur serveur : ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error("Erreur lors de la récupération :", error.message);
        throw error;
    }
};