// src/pages/hr/HRNotificationsCenter.tsx
// HR Notifications Center — company-level alerts, approvals, compliance
// Uses theme CSS variables throughout (var(--theme-primary) etc.)

import { useState, useMemo } from "react";
import {
  Bell, CheckCheck, Users, Briefcase, ShieldAlert,
  Filter, Settings, Check, 
  FileCheck, TrendingUp, ClipboardList,
  ChevronRight, MoreVertical,
} from "lucide-react";
import { PageHeader, PageContent } from "../../components/layout/Pageheader";

// ── Types ─────────────────────────────────────────────────────────────────────
type HRNotifCategory =
  | "approval" | "case_update" | "employee" | "compliance" | "system";
type HRNotifPriority = "urgent" | "high" | "medium" | "low";
type TabFilter = "all" | HRNotifCategory;

interface HRNotification {
  id:            string;
  category:      HRNotifCategory;
  priority:      HRNotifPriority;
  title:         string;
  body:          string;
  is_read:       boolean;
  created_at:    string;
  actor_label?:  string;
  ref_label?:    string;
  cta_primary?:  string;
  cta_secondary?: string;
  route?:        string;
}

// ── Mock data (replace with real hook) ───────────────────────────────────────
const MOCK_NOTIFS: HRNotification[] = [
  { id:"1", category:"approval",   priority:"urgent", title:"H-1B Petition Awaiting HR Approval", body:"David Chen's H-1B petition is ready for your review before attorney filing. Deadline in 3 days.", is_read:false, created_at: new Date(Date.now()-3600000).toISOString(),    actor_label:"Charan Sai", ref_label:"Case #VF-2025-0041", cta_primary:"Review Now", cta_secondary:"Delegate", route:"/employer/cases/1" },
  { id:"2", category:"employee",   priority:"high",   title:"New Employee Accepted Invitation",   body:"Priya Sharma accepted your company invite and completed profile setup. Assign a case attorney.", is_read:false, created_at: new Date(Date.now()-7200000).toISOString(),    actor_label:"Priya Sharma",  cta_primary:"View Employee", route:"/employer/employees" },
  { id:"3", category:"case_update",priority:"high",   title:"RFE Received — Emily Zhang",         body:"USCIS issued an RFE for Emily Zhang's L-1A case. Response due in 87 days. Attorney notified.", is_read:false, created_at: new Date(Date.now()-86400000).toISOString(),   actor_label:"USCIS", ref_label:"Case #VF-2025-0038", cta_primary:"View Case", route:"/employer/cases/3" },
  { id:"4", category:"compliance", priority:"urgent", title:"I-9 Expiring — 3 Employees",         body:"3 employees have I-9 employment authorization expiring within 30 days. Action required.", is_read:false, created_at: new Date(Date.now()-172800000).toISOString(),  cta_primary:"View Employees" },
  { id:"5", category:"approval",   priority:"medium", title:"Document Checklist Complete",         body:"All required documents for Marcus Johnson's O-1 petition have been uploaded and verified.", is_read:true,  created_at: new Date(Date.now()-259200000).toISOString(),  actor_label:"Marcus Johnson", ref_label:"Case #VF-2025-0039", cta_primary:"Approve & Forward" },
  { id:"6", category:"employee",   priority:"low",    title:"Employee Profile Updated",            body:"Charan Sai updated their employment information. Review changes if needed.", is_read:true, created_at: new Date(Date.now()-345600000).toISOString(), actor_label:"Charan Sai" },
  { id:"7", category:"system",     priority:"low",    title:"Monthly Case Summary Ready",          body:"Your July 2025 immigration case summary report is ready to download.", is_read:true, created_at: new Date(Date.now()-432000000).toISOString(), cta_primary:"Download Report" },
  { id:"8", category:"compliance", priority:"high",   title:"LCA Posting Period Ending",           body:"Labor Condition Application public posting for 3 employees ends in 7 days.", is_read:false, created_at: new Date(Date.now()-518400000).toISOString(), cta_primary:"View Details" },
];

