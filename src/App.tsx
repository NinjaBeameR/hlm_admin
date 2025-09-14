import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import PublicReportForm from './components/PublicReportForm';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboard from './pages/AdminDashboard';
import { useEffect } from 'react';

// Declare the build timestamp global
declare global {
  const __BUILD_TIMESTAMP__: string;
}

function App() {
  useEffect(() => {
    // Log build timestamp to help debug deployment issues
    console.log('🚀 App built at:', typeof __BUILD_TIMESTAMP__ !== 'undefined' ? __BUILD_TIMESTAMP__ : new Date().toISOString());
    console.log('🔄 Current time:', new Date().toISOString());
  }, []);

  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen">
          <Routes>
            {/* Public Route - Report Form */}
            <Route path="/" element={<PublicReportForm />} />
            
            {/* Redirect /admin to /admin/login */}
            <Route path="/admin" element={<AdminLoginPage />} />
            <Route path="/admin/login" element={<AdminLoginPage />} />
            
            {/* Protected Admin Dashboard */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            
            {/* Catch-all for admin routes - redirect to login */}
            <Route path="/admin/*" element={<Navigate to="/admin" replace />} />
            
            {/* Redirect any unknown routes to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;