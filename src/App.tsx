import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import PublicReportForm from './components/PublicReportForm';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboard from './pages/AdminDashboard';
import DebugInfo from './components/DebugInfo';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen">
          {/* Temporary debug info - remove after fixing */}
          {import.meta.env.MODE === 'production' && <DebugInfo />}
          
          <Routes>
            {/* Public Route - Report Form */}
            <Route path="/" element={<PublicReportForm />} />
            
            {/* Admin Login */}
            <Route path="/admin" element={<AdminLoginPage />} />
            
            {/* Protected Admin Dashboard */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            
            {/* Redirect any unknown routes to home */}
            <Route path="*" element={<PublicReportForm />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;