// components/layout/SettingsSidebar.tsx
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { Avatar } from '../ui/Avatar';
import {
  ChevronLeft,
  User,
  Settings,
  Bell,
  Shield,
  CreditCard,
  Users,
  Plug,
  Activity,
  Download,
  HelpCircle,
  LogOut,
} from 'lucide-react';

// ── Nav item type ─────────────────────────────────────────────────────────────
interface NavItem {
  id:    string;
  label: string;
  icon:  React.ReactNode;
  path:  string;
}

// ── Nav groups — matched exactly to Figma Screen 28 ──────────────────────────
const PERSONAL: NavItem[] = [
  { id: 'profile',      label: 'Profile',             icon: <User      size={16} />, path: '/profile' },
  { id: 'prefs',        label: 'Authentication',       icon: <Settings  size={16} />, path: '/profile/authentication' },
  { id: 'notifs',       label: 'Multi-Factor Auth',    icon: <Bell      size={16} />, path: '/profile/mfa' },
  { id: 'security',     label: 'Security & Privacy',   icon: <Shield    size={16} />, path: '/profile/security-alerts' },
];

const ACCOUNT: NavItem[] = [
  { id: 'billing',      label: 'Billing',        icon: <CreditCard size={16} />, path: '/profile/billing' },
  { id: 'team',         label: 'Team Members',   icon: <Users      size={16} />, path: '/profile/team' },
  { id: 'integrations', label: 'Integrations',   icon: <Plug       size={16} />, path: '/profile/integrations' },
];

const SYSTEM: NavItem[] = [
  { id: 'activity', label: 'Login History',   icon: <Activity   size={16} />, path: '/profile/login-history' },
  { id: 'export',   label: 'Privacy Settings', icon: <Download  size={16} />, path: '/profile/privacy' },
  { id: 'help',     label: 'Devices',          icon: <HelpCircle size={16} />, path: '/profile/devices' },
];

// ─────────────────────────────────────────────────────────────────────────────
export function SettingsSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { tokens, clearAuth: logout } = useAuthStore();

  // ── Dynamic user data from store ──────────────────────────────────────────
  const firstName = tokens?.user?.first_name ?? '';
  const lastName  = tokens?.user?.last_name  ?? '';
  const fullName  = `${firstName} ${lastName}`.trim() || 'User';
  const roleLabel = tokens?.roles?.[0]
    ? tokens.roles[0].charAt(0).toUpperCase() + tokens.roles[0].slice(1).toLowerCase()
    : 'Employee';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  const renderGroup = (label: string, items: NavItem[]) => (
    <div className="mb-[8px]">
      <p className="text-[11px] font-semibold text-[#9ca3af] uppercase tracking-[0.08em]
                    px-[12px] mb-[4px] leading-[16px]">
        {label}
      </p>
      {items.map(item => (
        <button
          key={item.id}
          onClick={() => navigate(item.path)}
          className={[
            'w-full flex items-center gap-[10px] px-[12px] py-[10px] rounded-[8px]',
            'text-[14px] font-medium tracking-[-0.5px] leading-[20px]',
            'transition-colors duration-150 mb-[2px]',
            isActive(item.path)
              ? 'bg-[#f0f5ff] text-[#2f35ca]'
              : 'text-[#64748b] hover:bg-[#f8fafc] hover:text-[#0f172a]',
          ].join(' ')}
        >
          <span className={isActive(item.path) ? 'text-[#2f35ca]' : 'text-[#94a3b8]'}>
            {item.icon}
          </span>
          {item.label}
        </button>
      ))}
    </div>
  );

  return (
    <aside className="w-[288px] shrink-0 bg-white border-r border-[#f1f5f9]
                      flex flex-col h-screen sticky top-0 overflow-y-auto">

      {/* ── Top: Back + Settings title + User info ───────────────────── */}
      <div className="px-[24px] pt-[24px] pb-[16px] shrink-0">

        {/* Back to Dashboard */}
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-[8px] text-[#64748b] text-[13px] font-medium
                     tracking-[-0.5px] hover:text-[#0f172a] transition-colors mb-[16px]"
        >
          <ChevronLeft size={14} className="shrink-0" />
          Back to Dashboard
        </button>

        {/* Settings heading */}
        <h2 className="text-[24px] font-bold text-[#0f172a] tracking-[-0.5px] leading-[32px]">
          Settings
        </h2>

        {/* ── User info — dynamic from auth store ───────────────────── */}
        <div className="flex items-center gap-[12px] mt-[16px] p-[12px] bg-[#f8fafc]
                        rounded-[12px] border border-[#f1f5f9]">
          <Avatar name={fullName} size="sm" />
          <div className="flex flex-col min-w-0">
            <p className="text-[14px] font-semibold text-[#0f172a] tracking-[-0.5px]
                          leading-[18px] truncate whitespace-nowrap">
              {fullName}
            </p>
            <p className="text-[12px] text-[#64748b] tracking-[-0.5px] leading-[16px]">
              {roleLabel}
            </p>
          </div>
        </div>
      </div>

      {/* ── Divider ──────────────────────────────────────────────────── */}
      <div className="h-px bg-[#f1f5f9] mx-[24px] shrink-0" />

      {/* ── Nav groups ───────────────────────────────────────────────── */}
      <nav className="flex-1 px-[12px] pt-[16px] pb-[8px] overflow-y-auto">
        {renderGroup('Personal Settings', PERSONAL)}
        {renderGroup('Account', ACCOUNT)}
        {renderGroup('System', SYSTEM)}
      </nav>

      {/* ── Sign out ─────────────────────────────────────────────────── */}
      <div className="border-t border-[#f1f5f9] px-[12px] py-[12px] shrink-0">
        <button
          onClick={handleLogout}
          className="flex items-center gap-[8px] w-full px-[12px] py-[10px] rounded-[8px]
                     text-[14px] font-medium text-[#64748b] tracking-[-0.5px]
                     hover:bg-red-50 hover:text-red-600 transition-colors duration-150"
        >
          <LogOut size={14} className="shrink-0" />
          Sign Out
        </button>
      </div>

    </aside>
  );
}