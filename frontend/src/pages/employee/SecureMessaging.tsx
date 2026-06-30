// // src/pages/employee/SecureMessaging.tsx
// import { useState, useEffect, useRef, useCallback } from "react";
// import { useCurrentUser } from "../../hooks/useAuth";
// import { useMessages } from "../../hooks/employee/useMessages";
// import messageApi from "../../api/employee/message.api";
// import type { Conversation, Message } from "../../types/employee/message.types";

// // ── Assets ────────────────────────────────────────────────────────────────────
// // import imgDefaultAvatar from "../../assets/icons/user-avatar-2.jpg";

// // ── Helpers ───────────────────────────────────────────────────────────────────
// function fmtTime(iso?: string): string {
//   if (!iso) return "";
//   return new Date(iso).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
// }

// function fmtConvTime(iso?: string): string {
//   if (!iso) return "";
//   const d    = new Date(iso);
//   const now  = new Date();
//   const diff = Math.floor((now.getTime() - d.getTime()) / 60000);
//   if (diff < 1)    return "Just now";
//   if (diff < 60)   return `${diff} min ago`;
//   if (diff < 1440) return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
//   return "Yesterday";
// }

// function getInitials(name?: string): string {
//   if (!name) return "?";
//   return name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
// }

// // Seeded color from name — consistent per user
// const AVATAR_COLORS = [
//   "bg-indigo-600", "bg-[#8b5cf6]", "bg-[#ec4899]",
//   "bg-[#f59e0b]", "bg-[#10b981]", "bg-[#3b82f6]",
// ];
// function avatarColor(name?: string): string {
//   if (!name) return AVATAR_COLORS[0];
//   const idx = name.split("").reduce((a, c) => a + c.charCodeAt(0), 0) % AVATAR_COLORS.length;
//   return AVATAR_COLORS[idx];
// }

// // ── Avatar ────────────────────────────────────────────────────────────────────
// function Avatar({
//   src, name, size = 40, online,
// }: {
//   src?: string; name?: string; size?: number; online?: boolean;
// }) {
//   const [imgErr, setImgErr] = useState(false);
//   const sz = `${size}px`;
//   return (
//     <div className="relative shrink-0" style={{ width: sz, height: sz }}>
//       {src && !imgErr ? (
//         <img
//           src={src} alt={name ?? ""}
//           onError={() => setImgErr(true)}
//           className="rounded-full object-cover w-full h-full"
//         />
//       ) : (
//         <div className={`${avatarColor(name)} rounded-full flex items-center justify-center
//                          text-white font-semibold w-full h-full`}
//              style={{ fontSize: size * 0.35 }}>
//           {getInitials(name)}
//         </div>
//       )}
//       {online !== undefined && (
//         <span className={`absolute bottom-0 right-0 rounded-full border-2 border-white
//                           ${online ? "bg-[#22c55e]" : "bg-[#94a3b8]"}`}
//               style={{ width: size * 0.28, height: size * 0.28 }} />
//       )}
//     </div>
//   );
// }

// // ── Conversation list item ────────────────────────────────────────────────────
// function ConvItem({
//   conv, active, onClick,
// }: {
//   conv: Conversation; active: boolean; onClick: () => void;
// }) {
//   return (
//     <button
//       onClick={onClick}
//       className={`w-full flex items-center gap-[12px] px-[16px] py-[12px] text-left
//                   transition-colors rounded-[12px] ${
//         active
//           ? "bg-[#f0f5ff]"
//           : "hover:bg-[#f8fafc]"
//       }`}
//     >
//       <Avatar src={conv.avatar_url} name={conv.participant_name} size={44} online={conv.is_online} />
//       <div className="flex-1 min-w-0">
//         <div className="flex items-center justify-between mb-[2px]">
//           <p className={`text-[14px] tracking-[-0.3px] truncate ${
//             conv.unread_count ? "font-semibold text-[#0f172a]" : "font-medium text-[#0f172a]"
//           }`}>
//             {conv.participant_name}
//           </p>
//           <span className="text-[11px] text-[#94a3b8] whitespace-nowrap ml-[8px] shrink-0">
//             {fmtConvTime(conv.last_message_at)}
//           </span>
//         </div>
//         <div className="flex items-center justify-between gap-[8px]">
//           <p className="text-[12px] text-[#64748b] truncate leading-[16px]">
//             {conv.last_message ?? "No messages yet"}
//           </p>
//           {(conv.unread_count ?? 0) > 0 && (
//             <span className="bg-indigo-600 text-white text-[10px] font-bold
//                              rounded-full min-w-[18px] h-[18px] flex items-center justify-center
//                              px-[5px] shrink-0">
//               {conv.unread_count}
//             </span>
//           )}
//         </div>
//       </div>
//     </button>
//   );
// }


// // ── Message bubble ────────────────────────────────────────────────────────────
// function MessageBubble({
//   msg, isMine, senderAvatar, senderName,
// }: {
//   msg: Message; isMine: boolean; senderAvatar?: string; senderName?: string;
// }) {
//   const hasAttachment = !!msg.attachment_name;

//   return (
//     <div className={`flex items-end gap-[8px] ${isMine ? "flex-row-reverse" : "flex-row"}`}>
//       {/* Avatar — only for received messages */}
//       {!isMine && (
//         <Avatar src={senderAvatar} name={senderName} size={36} />
//       )}

//       <div className={`flex flex-col gap-[4px] max-w-[65%] ${isMine ? "items-end" : "items-start"}`}>
//         {/* Attachment card */}
//         {hasAttachment && (
//           <div className={`flex items-center gap-[12px] px-[14px] py-[12px] rounded-[14px]
//                            ${isMine
//                              ? "rounded-br-[4px]"
//                              : "rounded-bl-[4px]"
//                            }`}
//                style={isMine
//                  ? { background: "linear-gradient(135deg, var(--theme-primary) 0%, var(--theme-gradient-end) 100%)" }
//                  : { background: "#f1f5f9" }
//                }>
//             {/* File icon */}
//             <div className={`rounded-[10px] flex items-center justify-center shrink-0 size-[40px] ${
//               isMine ? "bg-white/20" : "bg-[#e2e8f0]"
//             }`}>
//               <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
//                 <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z"
//                   fill={isMine ? "white" : "#6366f1"} fillOpacity={isMine ? 0.9 : 1} />
//                 <path d="M14 2v6h6" stroke={isMine ? "white" : "#6366f1"}
//                   strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
//               </svg>
//             </div>
//             <div className="min-w-0">
//               <p className={`text-[13px] font-semibold truncate max-w-[180px] ${
//                 isMine ? "text-white" : "text-[#0f172a]"
//               }`}>
//                 {msg.attachment_name}
//               </p>
//               {msg.attachment_size && (
//                 <p className={`text-[11px] mt-[1px] ${isMine ? "text-white/70" : "text-[#64748b]"}`}>
//                   {msg.attachment_size}
//                 </p>
//               )}
//             </div>
//           </div>
//         )}

//         {/* Text bubble */}
//         {msg.content && (
//           <div className={`px-[14px] py-[10px] rounded-[18px] ${
//             isMine
//               ? "rounded-br-[4px] text-white"
//               : "rounded-bl-[4px] bg-white border border-[#f1f5f9] text-[#0f172a]"
//           }`}
//                style={isMine
//                  ? { background: "linear-gradient(135deg, var(--theme-primary) 0%, var(--theme-gradient-end) 100%)" }
//                  : undefined
//                }>
//             <p className="text-[14px] leading-[22px] tracking-[-0.2px]">{msg.content}</p>
//           </div>
//         )}

//         {/* Timestamp + read receipt */}
//         <div className={`flex items-center gap-[4px] ${isMine ? "flex-row-reverse" : "flex-row"}`}>
//           <span className="text-[11px] text-[#94a3b8]">{fmtTime(msg.created_at)}</span>
//           {isMine && msg.is_read && (
//             <svg width="14" height="10" viewBox="0 0 16 10" fill="none">
//               <path d="M1 5l4 4L15 1" stroke="#3a46e5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//               <path d="M5 5l4 4" stroke="#3a46e5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//             </svg>
//           )}
//         </div>
//       </div>

