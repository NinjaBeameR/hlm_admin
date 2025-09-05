import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navigation from './components/Navigation';
import LoginPage from './pages/LoginPage';
import BugReportsPage from './pages/BugReportsPage';
import SuggestionsPage from './pages/SuggestionsPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <Navigation />
                  <Routes>
                    <Route path="/" element={<Navigate to="/bug-reports" replace />} />
                    <Route path="/bug-reports" element={<BugReportsPage />} />
                    <Route path="/suggestions" element={<SuggestionsPage />} />
                  </Routes>
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;