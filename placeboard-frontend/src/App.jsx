import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import KanbanPage from './pages/KanbanPage';
import AnalyticsPage from './pages/AnalyticsPage';
import AIRecommendPage from './pages/AIRecommendPage';
import CompanyPage from './pages/CompanyPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Protected Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <KanbanPage />
          </ProtectedRoute>
        } />
        <Route path="/analytics" element={
          <ProtectedRoute>
            <AnalyticsPage />
          </ProtectedRoute>
        } />
        <Route path="/ai" element={
          <ProtectedRoute>
            <AIRecommendPage />
          </ProtectedRoute>
        } />
        <Route path="/companies" element={
          <ProtectedRoute>
            <CompanyPage />
          </ProtectedRoute>
        } />

        {/* Redirect root to dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
