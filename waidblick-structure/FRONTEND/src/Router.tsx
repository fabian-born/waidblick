/**
 * Application Router Configuration
 * Defines all routes and navigation
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Pages will be imported here as they are created:
// import Dashboard from './pages/Dashboard';
// import JaegerPage from './pages/JaegerPage';
// import HegeringePage from './pages/HegeringePage';
// import RevierePage from './pages/RevierePage';
// import PaechterPage from './pages/PaechterPage';
// import MitjaegerPage from './pages/MitjaegerPage';
// import NotFoundPage from './pages/NotFoundPage';

const Router: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Routes will be added here */}
        {/* <Route path="/" element={<Dashboard />} />
        <Route path="/jaeger" element={<JaegerPage />} />
        <Route path="/hegeringe" element={<HegeringePage />} />
        <Route path="/reviere" element={<RevierePage />} />
        <Route path="/paechter" element={<PaechterPage />} />
        <Route path="/mitjaeger" element={<MitjaegerPage />} />
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<Navigate to="/404" replace />} /> */}

        <Route
          path="/"
          element={
            <div style={{ padding: '2rem', textAlign: 'center' }}>
              <h1>Waidblick - Jagdverwaltung</h1>
              <p>Welcome to the Hunting Management System</p>
              <p>Routes will be configured here...</p>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
