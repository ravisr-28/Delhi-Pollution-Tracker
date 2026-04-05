import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import Layout from './components/Layout/Layout';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import DelhiMap from './pages/DelhiMap';
import Analytics from './pages/Analytics';
import Alerts from './pages/Alerts';
import HealthAdvisory from './pages/HealthAdvisory';
import Globe from './pages/Globe';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          {/* Standalone pages — no Layout wrapper */}
          <Route path="/" element={<Home />} />

          {/* All other pages use Layout (navbar, sidebar, footer) */}
          <Route element={<Layout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="heatmap" element={<DelhiMap />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="advisory" element={<HealthAdvisory />} />
            <Route path="globe" element={<Globe />} />
            <Route path="alerts" element={<Alerts />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;