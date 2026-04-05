// Données fictives pour tester l'interface
const fakeData = [
    {
        id: "1",
        content: "Apple annonce une chute de ses actions de 3% suite aux nouvelles politiques commerciales américaines qui impactent ses fournisseurs asiatiques.",
        sourceUrl: "https://newsapi.org/v2/everything",
        sourceType: "REST",
        creationDate: "2026-03-30T10:00:00"
    },
    {
        id: "2",
        content: "Les marchés financiers européens ouvrent en baisse ce matin après les annonces de la Fed concernant les taux d'intérêt.",
        sourceUrl: "https://www.marketwatch.com/rss/topstories",
        sourceType: "RSS",
        creationDate: "2026-03-30T11:00:00"
    },
    {
        id: "3",
        content: "La bourse de Tunis enregistre une hausse de 1.2% portée par le secteur bancaire et les valeurs industrielles.",
        sourceUrl: "https://www.bvmt.com.tn/",
        sourceType: "SCRAPING",
        creationDate: "2026-03-30T12:00:00"
    }
];

// Simule un appel API avec les données fictives
export const getAllMarketEvents = async () => {
    return fakeData;
};