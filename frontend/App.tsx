import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { PublicRoute } from './components/PublicRoute';
import { LoginPage } from './pages/LoginPage';
import { OnboardingPage } from './pages/OnboardingPage';
import { CohortsPage } from './pages/CohortsPage';
import { CreateCohortPage } from './pages/CreateCohortPage';
import { CohortDetailPage } from './pages/CohortDetailPage';
import { AllStudentsPage } from './pages/AllStudentsPage';
import './styles/theme.css';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            } />
            
            <Route path="/onboard" element={
              <PublicRoute>
                <OnboardingPage />
              </PublicRoute>
            } />
            
            <Route path="/cohorts" element={
              <ProtectedRoute>
                <CohortsPage />
              </ProtectedRoute>
            } />
            
            <Route path="/cohorts/new" element={
              <ProtectedRoute>
                <CreateCohortPage />
              </ProtectedRoute>
            } />
            
            <Route path="/cohorts/:id" element={
              <ProtectedRoute>
                <CohortDetailPage />
              </ProtectedRoute>
            } />
            
            <Route path="/students" element={
              <ProtectedRoute>
                <AllStudentsPage />
              </ProtectedRoute>
            } />
            
            <Route path="/" element={<Navigate to="/cohorts" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
