/**
 * Main Application Component
 * 
 * This is the root component that handles routing and authentication.
 * It sets up the React Router with protected routes and authentication guards.
 */
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import useAuthStore from './store/authStore';

// Layout
import MainLayout from './components/layout/MainLayout';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

// App Pages
import DashboardPage from './pages/dashboard/DashboardPage';
import ManagementPage from './pages/management/ManagementPage';
import MapPage from './pages/map/MapPage';
import RoutesPage from './pages/routes/RoutesPage';
import TimeAnalysisPage from './pages/analysis/TimeAnalysisPage';
import StoreDetailsPage from './pages/stores/StoreDetailsPage';
import ReportsPage from './pages/reports/ReportsPage';

/**
 * Protected Route Component
 * 
 * This component wraps routes that require authentication.
 * If the user is not authenticated, it redirects to the login page.
 * 
 * @param children - The child components to render if authenticated
 */
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuthStore();
  
  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

/**
 * App Component
 * 
 * Sets up the main application routing structure with:
 * - Public routes (login, register)
 * - Protected routes (dashboard, management, etc.)
 * - Fallback redirects
 */
function App() {
  return (
    <Router>
      <Routes>
        {/* Public Authentication Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Protected Application Routes - All require authentication */}
        <Route path="/" element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }>
          {/* Default redirect to dashboard */}
          <Route index element={<Navigate to="/dashboard" replace />} />
          {/* Main application pages */}
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="management" element={<ManagementPage />} />
          <Route path="map" element={<MapPage />} />
          <Route path="routes" element={<RoutesPage />} />
          <Route path="time-analysis" element={<TimeAnalysisPage />} />
          <Route path="store-details" element={<StoreDetailsPage />} />
          <Route path="reports" element={<ReportsPage />} />
        </Route>
        
        {/* Fallback route - redirect any unknown paths to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;