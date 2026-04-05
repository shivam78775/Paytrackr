import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import DashboardLayout from './components/Layout';
import DueForm from './pages/DueForm';

import DashboardHome from './pages/Dashboard';
import DueList from './pages/DueList';
import StitchingList from './pages/StitchingList';
import StitchingForm from './pages/StitchingForm';
import Reports from './pages/Reports';
import More from './pages/More';
import Help from './pages/Help';
import About from './pages/About';

import { ThemeProvider } from './context/ThemeContext';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();
    if (loading) return <div className="min-h-screen bg-background flex flex-col items-center justify-center"><div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin mb-4"></div><p>Loading PayTrackr...</p></div>;
    return isAuthenticated ? children : <Navigate to="/" replace />;
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route 
                path="/dashboard" 
                element={
                    <ProtectedRoute>
                        <DashboardLayout />
                    </ProtectedRoute>
                }
            >
              {/* 5 Main Tabs */}
              <Route index element={<DashboardHome />} />
              <Route path="dues" element={<DueList />} />
              <Route path="stitching" element={<StitchingList />} />
              <Route path="reports" element={<Reports />} />
              <Route path="more" element={<More />} />
              <Route path="more/help" element={<Help />} />
              <Route path="more/about" element={<About />} />

              {/* Inner actions */}
              <Route path="dues/add" element={<DueForm />} />
              <Route path="dues/:id" element={<DueForm />} />
              <Route path="stitching/add" element={<StitchingForm />} />
              <Route path="stitching/:id" element={<StitchingForm />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
