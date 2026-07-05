import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import KanbanPage from './pages/KanbanPage';
import AnalyticsPage from './pages/AnalyticsPage';
import AIRecommendPage from './pages/AIRecommendPage';
import CompanyPage from './pages/CompanyPage';
import ProtectedRoute from './components/ProtectedRoute';
import { AnimatePresence } from 'framer-motion';
import LandingPage from './pages/LandingPage';
import SplashLoader from './pages/SplashLoader';

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [showSplash, setShowSplash] = useState(false);

  useEffect(() => {
    const hasVisited = sessionStorage.getItem('hasVisitedPlaceBoard');
    if (!hasVisited) {
      setShowSplash(true);
    }
  }, []);

  const handleSplashFinish = () => {
    setShowSplash(false);
    sessionStorage.setItem('hasVisitedPlaceBoard', 'true');
  };

  useEffect(() => {
    let requestCount = 0;
    let slowRequestTimer = null;

    const handleStart = () => {
      requestCount++;
      if (requestCount === 1) {
         slowRequestTimer = setTimeout(() => {
             setIsLoading(true);
         }, 1000);
      }
    };

    const handleEnd = () => {
      requestCount = Math.max(0, requestCount - 1);
      if (requestCount === 0) {
        clearTimeout(slowRequestTimer);
        setIsLoading(false);
      }
    };

    const handleError = () => {
      setIsError(true);
      setIsLoading(false);
      clearTimeout(slowRequestTimer);
    };

    window.addEventListener('api_request_start', handleStart);
    window.addEventListener('api_request_end', handleEnd);
    window.addEventListener('api_network_error', handleError);

    return () => {
      window.removeEventListener('api_request_start', handleStart);
      window.removeEventListener('api_request_end', handleEnd);
      window.removeEventListener('api_network_error', handleError);
      clearTimeout(slowRequestTimer);
    };
  }, []);

  const handleRetry = () => {
    setIsError(false);
    window.location.reload();
  };

  return (
    <>
      <Toaster position="top-right" />
      <AnimatePresence>
        {showSplash && <SplashLoader onFinish={handleSplashFinish} />}
      </AnimatePresence>
      
      {isLoading && !isError && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-lg shadow-xl text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold text-gray-900">Connecting to server...</h3>
            <p className="text-gray-500 mt-2 text-sm">Please wait, waking up the service.</p>
          </div>
        </div>
      )}

      {isError && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-lg shadow-xl text-center max-w-sm">
            <div className="text-red-500 mb-4">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Connection Failed</h3>
            <p className="text-gray-500 mt-2 text-sm mb-4">The server is taking too long to respond or is unreachable.</p>
            <button onClick={handleRetry} className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition">
              Retry Connection
            </button>
          </div>
        </div>
      )}
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

        {/* Landing Page */}
        <Route path="/" element={<LandingPage />} />
      </Routes>
    </Router>
    </>
  );
}

export default App;