// ── Category config ───────────────────────────────────────────────────────────
const CAT_CONFIG: Record<HRNotifCategory, { bg: string; color: string; label: string; icon: React.ReactNode }> = {
  approval:    { bg:"#eef2ff", color:"#4338ca", label:"Approval",    icon:<FileCheck size={16} /> },
  case_update: { bg:"#f0fdf4", color:"#15803d", label:"Case Update", icon:<Briefcase size={16} /> },
  employee:    { bg:"#eff6ff", color:"#1d4ed8", label:"Employee",    icon:<Users size={16} /> },
  compliance:  { bg:"#fef2f2", color:"#dc2626", label:"Compliance",  icon:<ShieldAlert size={16} /> },
  system:      { bg:"#f8fafc", color:"#64748b", label:"System",      icon:<Bell size={16} /> },
};

const PRIORITY_CONFIG: Record<HRNotifPriority, { bg: string; text: string; label: string }> = {
  urgent: { bg:"#fef2f2", text:"#dc2626", label:"URGENT" },
  high:   { bg:"#fff7ed", text:"#c2410c", label:"HIGH"   },
  medium: { bg:"#eff6ff", text:"#2563eb", label:"MEDIUM" },
  low:    { bg:"#f0fdf4", text:"#15803d", label:"LOW"    },
};

const TABS: { id: TabFilter; label: string }[] = [
  { id:"all",         label:"All"          },
  { id:"approval",    label:"Approvals"    },
  { id:"case_update", label:"Case Updates" },
  { id:"employee",    label:"Employees"    },
  { id:"compliance",  label:"Compliance"   },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
function timeAgo(iso: string): string {
  const diff = Math.floor((Date.now() - +new Date(iso)) / 60000);
  if (diff < 1) return "Just now";
  if (diff < 60) return `${diff}m ago`;
  const hrs = Math.floor(diff / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return "Yesterday";
  return `${days}d ago`;
}

// ── Stat card ─────────────────────────────────────────────────────────────────
function StatCard({ value, label, badge, badgeCls, iconBg, iconColor, icon }: {
  value: number; label: string; badge: string; badgeCls: string;
  iconBg: string; iconColor: string; icon: React.ReactNode;
}) {
  return (
    <div className="bg-white border border-[#e5e7eb] rounded-[12px] p-[16px] sm:p-[20px] flex flex-col gap-[8px] flex-1 min-w-0">
      <div className="flex items-center justify-between">
        <div className={`w-[44px] h-[44px] rounded-[10px] flex items-center justify-center flex-shrink-0`}
          style={{ backgroundColor: iconBg, color: iconColor }}>{icon}</div>
        <span className={`text-[10px] sm:text-[11px] font-semibold px-[8px] py-[3px] rounded-full ${badgeCls}`}>{badge}</span>
      </div>
      <p className="text-[26px] sm:text-[30px] font-bold text-[#111827] leading-none mt-[4px]">{value}</p>
      <p className="text-[11px] sm:text-[13px] text-[#6b7280] leading-tight">{label}</p>
    </div>
  );
}

// ── Toggle ────────────────────────────────────────────────────────────────────
function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button onClick={onChange}
      className="relative w-[44px] h-[24px] rounded-full transition-colors flex-shrink-0"
      style={{ backgroundColor: checked ? "var(--theme-primary)" : "#e5e7eb" }}>
      <div className={`absolute top-[2px] w-[20px] h-[20px] bg-white rounded-full shadow-sm transition-transform ${checked ? "translate-x-[22px]" : "translate-x-[2px]"}`} />
    </button>
  );
}

