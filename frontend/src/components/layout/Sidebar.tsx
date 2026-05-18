import { NavLink, useNavigate } from 'react-router-dom';
import { LogOut, X, ChevronLeft } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { Avatar } from '../ui/Avatar';
import imgLogoIcon from '../../assets/icons/plane-icon.svg';

import iconDashboard    from '../../assets/icons/nav-dashboard.svg';
import iconApplications from '../../assets/icons/icon-applications.svg';
import iconMessages     from '../../assets/icons/icon-messages.svg';
import iconDocuments    from '../../assets/icons/icon-documents.svg';
import iconSettings     from '../../assets/icons/icon-settings.svg';

const navItems = [
  { to: '/dashboard',    src: iconDashboard,    label: 'Application Dashboard' },
  { to: '/applications/list', src: iconApplications, label: 'Applications'          },
  { to: '/messages',     src: iconMessages,     label: 'Messages'               },
  { to: '/documents',    src: iconDocuments,    label: 'Documents'              },
  { to: '/settings',     src: iconSettings,     label: 'Settings'               },
];

const ACTIVE_FILTER =
  'brightness(0) saturate(100%) invert(20%) sepia(96%) saturate(1500%) hue-rotate(222deg) brightness(95%) contrast(98%)';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

function formatRole(role?: string): string {
  if (!role) return 'Employee';
  return role
    .split('_')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
}

export function Sidebar({ open, onClose, collapsed, onToggleCollapse }: SidebarProps) {
  const { user, roles, clearAuth: logout } = useAuthStore();
  const navigate = useNavigate();
  console.log(roles)
  // ✅ Read directly from store — available instantly, no API call needed
  const firstName = user?.first_name ?? '';
  const lastName  = user?.last_name  ?? '';
  const fullName  = `${firstName} ${lastName}`.trim() || 'User';
  const roleLabel = formatRole(roles?.[0]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={[
          'fixed inset-y-0 left-0 z-30 bg-white border-r border-[#f1f5f9] flex flex-col',
          'transform transition-all duration-300 ease-in-out',
          'lg:static lg:translate-x-0 lg:z-auto',
          collapsed ? 'lg:w-16' : 'lg:w-[260px]',
          'w-[260px]',
          open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        ].join(' ')}
      >

        {/* ── Logo ─────────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between px-6 h-[72px] border-b border-[#f1f5f9] shrink-0">
          <div className="flex items-center gap-2 overflow-hidden">
            <div
              className="w-9 h-9 rounded-[10px] flex items-center justify-center shrink-0 shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)]"
              style={{ backgroundImage: 'linear-gradient(135deg, rgb(37,99,235) 0%, rgb(147,51,234) 100%)' }}
            >
              <img src={imgLogoIcon} alt="VisaFlow" className="w-[15px] h-[18px] object-contain" />
            </div>
            <span
              className={[
                'text-[20px] font-bold tracking-[-0.7px] leading-[28px] text-[#3a46e5] whitespace-nowrap transition-all duration-300 overflow-hidden',
                collapsed ? 'lg:w-0 lg:opacity-0' : 'lg:w-auto lg:opacity-100',
              ].join(' ')}
            >
              VisaFlow
            </span>
          </div>

          <button
            onClick={onClose}
            className="lg:hidden p-1 rounded-lg hover:bg-gray-100 text-gray-500 shrink-0"
          >
            <X size={18} />
          </button>
        </div>

        {/* ── Profile ──────────────────────────────────────────────────── */}
        <div className="px-6 py-6 border-b border-[#f1f5f9] shrink-0">
          <div
            className={[
              'flex items-center gap-3',
              collapsed ? 'lg:justify-center' : '',
            ].join(' ')}
          >
            <div className="relative shrink-0">
              <Avatar name={fullName} size="lg" />
              <span className="absolute bottom-0.5 right-0.5 w-2.5 h-2.5 bg-green-400 border-2 border-white rounded-full" />
            </div>

            <div
              className={[
                'flex flex-col transition-all duration-300 overflow-hidden',
                collapsed ? 'lg:w-0 lg:opacity-0' : 'lg:w-auto lg:opacity-100',
              ].join(' ')}
            >
              <p className="text-[14px] font-semibold text-[#0f172a] tracking-[-0.5px] whitespace-nowrap leading-[18px]">
                {fullName}
              </p>
              <p className="text-[12px] text-[#64748b] tracking-[-0.5px] whitespace-nowrap leading-[16px] mt-0.5">
                {roleLabel}
              </p>
            </div>
          </div>
        </div>

        {/* ── Nav ──────────────────────────────────────────────────────── */}
        <nav className="flex-1 px-4 py-6 flex flex-col gap-1 overflow-y-auto">
          {navItems.map(({ to, src, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              title={collapsed ? label : undefined}
              className={({ isActive }) =>
                [
                  'flex items-center gap-3 rounded-[12px] text-[14px] font-medium tracking-[-0.5px] transition-colors duration-150',
                  collapsed
                    ? 'lg:justify-center lg:px-0 lg:py-[10px] px-3 py-[10px]'
                    : 'px-3 py-[10px]',
                  isActive
                    ? 'bg-[#f0f5ff] text-[#2f35ca]'
                    : 'text-[#64748b] hover:bg-gray-50 hover:text-gray-900',
                ].join(' ')
              }
            >
              {({ isActive }) => (
                <>
                  <img
                    src={src}
                    alt=""
                    aria-hidden="true"
                    className="shrink-0"
                    style={{
                      width: 20,
                      height: 20,
                      display: 'block',
                      filter: isActive ? ACTIVE_FILTER : 'none',
                    }}
                  />
                  <span
                    className={[
                      'whitespace-nowrap overflow-hidden transition-all duration-300',
                      collapsed ? 'lg:w-0 lg:opacity-0' : 'lg:w-auto lg:opacity-100',
                    ].join(' ')}
                  >
                    {label}
                  </span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* ── Sign out ─────────────────────────────────────────────────── */}
        <div className="px-4 py-4 border-t border-[#f1f5f9] shrink-0">
          <button
            onClick={handleLogout}
            title={collapsed ? 'Sign out' : undefined}
            className={[
              'flex items-center gap-2 w-full rounded-[12px] text-[14px] font-medium text-[#64748b] tracking-[-0.5px]',
              'hover:bg-red-50 hover:text-red-600 transition-colors duration-150',
              collapsed
                ? 'lg:justify-center lg:px-0 lg:py-[10px] px-3 py-[10px]'
                : 'px-3 py-[10px]',
            ].join(' ')}
          >
            <LogOut size={14} className="shrink-0" />
            <span
              className={[
                'whitespace-nowrap overflow-hidden transition-all duration-300',
                collapsed ? 'lg:w-0 lg:opacity-0' : 'lg:w-auto lg:opacity-100',
              ].join(' ')}
            >
              Sign out
            </span>
          </button>
        </div>

        {/* ── Desktop collapse toggle ───────────────────────────────────── */}
        <button
          onClick={onToggleCollapse}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className={[
            'hidden lg:flex items-center justify-center',
            'absolute -right-3 top-[72px]',
            'w-6 h-6 bg-white border border-gray-200 rounded-full shadow-sm',
            'hover:bg-indigo-50 hover:border-indigo-300 transition-colors duration-150 z-10',
          ].join(' ')}
        >
          <ChevronLeft
            size={12}
            className={[
              'text-gray-500 transition-transform duration-300',
              collapsed ? 'rotate-180' : 'rotate-0',
            ].join(' ')}
          />
        </button>

      </aside>
    </>
  );
}