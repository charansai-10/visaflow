// import { BrowserRouter, Routes, Route, Navigate, Outlet, useSearchParams } from 'react-router-dom';
// import { useAuthStore } from './store/authStore';
// import { getUiSession } from './utils/uiSession';
// import { getDashboardRoute } from './utils/navigation';

// // ── layouts ──────────────────────────────────────────────────────────────────
// import { DashboardLayout } from './components/layout/DashboardLayout';

// // ── public pages ─────────────────────────────────────────────────────────────
// import Login            from './pages/public/Login';
// import ForgotPassword   from './pages/public/ForgotPassword';
// import Signup           from './pages/public/Signup';
// import ResetPasswordOTP from './pages/public/Resetpasswordotp';
// import ResetPasswordNew from './pages/public/ResetPasswordNew';
// import LinkedInCallback from './pages/public/LinkedInCallback';

// // ── onboarding ────────────────────────────────────────────────────────────────
// import VerifyEmailPage  from './pages/signup/VerifyEmailPage';
// import ProfileSetupPage from './pages/signup/ProfileSetupPage';

// // /join?token=xxx  OR  /join?code=VF-XXXX-XXXX

// // ── employee pages ────────────────────────────────────────────────────────────
// import Dashboard             from './pages/employee/Dashboard';
// import ApplicationsList      from './pages/employee/ApplicationsList';
// import NewApplication        from './pages/employee/NewApplication';
// import ApplicationDetail     from './pages/employee/ApplicationDetail';
// import DocumentHub           from './pages/employee/DocumentHub';
// import DocumentUploadV2      from './pages/employee/DocumentUpload';
// import DocumentViewer        from './pages/employee/DocumentViewer';
// import SecureMessaging       from './pages/employee/SecureMessaging';
// import NotificationsCenterV2 from './pages/employee/NotificationsCenterV2';
// import ProfileSecurity       from './pages/employee/ProfileSecurity';
// import PaymentsScreen        from './pages/employee/PaymentsScreen';
// import SelectAttorney        from './pages/employee/SelectAttorney';
// import BookConsultation      from './pages/employee/BookConsultation';
// import ConnectEmployer       from './pages/employee/ConnectEmployer';

// // /profile/connect-employer — employee enters company code after signup

// // ── hr pages ──────────────────────────────────────────────────────────────────
// import HRDashboard      from './pages/hr/HRDashboard';
// // import HREmployees      from './pages/hr/HREmployees';
// import HRInviteEmployee from './pages/hr/HRInviteEmployees';
// import AcceptInvitePage from './pages/public/AcceptInvitePage';

// // ─────────────────────────────────────────────────────────────────────────────
// // Safe redirect helper — only allows internal paths.
// // Blocks open-redirect attacks (//evil.com, https://evil.com).
// // ─────────────────────────────────────────────────────────────────────────────
// function safeRedirectPath(raw: string | null): string | null {
//   if (raw && raw.startsWith('/') && !raw.startsWith('//')) return raw;
//   return null;
// }

// // ─────────────────────────────────────────────────────────────────────────────
// // Guards
// // ─────────────────────────────────────────────────────────────────────────────

// function PublicRoute() {
//   const isAuthenticated = useAuthStore(state => state.isAuthenticated);
//   const [params] = useSearchParams();

//   if (isAuthenticated) {
//     // ── HONOR ?redirect= when an already-logged-in user lands on a public ──
//     //    page (e.g. clicking "Sign In to Accept" from /accept-invite while
//     //    already authenticated). Without this, the user bounces straight
//     //    to the dashboard and never returns to the page that sent them here.
//     const redirect = safeRedirectPath(params.get('redirect'));
//     if (redirect) return <Navigate to={redirect} replace />;

//     const session = getUiSession();
//     return <Navigate to={getDashboardRoute(session?.roles?.[0] ?? '')} replace />;
//   }
//   return <Outlet />;
// }

// function OnboardingRoute() {
//   const isAuthenticated = useAuthStore(state => state.isAuthenticated);
//   if (!isAuthenticated) return <Navigate to="/login" replace />;
//   return <Outlet />;
// }

// function RoleRoute({ allowedRoles }: { allowedRoles: string[] }) {
//   const isAuthenticated = useAuthStore(state => state.isAuthenticated);
//   if (!isAuthenticated) return <Navigate to="/login" replace />;

//   const session  = getUiSession();
//   const userRole = session?.roles?.[0] ?? '';

//   if (!allowedRoles.includes(userRole)) {
//     return <Navigate to={getDashboardRoute(userRole)} replace />;
//   }

