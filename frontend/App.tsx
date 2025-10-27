import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { PublicRoute } from './components/PublicRoute';
import { LoginPage } from './pages/LoginPage';
import { OnboardingPage } from './pages/OnboardingPage';
import { OverviewPage } from './pages/OverviewPage';
import { CohortsPage } from './pages/CohortsPage';
import { CreateCohortPage } from './pages/CreateCohortPage';
import { CohortDetailPage } from './pages/CohortDetailPage';
import { AllStudentsPage } from './pages/AllStudentsPage';
import { WelcomePage } from './pages/mockinterviews/WelcomePage';
import { CompleteProfilePage } from './pages/mockinterviews/CompleteProfilePage';
import { ConsentPage } from './pages/mockinterviews/ConsentPage';
import { JDIntakePage } from './pages/mockinterviews/JDIntakePage';
import { JDReviewPage } from './pages/mockinterviews/JDReviewPage';
import { InterviewReadyPage } from './pages/mockinterviews/InterviewReadyPage';
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
            
            <Route path="/overview" element={
              <ProtectedRoute>
                <OverviewPage />
              </ProtectedRoute>
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
            
            <Route path="/mockinterviews/welcome/:token" element={
              <PublicRoute>
                <WelcomePage />
              </PublicRoute>
            } />
            
            <Route path="/mockinterviews/profile/:token" element={
              <PublicRoute>
                <CompleteProfilePage />
              </PublicRoute>
            } />
            
            <Route path="/mockinterviews/consent/:token" element={
              <PublicRoute>
                <ConsentPage />
              </PublicRoute>
            } />
            
            <Route path="/mockinterviews/jd-intake/:token" element={
              <PublicRoute>
                <JDIntakePage />
              </PublicRoute>
            } />
            
            <Route path="/mockinterviews/jd-review/:token" element={
              <PublicRoute>
                <JDReviewPage />
              </PublicRoute>
            } />
            
            <Route path="/mockinterviews/ready/:token" element={
              <PublicRoute>
                <InterviewReadyPage />
              </PublicRoute>
            } />
            
            <Route path="/" element={<Navigate to="/overview" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