//       {/* Spacer for sent messages */}
//       {isMine && <div className="size-[36px] shrink-0" />}
//     </div>
//   );
// }

// // ── Date separator ────────────────────────────────────────────────────────────
// function DateSeparator({ label }: { label: string }) {
//   return (
//     <div className="flex items-center gap-[12px] py-[8px]">
//       <div className="flex-1 h-px bg-[#f1f5f9]" />
//       <span className="text-[11px] text-[#94a3b8] font-medium px-[4px]">{label}</span>
//       <div className="flex-1 h-px bg-[#f1f5f9]" />
//     </div>
//   );
// }

// // ── Call event pill ───────────────────────────────────────────────────────────
// function CallEvent({ label, time }: { label: string; time: string }) {
//   return (
//     <div className="flex items-center justify-center gap-[8px] py-[4px]">
//       <div className="bg-[#f0f5ff] border border-[#e5edff] rounded-full
//                       flex items-center gap-[8px] px-[14px] py-[6px]">
//         <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
//           <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10.8 19.79 19.79 0 01.01 2.18 2 2 0 012 .01h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 14.92z"
//             stroke="#3a46e5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//         </svg>
//         <span className="text-[12px] text-indigo-600 font-medium">{label}</span>
//         <span className="text-[11px] text-[#94a3b8]">{time}</span>
//       </div>
//     </div>
//   );
// }

// // ── Empty state ───────────────────────────────────────────────────────────────
// function EmptyChat() {
//   return (
//     <div className="flex flex-1 items-center justify-center">
//       <div className="flex flex-col items-center gap-[16px] text-center px-[32px]">
//         <div className="bg-[#f0f5ff] rounded-full p-[24px]">
//           <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
//             <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"
//               stroke="#3a46e5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
//           </svg>
//         </div>
//         <div>
//           <p className="text-[#0f172a] text-[16px] font-semibold tracking-[-0.3px]">
//             Select a conversation
//           </p>
//           <p className="text-[#64748b] text-[13px] mt-[4px]">
//             Choose a conversation from the left to start messaging
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ── New Conversation Modal ────────────────────────────────────────────────────
// // Opens when user clicks pencil ✏️ icon in the Conversations header.
// // Fetches HR/attorney staff list → user picks one → createConversation() called.
// function NewConvModal({
//   onClose,
//   onCreate,
//   isCreating,
// }: {
//   onClose:    () => void;
//   onCreate:   (userId: string, name: string) => void;
//   isCreating: boolean;
// }) {
//   const [staff,   setStaff]   = useState<{ id: string; first_name: string; last_name: string; role: string; avatar_url?: string }[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [search,  setSearch]  = useState("");
//   const [selected, setSelected] = useState<string | null>(null);

//   useEffect(() => {
//     messageApi.listStaff()
//       .then(setStaff)
//       .catch(() => setStaff([]))
//       .finally(() => setLoading(false));
//   }, []);

//   const filtered = staff.filter(s =>
//     `${s.first_name} ${s.last_name}`.toLowerCase().includes(search.toLowerCase())
//   );

//   const selectedStaff = staff.find(s => s.id === selected);

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
//       <div className="bg-white rounded-[16px] shadow-[0_20px_60px_rgba(0,0,0,0.15)]
//                       w-[400px] flex flex-col overflow-hidden">

//         {/* Header */}
//         <div className="flex items-center justify-between px-[20px] py-[16px]
//                         border-b border-[#f1f5f9]">
//           <h3 className="text-[#0f172a] text-[15px] font-bold tracking-[-0.3px]">
//             New Conversation
//           </h3>
//           <button onClick={onClose}
//                   className="text-[#94a3b8] hover:text-[#374151] transition p-[4px] rounded-[6px]
//                              hover:bg-[#f1f5f9]">
//             <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
//               <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
//             </svg>
//           </button>
//         </div>

//         {/* Search */}
//         <div className="px-[16px] pt-[14px] pb-[8px]">
//           <div className="relative">
//             <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
//                  className="absolute left-[11px] top-1/2 -translate-y-1/2 text-[#94a3b8]">
//               <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
//               <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
//             </svg>
//             <input
//               autoFocus
//               type="text"
//               placeholder="Search HR or attorney..."
//               value={search}
//               onChange={e => setSearch(e.target.value)}
//               className="w-full bg-[#f8fafc] border border-[#f1f5f9] rounded-[10px]
//                          pl-[34px] pr-[12px] py-[9px] text-[13px] text-[#0f172a]
//                          placeholder:text-[#94a3b8] focus:outline-none
//                          focus:border-indigo-600 focus:ring-1 focus:ring-indigo-500/20 transition"
//               style={{ fontFamily: "Inter, sans-serif" }}
//             />
//           </div>
//         </div>

//         {/* Staff list */}
//         <div className="flex-1 overflow-y-auto max-h-[280px] px-[10px] pb-[10px]">
//           {loading ? (
//             <div className="flex items-center justify-center py-[32px]">
//               <svg className="w-5 h-5 animate-spin text-indigo-600" fill="none" viewBox="0 0 24 24">
//                 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
//                 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
//               </svg>
//             </div>
//           ) : filtered.length === 0 ? (
//             <p className="text-center text-[#94a3b8] text-[13px] py-[32px]">No staff found</p>
//           ) : (
//             filtered.map(s => (
//               <button
//                 key={s.id}
//                 onClick={() => setSelected(selected === s.id ? null : s.id)}
//                 className={`w-full flex items-center gap-[12px] px-[10px] py-[10px]
//                             rounded-[10px] transition text-left ${
//                   selected === s.id
//                     ? "bg-[#f0f5ff] border border-[#e5edff]"
//                     : "hover:bg-[#f8fafc] border border-transparent"
//                 }`}
//               >
//                 {/* Avatar */}
//                 <div className={`size-[36px] rounded-full flex items-center justify-center
//                                   shrink-0 text-white text-[13px] font-semibold ${
//                   s.role === "attorney" ? "bg-indigo-600"
//                   : s.role === "hr"     ? "bg-[#f59e0b]"
//                   : "bg-[#10b981]"
//                 }`}>
//                   {s.first_name[0]}{s.last_name[0]}
//                 </div>
//                 <div className="flex-1 min-w-0">
//                   <p className="text-[#0f172a] text-[13px] font-semibold truncate">
//                     {s.first_name} {s.last_name}
//                   </p>
//                   <p className="text-[#64748b] text-[11px] capitalize">{s.role}</p>
//                 </div>
//                 {selected === s.id && (
//                   <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
//                     <circle cx="12" cy="12" r="10" fill="#3a46e5"/>
//                     <path d="M8 12l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round"/>
//                   </svg>
//                 )}
//               </button>
//             ))
//           )}
//         </div>

//         {/* Footer */}
//         <div className="px-[16px] py-[14px] border-t border-[#f1f5f9] flex items-center gap-[10px]">
//           <button onClick={onClose}
//                   className="flex-1 h-[38px] rounded-[10px] border border-[#e2e8f0]
//                              text-[#374151] text-[13px] font-medium hover:bg-[#f8fafc] transition">
//             Cancel
//           </button>
//           <button
//             disabled={!selected || isCreating}
//             onClick={() => {
//               if (!selected || !selectedStaff) return;
//               onCreate(selected, `${selectedStaff.first_name} ${selectedStaff.last_name}`);
//             }}
//             className="flex-1 h-[38px] rounded-[10px] text-white text-[13px] font-semibold
//                        hover:opacity-90 transition disabled:opacity-40"
//             style={{ background: "linear-gradient(135deg, var(--theme-primary), var(--theme-gradient-end))" }}
//           >
//             {isCreating ? "Starting…" : "Start Conversation"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ─────────────────────────────────────────────────────────────────────────────
// export default function SecureMessaging() {
//   const { data: currentUser } = useCurrentUser();
//   const {
//     conversations,
//     messages,
//     activeConvId,
//     setActiveConvId,
//     sendMessage,
//     createConversation,
//     isLoading,
//     isSending,
//     isCreating,
//     searchQuery,
//     setSearchQuery,
//     activeTab,
//     setActiveTab,
//   } = useMessages();