//   return <Outlet />;
// }

// // ─────────────────────────────────────────────────────────────────────────────
// // App
// // ─────────────────────────────────────────────────────────────────────────────
// export default function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/" element={<Navigate to="/login" replace />} />

//         {/* ── Public (unauthenticated only — but honors ?redirect=) ──────── */}
//         <Route element={<PublicRoute />}>
//           <Route path="/login"           element={<Login />} />
//           <Route path="/forgot-password" element={<ForgotPassword />} />
//         </Route>

//         {/* ── Signup (no auth required) ───────────────────────────────────── */}
//         <Route path="/signup" element={<Signup />} />

//         {/* ── Onboarding (token required, no role check) ──────────────────── */}
//         <Route element={<OnboardingRoute />}>
//           <Route path="/signup/verify-email"  element={<VerifyEmailPage />} />
//           <Route path="/signup/profile-setup" element={<ProfileSetupPage />} />
//         </Route>

//         {/* ── Password reset & OAuth callbacks ────────────────────────────── */}
//         <Route path="/forgot-password/verify-otp"   element={<ResetPasswordOTP />} />
//         <Route path="/forgot-password/new-password" element={<ResetPasswordNew />} />
//         <Route path="/auth/linkedin/callback"        element={<LinkedInCallback />} />
//         <Route path="/accept-invite" element={<AcceptInvitePage />} />

//         {/* ── EMPLOYEE routes ─────────────────────────────────────────────── */}
//         <Route element={<RoleRoute allowedRoles={['employee']} />}>
//           <Route element={<DashboardLayout />}>
//             <Route path="/dashboard"                        element={<Dashboard />} />
//             <Route path="/applications/list"                element={<ApplicationsList />} />
//             <Route path="/applications/new"                 element={<NewApplication />} />
//             <Route path="/applications/:id"                 element={<ApplicationDetail />} />
//             <Route path="/documents"                        element={<DocumentHub />} />
//             <Route path="/documents/upload"                 element={<DocumentUploadV2 />} />
//             <Route path="/documents/viewer"                 element={<DocumentViewer />} />
//             <Route path="/messages"                         element={<SecureMessaging />} />
//             <Route path="/notifications"                    element={<NotificationsCenterV2 />} />
//             <Route path="/payments"                         element={<PaymentsScreen />} />
//             <Route path="/consultations"                    element={<SelectAttorney />} />
//             <Route path="/consultations/book/:attorneyId"   element={<BookConsultation />} />

//             {/* Profile & Settings */}
//             <Route path="/profile"                          element={<ProfileSecurity />} />
//             <Route path="/profile/authentication"           element={<ProfileSecurity />} />
//             <Route path="/profile/mfa"                      element={<ProfileSecurity />} />
//             <Route path="/profile/login-history"            element={<ProfileSecurity />} />
//             <Route path="/profile/privacy"                  element={<ProfileSecurity />} />
//             <Route path="/profile/devices"                  element={<ProfileSecurity />} />
//             <Route path="/profile/session"                  element={<ProfileSecurity />} />
//             <Route path="/profile/security-alerts"          element={<ProfileSecurity />} />

//             <Route path="/profile/connect-employer"         element={<ConnectEmployer />} />
//           </Route>
//         </Route>

//         {/* ── HR / EMPLOYER routes ────────────────────────────────────────── */}
//         <Route element={<RoleRoute allowedRoles={['hr']} />}>
//           <Route element={<DashboardLayout />}>
//             <Route path="/employer/dashboard"         element={<HRDashboard />} />
//             {/* <Route path="/employer/employees"         element={<HREmployees />} /> */}
//             <Route path="/employer/invite"            element={<HRInviteEmployee />} />
//             <Route path="/profile"                    element={<ProfileSecurity />} />
//           </Route>
//         </Route>

//         {/* ── Catch-all ───────────────────────────────────────────────────── */}
//         <Route path="*" element={<Navigate to="/" replace />} />
//       </Routes>
//     </BrowserRouter>
//   );
// }

import { BrowserRouter, Routes, Route, Navigate, Outlet, useSearchParams } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { getUiSession } from './utils/uiSession';
import { getDashboardRoute } from './utils/navigation';
import { ThemeProvider } from './theme';

// ── layouts ──────────────────────────────────────────────────────────────────
import { DashboardLayout } from './components/layout/DashboardLayout';

// ── public pages ─────────────────────────────────────────────────────────────
import Login            from './pages/public/Login';
import ForgotPassword   from './pages/public/ForgotPassword';
import Signup           from './pages/public/Signup';
import ResetPasswordOTP from './pages/public/Resetpasswordotp';
import ResetPasswordNew from './pages/public/ResetPasswordNew';
import LinkedInCallback from './pages/public/LinkedInCallback';

