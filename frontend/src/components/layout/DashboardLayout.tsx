// import { useState, type ReactNode } from 'react';
// import { Sidebar } from './Sidebar';
// import { Header } from './Header';

// interface DashboardLayoutProps {
//   children: ReactNode;
//   title?: string;
// }

// export function DashboardLayout({ children, title }: DashboardLayoutProps) {
//   const [sidebarOpen, setSidebarOpen] = useState(false);

//   return (
//     <div className="flex h-screen bg-gray-50 overflow-hidden">
//       <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
//       <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
//         <Header onMenuClick={() => setSidebarOpen(true)} title={title} />
//         <main className="flex-1 overflow-y-auto p-4 lg:p-6">
//           {children}
//         </main>
//       </div>
//     </div>
//   );
// }

import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { SettingsSidebar } from './SettingsSidebar';

export function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed,   setCollapsed]   = useState(false);
  const location = useLocation();

  const isSettingsPage  = location.pathname.startsWith("/profile") ||
                          location.pathname.startsWith("/settings");

  // Screen 15 — Document Upload has NO sidebar
  const isNoSidebarPage = /^\/applications\/[^/]+\/documents/.test(location.pathname) ||
                          /^\/applications\/[^/]+\/review/.test(location.pathname);

  return (
    <div className="flex h-screen bg-[#f7f9fc] overflow-hidden">

      {isNoSidebarPage ? null : isSettingsPage ? (
        <SettingsSidebar />
      ) : (
        <Sidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed(c => !c)}
        />
      )}

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Outlet />
      </div>

    </div>
  );
}