//   const [inputText,    setInputText]    = useState("");
//   const [attachFile,   setAttachFile]   = useState<File | null>(null);
//   const [showNewConv,  setShowNewConv]  = useState(false);
//   const messagesEndRef                  = useRef<HTMLDivElement>(null);
//   const fileInputRef                    = useRef<HTMLInputElement>(null);
//   const textareaRef                     = useRef<HTMLTextAreaElement>(null);

//   // Auto-scroll to bottom when messages change
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   // Auto-resize textarea
//   useEffect(() => {
//     const ta = textareaRef.current;
//     if (!ta) return;
//     ta.style.height = "auto";
//     ta.style.height = `${Math.min(ta.scrollHeight, 120)}px`;
//   }, [inputText]);

//   const activeConv = conversations.find(c => c.id === activeConvId);
//   const myUserId   = currentUser?.id;

//   // Group messages by date for separators
//   const groupedMessages = messages.reduce<Array<{ type: "date"; label: string } | { type: "msg"; msg: Message }>>((acc, msg) => {
//     const dateLabel = new Date(msg.created_at).toLocaleDateString("en-US", {
//       weekday: "long", month: "long", day: "numeric",
//     });
//     const prev = acc.findLast(x => x.type === "date");
//     if (!prev || (prev as any).label !== dateLabel) {
//       acc.push({ type: "date", label: dateLabel });
//     }
//     acc.push({ type: "msg", msg });
//     return acc;
//   }, []);

//   // const handleSend = useCallback(async () => {
//   //   const text = inputText.trim();
//   //   if (!text && !attachFile) return;
//   //   if (!activeConvId) return;
//   //   setInputText("");
//   //   setAttachFile(null);
//   //   await sendMessage({ conversationId: activeConvId, content: text, file: attachFile ?? undefined });
//   // }, [inputText, attachFile, activeConvId, sendMessage]);

//   const handleSend = useCallback(async () => {
//     const text = inputText.trim();

//     if (!text && !attachFile) return;
//     if (!activeConvId) return;

//     const fileToSend = attachFile instanceof File ? attachFile : undefined;

//     setInputText("");
//     setAttachFile(null);

//     if (fileInputRef.current) {
//       fileInputRef.current.value = "";
//     }

//     await sendMessage({
//       conversationId: activeConvId,
//       content: text,
//       file: fileToSend,
//     });
//   }, [inputText, attachFile, activeConvId, sendMessage]);

//   const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       handleSend();
//     }
//   };

//   const filteredConvs = conversations.filter(c => {
//     const matchSearch = !searchQuery || c.participant_name.toLowerCase().includes(searchQuery.toLowerCase());
//     const matchTab    = activeTab === "all"
//       ? true
//       : activeTab === "unread"
//       ? (c.unread_count ?? 0) > 0
//       : c.is_archived;
//     return matchSearch && matchTab;
//   });

//   const unreadCount = conversations.filter(c => (c.unread_count ?? 0) > 0).length;

//   return (
//     // ── Full page scroll wrapper ──────────────────────────────────────────────
//     <div className="flex flex-col flex-1 min-h-0 overflow-hidden" style={{ fontFamily: "Inter, sans-serif" }}>

//       {/* ── Page header ── */}
//       <header className="bg-white border-b border-[#f1f5f9] shrink-0
//                          flex items-center justify-between
//                          px-[24px] sm:px-[32px] h-[64px]">
//         <h1 className="text-[#0f172a] text-[20px] font-bold tracking-[-0.5px]">
//           Secure Messaging Center
//         </h1>
//         {/* Notification bell */}
//         <button className="bg-white border border-[#e2e8f0] rounded-[10px]
//                            flex items-center justify-center size-[40px] relative
//                            hover:bg-[#f8fafc] transition">
//           <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
//             <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"
//               stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//           </svg>
//           {unreadCount > 0 && (
//             <span className="absolute top-[8px] right-[10px] bg-indigo-600 rounded-full size-[8px]" />
//           )}
//         </button>
//       </header>

//       {/* ── Main two-panel layout ── */}
//       <div className="flex flex-1 min-h-0 overflow-hidden">

//         {/* ══════════════════════════════════════════════════════════════════
//             LEFT PANEL — Conversation list
//         ══════════════════════════════════════════════════════════════════ */}
//         <div className={`flex flex-col w-full sm:w-[300px] lg:w-[320px] shrink-0
//                          border-r border-[#f1f5f9] bg-white
//                          ${activeConvId ? "hidden sm:flex" : "flex"}`}>

//           {/* Left header */}
//           <div className="px-[16px] pt-[20px] pb-[12px] shrink-0">
//             <div className="flex items-center justify-between mb-[16px]">
//               <h2 className="text-[#0f172a] text-[16px] font-semibold tracking-[-0.4px]">
//                 Conversations
//               </h2>
//               <button
//                 onClick={() => setShowNewConv(true)}
//                 className="text-indigo-600 hover:bg-[#f0f5ff] rounded-[8px] p-[6px] transition"
//                 title="New conversation"
//               >
//                 <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
//                   <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"
//                     stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
//                   <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"
//                     stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
//                 </svg>
//               </button>
//             </div>

//             {/* Search */}
//             <div className="relative">
//               <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
//                    className="absolute left-[12px] top-1/2 -translate-y-1/2 text-[#94a3b8]">
//                 <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
//                 <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
//               </svg>
//               <input
//                 type="text"
//                 placeholder="Search messages..."
//                 value={searchQuery}
//                 onChange={e => setSearchQuery(e.target.value)}
//                 className="w-full bg-[#f8fafc] border border-[#f1f5f9] rounded-[10px]
//                            pl-[36px] pr-[12px] py-[9px] text-[13px] text-[#0f172a]
//                            placeholder:text-[#94a3b8] focus:outline-none
//                            focus:border-indigo-600 focus:ring-1 focus:ring-indigo-500/20 transition"
//                 style={{ fontFamily: "Inter, sans-serif" }}
//               />
//             </div>
//           </div>

//           {/* Tabs */}
//           <div className="flex items-center gap-[4px] px-[16px] pb-[12px] shrink-0">
//             {(["all", "unread", "archived"] as const).map(tab => (
//               <button
//                 key={tab}
//                 onClick={() => setActiveTab(tab)}
//                 className={`flex items-center gap-[6px] px-[12px] py-[6px] rounded-[8px]
//                             text-[12px] font-medium capitalize transition ${
//                   activeTab === tab
//                     ? "bg-[#f0f5ff] text-indigo-600"
//                     : "text-[#64748b] hover:bg-[#f8fafc]"
//                 }`}
//               >
//                 {tab}
//                 {tab === "all" && unreadCount > 0 && (
//                   <span className="bg-indigo-600 text-white text-[10px] font-bold
//                                    rounded-full min-w-[16px] h-[16px] flex items-center
//                                    justify-center px-[4px]">
//                     {unreadCount}
//                   </span>
//                 )}
//               </button>
//             ))}
//           </div>

//           {/* Conversation list */}
//           <div className="flex-1 overflow-y-auto px-[8px] pb-[16px]">
//             {isLoading ? (
//               <div className="flex items-center justify-center py-[48px]">
//                 <svg className="w-6 h-6 animate-spin text-indigo-600" fill="none" viewBox="0 0 24 24">
//                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
//                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
//                 </svg>
//               </div>
//             ) : filteredConvs.length === 0 ? (
//               <div className="flex flex-col items-center gap-[8px] py-[48px] px-[16px] text-center">
//                 <p className="text-[#64748b] text-[13px]">No conversations found</p>
//               </div>
//             ) : (
//               filteredConvs.map(conv => (
//                 <ConvItem
//                   key={conv.id}
//                   conv={conv}
//                   active={conv.id === activeConvId}
//                   onClick={() => setActiveConvId(conv.id)}
//                 />
//               ))
//             )}
//           </div>
//         </div>

