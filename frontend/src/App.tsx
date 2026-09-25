import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import MainLayout from './layouts/MainLayout';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import NewAnalysisWizard from './pages/NewAnalysisWizard';
import AnalysisResultPage from './pages/AnalysisResultPage';
import HistoryPage from './pages/HistoryPage';
import ComparisonPage from './pages/ComparisonPage';
import ShelfLifeSimulatorPage from './pages/ShelfLifeSimulatorPage';
import CostCalculatorPage from './pages/CostCalculatorPage';
import SustainabilityPage from './pages/SustainabilityPage';
import KnowledgeBasePage from './pages/KnowledgeBasePage';
import ProfilePage from './pages/ProfilePage';

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Landing & Auth */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Authenticated / Core Platform Routes */}
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/new-analysis" element={<NewAnalysisWizard />} />
          <Route path="/analysis/:id" element={<AnalysisResultPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/compare" element={<ComparisonPage />} />
          <Route path="/simulator" element={<ShelfLifeSimulatorPage />} />
          <Route path="/cost-calculator" element={<CostCalculatorPage />} />
          <Route path="/sustainability" element={<SustainabilityPage />} />
          <Route path="/knowledge-base" element={<KnowledgeBasePage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
};

export default App;
