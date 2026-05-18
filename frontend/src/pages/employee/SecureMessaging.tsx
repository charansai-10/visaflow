import { useState, useRef, useEffect, type ReactNode } from 'react';
import { Search, Send, Paperclip, Phone, Video, MoreVertical, Check, CheckCheck } from 'lucide-react';
import EmployeeLayout from '../../components/layout/EmployeeLayout';

interface Message {
  id: string;
  content: string;
  sender: 'me' | 'them';
  time: string;
  status: 'sent' | 'delivered' | 'read';
}

interface Contact {
  id: string;
  name: string;
  role: string;
  avatar: string;
  online: boolean;
  lastMessage: string;
  lastTime: string;
  unread: number;
  messages: Message[];
}

const contacts: Contact[] = [
  {
    id: '1', name: 'Sarah Mitchell', role: 'Immigration Attorney', avatar: 'SM', online: true,
    lastMessage: 'I reviewed your documents and everything looks good.', lastTime: '3h', unread: 2,
    messages: [
      { id: 'm1', content: 'Hello! I wanted to follow up on your H-1B case. I\'ve received all the documents you uploaded.', sender: 'them', time: '10:30 AM', status: 'read' },
      { id: 'm2', content: 'Great, thank you! Is there anything else you need from me?', sender: 'me', time: '10:45 AM', status: 'read' },
      { id: 'm3', content: 'I reviewed your documents and everything looks good. We just need the employment verification letter from your current employer.', sender: 'them', time: '11:02 AM', status: 'read' },
      { id: 'm4', content: 'The letter needs to be on company letterhead and signed by HR. Can you get that to me by Friday?', sender: 'them', time: '11:03 AM', status: 'read' },
      { id: 'm5', content: 'Absolutely, I\'ll get that to you by Thursday.', sender: 'me', time: '11:15 AM', status: 'delivered' },
    ],
  },
  {
    id: '2', name: 'James Chen', role: 'Case Manager', avatar: 'JC', online: false,
    lastMessage: 'Your priority date is now current.', lastTime: '1d', unread: 0,
    messages: [
      { id: 'm1', content: 'I wanted to let you know that your GC-2024-032 case has been updated.', sender: 'them', time: 'Yesterday', status: 'read' },
      { id: 'm2', content: 'Your priority date is now current. We can proceed with the I-485 filing.', sender: 'them', time: 'Yesterday', status: 'read' },
      { id: 'm3', content: 'That\'s wonderful news! What are the next steps?', sender: 'me', time: 'Yesterday', status: 'read' },
    ],
  },
  {
    id: '3', name: 'Lisa Park', role: 'Immigration Attorney', avatar: 'LP', online: true,
    lastMessage: 'OPT extension approved!', lastTime: '3d', unread: 0,
    messages: [
      { id: 'm1', content: 'Great news! Your OPT STEM extension application has been approved by USCIS.', sender: 'them', time: '3 days ago', status: 'read' },
      { id: 'm2', content: 'Thank you so much! What\'s the validity period?', sender: 'me', time: '3 days ago', status: 'read' },
      { id: 'm3', content: 'You have 24 months of additional OPT authorization. Your new EAD card will arrive in 2-3 weeks.', sender: 'them', time: '3 days ago', status: 'read' },
    ],
  },
];

function Avatar({ initials, size = 'md', online }: { initials: string; size?: 'sm' | 'md' | 'lg'; online?: boolean }) {
  const sizes = { sm: 'w-8 h-8 text-xs', md: 'w-10 h-10 text-sm', lg: 'w-12 h-12 text-base' };
  const dotSizes = { sm: 'w-2 h-2', md: 'w-2.5 h-2.5', lg: 'w-3 h-3' };
  return (
    <div className="relative shrink-0">
      <div className={`${sizes[size]} rounded-full bg-indigo-100 text-indigo-700 font-semibold flex items-center justify-center`}>
        {initials}
      </div>
      {online !== undefined && (
        <span className={`absolute bottom-0 right-0 ${dotSizes[size]} rounded-full border-2 border-white ${online ? 'bg-emerald-500' : 'bg-gray-300'}`} />
      )}
    </div>
  );
}

function MessageStatus({ status }: { status: Message['status'] }) {
  if (status === 'read') return <CheckCheck size={12} className="text-indigo-400" />;
  if (status === 'delivered') return <CheckCheck size={12} className="text-gray-400" />;
  return <Check size={12} className="text-gray-400" />;
}

// Unused var suppression
void ((_: ReactNode) => _);

