import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MarketEventsPage from "./pages/MarketEventsPage";
import MarketEventsSummaryPage from "./pages/MarketEventsSummaryPage";
import SettingsPage from "./pages/SettingsPage";
import SourcesPage from "./pages/SourcesPage";
import DashboardPage from "./pages/DashboardPage";



function App() {
  return (
    <Router>
      <div style={{ minHeight: '100vh', backgroundColor: '#f4f7f6' }}>
        <Routes>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/" element={<MarketEventsPage />} />
          <Route path="/summary" element={<MarketEventsSummaryPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/sources" element={<SourcesPage />} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;