//         {/* ══════════════════════════════════════════════════════════════════
//             RIGHT PANEL — Chat window
//         ══════════════════════════════════════════════════════════════════ */}
//         <div className={`flex flex-col flex-1 min-w-0 bg-[#f8fafc]
//                          ${!activeConvId ? "hidden sm:flex" : "flex"}`}>

//           {!activeConvId ? (
//             <EmptyChat />
//           ) : (
//             <>
//               {/* Chat header */}
//               <div className="bg-white border-b border-[#f1f5f9] shrink-0
//                               flex items-center justify-between
//                               px-[20px] sm:px-[24px] py-[14px]">
//                 <div className="flex items-center gap-[12px]">
//                   {/* Back button — mobile only */}
//                   <button
//                     onClick={() => setActiveConvId(null)}
//                     className="sm:hidden text-[#64748b] hover:text-[#0f172a] transition mr-[4px]"
//                   >
//                     <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
//                       <path d="M19 12H5M12 5l-7 7 7 7" stroke="currentColor"
//                         strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//                     </svg>
//                   </button>
//                   <Avatar
//                     src={activeConv?.avatar_url}
//                     name={activeConv?.participant_name}
//                     size={42}
//                     online={activeConv?.is_online}
//                   />
//                   <div>
//                     <p className="text-[#0f172a] text-[15px] font-semibold tracking-[-0.3px]">
//                       {activeConv?.participant_name}
//                     </p>
//                     <p className="text-[12px] text-[#64748b] flex items-center gap-[5px]">
//                       {activeConv?.is_online && (
//                         <span className="inline-block w-[7px] h-[7px] bg-[#22c55e] rounded-full" />
//                       )}
//                       {activeConv?.is_online ? "Online" : "Offline"}
//                       {activeConv?.participant_role && (
//                         <> • {activeConv.participant_role}</>
//                       )}
//                     </p>
//                   </div>
//                 </div>

//                 {/* Action buttons */}
//                 <div className="flex items-center gap-[6px]">
//                   <button className="bg-[#f8fafc] border border-[#e2e8f0] rounded-[10px]
//                                      flex items-center justify-center size-[36px]
//                                      hover:bg-[#f1f5f9] transition text-[#64748b]">
//                     <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
//                       <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10.8 19.79 19.79 0 01.01 2.18 2 2 0 012 .01h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 14.92z"
//                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
//                     </svg>
//                   </button>
//                   <button className="bg-[#f8fafc] border border-[#e2e8f0] rounded-[10px]
//                                      flex items-center justify-center size-[36px]
//                                      hover:bg-[#f1f5f9] transition text-[#64748b]">
//                     <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
//                       <path d="M23 7l-7 5 7 5V7zM1 5a2 2 0 012-2h11a2 2 0 012 2v14a2 2 0 01-2 2H3a2 2 0 01-2-2V5z"
//                         stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//                     </svg>
//                   </button>
//                   <button className="bg-[#f8fafc] border border-[#e2e8f0] rounded-[10px]
//                                      flex items-center justify-center size-[36px]
//                                      hover:bg-[#f1f5f9] transition text-[#64748b]">
//                     <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
//                       <circle cx="12" cy="5" r="1" fill="currentColor"/>
//                       <circle cx="12" cy="12" r="1" fill="currentColor"/>
//                       <circle cx="12" cy="19" r="1" fill="currentColor"/>
//                     </svg>
//                   </button>
//                 </div>
//               </div>

//               {/* Messages area */}
//               <div className="flex-1 overflow-y-auto px-[16px] sm:px-[24px] py-[20px]">
//                 <div className="flex flex-col gap-[16px] max-w-[800px] mx-auto">
//                   {groupedMessages.map((item, idx) => {
//                     if (item.type === "date") {
//                       return <DateSeparator key={`date-${idx}`} label={item.label} />;
//                     }
//                     const msg    = item.msg;
//                     const isMine = msg.sender_id === myUserId;

//                     // Check for call events
//                     if (msg.message_type === "call_event") {
//                       return (
//                         <CallEvent
//                           key={msg.id}
//                           label={msg.content ?? "Call"}
//                           time={fmtTime(msg.created_at)}
//                         />
//                       );
//                     }

//                     return (
//                       <MessageBubble
//                         key={msg.id}
//                         msg={msg}
//                         isMine={isMine}
//                         senderAvatar={isMine ? undefined : activeConv?.avatar_url}
//                         senderName={isMine ? undefined : activeConv?.participant_name}
//                       />
//                     );
//                   })}
//                   <div ref={messagesEndRef} />
//                 </div>
//               </div>

//               {/* Compose bar */}
//               <div className="bg-white border-t border-[#f1f5f9] shrink-0
//                               px-[16px] sm:px-[20px] py-[14px]">
//                 {/* Attachment preview */}
//                 {attachFile && (
//                   <div className="flex items-center gap-[10px] mb-[10px] px-[14px] py-[10px]
//                                   bg-[#f0f5ff] border border-[#e5edff] rounded-[10px]">
//                     <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
//                       <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z"
//                         fill="#3a46e5"/>
//                     </svg>
//                     <span className="text-[13px] text-indigo-600 font-medium flex-1 truncate">
//                       {attachFile.name}
//                     </span>
//                     <button onClick={() => setAttachFile(null)}
//                             className="text-[#94a3b8] hover:text-[#ef4444] transition">
//                       <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
//                         <path d="M18 6L6 18M6 6l12 12" stroke="currentColor"
//                           strokeWidth="2" strokeLinecap="round"/>
//                       </svg>
//                     </button>
//                   </div>
//                 )}

//                 <div className="flex items-end gap-[10px]">
//                   {/* Emoji */}
//                   {/* <button className="text-[#94a3b8] hover:text-[#64748b] transition shrink-0 mb-[2px]">
//                     <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
//                       <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.8"/>
//                       <path d="M8 14s1.5 2 4 2 4-2 4-2" stroke="currentColor"
//                         strokeWidth="1.8" strokeLinecap="round"/>
//                       <circle cx="9" cy="10" r="1" fill="currentColor"/>
//                       <circle cx="15" cy="10" r="1" fill="currentColor"/>
//                     </svg>
//                   </button> */}

//                   {/* Attach */}
//                   {/* <button
//                     onClick={() => fileInputRef.current?.click()}
//                     className="text-[#94a3b8] hover:text-[#64748b] transition shrink-0 mb-[2px]"
//                   >
//                     <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
//                       <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48"
//                         stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
//                     </svg>
//                   </button>
//                   <input
//                     ref={fileInputRef}
//                     type="file"
//                     className="hidden"
//                     onChange={e => setAttachFile(e.target.files?.[0] ?? null)}
//                   /> */}

//                   {/* Text input */}
//                   <div className="flex-1 bg-[#f8fafc] border border-[#f1f5f9] rounded-[14px]
//                                   focus-within:border-indigo-600 focus-within:ring-1
//                                   focus-within:ring-[#3a46e5]/20 transition px-[14px] py-[10px]">
//                     <textarea
//                       ref={textareaRef}
//                       rows={1}
//                       value={inputText}
//                       onChange={e => setInputText(e.target.value)}
//                       onKeyDown={handleKeyDown}
//                       placeholder="Type a message..."
//                       className="w-full bg-transparent text-[14px] text-[#0f172a]
//                                  placeholder:text-[#94a3b8] focus:outline-none resize-none
//                                  leading-[22px] max-h-[120px] overflow-y-auto"
//                       style={{ fontFamily: "Inter, sans-serif" }}
//                     />
//                   </div>