// ── onboarding ────────────────────────────────────────────────────────────────
import VerifyEmailPage  from './pages/signup/VerifyEmailPage';
import ProfileSetupPage from './pages/signup/ProfileSetupPage';

// /join?token=xxx  OR  /join?code=VF-XXXX-XXXX

// ── employee pages ────────────────────────────────────────────────────────────
import Dashboard             from './pages/employee/Dashboard';
import ApplicationsList      from './pages/employee/ApplicationsList';
import NewApplication        from './pages/employee/NewApplication';
import ApplicationDetail     from './pages/employee/ApplicationDetail';
import DocumentHub           from './pages/employee/DocumentHub';
import DocumentUploadV2      from './pages/employee/DocumentUpload';
import DocumentViewer        from './pages/employee/DocumentViewer';
import SecureMessaging       from './pages/employee/SecureMessaging';
import NotificationsCenterV2 from './pages/employee/NotificationsCenterV2';
import ProfileSecurity       from './pages/employee/ProfileSecurity';
import PaymentsScreen        from './pages/employee/PaymentsScreen';
import SelectAttorney        from './pages/employee/SelectAttorney';
import BookConsultation      from './pages/employee/BookConsultation';
import ConnectEmployer       from './pages/employee/ConnectEmployer';

// /profile/connect-employer — employee enters company code after signup

// ── hr pages ──────────────────────────────────────────────────────────────────
import HRDashboard      from './pages/hr/HRDashboard';
import HREmployees      from './pages/hr/HREmployees';
import HRInviteEmployee from './pages/hr/HRInviteEmployees';
import AcceptInvitePage from './pages/public/AcceptInvitePage';
import HREmployeeDetail from './pages/hr/HREmployeeDetail';
import HRCreateCase from './pages/hr/HRCreateCase';
import HRCasesList from './pages/hr/HRCasesList';
import HRCaseDetail from './pages/hr/HRCaseDetail';
import HRMessages from './pages/hr/HRMessages';
import HRDeadlines from './pages/hr/HRDeadlines';
import HRApprovalQueue from './pages/hr/HRApprovalQueue';
import HRDocumentManagement from './pages/hr/HRDocumentManagement';
import HRNotificationsCenter from './pages/hr/HRNotificationsCenter';

// ─────────────────────────────────────────────────────────────────────────────
// Safe redirect helper — only allows internal paths.
// Blocks open-redirect attacks (//evil.com, https://evil.com).
// ─────────────────────────────────────────────────────────────────────────────
function safeRedirectPath(raw: string | null): string | null {
  if (raw && raw.startsWith('/') && !raw.startsWith('//')) return raw;
  return null;
}

// ─────────────────────────────────────────────────────────────────────────────
// Guards
// ─────────────────────────────────────────────────────────────────────────────

function PublicRoute() {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const [params] = useSearchParams();

  if (isAuthenticated) {
    // ── HONOR ?redirect= when an already-logged-in user lands on a public ──
    //    page (e.g. clicking "Sign In to Accept" from /accept-invite while
    //    already authenticated). Without this, the user bounces straight
    //    to the dashboard and never returns to the page that sent them here.
    const redirect = safeRedirectPath(params.get('redirect'));
    if (redirect) return <Navigate to={redirect} replace />;

    const session = getUiSession();
    return <Navigate to={getDashboardRoute(session?.roles?.[0] ?? '')} replace />;
  }
  return <Outlet />;
}

function OnboardingRoute() {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <Outlet />;
}
function RoleRoute({ allowedRoles }: { allowedRoles: string[] }) {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const session = getUiSession();
 
  // Not authenticated at all — no Zustand token AND no cookie
  const authed = isAuthenticated || !!session;
  if (!authed) return <Navigate to="/login" replace />;
 
  // Authenticated but wrong role
  const userRole = session?.roles?.[0] ?? '';
  if (!allowedRoles.includes(userRole)) {
    return <Navigate to={getDashboardRoute(userRole)} replace />;
  }
 
  return <Outlet />;
}

