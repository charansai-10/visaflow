export function getDashboardRoute(role: string): string {
  switch (role) {
    case 'employee':  return '/dashboard';
    case 'hr':        return '/employer/dashboard';
    case 'attorney':  return '/lawyer/dashboard';
    case 'app_admin': return '/admin/dashboard';
    default:          return '/dashboard';
  }
}

export function getOnboardingRoute(step: number): string {
  if (step === 1) return '/signup/profile-setup';
  if (step === 2) return '/signup/verify-email';

  const stored = localStorage.getItem('roles');
  const roles: string[] = stored ? (JSON.parse(stored) as string[]) : [];
  return getDashboardRoute(roles[0] ?? '');
}
