import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MarketEventsPage from "./pages/MarketEventsPage";
import SettingsPage from "./pages/SettingsPage";

function App() {
  return (
    <Router>
      <div style={{ minHeight: '100vh', backgroundColor: '#f4f7f6' }}>
        <Routes>
          {/* Page d'accueil : Tableau des événements */}
          <Route path="/" element={<MarketEventsPage />} />
          
          {/* Page des paramètres : Badge de collecte active */}
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;