// ─────────────────────────────────────────────────────────────────────────────
// App
// ─────────────────────────────────────────────────────────────────────────────
export default function App() {
  const session = getUiSession();

  return (
    <ThemeProvider color={session?.theme_color}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* ── Public (unauthenticated only — but honors ?redirect=) ──────── */}
          <Route element={<PublicRoute />}>
            <Route path="/login"           element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
          </Route>

          {/* ── Signup (no auth required) ───────────────────────────────────── */}
          <Route path="/signup" element={<Signup />} />

          {/* ── Onboarding (token required, no role check) ──────────────────── */}
          <Route element={<OnboardingRoute />}>
            <Route path="/signup/verify-email"  element={<VerifyEmailPage />} />
            <Route path="/signup/profile-setup" element={<ProfileSetupPage />} />
          </Route>

          {/* ── Password reset & OAuth callbacks ────────────────────────────── */}
          <Route path="/forgot-password/verify-otp"   element={<ResetPasswordOTP />} />
          <Route path="/forgot-password/new-password" element={<ResetPasswordNew />} />
          <Route path="/auth/linkedin/callback"        element={<LinkedInCallback />} />
          <Route path="/accept-invite" element={<AcceptInvitePage />} />

          {/* ── EMPLOYEE routes ─────────────────────────────────────────────── */}
          <Route element={<RoleRoute allowedRoles={['employee']} />}>
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard"                        element={<Dashboard />} />
              <Route path="/applications/list"                element={<ApplicationsList />} />
              <Route path="/applications/new"                 element={<NewApplication />} />
              <Route path="/applications/:id"                 element={<ApplicationDetail />} />
              <Route path="/documents"                        element={<DocumentHub />} />
              <Route path="/documents/upload"                 element={<DocumentUploadV2 />} />
              <Route path="/documents/viewer"                 element={<DocumentViewer />} />
              <Route path="/messages"                         element={<SecureMessaging />} />
              <Route path="/notifications"                    element={<NotificationsCenterV2 />} />
              <Route path="/payments"                         element={<PaymentsScreen />} />
              <Route path="/consultations"                    element={<SelectAttorney />} />
              <Route path="/consultations/book/:attorneyId"   element={<BookConsultation />} />

              {/* Profile & Settings */}
              <Route path="/profile"                          element={<ProfileSecurity />} />
              <Route path="/profile/authentication"           element={<ProfileSecurity />} />
              <Route path="/profile/mfa"                      element={<ProfileSecurity />} />
              <Route path="/profile/login-history"            element={<ProfileSecurity />} />
              <Route path="/profile/privacy"                  element={<ProfileSecurity />} />
              <Route path="/profile/devices"                  element={<ProfileSecurity />} />
              <Route path="/profile/session"                  element={<ProfileSecurity />} />
              <Route path="/profile/security-alerts"          element={<ProfileSecurity />} />

              <Route path="/profile/connect-employer"         element={<ConnectEmployer />} />
            </Route>
          </Route>

          {/* ── HR / EMPLOYER routes ────────────────────────────────────────── */}
          <Route element={<RoleRoute allowedRoles={['hr']} />}>
            <Route element={<DashboardLayout />}>
              <Route path="/employer/dashboard" element={<HRDashboard />} />
              <Route path="/employer/employees" element={<HREmployees />} />
              <Route path="/employer/invite" element={<HRInviteEmployee />} />
              <Route path="/employer/employees/:employeeLinkId" element={<HREmployeeDetail />} />
              <Route path="/employer/cases" element={<HRCasesList />} />
              <Route path="/employer/cases/new" element={<HRCreateCase />} />
              <Route path="/employer/cases/:applicationId" element={<HRCaseDetail />} />
              <Route path="/employer/messages" element={<HRMessages />} />
              <Route path="/employer/deadlines" element={<HRDeadlines />} />
              <Route path="/employer/approvals" element={<HRApprovalQueue />} />
              <Route path="/employer/documents/:applicationId" element={<HRDocumentManagement />} />
              <Route path="/employer/notifications" element={<HRNotificationsCenter />} />

              {/* HR Profile & Settings */}
              <Route path="/employer/profile" element={<ProfileSecurity />} />
              <Route path="/employer/profile/authentication" element={<ProfileSecurity />} />
              <Route path="/employer/profile/mfa" element={<ProfileSecurity />} />
              <Route path="/employer/profile/login-history" element={<ProfileSecurity />} />
              <Route path="/employer/profile/privacy" element={<ProfileSecurity />} />
              <Route path="/employer/profile/devices" element={<ProfileSecurity />} />
              <Route path="/employer/profile/session" element={<ProfileSecurity />} />
              <Route path="/employer/profile/security-alerts" element={<ProfileSecurity />} />

              {/* Optional compatibility route */}
              <Route path="/profile" element={<ProfileSecurity />} />
            </Route>
          </Route>
          {/* ── Catch-all ───────────────────────────────────────────────────── */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}