//                   {/* Send */}
//                   <button
//                     onClick={handleSend}
//                     disabled={isSending || (!inputText.trim() && !attachFile)}
//                     className="shrink-0 size-[44px] rounded-[12px] flex items-center justify-center
//                                text-white transition hover:opacity-90 disabled:opacity-40
//                                shadow-[0px_4px_12px_rgba(58,70,229,0.3)]"
//                     style={{ background: "linear-gradient(135deg, var(--theme-primary) 0%, var(--theme-gradient-end) 100%)" }}
//                   >
//                     {isSending ? (
//                       <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
//                         <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
//                         <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
//                       </svg>
//                     ) : (
//                       <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
//                         <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z"
//                           stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//                       </svg>
//                     )}
//                   </button>
//                 </div>
//               </div>
//             </>
//           )}
//         </div>
//       </div>

//       {/* ── New Conversation Modal ── */}
//       {showNewConv && (
//         <NewConvModal
//           onClose={() => setShowNewConv(false)}
//           isCreating={isCreating}
//           onCreate={async (userId) => {
//             await createConversation({
//               thread_type:     "direct",
//               participant_ids: [userId],
//             });
//             setShowNewConv(false);
//           }}
//         />
//       )}
//     </div>
//   );
// }






// src/pages/employee/SecureMessaging.tsx
import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { Paperclip, Pencil, Search, Send, Smile, X, Download, Check, CheckCheck } from "lucide-react";
import messageApi from "../../api/employee/message.api";
import type { Conversation, Message } from "../../types/employee/message.types";
import { getUiSession } from "../../utils/uiSession";
import { getFileUrl } from "../../utils/fileUrl";

// ── Helpers ───────────────────────────────────────────────────────────────────
const getInitials = (name?: string) =>
  (name ?? "?").split(" ").filter(Boolean).map(n => n[0]).join("").slice(0, 2).toUpperCase();

const formatTime = (date?: string) =>
  date ? new Date(date).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }) : "";

const formatDateDivider = (date?: string) => {
  if (!date) return "";
  const d    = new Date(date);
  const now  = new Date();
  const diff = Math.floor((now.getTime() - d.getTime()) / 86400000);
  if (diff === 0) return "Today";
  if (diff === 1) return "Yesterday";
  return d.toLocaleDateString([], { weekday: "long", day: "numeric", month: "long" });
};

const fmtConvTime = (date?: string) => {
  if (!date) return "";
  const d    = new Date(date);
  const now  = new Date();
  const diff = Math.floor((now.getTime() - d.getTime()) / 60000);
  if (diff < 1)    return "now";
  if (diff < 60)   return `${diff}m`;
  if (diff < 1440) return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  return d.toLocaleDateString([], { day: "numeric", month: "short" });
};

const fmtLastSeen = (iso?: string): string => {
  if (!iso) return "a while ago";
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 60)    return "just now";
  if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return new Date(iso).toLocaleDateString([], { month: "short", day: "numeric" });
};

const isSameDay = (a?: string, b?: string) =>
  !!a && !!b && new Date(a).toDateString() === new Date(b).toDateString();

const isImageFile = (name?: string | null) =>
  /\.(jpg|jpeg|png|gif|webp)$/i.test(name ?? "");

// ── Avatar ────────────────────────────────────────────────────────────────────
function Avatar({ name, url, online, size = 44 }: {
  name?: string; url?: string | null; online?: boolean; size?: number;
}) {
  const [failed, setFailed] = useState(false);
  const src  = getFileUrl(url ?? null);
  const sz   = `${size}px`;
  const COLORS = ["bg-violet-500","bg-orange-500","bg-emerald-600","bg-blue-500","bg-pink-500","bg-amber-500","bg-teal-500","bg-rose-500"];
  const color  = COLORS[(name ?? "").split("").reduce((a, c) => a + c.charCodeAt(0), 0) % COLORS.length];

  return (
    <div className="relative shrink-0" style={{ width: sz, height: sz }}>
      {src && !failed ? (
        <img src={src} alt={name ?? ""} onError={() => setFailed(true)}
          className="rounded-full object-cover w-full h-full" />
      ) : (
        <div className={`${color} rounded-full flex items-center justify-center text-white font-semibold w-full h-full`}
          style={{ fontSize: size * 0.38 }}>
          {getInitials(name)}
        </div>
      )}
      {online !== undefined && (
        <span
          className={`absolute bottom-0 right-0 border-2 border-white rounded-full ${online ? "bg-emerald-400" : "bg-slate-300"}`}
          style={{ width: size * 0.27, height: size * 0.27 }}
        />
      )}
    </div>
  );
}

// ── Ticks (WhatsApp-style) ────────────────────────────────────────────────────
function Ticks({ isRead }: { isRead: boolean }) {
  if (isRead) return <CheckCheck size={14} className="shrink-0" style={{ color: "var(--theme-primary)" }} />;
  return <Check size={14} className="text-slate-400 shrink-0" />;
}

// ── Protected image ───────────────────────────────────────────────────────────
function ProtectedImage({ documentId, name, onClick }: {
  documentId: string; name?: string; onClick: (url: string) => void;
}) {
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(false);
  const blobRef = useRef<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    messageApi.getFileObjectUrl(documentId)
      .then(({ url }) => { if (!cancelled) { setBlobUrl(url); blobRef.current = url; } })
      .catch(() => { if (!cancelled) setError(true); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; if (blobRef.current) URL.revokeObjectURL(blobRef.current); };
  }, [documentId]);

  if (loading) return (
    <div className="w-[200px] h-[150px] rounded-2xl bg-slate-100 animate-pulse flex items-center justify-center">
      <span className="text-xs text-slate-400">Loading…</span>
    </div>
  );
  if (error || !blobUrl) return (
    <div className="flex items-center gap-2 bg-white/60 rounded-xl px-3 py-2 text-sm text-slate-500">
      <Paperclip size={14} /><span className="truncate max-w-[160px]">{name ?? "Image"}</span>
    </div>
  );
  return (
    <img src={blobUrl} alt={name ?? ""}
      className="max-w-[260px] max-h-[260px] rounded-2xl object-cover cursor-pointer shadow-sm hover:opacity-95 transition"
      onClick={() => onClick(blobUrl)} />
  );
}

// ── File download card ────────────────────────────────────────────────────────
function FileCard({ documentId, name, size, isMine }: {
  documentId: string; name?: string; size?: string; isMine: boolean;
}) {
  const [loading, setLoading] = useState(false);
  const handleClick = async () => {
    setLoading(true);
    try {
      const { url, fileName } = await messageApi.getFileObjectUrl(documentId);
      const a = document.createElement("a");
      a.href = url; a.download = fileName || name || "file"; a.click();
      setTimeout(() => URL.revokeObjectURL(url), 5000);
    } catch { /* silent */ } finally { setLoading(false); }
  };
  return (
    <button type="button" onClick={handleClick} disabled={loading}
      className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition disabled:opacity-60 max-w-[260px] w-full ${
        isMine ? "bg-white/20 hover:bg-white/30" : "bg-white hover:bg-slate-50 border border-slate-100 shadow-sm"
      }`}>
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isMine ? "bg-white/25" : "bg-[var(--theme-light)]"}`}>
        <Paperclip size={16} className={isMine ? "text-white" : "text-[var(--theme-dark)]"} />
      </div>
      <div className="min-w-0 text-left flex-1">
        <p className={`font-medium truncate max-w-[160px] text-[13px] ${isMine ? "text-white" : "text-slate-700"}`}>{name ?? "File"}</p>
        {size && <p className={`text-xs mt-0.5 ${isMine ? "text-white/70" : "text-slate-400"}`}>{size}</p>}
      </div>
      <Download size={14} className={isMine ? "text-white/80" : "text-slate-400"} />
    </button>
  );
}

// ── Lightbox ──────────────────────────────────────────────────────────────────
function Lightbox({ src, onClose }: { src: string; onClose: () => void }) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [onClose]);
  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4" onClick={onClose}>
      <button type="button" className="absolute top-4 right-5 text-white/80 hover:text-white" onClick={onClose}>
        <X size={28} />
      </button>
      <img src={src} alt="Preview"
        className="max-w-[92vw] max-h-[88vh] rounded-xl object-contain"
        onClick={e => e.stopPropagation()} />
    </div>
  );
}

