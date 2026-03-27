import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout/Layout';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import DelhiMap from './pages/DelhiMap';
import Analytics from './pages/Analytics';
import Login from './pages/Login';
import Register from './pages/Register';
import Alerts from './pages/Alerts';
import AdminPanel from './pages/AdminPanel';
import HealthAdvisory from './pages/HealthAdvisory';
import Globe from './pages/Globe';
import Profile from './pages/Profile';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Standalone pages — no Layout wrapper */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* All other pages use Layout (navbar, sidebar, footer) */}
            <Route element={<Layout />}>
              <Route path="dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="heatmap" element={
                <ProtectedRoute>
                  <DelhiMap />
                </ProtectedRoute>
              } />
              <Route path="analytics" element={
                <ProtectedRoute>
                  <Analytics />
                </ProtectedRoute>
              } />
              <Route path="advisory" element={
                <ProtectedRoute>
                  <HealthAdvisory />
                </ProtectedRoute>
              } />
              <Route path="globe" element={
                <ProtectedRoute>
                  <Globe />
                </ProtectedRoute>
              } />

              {/* Protected Routes */}
              <Route path="alerts" element={
                <ProtectedRoute>
                  <Alerts />
                </ProtectedRoute>
              } />

              <Route path="profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />

              <Route path="admin" element={
                <ProtectedRoute adminOnly={true}>
                  <AdminPanel />
                </ProtectedRoute>
              } />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;