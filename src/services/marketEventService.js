const API_URL = "http://localhost:9060/api/market-events"; 

export const getAllMarketEvents = async () => {
    try {
        const response = await fetch(API_URL);

       
        if (!response.ok) {
            throw new Error(`Erreur serveur : ${response.status}`);
        }

        const data = await response.json();
        
        return data;
    } catch (error) {
        console.error("Erreur lors de la récupération :", error.message);
  
        throw error;
    }
};