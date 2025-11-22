import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ProtectedRoute } from './components/ProtectedRoute';
import { PublicRoute } from './components/PublicRoute';
import { StudentRoute } from './components/StudentRoute';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { VerifyEmailPage } from './pages/VerifyEmailPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { VerifyPasswordResetPage } from './pages/VerifyPasswordResetPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';
import { OnboardingPage } from './pages/OnboardingPage';
import { OverviewPage } from './pages/OverviewPage';
import { CohortsPage } from './pages/CohortsPage';
import { CreateCohortPage } from './pages/CreateCohortPage';
import { CohortDetailPage } from './pages/CohortDetailPage';
import { AddStudentsPage } from './pages/AddStudentsPage';
import { SendInvitesPage } from './pages/SendInvitesPage';
import { AllStudentsPage } from './pages/AllStudentsPage';
import { StudentsPage } from './components/students/StudentsPage';
import { ReportsPage } from './components/reports/ReportsPage';
import { WelcomePage } from './pages/mockinterviews/WelcomePage';
import { CompleteProfilePage } from './pages/mockinterviews/CompleteProfilePage';
import { ConsentPage } from './pages/mockinterviews/ConsentPage';
import { JDIntakePage } from './pages/mockinterviews/JDIntakePage';
import { JDReviewPage } from './pages/mockinterviews/JDReviewPage';
import { InterviewReadyPage } from './pages/mockinterviews/InterviewReadyPage';
import { InviteLandingPage } from './pages/interviews/InviteLandingPage';
import { WelcomePage as InterviewWelcomePage } from './pages/interviews/WelcomePage';
import { ProfilePage as InterviewProfilePage } from './pages/interviews/ProfilePage';
import { ConsentPage as InterviewConsentPage } from './pages/interviews/ConsentPage';
import { SetupPage } from './pages/interviews/SetupPage';
import { PreflightPage } from './pages/interviews/PreflightPage';
import { InterviewRoomPage } from './pages/interviews/InterviewRoomPage';
import { CompletionPage } from './pages/interviews/CompletionPage';
import './styles/theme.css';

// Root redirect component that checks authentication
function RootRedirect() {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  
  return <Navigate to={isAuthenticated ? "/overview" : "/login"} replace />;
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <ToastProvider>
          <AuthProvider>
            <BrowserRouter>
          <Routes>
            <Route path="/login" element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            } />
            
            <Route path="/register" element={
              <PublicRoute>
                <RegisterPage />
              </PublicRoute>
            } />
            
            <Route path="/verify-email" element={
              <PublicRoute>
                <VerifyEmailPage />
              </PublicRoute>
            } />
            
            <Route path="/forgot-password" element={
              <PublicRoute>
                <ForgotPasswordPage />
              </PublicRoute>
            } />
            
            <Route path="/forgot-password/verify" element={
              <PublicRoute>
                <VerifyPasswordResetPage />
              </PublicRoute>
            } />
            
            <Route path="/forgot-password/reset" element={
              <PublicRoute>
                <ResetPasswordPage />
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
            
            <Route path="/cohorts/:id/add-students" element={
              <ProtectedRoute>
                <AddStudentsPage />
              </ProtectedRoute>
            } />
            
            <Route path="/cohorts/:id/send-invites" element={
              <ProtectedRoute>
                <SendInvitesPage />
              </ProtectedRoute>
            } />
            
            <Route path="/students" element={
              <ProtectedRoute>
                <StudentsPage />
              </ProtectedRoute>
            } />
            
            <Route path="/reports" element={
              <ProtectedRoute>
                <ReportsPage />
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
            
            {/* Student-Facing Mock Interview Flow (WebRTC) */}
            <Route path="/invite/:token" element={
              <StudentRoute>
                <InviteLandingPage />
              </StudentRoute>
            } />
            
            <Route path="/session/:sessionId/welcome" element={
              <StudentRoute>
                <InterviewWelcomePage />
              </StudentRoute>
            } />
            
            <Route path="/session/:sessionId/profile" element={
              <StudentRoute>
                <InterviewProfilePage />
              </StudentRoute>
            } />
            
            <Route path="/session/:sessionId/consent" element={
              <StudentRoute>
                <InterviewConsentPage />
              </StudentRoute>
            } />
            
            <Route path="/session/:sessionId/setup" element={
              <StudentRoute>
                <SetupPage />
              </StudentRoute>
            } />
            
            <Route path="/session/:sessionId/preflight" element={
              <StudentRoute>
                <PreflightPage />
              </StudentRoute>
            } />
            
            <Route path="/session/:sessionId/interview" element={
              <StudentRoute>
                <InterviewRoomPage />
              </StudentRoute>
            } />
            
            <Route path="/session/:sessionId/complete" element={
              <StudentRoute>
                <CompletionPage />
              </StudentRoute>
            } />
            
            <Route path="/" element={<RootRedirect />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
        </ToastProvider>
    </ThemeProvider>
    </ErrorBoundary>
  );
}