export default function SecureMessaging() {
  const [selectedContactId, setSelectedContactId] = useState('1');
  const [contactList, setContactList] = useState(contacts);
  const [input, setInput] = useState('');
  const [search, setSearch] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const selectedContact = contactList.find((c) => c.id === selectedContactId)!;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedContact.messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    const newMsg: Message = {
      id: `m${Date.now()}`, content: input.trim(), sender: 'me',
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }), status: 'sent',
    };
    setContactList((prev) => prev.map((c) =>
      c.id === selectedContactId
        ? { ...c, messages: [...c.messages, newMsg], lastMessage: input.trim(), lastTime: 'now', unread: 0 }
        : c
    ));
    setInput('');
  };

  const handleSelect = (id: string) => {
    setSelectedContactId(id);
    setContactList((prev) => prev.map((c) => c.id === id ? { ...c, unread: 0 } : c));
  };

  const filteredContacts = contactList.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) || c.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <EmployeeLayout>
      <div className="h-[calc(100vh-8rem)] flex rounded-xl overflow-hidden border border-gray-200 shadow-sm bg-white">
        {/* Conversation list */}
        <div className="w-72 shrink-0 border-r border-gray-100 flex flex-col">
          {/* Header */}
          <div className="px-4 py-4 border-b border-gray-100">
            <h2 className="text-base font-bold text-gray-900 mb-3">Messages</h2>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50"
              />
            </div>
          </div>

          {/* Contact list */}
          <ul className="flex-1 overflow-y-auto divide-y divide-gray-50">
            {filteredContacts.map((contact) => (
              <li key={contact.id}
                onClick={() => handleSelect(contact.id)}
                className={['flex items-start gap-3 px-4 py-3.5 cursor-pointer transition-colors',
                  selectedContactId === contact.id ? 'bg-indigo-50' : 'hover:bg-gray-50'].join(' ')}>
                <Avatar initials={contact.avatar} online={contact.online} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <p className={`text-sm font-semibold truncate ${selectedContactId === contact.id ? 'text-indigo-700' : 'text-gray-900'}`}>
                      {contact.name}
                    </p>
                    <span className="text-xs text-gray-400 shrink-0">{contact.lastTime}</span>
                  </div>
                  <p className="text-xs text-gray-500 truncate mt-0.5">{contact.role}</p>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-xs text-gray-400 truncate">{contact.lastMessage}</p>
                    {contact.unread > 0 && (
                      <span className="bg-indigo-600 text-white text-xs font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 ml-1 shrink-0">
                        {contact.unread}
                      </span>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Message thread */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Thread header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <Avatar initials={selectedContact.avatar} size="md" online={selectedContact.online} />
              <div>
                <p className="text-sm font-bold text-gray-900">{selectedContact.name}</p>
                <p className="text-xs text-gray-500">
                  {selectedContact.online ? <span className="text-emerald-600 font-medium">Online</span> : 'Offline'} &middot; {selectedContact.role}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"><Phone size={16} /></button>
              <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"><Video size={16} /></button>
              <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"><MoreVertical size={16} /></button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3 bg-[#f9fafb]">
            {selectedContact.messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                {msg.sender === 'them' && (
                  <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 text-xs font-semibold flex items-center justify-center shrink-0 mr-2 mt-auto">
                    {selectedContact.avatar}
                  </div>
                )}
                <div className={['max-w-[70%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed',
                  msg.sender === 'me'
                    ? 'bg-indigo-600 text-white rounded-br-sm'
                    : 'bg-white border border-gray-200 text-gray-800 rounded-bl-sm shadow-sm'].join(' ')}>
                  <p>{msg.content}</p>
                  <div className={`flex items-center gap-1 mt-1 ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                    <span className={`text-xs ${msg.sender === 'me' ? 'text-indigo-200' : 'text-gray-400'}`}>{msg.time}</span>
                    {msg.sender === 'me' && <MessageStatus status={msg.status} />}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Compose area */}
          <div className="px-4 py-3 border-t border-gray-100 bg-white">
            <div className="flex items-end gap-2">
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors shrink-0">
                <Paperclip size={18} />
              </button>
              <div className="flex-1 relative">
                <textarea
                  rows={1}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                  placeholder="Type a secure message..."
                  className="w-full resize-none px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 max-h-32 overflow-y-auto"
                />
              </div>
              <button
                onClick={handleSend}
                disabled={!input.trim()}
                className="p-2.5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shrink-0"
              >
                <Send size={16} />
              </button>
            </div>
            <p className="text-xs text-gray-400 text-center mt-2">Messages are encrypted and secure</p>
          </div>
        </div>
      </div>
    </EmployeeLayout>
  );
}
