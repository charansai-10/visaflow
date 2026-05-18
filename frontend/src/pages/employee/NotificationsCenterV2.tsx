import { useState, useEffect, type ReactNode } from 'react';
import EmployeeLayout from '../../components/layout/EmployeeLayout';
import { Button } from '../../components/ui/Button';
import {
  Bell, X, Filter, Info, CheckCircle, AlertTriangle, MessageSquare,
  Settings, ArrowLeft, ExternalLink, ChevronRight,
} from 'lucide-react';
import { getNotifications } from '../../api/notifications.api';

type NType = 'info' | 'success' | 'warning' | 'message';

interface Notif {
  id: string;
  type: NType;
  title: string;
  message: string;
  time: string;
  read: boolean;
  caseRef?: string;
}

const mockNotifs: Notif[] = [
  { id: '1', type: 'warning', title: 'Action Required', message: 'Please upload the employment verification letter for case GC-2024-032 within 7 days.', time: '2 hours ago', read: false, caseRef: 'GC-2024-032' },
  { id: '2', type: 'message', title: 'New Message from Sarah Mitchell', message: 'I reviewed your documents and everything looks good. We need one more document.', time: '3 hours ago', read: false },
  { id: '3', type: 'success', title: 'Document Verified', message: 'Your passport copy has been verified for case H1B-2024-001.', time: '1 day ago', read: true, caseRef: 'H1B-2024-001' },
  { id: '4', type: 'info', title: 'Case Status Update', message: 'Case H1B-2024-001 moved to attorney review stage.', time: '2 days ago', read: true, caseRef: 'H1B-2024-001' },
  { id: '5', type: 'success', title: 'OPT Extension Approved', message: 'Your OPT STEM extension (OPT-2024-019) has been approved by USCIS!', time: '3 days ago', read: true, caseRef: 'OPT-2024-019' },
  { id: '6', type: 'warning', title: 'Upcoming Deadline', message: 'Your H-4 EAD expires in 90 days. Start the renewal process now.', time: '5 days ago', read: true },
];

type FilterTab = 'All' | 'Unread' | 'Actions' | 'Messages' | 'Updates';

function Card({ children, className = '', padding = 'md' }: { children: ReactNode; className?: string; padding?: 'none' | 'sm' | 'md' | 'lg' }) {
  const p = { none: '', sm: 'p-4', md: 'p-6', lg: 'p-8' };
  return <div className={`bg-white rounded-xl border border-gray-200 shadow-sm ${p[padding]} ${className}`}>{children}</div>;
}

function typeIcon(type: NType, size = 16) {
  if (type === 'info') return <Info size={size} className="text-blue-600" />;
  if (type === 'success') return <CheckCircle size={size} className="text-green-600" />;
  if (type === 'warning') return <AlertTriangle size={size} className="text-amber-500" />;
  return <MessageSquare size={size} className="text-indigo-600" />;
}

function typeIconBg(type: NType) {
  if (type === 'info') return 'bg-blue-100';
  if (type === 'success') return 'bg-green-100';
  if (type === 'warning') return 'bg-amber-100';
  return 'bg-indigo-100';
}