// ── Emoji picker ──────────────────────────────────────────────────────────────
const EMOJI_CATEGORIES: { label: string; emojis: string[] }[] = [
  { label: "Smileys",  emojis: ["😀","😂","😊","😍","🥰","😎","🤔","😢","😡","🥳","😇","🤩","😴","🤯","😤","🫠","😶","🤭","🫢","🙄"] },
  { label: "Gestures", emojis: ["👍","👎","👏","🙏","🤝","💪","👋","🫡","✌️","🤞","🫶","❤️","🔥","✅","⚠️","💯","🎯","🏆","⭐","💎"] },
  { label: "Objects",  emojis: ["📎","📄","📅","⏰","🔔","💬","🌟","✍️","📧","🗂️","💡","🔍","🎉","🚀","💼","📊","🔒","🌐","📱","💻"] },
];

function EmojiPicker({ onPick, onClose }: { onPick: (e: string) => void; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const [tab, setTab] = useState(0);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [onClose]);

  return (
    <div ref={ref}
      className="absolute bottom-[56px] left-0 z-50 bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden"
      style={{ width: 300 }}>
      {/* Category tabs */}
      <div className="flex border-b border-slate-100">
        {EMOJI_CATEGORIES.map((cat, i) => (
          <button key={cat.label} type="button" onClick={() => setTab(i)}
            className={`flex-1 py-2 text-xs font-medium transition ${
              tab === i
                ? "border-b-2 border-[var(--theme-primary)] text-[var(--theme-dark)] bg-[var(--theme-light)]"
                : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
            }`}>
            {cat.label}
          </button>
        ))}
      </div>
      {/* Emoji grid */}
      <div className="p-2 grid grid-cols-10 gap-0.5">
        {EMOJI_CATEGORIES[tab].emojis.map(e => (
          <button key={e} type="button" onClick={() => { onPick(e); onClose(); }}
            className="text-[20px] w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[var(--theme-light)] transition">
            {e}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── New conversation modal ────────────────────────────────────────────────────
type StaffUser = { id: string; name: string; role?: string; avatar_url?: string };

function NewConvModal({ onClose, onCreate, isHR }: {
  onClose: () => void; onCreate: (userId: string) => void; isHR: boolean;
}) {
  const [users,    setUsers]    = useState<StaffUser[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [search,   setSearch]   = useState("");
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    if (isHR) {
      import("../../api/hr/employees.api")
        .then(({ employeesApi }) => employeesApi.list({ is_active: true, limit: 100 }))
        .then(res => setUsers((res.items ?? []).map((e: any) => ({
          id: e.employee_id, name: e.full_name,
          role: e.job_title ?? "Employee", avatar_url: e.profile_picture_url,
        }))))
        .catch(() => setUsers([]))
        .finally(() => setLoading(false));
    } else {
      messageApi.listStaff()
        .then(items => setUsers(items.map(s => ({
          id: s.id, name: `${s.first_name} ${s.last_name}`,
          role: s.role, avatar_url: s.profile_picture_url ?? s.avatar_url,
        }))))
        .catch(() => setUsers([]))
        .finally(() => setLoading(false));
    }
  }, [isHR]);

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-[380px] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h3 className="font-bold text-[15px] text-slate-900">New Conversation</h3>
          <button onClick={onClose} type="button" className="text-slate-400 hover:text-slate-700 transition">
            <X size={18} />
          </button>
        </div>
        <div className="px-4 pt-3 pb-2">
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input autoFocus type="text"
              placeholder={isHR ? "Search employees…" : "Search staff…"}
              value={search} onChange={e => setSearch(e.target.value)}
              className="w-full h-9 bg-slate-50 border border-slate-100 rounded-xl pl-8 pr-3 text-[13px] outline-none focus:ring-2 focus:ring-[var(--theme-light)] focus:border-[var(--theme-primary)] transition" />
          </div>
        </div>
        <div className="overflow-y-auto max-h-[280px] px-3 pb-3">
          {loading
            ? <p className="text-center text-slate-400 text-sm py-8">Loading…</p>
            : filtered.length === 0
              ? <p className="text-center text-slate-400 text-sm py-8">No results</p>
              : filtered.map(u => (
                <button key={u.id} type="button"
                  onClick={() => setSelected(u.id === selected ? null : u.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition text-left mb-0.5 ${
                    selected === u.id ? "bg-[var(--theme-light)] ring-1 ring-[var(--theme-border,#c7d2fe)]" : "hover:bg-slate-50"
                  }`}>
                  <Avatar name={u.name} url={u.avatar_url} size={36} />
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold text-slate-800 truncate">{u.name}</p>
                    <p className="text-[11px] text-slate-500 capitalize">{u.role}</p>
                  </div>
                  {selected === u.id && (
                    <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0" style={{ background: "var(--theme-primary)" }}>
                      <Check size={11} className="text-white" />
                    </div>
                  )}
                </button>
              ))
          }
        </div>
        <div className="px-4 py-3 border-t border-slate-100 flex gap-2">
          <button type="button" onClick={onClose}
            className="flex-1 h-9 rounded-xl border border-slate-200 text-slate-600 text-[13px] font-medium hover:bg-slate-50 transition">
            Cancel
          </button>
          <button type="button" disabled={!selected} onClick={() => selected && onCreate(selected)}
            className="flex-1 h-9 rounded-xl text-white text-[13px] font-semibold hover:opacity-90 transition disabled:opacity-40"
            style={{ background: "linear-gradient(135deg, var(--theme-primary) 0%, var(--theme-gradient-end) 100%)" }}>
            Start Chat
          </button>
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================
const SecureMessaging: React.FC = () => {
  const session = getUiSession();
  const isHR    = session?.roles?.includes("hr") ?? false;

  // user_id from cookie (populated after backend fix + fresh login).
  // Fallback: scan all cookies for a JWT with sub + type=access.
  // This handles users who haven't re-logged-in yet after the backend change.
  const currentUserId = useMemo((): string => {
    if (session?.user_id) return session.user_id;
    try {
      for (const cookie of document.cookie.split("; ")) {
        const val = cookie.split("=").slice(1).join("=");
        if (!val) continue;
        const parts = decodeURIComponent(val).split(".");
        if (parts.length !== 3) continue;
        try {
          const p = JSON.parse(atob(parts[1].replace(/-/g, "+").replace(/_/g, "/")));
          if (p?.sub && p?.type === "access") return p.sub;
        } catch { continue; }
      }
    } catch { /* silent */ }
    return "";
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.user_id]);

  const [conversations,  setConversations]  = useState<Conversation[]>([]);
  const [selectedConv,   setSelectedConv]   = useState<Conversation | null>(null);
  const [messages,       setMessages]       = useState<Message[]>([]);
  const [search,         setSearch]         = useState("");
  const [filter,         setFilter]         = useState<"all" | "unread" | "archived">("all");
  const [text,           setText]           = useState("");
  const [selectedFile,   setSelectedFile]   = useState<File | null>(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);
  const [loadingConvs,   setLoadingConvs]   = useState(true);
  const [loadingMsgs,    setLoadingMsgs]    = useState(false);
  const [sending,        setSending]        = useState(false);
  const [lightboxSrc,    setLightboxSrc]    = useState<string | null>(null);
  const [showEmoji,      setShowEmoji]      = useState(false);
  const [showNewConv,    setShowNewConv]    = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const bottomRef    = useRef<HTMLDivElement>(null);
  const textareaRef  = useRef<HTMLTextAreaElement>(null);
  const activeIdRef  = useRef<string | null>(null);

  // ── Filtered conversations ────────────────────────────────────────────────
  const filteredConvs = useMemo(() => conversations.filter(c => {
    const m = c.participant_name?.toLowerCase().includes(search.toLowerCase())
           || c.last_message?.toLowerCase().includes(search.toLowerCase());
    if (!m) return false;
    if (filter === "unread")   return c.unread_count > 0;
    if (filter === "archived") return c.is_archived;
    return !c.is_archived;
  }), [conversations, search, filter]);

  const totalUnread = conversations.reduce((s, c) => s + (c.unread_count ?? 0), 0);

  // ── Data fetching ─────────────────────────────────────────────────────────
  const loadConversations = useCallback(async () => {
    try {
      const d = await messageApi.listConversations();
      setConversations(d);
    } catch { /* silent */ } finally { setLoadingConvs(false); }
  }, []);

  const loadMessages = useCallback(async (id: string) => {
    if (activeIdRef.current !== id) return;
    try {
      const d = await messageApi.listMessages(id);
      setMessages(d);
    } catch { /* silent */ }
  }, []);

  const selectConv = useCallback(async (conv: Conversation) => {
    setSelectedConv(conv);
    activeIdRef.current = conv.id;
    setMessages([]);
    setLoadingMsgs(true);
    try {
      const d = await messageApi.listMessages(conv.id);
      setMessages(d);
      await messageApi.markRead(conv.id);
      setConversations(p => p.map(c => c.id === conv.id ? { ...c, unread_count: 0 } : c));
    } catch { /* silent */ } finally { setLoadingMsgs(false); }
  }, []);

  // ── Send ──────────────────────────────────────────────────────────────────
  const handleSend = useCallback(async () => {
    if (!selectedConv || sending || (!text.trim() && !selectedFile)) return;
    setSending(true);
    try {
      const msg = selectedFile
        ? await messageApi.sendFile(selectedConv.id, text.trim() || undefined, selectedFile)
        : await messageApi.sendText(selectedConv.id, text.trim());
      setMessages(p => p.find(m => m.id === msg.id) ? p : [...p, msg]);
      setConversations(p => p.map(c => c.id === selectedConv.id
        ? { ...c, last_message: msg.content ?? (msg.attachment_name ? `📎 ${msg.attachment_name}` : c.last_message), last_message_at: msg.created_at }
        : c));
      setText("");
      setSelectedFile(null);
      setFilePreviewUrl(null);
      setShowEmoji(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (e) { console.error(e); } finally { setSending(false); }
  }, [selectedConv, text, selectedFile, sending]);

  const handleFileChange = (file: File | null) => {
    setSelectedFile(file);
    if (filePreviewUrl) URL.revokeObjectURL(filePreviewUrl);
    setFilePreviewUrl(file?.type.startsWith("image/") ? URL.createObjectURL(file) : null);
  };

  const handleCreateConv = useCallback(async (userId: string) => {
    try {
      const thread = await messageApi.createConversation({ thread_type: "direct", participant_ids: [userId] });
      setConversations(p => p.find(c => c.id === thread.id) ? p : [thread, ...p]);
      await selectConv(thread);
      setShowNewConv(false);
    } catch { /* silent */ }
  }, [selectConv]);

  // ── Effects ───────────────────────────────────────────────────────────────
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = `${Math.min(ta.scrollHeight, 100)}px`;
  }, [text]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    loadConversations();
    const t = setInterval(loadConversations, 10_000);
    return () => clearInterval(t);
  }, [loadConversations]);

  useEffect(() => {
    if (!selectedConv) return;
    const t = setInterval(() => loadMessages(selectedConv.id), 3_000);
    return () => clearInterval(t);
  }, [selectedConv, loadMessages]);

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="h-full w-full flex overflow-hidden"
      style={{ fontFamily: "Inter, sans-serif", background: "#f8fafc" }}>

      {/* ══ LEFT PANEL ══════════════════════════════════════════════════════ */}
      <aside className="w-[340px] shrink-0 flex flex-col bg-white border-r border-slate-100">

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-slate-100">
          <div className="flex items-center gap-3">
            <Avatar
              name={`${session?.first_name ?? ""} ${session?.last_name ?? ""}`}
              url={session?.profile}
              size={40}
            />
            <span className="font-semibold text-[15px] text-slate-800">Chats</span>
          </div>
          <button type="button" onClick={() => setShowNewConv(true)}
            className="w-9 h-9 rounded-full flex items-center justify-center transition hover:bg-[var(--theme-light)] text-[var(--theme-dark)]"
            title="New chat">
            <Pencil size={18} />
          </button>
        </div>

        {/* Search */}
        <div className="px-3 py-2 bg-white">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search or start new chat"
              className="w-full h-9 bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-3 text-[13px] text-slate-700 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-[var(--theme-light)] transition" />
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex border-b border-slate-100">
          {(["all", "unread", "archived"] as const).map(tab => (
            <button key={tab} type="button" onClick={() => setFilter(tab)}
              className={`flex-1 py-2 text-xs font-medium capitalize transition flex items-center justify-center gap-1.5 ${
                filter === tab
                  ? "border-b-2 border-[var(--theme-primary)] text-[var(--theme-dark)]"
                  : "text-slate-500 hover:text-slate-700"
              }`}>
              {tab}
              {tab === "unread" && totalUnread > 0 && (
                <span className="text-white text-[9px] font-bold rounded-full min-w-[14px] h-[14px] flex items-center justify-center px-1" style={{ background: "var(--theme-primary)" }}>
                  {totalUnread}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Conversation list */}
        <div className="flex-1 overflow-y-auto">
          {loadingConvs && (
            <p className="text-xs text-slate-400 text-center py-8">Loading…</p>
          )}
          {!loadingConvs && filteredConvs.length === 0 && (
            <p className="text-xs text-slate-400 text-center py-8">No conversations</p>
          )}
          {filteredConvs.map(conv => (
            <button key={conv.id} type="button" onClick={() => selectConv(conv)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left transition border-b border-slate-50 ${
                selectedConv?.id === conv.id ? "bg-[var(--theme-light)] text-[var(--theme-dark)]" : "hover:bg-slate-50"
              }`}>
              <Avatar name={conv.participant_name} url={conv.avatar_url} online={conv.is_online} size={48} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-[15px] font-medium text-slate-900 truncate">{conv.participant_name}</p>
                  <span className={`text-[11px] shrink-0 ml-2 ${conv.unread_count > 0 ? "font-semibold text-[var(--theme-dark)]" : "text-slate-400"}`}>
                    {fmtConvTime(conv.last_message_at)}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-0.5">
                  <p className={`text-[13px] truncate ${conv.unread_count > 0 ? "text-slate-700 font-medium" : "text-slate-400"}`}>
                    {conv.last_message ?? "No messages yet"}
                  </p>
                  {conv.unread_count > 0 && (
                    <span className="text-white text-[11px] font-bold rounded-full min-w-[20px] h-[20px] flex items-center justify-center px-1 shrink-0 ml-2" style={{ background: "var(--theme-primary)" }}>
                      {conv.unread_count}
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </aside>

      {/* ══ RIGHT PANEL ═════════════════════════════════════════════════════ */}
      <main className="flex-1 flex flex-col min-w-0">
        {!selectedConv ? (
          <div className="flex-1 flex flex-col items-center justify-center bg-slate-50">
            <div className="w-20 h-20 rounded-full flex items-center justify-center mb-5" style={{ background: "var(--theme-light)" }}>
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"
                  stroke="#6366f1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h3 className="text-[18px] font-semibold text-slate-700">VisaFlow Messaging</h3>
            <p className="text-slate-400 text-[13px] mt-2">Select a conversation to start chatting</p>
          </div>
        ) : (
          <>
            {/* Chat header */}
            <div className="h-[60px] bg-white border-b border-slate-200 px-4 flex items-center gap-3 shrink-0">
              <Avatar
                name={selectedConv.participant_name}
                url={selectedConv.avatar_url}
                online={selectedConv.is_online}
                size={40}
              />
              <div className="flex-1 min-w-0">
                <p className="text-[15px] font-semibold text-slate-900 leading-tight">
                  {selectedConv.participant_name}
                </p>
                <p className="text-[12px] leading-tight mt-0.5">
                  {selectedConv.is_online
                    ? <span className="font-medium" style={{ color: "var(--theme-primary)" }}>online</span>
                    : (selectedConv as any).last_seen_at
                      ? <span className="text-slate-400">last seen {fmtLastSeen((selectedConv as any).last_seen_at)}</span>
                      : <span className="text-slate-400 capitalize">{selectedConv.participant_role ?? "offline"}</span>
                  }
                </p>
              </div>
            </div>

            {/* Messages area */}
            <div className="flex-1 overflow-y-auto px-4 py-4"
              style={{
                background: "#f8fafc",
              }}>
              {loadingMsgs && (
                <p className="text-xs text-slate-500 text-center py-4">Loading messages…</p>
              )}

              <div className="flex flex-col gap-1 max-w-[800px] mx-auto">
                {messages.map((msg, idx) => {
                  const isMine         = msg.sender_id === currentUserId;
                  const prev           = messages[idx - 1];
                  const showDate       = idx === 0 || !isSameDay(prev?.created_at, msg.created_at);
                  const isLastFromSender = !messages[idx + 1] || messages[idx + 1].sender_id !== msg.sender_id;
                  const hasImage       = msg.message_type === "file_attachment" && msg.document_id
                                         && ((msg as any).is_image || isImageFile(msg.attachment_name));
                  const hasFile        = msg.message_type === "file_attachment" && msg.document_id && !hasImage;

                  return (
                    <React.Fragment key={msg.id}>
                      {/* Date divider */}
                      {showDate && (
                        <div className="flex items-center justify-center my-3">
                          <span className="bg-white border border-slate-200 text-slate-400 text-[11px] font-medium px-4 py-1 rounded-full shadow-sm">
                            {formatDateDivider(msg.created_at)}
                          </span>
                        </div>
                      )}

                      {/* System notification */}
                      {msg.message_type === "system_notification" && (
                        <div className="flex justify-center my-2">
                          <div className="bg-[#fff3cd] text-[#856404] text-[11px] px-4 py-1.5 rounded-full max-w-[80%] text-center shadow-sm">
                            {msg.content}
                          </div>
                        </div>
                      )}

                      {/* Regular message */}
                      {msg.message_type !== "system_notification" && (
                        <div
                          className={`flex items-end gap-2 ${isMine ? "justify-end" : "justify-start"}`}
                          style={{ marginBottom: isLastFromSender ? "6px" : "1px" }}>

                          {/* Receiver avatar — only on last message in a group */}
                          {!isMine && (
                            <div className="shrink-0 mb-1">
                              {isLastFromSender
                                ? <Avatar name={selectedConv.participant_name} url={selectedConv.avatar_url} size={28} />
                                : <div style={{ width: 28 }} />
                              }
                            </div>
                          )}

                          {/* Bubble */}
                          <div className={`flex flex-col max-w-[65%] ${isMine ? "items-end" : "items-start"}`}>
                            <div
                              className={`px-3 pt-2 pb-1.5 rounded-2xl shadow-sm ${
                                isMine
                                  ? "rounded-tr-sm border border-[var(--theme-border,#e0e7ff)]"
                                  : "bg-white rounded-tl-sm border border-slate-100"
                              }`}
                              style={isMine ? {
                                background: "#ffffff",
                              } : undefined}>

                              {/* Text */}
                              {msg.content && (
                                <p className={`text-[14px] leading-[1.5] whitespace-pre-wrap break-words ${
                                  "text-slate-900"
                                }`}>
                                  {msg.content}
                                </p>
                              )}

                              {/* Image attachment */}
                              {hasImage && (
                                <div className={msg.content ? "mt-1.5" : ""}>
                                  <ProtectedImage
                                    documentId={msg.document_id!}
                                    name={msg.attachment_name ?? undefined}
                                    onClick={setLightboxSrc}
                                  />
                                </div>
                              )}

                              {/* File attachment */}
                              {hasFile && (
                                <div className={msg.content ? "mt-1.5" : ""}>
                                  <FileCard
                                    documentId={msg.document_id!}
                                    name={msg.attachment_name ?? undefined}
                                    size={msg.attachment_size ?? undefined}
                                    isMine={isMine}
                                  />
                                </div>
                              )}

                              {/* Timestamp + ticks — always on its own line below content */}
                              <div className={`flex items-center gap-1 mt-0.5 ${isMine ? "justify-end" : "justify-end"}`}>
                                <span className={`text-[10px] whitespace-nowrap ${
                                  "text-slate-400"
                                }`}>
                                  {formatTime(msg.created_at)}
                                </span>
                                {isMine && <Ticks isRead={msg.is_read} />}
                              </div>
                            </div>
                          </div>

                          {/* Spacer on sender side */}
                          {isMine && <div style={{ width: 0 }} className="shrink-0" />}
                        </div>
                      )}
                    </React.Fragment>
                  );
                })}
                <div ref={bottomRef} />
              </div>
            </div>

            {/* File preview strip */}
            {selectedFile && (
              <div className="bg-white border-t border-slate-100 px-4 py-2 flex items-center gap-3">
                {filePreviewUrl
                  ? <img src={filePreviewUrl} alt="" className="w-12 h-12 rounded-lg object-cover shrink-0 border border-slate-200" />
                  : (
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0" style={{ background: "var(--theme-light)" }}>
                      <Paperclip size={16} style={{ color: "var(--theme-primary)" }} />
                    </div>
                  )
                }
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] text-slate-700 font-medium truncate">{selectedFile.name}</p>
                  <p className="text-xs text-slate-400">
                    {selectedFile.size > 1048576
                      ? `${(selectedFile.size / 1048576).toFixed(1)} MB`
                      : `${Math.round(selectedFile.size / 1024)} KB`}
                  </p>
                </div>
                <button type="button"
                  onClick={() => {
                    setSelectedFile(null);
                    setFilePreviewUrl(null);
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                  className="text-slate-400 hover:text-red-500 transition p-1 shrink-0">
                  <X size={16} />
                </button>
              </div>
            )}

            {/* Compose bar */}
            <div className="bg-white border-t border-slate-200 px-3 py-2 flex items-end gap-2">
              {/* Emoji */}
              <div className="relative">
                <button type="button" onClick={() => setShowEmoji(v => !v)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition ${
                    showEmoji ? "bg-[var(--theme-light)] text-[var(--theme-dark)]" : "text-slate-500 hover:bg-slate-100"
                  }`}>
                  <Smile size={22} />
                </button>
                {showEmoji && (
                  <EmojiPicker
                    onPick={e => setText(t => t + e)}
                    onClose={() => setShowEmoji(false)}
                  />
                )}
              </div>

              {/* Attach file */}
              <button type="button" onClick={() => fileInputRef.current?.click()}
                className="w-10 h-10 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-200 transition">
                <Paperclip size={22} />
              </button>
              <input ref={fileInputRef} type="file" className="hidden"
                accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
                onChange={e => handleFileChange(e.target.files?.[0] ?? null)} />

              {/* Text input */}
              <div className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 focus-within:bg-white focus-within:border-[var(--theme-primary)] focus-within:ring-2 focus-within:ring-[var(--theme-light)] transition">
                <textarea ref={textareaRef} rows={1} value={text}
                  onChange={e => setText(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
                  }}
                  placeholder="Type a message"
                  className="w-full bg-transparent text-[14px] text-slate-800 placeholder:text-slate-400 focus:outline-none resize-none leading-[22px] max-h-[100px] overflow-y-auto" />
              </div>

              {/* Send */}
              <button type="button" onClick={handleSend}
                disabled={sending || (!text.trim() && !selectedFile)}
                className="w-10 h-10 rounded-full text-white flex items-center justify-center transition disabled:opacity-40 shrink-0 shadow-md hover:opacity-90"
                style={{ background: "linear-gradient(135deg, var(--theme-primary) 0%, var(--theme-gradient-end) 100%)" }}>
                {sending ? (
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : (
                  <Send size={18} />
                )}
              </button>
            </div>
          </>
        )}
      </main>

      {/* Lightbox */}
      {lightboxSrc && <Lightbox src={lightboxSrc} onClose={() => setLightboxSrc(null)} />}

      {/* New conversation modal */}
      {showNewConv && (
        <NewConvModal isHR={isHR} onClose={() => setShowNewConv(false)} onCreate={handleCreateConv} />
      )}
    </div>
  );
};

export default SecureMessaging;