import { useState, type ReactNode } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, FileText, FolderOpen, MessageSquare, Bell,
  Newspaper, User, HelpCircle, LogOut, X, Globe, Menu, Search,
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/applications', icon: FileText, label: 'My Applications' },
  { to: '/documents', icon: FolderOpen, label: 'Document Hub' },
  { to: '/messages', icon: MessageSquare, label: 'Secure Messaging' },
  { to: '/notifications', icon: Bell, label: 'Notifications' },
  { to: '/news', icon: Newspaper, label: 'Immigration News' },
  { to: '/profile', icon: User, label: 'Profile & Security' },
  { to: '/help', icon: HelpCircle, label: 'Help & Support' },
];

function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { user, clearAuth } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    clearAuth();
    navigate('/login');
  };

  const initials = user
    ? `${user.first_name?.[0] ?? ''}${user.last_name?.[0] ?? ''}`.toUpperCase()
    : 'U';

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-20 bg-black/50 lg:hidden" onClick={onClose} />
      )}
      <aside
        className={[
          'fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 flex flex-col',
          'transition-transform duration-300 ease-in-out',
          'lg:static lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full',
        ].join(' ')}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Globe size={16} className="text-white" />
            </div>
            <span className="font-bold text-gray-900 text-sm tracking-tight">ImmigrationPro</span>
          </div>
          <button onClick={onClose} className="lg:hidden p-1 rounded-md hover:bg-gray-100 text-gray-500">
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                [
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                ].join(' ')
              }
            >
              {({ isActive }) => (
                <>
                  <Icon size={18} className={isActive ? 'text-indigo-600' : 'text-gray-400'} />
                  {label}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User footer */}
        <div className="px-3 py-3 border-t border-gray-100 space-y-1">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 cursor-pointer">
            <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-semibold shrink-0">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user ? `${user.first_name} ${user.last_name}` : 'User'}
              </p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <LogOut size={16} className="text-gray-400" />
            Sign out
          </button>
        </div>
      </aside>
    </>
  );
}

function Header({ onMenuClick }: { onMenuClick: () => void }) {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center px-4 lg:px-6 gap-4 sticky top-0 z-10 shrink-0">
      <button onClick={onMenuClick} className="lg:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-500">
        <Menu size={20} />
      </button>

      <div className="flex-1 max-w-sm hidden md:block">
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search cases, documents..."
            className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 ml-auto">
        <button
          onClick={() => navigate('/notifications')}
          className="relative p-2 rounded-lg hover:bg-gray-100 text-gray-500"
        >
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>
        <button
          onClick={() => navigate('/profile')}
          className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-50"
        >
          <div className="w-7 h-7 bg-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-semibold">
            {user ? `${user.first_name?.[0] ?? ''}${user.last_name?.[0] ?? ''}`.toUpperCase() : 'U'}
          </div>
          <span className="text-sm font-medium text-gray-700 hidden sm:block">
            {user ? user.first_name : 'User'}
          </span>
        </button>
      </div>
    </header>
  );
}

interface EmployeeLayoutProps {
  children: ReactNode;
}

export default function EmployeeLayout({ children }: EmployeeLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
