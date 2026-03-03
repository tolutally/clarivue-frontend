import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import { SessionProvider } from './contexts/SessionContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ProtectedRoute } from './components/ProtectedRoute';
import { DashboardRoute } from './components/DashboardRoute';
import { PublicRoute } from './components/PublicRoute';
import { SessionRoute } from './components/SessionRoute';
import { SessionJoinPage } from './pages/session/SessionJoinPage';
import { WelcomePage as SessionWelcomePage } from './pages/session/WelcomePage';
import { ConsentPage as SessionConsentPage } from './pages/session/ConsentPage';
import { SetupPage as SessionSetupPage } from './pages/session/SetupPage';
import { PreflightPage as SessionPreflightPage } from './pages/session/PreflightPage';
import { StartSessionPage } from './pages/session/StartSessionPage';
import { InterviewRoomPage as SessionInterviewRoomPage } from './pages/session/InterviewRoomPage';
import { SessionCompletePage } from './pages/session/SessionCompletePage';
import { LoginPage } from './pages/LoginPage';
import { ComingSoonPage } from './pages/ComingSoonPage';
import { RegisterPage } from './pages/RegisterPage';
import { VerifyEmailPage } from './pages/VerifyEmailPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { VerifyPasswordResetPage } from './pages/VerifyPasswordResetPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';
import { OnboardingPage } from './pages/OnboardingPage';
import { OverviewPage } from './pages/OverviewPage';
import { CohortsPage } from './pages/CohortsPage';
import { CreateCohortPage } from './pages/CreateCohortPage';
import { UpdateCohortPage } from './pages/UpdateCohortPage';
import { CohortDetailPage } from './pages/CohortDetailPage';
import { AddStudentsPage } from './pages/AddStudentsPage';
import { SendInvitesPage } from './pages/SendInvitesPage';
import { AllStudentsPage } from './pages/AllStudentsPage';
import { StudentsPage } from './components/students/StudentsPage';
import { ReportsPage } from './components/reports/ReportsPage';
import { AdvisorsPage } from './pages/AdvisorsPage';
import { WelcomePage } from './pages/mockinterviews/WelcomePage';
import { CompleteProfilePage } from './pages/mockinterviews/CompleteProfilePage';
import { ConsentPage } from './pages/mockinterviews/ConsentPage';
import { JDIntakePage } from './pages/mockinterviews/JDIntakePage';
import { JDReviewPage } from './pages/mockinterviews/JDReviewPage';
import { InterviewReadyPage } from './pages/mockinterviews/InterviewReadyPage';
import './styles/theme.css';

// Root redirect component that checks authentication and user type
function RootRedirect() {
  const { isAuthenticated, loading, admin } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // Check user type and redirect accordingly
  const userType = admin?.user?.role?.user_type;
  if (userType === 'user') {
    return <Navigate to="/overview" replace />;
  } else {
    return <Navigate to="/coming-soon" replace />;
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <ToastProvider>
          <AuthProvider>
            <SessionProvider>
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
            
            <Route path="/coming-soon" element={
              <ProtectedRoute>
                <ComingSoonPage />
              </ProtectedRoute>
            } />
            
            {/* Interview Session Flow */}
            <Route path="/session/join" element={
              <PublicRoute>
                <SessionJoinPage />
              </PublicRoute>
            } />
            <Route path="/session/welcome" element={
              <SessionRoute>
                <SessionWelcomePage />
              </SessionRoute>
            } />
            <Route path="/session/consent" element={
              <SessionRoute>
                <SessionConsentPage />
              </SessionRoute>
            } />
            <Route path="/session/setup" element={
              <SessionRoute>
                <SessionSetupPage />
              </SessionRoute>
            } />
            <Route path="/session/preflight" element={
              <SessionRoute>
                <SessionPreflightPage />
              </SessionRoute>
            } />
            <Route path="/session/start" element={
              <SessionRoute>
                <StartSessionPage />
              </SessionRoute>
            } />
            <Route path="/session/interview" element={
              <SessionRoute>
                <SessionInterviewRoomPage />
              </SessionRoute>
            } />
            <Route path="/session/complete" element={
              <SessionRoute>
                <SessionCompletePage />
              </SessionRoute>
            } />
            
            <Route path="/overview" element={
              <DashboardRoute>
                <OverviewPage />
              </DashboardRoute>
            } />
            
            <Route path="/cohorts" element={
              <DashboardRoute>
                <CohortsPage />
              </DashboardRoute>
            } />
            
            <Route path="/cohorts/new" element={
              <DashboardRoute>
                <CreateCohortPage />
              </DashboardRoute>
            } />
            
            <Route path="/cohorts/:id/edit" element={
              <DashboardRoute>
                <UpdateCohortPage />
              </DashboardRoute>
            } />
            
            <Route path="/cohorts/:id" element={
              <DashboardRoute>
                <CohortDetailPage />
              </DashboardRoute>
            } />
            
            <Route path="/cohorts/:id/add-students" element={
              <DashboardRoute>
                <AddStudentsPage />
              </DashboardRoute>
            } />
            
            <Route path="/cohorts/:id/send-invites" element={
              <DashboardRoute>
                <SendInvitesPage />
              </DashboardRoute>
            } />
            
            <Route path="/students" element={
              <DashboardRoute>
                <StudentsPage />
              </DashboardRoute>
            } />
            
            <Route path="/advisors" element={
              <DashboardRoute>
                <AdvisorsPage />
              </DashboardRoute>
            } />
            
            <Route path="/reports" element={
              <DashboardRoute>
                <ReportsPage />
              </DashboardRoute>
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
            
            <Route path="/" element={<RootRedirect />} />
          </Routes>
        </BrowserRouter>
            </SessionProvider>
      </AuthProvider>
        </ToastProvider>
    </ThemeProvider>
    </ErrorBoundary>
  );
}
