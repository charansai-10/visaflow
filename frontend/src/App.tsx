import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';

// Public / auth pages
import Login from './pages/public/Login';
import ForgotPassword from './pages/public/ForgotPassword';
import Signup from './pages/public/Signup';

// Signup onboarding pages
import ProfileSetupPage from './pages/signup/ProfileSetupPage';
import VerifyEmailPage from './pages/signup/VerifyEmailPage';

// Employee pages
import Dashboard from './pages/employee/Dashboard';
// import MyApplications from './pages/employee/MyApplications';
import DocumentHub from './pages/employee/DocumentHub';
import DocumentUploadV2 from './pages/employee/DocumentUpload';
import DocumentViewer from './pages/employee/DocumentViewer';
import InterviewPrep from './pages/employee/InterviewPrep';
import SecureMessaging from './pages/employee/SecureMessaging';
import NotificationsCenterV2 from './pages/employee/NotificationsCenterV2';
import ImmigrationNews from './pages/employee/ImmigrationNews';
import ProfileSecurity from './pages/employee/ProfileSecurity';
import HelpSupport from './pages/employee/HelpSupport';
import ResetPasswordNew from './pages/public/ResetPasswordNew';
import ResetPasswordOTP from './pages/public/Resetpasswordotp';
import LinkedInCallback from './pages/public/LinkedInCallback';
import { DashboardLayout } from './components/layout/DashboardLayout';
import ApplicationsList from './pages/employee/ApplicationsList';
import NewApplication from './pages/employee/NewApplication';
import ApplicationDetail from './pages/employee/ApplicationDetail';
import { useAuthStore } from './store/authStore';

// ── OnboardingRoute ───────────────────────────────────────────────────────────
// Requires access_token. Redirects to /login if missing.
function OnboardingRoute() {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
}
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Public routes */}
        <Route element={<PublicRoute />}>
          <Route path="/login"           element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Route>

        <Route path="/signup" element={<Signup />} />

        {/* Signup onboarding — needs token, no email-verify check */}
        <Route element={<OnboardingRoute />}>
          <Route path="/signup/verify-email"  element={<VerifyEmailPage />} />
          <Route path="/signup/profile-setup" element={<ProfileSetupPage />} />
        </Route>

        {/* Password reset — no auth needed */}
        <Route path="/forgot-password/verify-otp" element={<ResetPasswordOTP />} />
        <Route path="/forgot-password/new-password" element={<ResetPasswordNew />} />
        <Route path="/auth/linkedin/callback"       element={<LinkedInCallback />} />

        {/* Authenticated routes */}
        {/* <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/applications"      element={<MyApplications />} />
          <Route path="/cases/new"         element={<CaseCreation />} />
          <Route path="/documents"         element={<DocumentHub />} />
          <Route path="/documents/upload"  element={<DocumentUploadV2 />} />
          <Route path="/documents/viewer"  element={<DocumentViewer />} />
          <Route path="/messages"          element={<SecureMessaging />} />
          <Route path="/notifications"     element={<NotificationsCenterV2 />} />
          <Route path="/news"              element={<ImmigrationNews />} />
          <Route path="/interview-prep"    element={<InterviewPrep />} />
          <Route path="/profile"           element={<ProfileSecurity />} />
          <Route path="/help"              element={<HelpSupport />} />
        </Route> */}
        
        {/* ── Authenticated routes (WITH sidebar via DashboardLayout) ──── */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>   {/* ← wraps all employee pages */}
            <Route path="/dashboard"         element={<Dashboard />} />
            <Route path="/applications/list"  element={<ApplicationsList />} />
            <Route path="/applications/new"       element={<NewApplication />} />
            <Route path="/applications/:id"   element={<ApplicationDetail />} />
            <Route path="/documents"         element={<DocumentHub />} />
            <Route path="/documents/upload"  element={<DocumentUploadV2 />} />
            <Route path="/documents/viewer"  element={<DocumentViewer />} />
            <Route path="/messages"          element={<SecureMessaging />} />
            <Route path="/notifications"     element={<NotificationsCenterV2 />} />
            <Route path="/news"              element={<ImmigrationNews />} />
            <Route path="/interview-prep"    element={<InterviewPrep />} />
            <Route path="/help"              element={<HelpSupport />} />
            <Route path="/profile"                    element={<ProfileSecurity />} />
            <Route path="/profile/authentication"     element={<ProfileSecurity />} />
            <Route path="/profile/mfa"                element={<ProfileSecurity />} />
            <Route path="/profile/login-history"      element={<ProfileSecurity />} />
            <Route path="/profile/privacy"            element={<ProfileSecurity />} />
            <Route path="/profile/devices"            element={<ProfileSecurity />} />
            <Route path="/profile/session"            element={<ProfileSecurity />} />
            <Route path="/profile/security-alerts"    element={<ProfileSecurity />} />
          </Route>
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
