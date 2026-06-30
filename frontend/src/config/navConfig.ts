// src/config/navConfig.ts
//
// Single source of truth for sidebar navigation, keyed by user role.
// Sidebar.tsx reads the logged-in user's role (from the ui_session cookie)
// and renders the matching nav set.
//
// Icon styles:
//   • kind: 'lucide' → lucide-react component, inherits currentColor automatically
//                       (works with the dynamic theme system)

import type { LucideIcon } from 'lucide-react';
import {
  // ── Shared ────────────────────────────────────────────────────────────────
  LayoutDashboard,
  Users,
  FileText,
  MessageSquare,
  Settings,
  Bell,
  CreditCard,
  // ── Employee-only ─────────────────────────────────────────────────────────
  PieChart,
  FolderOpen,
  Mail,
  CalendarDays,
  // ── HR-only ───────────────────────────────────────────────────────────────
  // UserPlus,
  Briefcase,
  Clock,
  CheckSquare,
  // FolderKanban,
} from 'lucide-react';

// ── Types ─────────────────────────────────────────────────────────────────────

/** The four roles that exist in VisaFlow (matches UiSession.roles values). */
export type AppRole = 'employee' | 'attorney' | 'hr' | 'app_admin';

/** An icon is either an imported SVG (string URL) or a lucide-react component. */
export type NavIcon =
  | { kind: 'img';    src: string }
  | { kind: 'lucide'; Icon: LucideIcon };

export interface NavItem {
  to:    string;
  label: string;
  icon:  NavIcon;
}

// ── EMPLOYEE NAV ──────────────────────────────────────────────────────────────
// All lucide-react icons so they inherit the dynamic theme color.

const employeeNav: NavItem[] = [
  { to: '/dashboard',         label: 'Application Dashboard', icon: { kind: 'lucide', Icon: PieChart        } },
  { to: '/applications/list', label: 'Applications',          icon: { kind: 'lucide', Icon: FolderOpen      } },
  { to: '/messages',          label: 'Messages',              icon: { kind: 'lucide', Icon: Mail             } },
  { to: '/documents',         label: 'Documents',             icon: { kind: 'lucide', Icon: FileText         } },
  { to: '/payments',          label: 'Payments & Billing',    icon: { kind: 'lucide', Icon: CreditCard       } },
  { to: '/consultations',     label: 'Book Consultation',     icon: { kind: 'lucide', Icon: CalendarDays     } },
  { to: '/profile',           label: 'Settings',              icon: { kind: 'lucide', Icon: Settings         } },
  { to: '/notifications',     label: 'Notifications',         icon: { kind: 'lucide', Icon: Bell             } },
];

// ── HR / EMPLOYER NAV ─────────────────────────────────────────────────────────
//
// Route status:
//   ✅ built + routed in App.tsx   → active
//   🔜 roadmap                     → listed but page not built yet
//
// Navigation order matches the Figma sidebar (file: pBNHGu41ShCCU8Bh1YhFqK).
//
// NOT in the sidebar (reached from other places):
//   • Invite Employees  → "Invite" button on Dashboard card (→ /employer/invite)
//   • Notifications     → header bell icon (→ /employer/notifications)
//   • Detail screens    → navigated from list pages (Employee detail, Case detail)
//   • Team / Audit / Document Rules → from Settings
//   • E-Signature       → from a case / document action

const hrNav: NavItem[] = [
  // ── ✅ Built ───────────────────────────────────────────────────────────────
  { to: '/employer/dashboard',  label: 'Dashboard',  icon: { kind: 'lucide', Icon: LayoutDashboard } },
  { to: '/employer/employees',  label: 'Employees',  icon: { kind: 'lucide', Icon: Users            } },
  { to: '/employer/cases',      label: 'Cases',      icon: { kind: 'lucide', Icon: Briefcase        } },
  { to: '/employer/approvals',  label: 'Approvals',  icon: { kind: 'lucide', Icon: CheckSquare      } },
  // { to: '/employer/documents',  label: 'Documents',  icon: { kind: 'lucide', Icon: FolderKanban     } },
  { to: '/employer/deadlines',  label: 'Deadlines',  icon: { kind: 'lucide', Icon: Clock            } },
  { to: '/employer/messages',   label: 'Messages',   icon: { kind: 'lucide', Icon: MessageSquare    } },
  { to: '/employer/profile',       label: 'Settings',      icon: { kind: 'lucide', Icon: Settings } },
  { to: '/employer/notifications', label: 'Notifications', icon: { kind: 'lucide', Icon: Bell     } },
  // ── 🔜 Roadmap (uncomment when page + route exist) ─────────────────────────
  // { to: '/employer/analytics',  label: 'Analytics',  icon: { kind: 'lucide', Icon: BarChart3    } },
  // { to: '/employer/billing',    label: 'Billing',    icon: { kind: 'lucide', Icon: CreditCard   } },
  // { to: '/employer/settings',   label: 'Settings',   icon: { kind: 'lucide', Icon: Settings     } },
];

// ── OTHER ROLES (not built yet) ───────────────────────────────────────────────

const attorneyNav: NavItem[] = [];
const appAdminNav: NavItem[] = [];

const navByRole: Record<AppRole, NavItem[]> = {
  employee:  employeeNav,
  hr:        hrNav,
  attorney:  attorneyNav,
  app_admin: appAdminNav,
};

// ── Resolvers ─────────────────────────────────────────────────────────────────

/**
 * Resolve the user's primary role from the session `roles` array.
 * Falls back to 'employee' if the role is missing or unrecognised.
 */
export function resolvePrimaryRole(roles?: string[] | null): AppRole {
  const r = roles?.[0];
  return r === 'hr' || r === 'attorney' || r === 'app_admin' || r === 'employee'
    ? r
    : 'employee';
}

/** Public helper used by Sidebar.tsx to get the nav items for the current user. */
export function getNavItems(roles?: string[] | null): NavItem[] {
  return navByRole[resolvePrimaryRole(roles)];
}