function typeBadge(type: NType) {
  const map: Record<NType, string> = {
    info: 'bg-blue-100 text-blue-700',
    success: 'bg-green-100 text-green-700',
    warning: 'bg-amber-100 text-amber-700',
    message: 'bg-indigo-100 text-indigo-700',
  };
  const labels: Record<NType, string> = {
    info: 'Update', success: 'Success', warning: 'Action Required', message: 'Message',
  };
  return (
    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${map[type]}`}>
      {labels[type]}
    </span>
  );
}

interface PrefToggles {
  email: boolean;
  push: boolean;
  sms: boolean;
}

function Toggle({ active, onToggle }: { active: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className={`relative inline-flex w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${active ? 'bg-indigo-600' : 'bg-gray-300'}`}
    >
      <span
        className={`inline-block w-5 h-5 bg-white rounded-full shadow transform transition-transform duration-200 mt-0.5 ${active ? 'translate-x-5' : 'translate-x-0.5'}`}
      />
    </button>
  );
}

export default function NotificationsCenterV2() {
  const [notifs, setNotifs] = useState<Notif[]>(mockNotifs);
  const [activeFilter, setActiveFilter] = useState<FilterTab>('All');
  const [selected, setSelected] = useState<Notif | null>(null);
  const [showPrefs, setShowPrefs] = useState(false);
  const [prefs, setPrefs] = useState<PrefToggles>({ email: true, push: true, sms: false });

  useEffect(() => {
    getNotifications()
      .then((res) => {
        const data = res.data.data.map((n) => ({
          id: n.id,
          type: (n.type === 'error' ? 'warning' : n.type) as NType,
          title: n.title,
          message: n.message,
          time: new Date(n.created_at).toLocaleDateString(),
          read: n.read,
        }));
        if (data.length > 0) setNotifs(data);
      })
      .catch(() => {/* fallback to mock */});
  }, []);

  const unreadCount = notifs.filter((n) => !n.read).length;

  const markAllRead = () => setNotifs((prev) => prev.map((n) => ({ ...n, read: true })));

  const markRead = (id: string) => setNotifs((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));

  const dismiss = (id: string) => {
    setNotifs((prev) => prev.filter((n) => n.id !== id));
    if (selected?.id === id) setSelected(null);
  };

  const handleSelect = (n: Notif) => {
    markRead(n.id);
    setSelected(n);
  };

  const filtered = notifs.filter((n) => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Unread') return !n.read;
    if (activeFilter === 'Actions') return n.type === 'warning';
    if (activeFilter === 'Messages') return n.type === 'message';
    if (activeFilter === 'Updates') return n.type === 'info' || n.type === 'success';
    return true;
  });

  const tabs: FilterTab[] = ['All', 'Unread', 'Actions', 'Messages', 'Updates'];

  const togglePref = (key: keyof PrefToggles) => setPrefs((p) => ({ ...p, [key]: !p[key] }));

  /* ─── Mobile: show detail panel over list ─── */
  const mobileDetailOpen = selected !== null;

  return (
    <EmployeeLayout>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
            {unreadCount > 0 && (
              <span className="bg-indigo-600 text-white text-xs font-bold px-2.5 py-0.5 rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" onClick={markAllRead}>
                Mark all read
              </Button>
            )}
            <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors">
              <Filter size={18} />
            </button>
            <button
              onClick={() => setShowPrefs((v) => !v)}
              className={`p-2 rounded-lg transition-colors ${showPrefs ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-gray-100 text-gray-500'}`}
            >
              <Settings size={18} />
            </button>
          </div>
        </div>

        {/* Inline preferences */}
        {showPrefs && (
          <Card padding="md">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Notification Preferences</h3>
            <div className="space-y-3">
              {(['email', 'push', 'sms'] as const).map((key) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 capitalize">{key} Notifications</span>
                  <Toggle active={prefs[key]} onToggle={() => togglePref(key)} />
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Filter pills */}
        <div className="flex gap-2 flex-wrap">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className={[
                'px-4 py-1.5 rounded-full text-sm font-medium transition-colors',
                activeFilter === tab
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50',
              ].join(' ')}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Two-column layout */}
        <div className="flex gap-4 relative">
          {/* Left: notification list — hidden on mobile when detail open */}
          <div className={`flex-shrink-0 w-full lg:w-96 ${mobileDetailOpen ? 'hidden lg:block' : 'block'}`}>
            <Card padding="none">
              {filtered.length === 0 ? (
                <div className="p-12 text-center">
                  <Bell size={40} className="mx-auto mb-3 text-gray-300" />
                  <p className="text-gray-500 font-medium">No notifications</p>
                </div>
              ) : (
                <ul className="divide-y divide-gray-100">
                  {filtered.map((n) => (
                    <li
                      key={n.id}
                      className={[
                        'relative flex gap-3 p-4 cursor-pointer transition-colors',
                        !n.read ? 'border-l-4 border-l-indigo-500' : 'border-l-4 border-l-transparent',
                        selected?.id === n.id ? 'bg-indigo-50' : 'hover:bg-gray-50',
                      ].join(' ')}
                      onClick={() => handleSelect(n)}
                    >
                      <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${typeIconBg(n.type)}`}>
                        {typeIcon(n.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className={`text-sm font-semibold truncate ${!n.read ? 'text-gray-900' : 'text-gray-700'}`}>
                            {n.title}
                          </span>
                          {!n.read && <span className="w-2 h-2 bg-indigo-600 rounded-full shrink-0" />}
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{n.message}</p>
                        <span className="text-xs text-gray-400 mt-1 block">{n.time}</span>
                      </div>
                      <ChevronRight size={14} className="shrink-0 text-gray-300 self-center" />
                    </li>
                  ))}
                </ul>
              )}
            </Card>
            <p className="text-xs text-gray-400 text-center mt-3">
              Showing {filtered.length} of {notifs.length}
            </p>
          </div>

          {/* Right: detail panel */}
          <div className={`flex-1 min-w-0 ${mobileDetailOpen ? 'block' : 'hidden lg:block'}`}>
            {selected ? (
              <Card padding="lg" className="h-full">
                {/* Mobile back */}
                <button
                  className="lg:hidden flex items-center gap-1.5 text-sm text-indigo-600 font-medium mb-4"
                  onClick={() => setSelected(null)}
                >
                  <ArrowLeft size={16} /> Back
                </button>

                {/* Detail header */}
                <div className="flex items-start gap-4 mb-6">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${typeIconBg(selected.type)}`}>
                    {typeIcon(selected.type, 22)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-lg font-bold text-gray-900">{selected.title}</h2>
                    <p className="text-sm text-gray-500 mt-0.5">{selected.time}</p>
                  </div>
                  {typeBadge(selected.type)}
                </div>

                {/* Full message */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <p className="text-sm text-gray-700 leading-relaxed">{selected.message}</p>
                </div>

                {/* Related case */}
                {selected.caseRef && (
                  <div className="flex items-center gap-2 mb-6 p-3 bg-indigo-50 rounded-lg border border-indigo-100">
                    <span className="text-sm text-indigo-700 font-medium">Related Case:</span>
                    <span className="text-sm text-indigo-600 font-semibold">{selected.caseRef}</span>
                    <ExternalLink size={13} className="text-indigo-400 ml-auto" />
                  </div>
                )}

                {/* Action buttons */}
                <div className="flex gap-3 flex-wrap">
                  {selected.caseRef && (
                    <Button variant="primary" size="sm">
                      View Case
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => { dismiss(selected.id); setSelected(null); }}
                  >
                    <X size={14} /> Dismiss
                  </Button>
                </div>
              </Card>
            ) : (
              <Card padding="lg" className="h-full flex flex-col items-center justify-center min-h-64 text-center">
                <Bell size={40} className="text-gray-200 mb-3" />
                <p className="text-gray-500 font-medium">Select a notification</p>
                <p className="text-sm text-gray-400 mt-1">Click any notification to view details here</p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </EmployeeLayout>
  );
}
