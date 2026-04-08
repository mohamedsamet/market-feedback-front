const API_URL = "http://localhost:9060/api/market-events";

export const getAllMarketEvents = async ({ search = '', page = 0, size = 10 } = {}) => {
    try {
        // construire les paramètres
        const params = new URLSearchParams({ search, page, size });

        // appel API avec query params
        const response = await fetch(`${API_URL}?${params}`);

        if (!response.ok) {
            throw new Error(`Erreur serveur : ${response.status}`);
        }

        const data = await response.json();

        return data; 
        // { content, totalElements, totalPages, currentPage }

    } catch (error) {
        console.error("Erreur lors de la récupération :", error.message);
        throw error;
    }
};
export const fetchStats = async () => {
  const response = await fetch(
    "http://localhost:9060/api/market-events/stats"
  );

  if (!response.ok) {
    throw new Error("Erreur lors du chargement des stats");
  }

  return await response.json();
};