// ── Notification row ──────────────────────────────────────────────────────────
function NotifRow({ notif, onMarkRead, onDismiss }: {
  notif: HRNotification;
  onMarkRead: (id: string) => void;
  onDismiss:  (id: string) => void;
}) {
  const cat  = CAT_CONFIG[notif.category];
  const prio = PRIORITY_CONFIG[notif.priority];

  return (
    <div className={`border-b border-[#f3f4f6] last:border-0 ${!notif.is_read ? "bg-[#fafbff]" : "bg-white"}`}>
      <div className="px-[16px] sm:px-[24px] py-[16px] sm:py-[20px]">
        <div className="flex items-start gap-[12px] sm:gap-[14px]">
          {/* Icon */}
          <div className="w-[40px] h-[40px] sm:w-[44px] sm:h-[44px] rounded-[10px] flex items-center justify-center flex-shrink-0 mt-[2px]"
            style={{ backgroundColor: cat.bg, color: cat.color }}>
            {cat.icon}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start gap-[6px] flex-wrap">
              <h3 className="text-[13px] sm:text-[14px] font-semibold text-[#111827] flex-1 min-w-0 leading-[20px]">
                {notif.title}
              </h3>
              {(notif.priority === "urgent" || notif.priority === "high") && (
                <span className="text-[10px] font-bold px-[7px] py-[2px] rounded-full flex-shrink-0"
                  style={{ backgroundColor: prio.bg, color: prio.text }}>
                  {prio.label}
                </span>
              )}
              {!notif.is_read && (
                <div className="w-[7px] h-[7px] rounded-full flex-shrink-0 mt-[6px]"
                  style={{ backgroundColor: "var(--theme-primary)" }} />
              )}
            </div>

            <p className="text-[12px] sm:text-[13px] text-[#6b7280] mt-[4px] leading-[18px] sm:leading-[20px]">
              {notif.body}
            </p>

            <div className="flex items-center flex-wrap gap-[8px] sm:gap-[10px] mt-[8px]">
              {notif.actor_label && (
                <span className="text-[11px] font-medium" style={{ color: "var(--theme-primary)" }}>
                  {notif.actor_label}
                </span>
              )}
              {notif.ref_label && (
                <span className="text-[11px] text-[#94a3b8] bg-[#f1f5f9] px-[8px] py-[2px] rounded-full">
                  {notif.ref_label}
                </span>
              )}
              <span className="text-[11px] text-[#9ca3af]">{timeAgo(notif.created_at)}</span>
            </div>
          </div>

          <button onClick={() => onDismiss(notif.id)}
            className="text-[#d1d5db] hover:text-[#6b7280] transition flex-shrink-0 mt-[2px] p-[4px]">
            <MoreVertical size={14} />
          </button>
        </div>

        {/* CTAs */}
        {(notif.cta_primary || notif.cta_secondary) && (
          <div className="flex items-center flex-wrap gap-[8px] mt-[12px] ml-[52px] sm:ml-[58px]">
            {notif.cta_primary && (
              <button onClick={() => onMarkRead(notif.id)}
                className="text-[12px] sm:text-[13px] font-medium px-[14px] py-[6px] rounded-[8px] text-white hover:opacity-90 transition"
                style={{ background: "linear-gradient(135deg, var(--theme-primary) 0%, var(--theme-gradient-end) 100%)" }}>
                {notif.cta_primary}
              </button>
            )}
            {notif.cta_secondary && (
              <button onClick={() => onMarkRead(notif.id)}
                className="text-[12px] sm:text-[13px] font-medium px-[14px] py-[6px] rounded-[8px] border border-[#e5e7eb] text-[#374151] hover:bg-[#f9fafb] transition">
                {notif.cta_secondary}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function HRNotificationsCenter() {
  const [notifs,    setNotifs]    = useState<HRNotification[]>(MOCK_NOTIFS);
  const [activeTab, setActiveTab] = useState<TabFilter>("all");
  const [prefs,     setPrefs]     = useState({ email: true, push: true, sms: false });

  const unread   = notifs.filter(n => !n.is_read).length;
//   const urgent   = notifs.filter(n => n.priority === "urgent").length;
  const pending  = notifs.filter(n => n.category === "approval" && !n.is_read).length;
  const empCount = notifs.filter(n => n.category === "employee").length;

  const filtered = useMemo(() =>
    notifs.filter(n => activeTab === "all" || n.category === activeTab),
    [notifs, activeTab]
  );

  const markRead = (id: string) =>
    setNotifs(p => p.map(n => n.id === id ? { ...n, is_read: true } : n));

  const markAllRead = () =>
    setNotifs(p => p.map(n => ({ ...n, is_read: true })));

  const dismiss = (id: string) =>
    setNotifs(p => p.filter(n => n.id !== id));

  // Right sidebar data
  const pendingApprovals = notifs.filter(n => n.category === "approval" && !n.is_read);
  const complianceAlerts = notifs.filter(n => n.category === "compliance");

  return (
    <div className="flex flex-col h-full" style={{ fontFamily: "Inter, sans-serif" }}>
      <PageHeader
        title="Notifications"
        subtitle="Company-wide alerts, approvals, and compliance updates"
        showSearch={false}
        actions={
          <button onClick={markAllRead}
            className="flex items-center gap-[6px] text-[12px] sm:text-[13px] font-medium transition"
            style={{ color: "var(--theme-primary)" }}>
            <CheckCheck size={14} />
            <span className="hidden sm:inline">Mark All Read</span>
            <span className="sm:hidden">Mark All</span>
          </button>
        }
      />

      <PageContent>
        <div className="flex flex-col gap-[20px] sm:gap-[24px]">

          {/* ── Stat cards ── */}
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-[12px] sm:gap-[16px]">
            <StatCard value={pending}  label="Pending Approvals"       badge="Action"    badgeCls="bg-[#fef2f2] text-[#dc2626]"   iconBg="#fef2f2" iconColor="#dc2626" icon={<FileCheck size={18} />} />
            <StatCard value={unread}   label="Unread Notifications"     badge="New"       badgeCls="bg-[#eff6ff] text-[#2563eb]"   iconBg="#eff6ff" iconColor="#2563eb" icon={<Bell size={18} />} />
            <StatCard value={empCount} label="Employee Activity"        badge="This Week" badgeCls="bg-[#f0fdf4] text-[#15803d]"   iconBg="#f0fdf4" iconColor="#15803d" icon={<Users size={18} />} />
            <StatCard value={complianceAlerts.length} label="Compliance Alerts" badge="Review" badgeCls="bg-[#fff7ed] text-[#c2410c]" iconBg="#fff7ed" iconColor="#c2410c" icon={<ShieldAlert size={18} />} />
          </div>

          {/* ── Main grid ── */}
          <div className="flex flex-col xl:flex-row gap-[20px] sm:gap-[24px] items-start">

            {/* Notification list */}
            <div className="flex-1 min-w-0 w-full">
              <div className="bg-white border border-[#e5e7eb] rounded-[12px] overflow-hidden">

                {/* Toolbar */}
                <div className="px-[14px] sm:px-[16px] pt-[14px] sm:pt-[16px] pb-0 border-b border-[#e5e7eb]">
                  <div className="flex items-center justify-between mb-[10px]">
                    <h2 className="text-[14px] sm:text-[16px] font-bold text-[#111827]">
                      All Notifications
                      {unread > 0 && (
                        <span className="ml-[8px] text-[11px] font-bold px-[7px] py-[2px] rounded-full text-white"
                          style={{ background: "var(--theme-primary)" }}>{unread}</span>
                      )}
                    </h2>
                    <div className="flex items-center gap-[6px]">
                      <button className="flex items-center gap-[4px] text-[12px] font-medium text-[#374151] border border-[#e5e7eb] rounded-[8px] px-[10px] py-[6px] hover:bg-[#f9fafb] transition">
                        <Filter size={12} /><span className="hidden sm:inline">Filter</span>
                      </button>
                      <button className="flex items-center gap-[4px] text-[12px] font-medium text-[#374151] border border-[#e5e7eb] rounded-[8px] px-[10px] py-[6px] hover:bg-[#f9fafb] transition">
                        <Settings size={12} /><span className="hidden sm:inline">Settings</span>
                      </button>
                    </div>
                  </div>

                  {/* Tabs */}
                  <div className="flex items-center gap-[2px] overflow-x-auto pb-[1px]">
                    {TABS.map(tab => (
                      <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                        className={`text-[12px] sm:text-[13px] font-medium px-[12px] sm:px-[14px] py-[7px] sm:py-[8px]
                                    rounded-t-[6px] whitespace-nowrap transition border-b-2 ${
                          activeTab === tab.id
                            ? "border-[var(--theme-primary)] bg-[var(--theme-light)] text-[var(--theme-dark)]"
                            : "border-transparent text-[#6b7280] hover:text-[#374151]"
                        }`}>
                        {tab.label}
                        {tab.id === "all" && unread > 0 && (
                          <span className="ml-[5px] text-[10px] text-white rounded-full px-[5px] py-[1px]"
                            style={{ background: "var(--theme-primary)" }}>{unread}</span>
                        )}
                        {tab.id === "approval" && pending > 0 && (
                          <span className="ml-[5px] text-[10px] bg-[#fef2f2] text-[#dc2626] rounded-full px-[5px] py-[1px] font-bold">{pending}</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Rows */}
                {filtered.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-[48px]">
                    <div className="w-[48px] h-[48px] bg-[#f1f5f9] rounded-full flex items-center justify-center mb-[12px] text-[#9ca3af]"><Bell size={20} /></div>
                    <p className="text-[14px] font-medium text-[#374151]">No notifications</p>
                    <p className="text-[12px] text-[#9ca3af] mt-[4px]">You're all caught up!</p>
                  </div>
                ) : (
                  filtered.map(n => <NotifRow key={n.id} notif={n} onMarkRead={markRead} onDismiss={dismiss} />)
                )}

                <div className="flex items-center justify-center py-[16px] border-t border-[#f3f4f6]">
                  <p className="text-[12px] text-[#9ca3af]">You've seen all notifications</p>
                </div>
              </div>
            </div>

            {/* ── Right sidebar ── */}
            <div className="hidden xl:flex flex-col gap-[16px] w-[300px] 2xl:w-[320px] flex-shrink-0">

              {/* Pending Approvals */}
              <div className="bg-white border border-[#e5e7eb] rounded-[12px] p-[20px]">
                <div className="flex items-center gap-[8px] mb-[14px]">
                  <div className="w-[36px] h-[36px] rounded-[8px] flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: "var(--theme-light)", color: "var(--theme-primary)" }}>
                    <ClipboardList size={16} />
                  </div>
                  <div>
                    <h3 className="text-[14px] font-bold text-[#111827]">Pending Approvals</h3>
                    <p className="text-[11px] text-[#9ca3af]">{pendingApprovals.length} need your action</p>
                  </div>
                </div>
                {pendingApprovals.length === 0 ? (
                  <p className="text-[13px] text-[#9ca3af]">No pending approvals</p>
                ) : (
                  <div className="flex flex-col gap-[8px]">
                    {pendingApprovals.slice(0, 3).map(n => (
                      <div key={n.id} className="bg-[#f8fafc] border border-[#f1f5f9] rounded-[10px] p-[12px] hover:bg-[#f0f5ff] transition cursor-pointer">
                        <p className="text-[12px] font-semibold text-[#111827] leading-[16px]">{n.title}</p>
                        {n.actor_label && <p className="text-[11px] text-[#64748b] mt-[2px]">{n.actor_label}</p>}
                        <div className="flex items-center justify-between mt-[8px]">
                          <span className="text-[10px] font-bold px-[6px] py-[2px] rounded-full bg-[#fef2f2] text-[#dc2626]">
                            {PRIORITY_CONFIG[n.priority].label}
                          </span>
                          <button onClick={() => markRead(n.id)}
                            className="text-[11px] font-medium transition" style={{ color: "var(--theme-primary)" }}>
                            Review →
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {pendingApprovals.length > 3 && (
                  <button onClick={() => setActiveTab("approval")}
                    className="flex items-center gap-[4px] text-[12px] font-medium mt-[12px] transition"
                    style={{ color: "var(--theme-primary)" }}>
                    View all {pendingApprovals.length} <ChevronRight size={12} />
                  </button>
                )}
              </div>

              {/* Compliance Alerts */}
              <div className="bg-white border border-[#e5e7eb] rounded-[12px] p-[20px]">
                <div className="flex items-center gap-[8px] mb-[14px]">
                  <div className="w-[36px] h-[36px] bg-[#fef2f2] text-[#dc2626] rounded-[8px] flex items-center justify-center flex-shrink-0">
                    <ShieldAlert size={16} />
                  </div>
                  <div>
                    <h3 className="text-[14px] font-bold text-[#111827]">Compliance Alerts</h3>
                    <p className="text-[11px] text-[#9ca3af]">Items requiring attention</p>
                  </div>
                </div>
                {complianceAlerts.length === 0 ? (
                  <div className="flex items-center gap-[8px] bg-[#f0fdf4] rounded-[8px] p-[12px]">
                    <Check size={14} className="text-[#15803d]" />
                    <p className="text-[12px] text-[#15803d] font-medium">All compliance items are current</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-[8px]">
                    {complianceAlerts.map(n => (
                      <div key={n.id} className="flex items-start gap-[8px] py-[10px] border-b border-[#f3f4f6] last:border-0">
                        <div className="w-[6px] h-[6px] rounded-full bg-[#ef4444] shrink-0 mt-[5px]" />
                        <div className="min-w-0">
                          <p className="text-[12px] font-semibold text-[#111827] leading-[16px]">{n.title}</p>
                          <p className="text-[11px] text-[#6b7280] mt-[2px] leading-[15px] line-clamp-2">{n.body}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Notification Preferences */}
              <div className="bg-white border border-[#e5e7eb] rounded-[12px] p-[20px]">
                <h3 className="text-[14px] font-bold text-[#111827] mb-[14px] flex items-center gap-[8px]">
                  <Settings size={14} className="text-[#64748b]" /> Preferences
                </h3>
                <div className="flex flex-col gap-[14px]">
                  {[
                    { label: "Email Alerts",        sub: "Approval requests & compliance", key: "email" as const },
                    { label: "Push Notifications",  sub: "Real-time browser alerts",       key: "push"  as const },
                    { label: "SMS for Urgent",       sub: "Critical compliance only",       key: "sms"   as const },
                  ].map(p => (
                    <div key={p.key} className="flex items-center justify-between gap-[10px]">
                      <div className="min-w-0">
                        <p className="text-[12px] font-medium text-[#111827]">{p.label}</p>
                        <p className="text-[11px] text-[#9ca3af]">{p.sub}</p>
                      </div>
                      <Toggle checked={prefs[p.key]} onChange={() => setPrefs(prev => ({ ...prev, [p.key]: !prev[p.key] }))} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick stats */}
              <div className="bg-white border border-[#e5e7eb] rounded-[12px] p-[20px]">
                <div className="flex items-center gap-[8px] mb-[14px]">
                  <div className="w-[36px] h-[36px] bg-[#f0fdf4] text-[#15803d] rounded-[8px] flex items-center justify-center">
                    <TrendingUp size={16} />
                  </div>
                  <h3 className="text-[14px] font-bold text-[#111827]">This Month</h3>
                </div>
                {[
                  { label: "Cases approved",     value: 4,  color: "#15803d" },
                  { label: "Employees onboarded", value: 2,  color: "#1d4ed8" },
                  { label: "Documents verified",  value: 18, color: "#7c3aed" },
                  { label: "Pending actions",     value: pending, color: "#dc2626" },
                ].map(s => (
                  <div key={s.label} className="flex items-center justify-between py-[8px] border-b border-[#f3f4f6] last:border-0">
                    <span className="text-[12px] text-[#6b7280]">{s.label}</span>
                    <span className="text-[13px] font-bold" style={{ color: s.color }}>{s.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </PageContent>
    </div>
  );
}