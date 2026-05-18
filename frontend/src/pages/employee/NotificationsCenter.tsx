import { useState, useEffect, type ReactNode } from 'react';
import EmployeeLayout from '../../components/layout/EmployeeLayout';
import { Button } from '../../components/ui/Button';
import {
  Bell, X, Filter, Info, CheckCircle, AlertTriangle, MessageSquare,
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
}

const mockNotifs: Notif[] = [
  { id: '1', type: 'warning', title: 'Action Required', message: 'Please upload the employment verification letter for case GC-2024-032 within 7 days.', time: '2 hours ago', read: false },
  { id: '2', type: 'message', title: 'New Message from Sarah Mitchell', message: 'I reviewed your documents and everything looks good. We need one more document.', time: '3 hours ago', read: false },
  { id: '3', type: 'success', title: 'Document Verified', message: 'Your passport copy has been verified for case H1B-2024-001.', time: '1 day ago', read: true },
  { id: '4', type: 'info', title: 'Case Status Update', message: 'Case H1B-2024-001 moved to attorney review stage.', time: '2 days ago', read: true },
  { id: '5', type: 'success', title: 'OPT Extension Approved', message: 'Your OPT STEM extension (OPT-2024-019) has been approved by USCIS!', time: '3 days ago', read: true },
  { id: '6', type: 'warning', title: 'Upcoming Deadline', message: 'Your H-4 EAD expires in 90 days. Start the renewal process now.', time: '5 days ago', read: true },
];

type FilterTab = 'All' | 'Unread' | 'Actions' | 'Messages' | 'Updates';

function Card({ children, className = '', padding = 'md' }: { children: ReactNode; className?: string; padding?: 'none' | 'sm' | 'md' | 'lg' }) {
  const p = { none: '', sm: 'p-4', md: 'p-6', lg: 'p-8' };
  return <div className={`bg-white rounded-xl border border-gray-200 shadow-sm ${p[padding]} ${className}`}>{children}</div>;
}

function typeIcon(type: NType) {
  if (type === 'info') return <Info size={16} className="text-blue-600" />;
  if (type === 'success') return <CheckCircle size={16} className="text-green-600" />;
  if (type === 'warning') return <AlertTriangle size={16} className="text-amber-500" />;
  return <MessageSquare size={16} className="text-indigo-600" />;
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
    info: 'Update', success: 'Success', warning: 'Action', message: 'Message',
  };
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${map[type]}`}>
      {labels[type]}
    </span>
  );
}

export default function NotificationsCenter() {
  const [notifs, setNotifs] = useState<Notif[]>(mockNotifs);
  const [activeFilter, setActiveFilter] = useState<FilterTab>('All');
  const [hoveredId, setHoveredId] = useState<string | null>(null);

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
      .catch(() => {/* fallback to mock already set */});
  }, []);

  const unreadCount = notifs.filter((n) => !n.read).length;

  const markAllRead = () => setNotifs((prev) => prev.map((n) => ({ ...n, read: true })));

  const markRead = (id: string) => setNotifs((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));

  const dismiss = (id: string) => setNotifs((prev) => prev.filter((n) => n.id !== id));

  const filtered = notifs.filter((n) => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Unread') return !n.read;
    if (activeFilter === 'Actions') return n.type === 'warning';
    if (activeFilter === 'Messages') return n.type === 'message';
    if (activeFilter === 'Updates') return n.type === 'info' || n.type === 'success';
    return true;
  });

  const tabs: FilterTab[] = ['All', 'Unread', 'Actions', 'Messages', 'Updates'];

  return (
    <EmployeeLayout>
      <div className="max-w-3xl mx-auto space-y-6">
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
          </div>
        </div>

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

        {/* Notification list */}
        <Card padding="none">
          {filtered.length === 0 ? (
            <div className="p-12 text-center">
              <Bell size={40} className="mx-auto mb-3 text-gray-300" />
              <p className="text-gray-500 font-medium">No notifications</p>
              <p className="text-sm text-gray-400 mt-1">You're all caught up!</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {filtered.map((n) => (
                <li
                  key={n.id}
                  className={[
                    'relative flex gap-4 p-4 cursor-pointer hover:bg-gray-50 transition-colors',
                    !n.read ? 'border-l-4 border-l-indigo-500' : 'border-l-4 border-l-transparent',
                  ].join(' ')}
                  onClick={() => markRead(n.id)}
                  onMouseEnter={() => setHoveredId(n.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  {/* Icon */}
                  <div className={`shrink-0 w-9 h-9 rounded-full flex items-center justify-center ${typeIconBg(n.type)}`}>
                    {typeIcon(n.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-sm font-semibold ${!n.read ? 'text-gray-900' : 'text-gray-700'}`}>
                        {n.title}
                      </span>
                      {!n.read && (
                        <span className="w-2 h-2 bg-indigo-600 rounded-full shrink-0" />
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mt-0.5 leading-relaxed">{n.message}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-xs text-gray-400">{n.time}</span>
                      {typeBadge(n.type)}
                    </div>
                  </div>

                  {/* Dismiss */}
                  {hoveredId === n.id && (
                    <button
                      className="shrink-0 p-1.5 rounded-lg hover:bg-gray-200 text-gray-400 hover:text-gray-600 transition-colors"
                      onClick={(e) => { e.stopPropagation(); dismiss(n.id); }}
                    >
                      <X size={15} />
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </Card>

        {/* Footer */}
        <p className="text-sm text-gray-500 text-center">
          Showing <span className="font-medium">{filtered.length}</span> of{' '}
          <span className="font-medium">{notifs.length}</span> notifications
        </p>
      </div>
    </EmployeeLayout>
  );
}
