// // src/pages/employee/Dashboard.tsx
// import { useState } from "react";
// import { useNavigate } from "react-router-dom";

// import { useCurrentUser } from "../../hooks/useAuth";
// import { useDashboard } from "../../hooks/employee/useDashboard";
// import type { ActivityItem } from "../../types/employee/dashboard.types";

// import imgKpi1       from "../../assets/icons/kpi-apps.svg";
// import imgKpi2       from "../../assets/icons/kpi-docs.svg";
// import imgKpi3       from "../../assets/icons/kpi-clock.svg";
// import imgKpi4       from "../../assets/icons/kpi-sponsor.svg";
// import imgTrend      from "../../assets/icons/trend-up.svg";
// import imgClockSm    from "../../assets/icons/clock-small.svg";
// import imgVerified   from "../../assets/icons/verified-badge.svg";
// import imgContIcon   from "../../assets/icons/continue-draft.svg";
// import imgStartIcon  from "../../assets/icons/start-new.svg";
// import imgArrowRight from "../../assets/icons/arrow-right-dash.svg";
// import imgGuide1     from "../../assets/icons/guide-lca.svg";
// import imgGuide2     from "../../assets/icons/guide-degree.svg";
// import imgGuide3     from "../../assets/icons/guide-photo.svg";
// import imgGuide4     from "../../assets/icons/guide-fees.svg";
// import imgMoreDots   from "../../assets/icons/more-dots.svg";
// import imgDonut      from "../../assets/icons/donut-chart.svg";
// import imgDotFilled  from "../../assets/icons/dot-filled.svg";
// import imgDotEmpty   from "../../assets/icons/dot-empty.svg";
// import { PageContent, PageHeader } from "../../components/layout/Pageheader";

// // ── Static guidance items ─────────────────────────────────────────────────────
// const GUIDANCE = [
//   { id: "1", icon: imgGuide1, tag: "Required", tagBg: "bg-[#e5edff]",              tagText: "text-[#2f35ca]", title: "LCA Overview",       desc: "Understanding the Labor Condition Application process and timelines." },
//   { id: "2", icon: imgGuide2, tag: "Optional", tagBg: "bg-[rgba(157,78,221,0.1)]", tagText: "text-[#9d4edd]", title: "Degree Evaluation",  desc: "When and how to get your foreign degree evaluated for US equivalent." },
//   { id: "3", icon: imgGuide3, tag: "Tip",      tagBg: "bg-[#e2e8f0]",              tagText: "text-[#334155]", title: "Photo Requirements", desc: "USCIS passport-style photo specifications and common mistakes." },
//   { id: "4", icon: imgGuide4, tag: "Info",     tagBg: "bg-[#e2e8f0]",              tagText: "text-[#334155]", title: "Filing Fees 2024",   desc: "Updated fee schedule for I-129 and premium processing." },
// ];

// // ── Static activity fallback ──────────────────────────────────────────────────
// const ACTIVITY_FALLBACK: ActivityItem[] = [
//   { id: "1", title: "Uploaded Passport Copy",  description: "Document requires verification", timestamp: new Date().toISOString(),                            color: "#5269f2" },
//   { id: "2", title: "Draft Saved",             description: "H-1B Application Form",          timestamp: new Date(Date.now() - 86400000).toISOString(),        color: "#10b981" },
//   { id: "3", title: "Profile Created",         description: "Basic setup completed",          timestamp: new Date(Date.now() - 86400000 + 900000).toISOString(), color: "#cbd5e1" },
//   { id: "4", title: "Account Registered",      description: "Welcome to VisaFlow",            timestamp: new Date(Date.now() - 86400000 + 600000).toISOString(), color: "#cbd5e1" },
// ];

// function formatTs(iso: string): string {
//   try {
//     const d    = new Date(iso);
//     const diff = Date.now() - d.getTime();
//     const days = Math.floor(diff / 86400000);
//     const time = d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
//     if (days === 0) return `Today, ${time}`;
//     if (days === 1) return `Yesterday, ${time}`;
//     return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
//   } catch { return iso; }
// }

// // ─────────────────────────────────────────────────────────────────────────────
// export default function Dashboard() {
//   const navigate                  = useNavigate();
//   const { data: user }            = useCurrentUser();
//   const { data: dash, isLoading } = useDashboard();
//   const [search, setSearch]       = useState("");

//   const firstName = user?.first_name ?? "Alexandra";

//   // KPI values
//   const s               = dash?.stats;
//   const activeApps      = s?.active_applications       ?? 1;
//   const docsVerified    = s?.documents_verified        ?? 4;
//   const docsTotal       = s?.documents_total           ?? 12;
//   const docsAction      = s?.documents_action_required ?? 2;
//   const procDays        = s?.processing_days           ?? 45;
//   const procType        = s?.processing_type           ?? "Standard Processing";
//   const sponsorName     = s?.sponsor_name              ?? "TechCorp Inc.";
//   const sponsorStage    = s?.sponsor_stage             ?? "LCA Filed";
//   const sponsorVerified = s?.sponsor_verified          ?? true;
//   const readiness       = s?.profile_readiness         ?? 75;
//   const docsBarW        = docsTotal > 0 ? Math.round((docsVerified / docsTotal) * 100) : 33;

//   const activity = (dash?.activity ?? []).length > 0
//     ? (dash?.activity ?? [])
//     : ACTIVITY_FALLBACK;

//   return (
//     // ── Full page: header + scrollable content ──────────────────────────────
//     <div className="flex flex-col flex-1 min-h-0 overflow-hidden" style={{ fontFamily: "Inter, sans-serif" }}>

//       {/* ══════════════════════════════════════════════════════════════════════
//           TOP HEADER  — Figma node 14:12890
//           h-[72px], bg-[rgba(255,255,255,0.8)], border-b border-[#f1f5f9]
//           flex, items-center, justify-between, px-[32px]
//       ══════════════════════════════════════════════════════════════════════ */}
//       <PageHeader
//         title="Dashboard Overview"
//         subtitle={`Welcome back, ${firstName}. Here's your visa status.`}
//         showSearch
//         searchValue={search}
//         searchPlaceholder="Search applications..."
//         onSearchChange={setSearch}
//       />
//       <PageContent>
//         <div className="flex flex-col gap-[32px] w-full max-w-[1200px]">

//           {/* ── STATUS OVERVIEW ROW ─────────────────────────────────────────
//               Figma: flex, gap-[24px], h-[165px], 4 cards each w-[261px]
//           ──────────────────────────────────────────────────────────────────*/}
//           <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-[24px]">

//             {/* Card 1: Active Applications */}
//             <div className="bg-white border border-[#f1f5f9] flex flex-col gap-[16px] h-[165px]
//                             items-start overflow-clip pb-[40px] pt-[25px] px-[25px] relative
//                             rounded-[24px] shadow-[0px_4px_12px_0px_rgba(0,0,0,0.02)]">
//               <p className="font-medium leading-[20px] text-[#64748b] text-[14px] tracking-[-0.5px] whitespace-nowrap">
//                 Active Applications
//               </p>
//               <p className="font-bold leading-[36px] text-[#0f172a] text-[30px] tracking-[-0.5px]">
//                 {isLoading ? "—" : activeApps}
//               </p>
//               <div className="bg-[#ecfdf5] flex gap-[8px] h-[24px] items-center px-[10px] py-[4px] rounded-[6px] shrink-0">
//                 <img src={imgTrend} alt="" className="w-[13.5px] h-[12px] object-contain shrink-0" />
//                 <span className="font-medium text-[#059669] text-[12px] tracking-[-0.5px] leading-[16px] whitespace-nowrap">
//                   In Progress
//                 </span>
//               </div>
//               <div className="absolute flex flex-col h-[88px] items-start left-[170.5px] opacity-10 p-[24px] right-[-0.5px] top-0 pointer-events-none">
//                 <img src={imgKpi1} alt="" className="w-[40.5px] h-[36px] object-contain" />
//               </div>
//             </div>

//             {/* Card 2: Documents Verified */}
//             <div className="bg-white border border-[#f1f5f9] flex flex-col gap-[8px] h-[165px]
//                             items-start overflow-clip pb-[34px] pt-[25px] px-[25px] relative
//                             rounded-[24px] shadow-[0px_4px_12px_0px_rgba(0,0,0,0.02)]">
//               <p className="font-medium leading-[20px] text-[#64748b] text-[14px] tracking-[-0.5px] whitespace-nowrap">
//                 Documents Verified
//               </p>
//               <p className="font-bold leading-[36px] text-[#0f172a] text-[30px] tracking-[-0.5px]">
//                 {isLoading ? "—" : `${docsVerified}/${docsTotal}`}
//               </p>
//               {/* Progress bar */}
//               <div className="bg-[#f1f5f9] h-[6px] rounded-full shrink-0 w-[211px] overflow-hidden">
//                 <div className="bg-[#5269f2] h-[6px] rounded-full" style={{ width: `${docsBarW}%` }} />
//               </div>
//               <p className="font-normal leading-[16px] text-[#64748b] text-[12px] tracking-[-0.5px] whitespace-nowrap">
//                 Action required on {docsAction} items
//               </p>
//               <div className="absolute flex flex-col h-[88px] items-start left-[170.5px] opacity-10 p-[24px] right-[-0.5px] top-0 pointer-events-none">
//                 <img src={imgKpi2} alt="" className="w-[40.5px] h-[36px] object-contain" />
//               </div>
//             </div>

//             {/* Card 3: Est. Processing Time */}
//             <div className="bg-white border border-[#f1f5f9] flex flex-col gap-[16px] h-[165px]
//                             items-start overflow-clip pb-[37px] pt-[25px] px-[25px] relative
//                             rounded-[24px] shadow-[0px_4px_12px_0px_rgba(0,0,0,0.02)]">
//               <p className="font-medium leading-[20px] text-[#64748b] text-[14px] tracking-[-0.5px] whitespace-nowrap">
//                 Est. Processing Time
//               </p>
//               <p className="leading-none text-[0px] whitespace-nowrap">
//                 <span className="font-bold leading-[36px] text-[#0f172a] text-[30px] tracking-[-0.5px]">
//                   {isLoading ? "—" : `${procDays} `}
//                 </span>
//                 <span className="leading-[36px] text-[#94a3b8] text-[18px]">days</span>
//               </p>
//               <div className="bg-[#f8fafc] border border-[#f1f5f9] flex gap-[8px] h-[26px] items-center px-[11px] py-[5px] rounded-[6px] shrink-0">
//                 <img src={imgClockSm} alt="" className="size-[12px] object-contain shrink-0" />
//                 <span className="font-medium text-[#64748b] text-[12px] tracking-[-0.5px] leading-[16px] whitespace-nowrap">
//                   {procType}
//                 </span>
//               </div>
//               <div className="absolute flex flex-col h-[88px] items-start left-[179.5px] opacity-10 p-[24px] right-[-0.5px] top-0 pointer-events-none">
//                 <img src={imgKpi3} alt="" className="w-[31.5px] h-[36px] object-contain" />
//               </div>
//             </div>

//             {/* Card 4: Sponsor Status */}
//             <div className="bg-white border border-[#f1f5f9] flex flex-col gap-[8px] h-[165px]
//                             items-start overflow-clip p-[25px] relative rounded-[24px]
//                             shadow-[0px_4px_12px_0px_rgba(0,0,0,0.02)]">
//               <p className="font-medium leading-[20px] text-[#64748b] text-[14px] tracking-[-0.5px] whitespace-nowrap">
//                 Sponsor Status
//               </p>
//               <p className="font-bold leading-[23px] text-[#0f172a] text-[18px] tracking-[-0.5px] whitespace-nowrap">
//                 {isLoading ? "—" : sponsorName}
//               </p>
//               <p className="font-normal leading-[20px] text-[#64748b] text-[14px] tracking-[-0.5px] whitespace-nowrap">
//                 {sponsorStage}
//               </p>
//               {sponsorVerified && (
//                 <div className="bg-[#f0f5ff] flex gap-[8px] h-[24px] items-center px-[10px] py-[4px] rounded-[6px] shrink-0">
//                   <img src={imgVerified} alt="" className="size-[12px] object-contain shrink-0" />
//                   <span className="font-medium text-[#2f35ca] text-[12px] tracking-[-0.5px] leading-[16px] whitespace-nowrap">
//                     Verified
//                   </span>
//                 </div>
//               )}
//               <div className="absolute flex flex-col h-[88px] items-start left-[166px] opacity-10 p-[24px] right-0 top-0 pointer-events-none">
//                 <img src={imgKpi4} alt="" className="w-[45px] h-[36px] object-contain" />
//               </div>
//             </div>
//           </div>

//           {/* ── TWO COLUMN ROW ──────────────────────────────────────────────
//               Figma: flex, gap-[32px], left col w-[733px], right col w-[351px]
//           ──────────────────────────────────────────────────────────────────*/}
//           <div className="flex flex-col xl:flex-row gap-[32px] items-start w-full">

//             {/* LEFT column — w-[733px] */}
//             <div className="flex flex-col gap-[32px] w-full xl:flex-1">

//               {/* QUICK ACTIONS ─────────────────────────────────────────────
//                   Figma: bg-white, border-[#f1f5f9], drop-shadow, rounded-[24px],
//                   gap-[24px], h-[257px], p-[33px]
//               ────────────────────────────────────────────────────────────── */}
//               <div className="bg-white border border-[#f1f5f9] drop-shadow-[0px_4px_6px_rgba(0,0,0,0.02)]
//                               flex flex-col gap-[24px] items-start p-[33px] rounded-[24px] w-full">
//                 <p className="font-bold leading-[28px] text-[#0f172a] text-[18px] tracking-[-0.5px] whitespace-nowrap">
//                   Quick Actions
//                 </p>

//                 <div className="flex flex-col sm:flex-row gap-[16px] w-full">

//                   {/* Continue Draft — bg-[#f0f5ff], border-[#cddbfe], w-[326px] */}
//                   <button
//                     type="button"
//                     onClick={() => navigate("/applications/list")}
//                     className="bg-[#f0f5ff] border border-[#cddbfe] flex gap-[16px] h-[139px]
//                                items-start overflow-clip pb-[47px] pl-[21px] pr-[21px] pt-[21px]
//                                relative rounded-[16px] flex-1 text-left
//                                hover:bg-[#e8eeff] transition-colors cursor-pointer"
//                   >
//                     <div className="bg-white drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] flex items-center
//                                     justify-center px-[15px] py-[10px] rounded-[12px] shrink-0 size-[48px]">
//                       <img src={imgContIcon} alt="" className="size-[18px] object-contain" />
//                     </div>
//                     <div className="flex flex-col gap-[12px] items-start">
//                       <p className="font-bold leading-[24px] text-[#242b81] text-[16px] tracking-[-0.5px] whitespace-nowrap">
//                         Continue Draft
//                       </p>
//                       <p className="font-normal leading-[16px] text-[12px] text-[rgba(47,53,202,0.8)] tracking-[-0.5px] whitespace-nowrap">
//                         H-1B Specialty Occupation
//                       </p>
//                       {/* Progress bar */}
//                       <div className="flex gap-[8px] items-center">
//                         <div className="bg-white h-[6px] rounded-full w-[100px] overflow-hidden">
//                           <div className="bg-[#5269f2] h-[6px] rounded-full w-[45px]" />
//                         </div>
//                         <span className="font-semibold text-indigo-600 text-[10px] tracking-[-0.5px] leading-[15px] whitespace-nowrap">
//                           45%
//                         </span>
//                       </div>
//                     </div>
//                     {/* Gradient deco */}
//                     <div
//                       className="absolute h-[96px] left-[275.66px] opacity-5 right-[-47.66px] rounded-bl-full top-[-48px]"
//                       style={{ backgroundImage: "linear-gradient(135deg, rgb(58,70,229) 0%, rgb(157,78,221) 100%)" }}
//                     />
//                   </button>

//                   {/* Start New Application — bg-white, border-[#e2e8f0], w-[326px] */}
//                   <button
//                     type="button"
//                     onClick={() => navigate("/applications/new")}
//                     className="bg-white border border-[#e2e8f0] flex gap-[16px] h-[139px]
//                                items-start p-[21px] rounded-[16px] flex-1 text-left
//                                hover:bg-[#f8fafc] transition-colors cursor-pointer"
//                   >
//                     <div className="bg-[#f1f5f9] flex items-center justify-center px-[16px] py-[10px] rounded-[12px] shrink-0 size-[48px]">
//                       <img src={imgStartIcon} alt="" className="w-[15.75px] h-[18px] object-contain" />
//                     </div>
//                     <div className="flex flex-col gap-[12px] items-start">
//                       <p className="font-bold leading-[24px] text-[#0f172a] text-[16px] tracking-[-0.5px] whitespace-nowrap">
//                         Start New Application
//                       </p>
//                       <p className="font-normal text-[#64748b] text-[12px] tracking-[-0.5px] leading-[20px]">
//                         Begin a new visa or green card{"\n"}process.
//                       </p>
//                       <div className="flex gap-[4px] items-center">
//                         <span className="font-medium leading-[16px] text-indigo-600 text-[12px] tracking-[-0.5px] whitespace-nowrap">
//                           Start now{" "}
//                         </span>
//                         <img src={imgArrowRight} alt="" className="w-[8.75px] h-[10px] object-contain" />
//                       </div>
//                     </div>
//                   </button>
//                 </div>
//               </div>

//               {/* GUIDANCE LIBRARY ──────────────────────────────────────────
//                   Figma: bg-white, border-[#f1f5f9], drop-shadow, rounded-[24px],
//                   gap-[24px], h-[522px], p-[33px]
//               ────────────────────────────────────────────────────────────── */}
//               <div className="bg-white border border-[#f1f5f9] drop-shadow-[0px_4px_6px_rgba(0,0,0,0.02)]
//                               flex flex-col gap-[24px] items-start p-[33px] rounded-[24px] w-full">

//                 {/* Header row */}
//                 <div className="flex items-center justify-between w-full">
//                   <div className="flex flex-col gap-[4px]">
//                     <p className="font-bold leading-[28px] text-[#0f172a] text-[18px] tracking-[-0.5px] whitespace-nowrap">
//                       H-1B Guidance Library
//                     </p>
//                     <p className="font-normal leading-[20px] text-[#64748b] text-[14px] tracking-[-0.5px] whitespace-nowrap">
//                       Resources tailored to your target visa.
//                     </p>
//                   </div>
//                   <button
//                     type="button"
//                     className="flex h-[32px] items-center justify-center px-[12px] rounded-[8px] hover:bg-[#f0f5ff] transition-colors"
//                   >
//                     <span className="font-medium leading-[20px] text-indigo-600 text-[14px] tracking-[-0.5px] whitespace-nowrap">
//                       View All
//                     </span>
//                   </button>
//                 </div>

//                 {/* 4 guidance cards — 2×2 grid */}
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-[16px] w-full">
//                   {GUIDANCE.map(g => (
//                     <div
//                       key={g.id}
//                       className="bg-[#f8fafc] border border-[#f1f5f9] flex gap-[16px] h-[90px]
//                                  items-start p-[17px] rounded-[12px] cursor-pointer
//                                  hover:bg-[#f0f5ff] transition-colors"
//                     >
//                       <div className="bg-white border border-[#e2e8f0] drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)]
//                                       flex items-center justify-center rounded-[8px] shrink-0 size-[48px]">
//                         <img src={g.icon} alt="" className="size-[16px] object-contain" />
//                       </div>
//                       <div className="flex flex-col gap-[4px] overflow-hidden">
//                         <div className="flex gap-[8px] items-center">
//                           <div className={`${g.tagBg} flex h-[19px] items-center justify-center px-[8px] rounded-[4px] shrink-0`}>
//                             <span className={`font-bold ${g.tagText} text-[10px] leading-[15px] whitespace-nowrap`}>
//                               {g.tag}
//                             </span>
//                           </div>
//                           <p className="font-bold leading-[20px] text-[#0f172a] text-[14px] tracking-[-0.5px] whitespace-nowrap">
//                             {g.title}
//                           </p>
//                         </div>
//                         <p className="font-normal text-[#64748b] text-[12px] tracking-[-0.5px] leading-[16px] truncate">
//                           {g.desc}
//                         </p>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>

//             {/* RIGHT column — w-[351px] ────────────────────────────────────*/}
//             <div className="flex flex-col gap-[32px] w-full xl:w-[351px] xl:shrink-0">

//               {/* RECENT ACTIVITY ───────────────────────────────────────────
//                   Figma: bg-white, border-[#f1f5f9], drop-shadow, rounded-[24px],
//                   gap-[24px], h-[400px], p-[25px]
//               ────────────────────────────────────────────────────────────── */}
//               <div className="bg-white border border-[#f1f5f9] drop-shadow-[0px_4px_6px_rgba(0,0,0,0.02)]
//                               flex flex-col gap-[24px] p-[25px] rounded-[24px] w-full">

//                 <div className="flex items-center justify-between w-full">
//                   <p className="font-bold leading-[24px] text-[#0f172a] text-[16px] tracking-[-0.5px] whitespace-nowrap">
//                     Recent Activity
//                   </p>
//                   <button
//                     type="button"
//                     className="flex items-center justify-center rounded-[8px] size-[32px] hover:bg-[#f8fafc] transition-colors"
//                   >
//                     <img src={imgMoreDots} alt="more" className="w-[14px] h-[16px] object-contain" />
//                   </button>
//                 </div>

//                 {/* Timeline */}
//                 <div className="flex flex-col gap-[24px] w-full">
//                   {activity.map((item: ActivityItem, idx: number) => (
//                     <div key={item.id} className="flex flex-col gap-[4px] pl-[32px] relative shrink-0">
//                       <p className="font-medium leading-[20px] text-[#0f172a] text-[14px] tracking-[-0.5px] whitespace-nowrap">
//                         {item.title}
//                       </p>
//                       <p className="font-normal leading-[16px] text-[#64748b] text-[12px] tracking-[-0.5px] whitespace-nowrap">
//                         {item.description}
//                       </p>
//                       <p className="font-medium leading-[15px] text-[#94a3b8] text-[10px] tracking-[-0.5px] whitespace-nowrap">
//                         {formatTs(item.timestamp)}
//                       </p>
//                       {/* Colored dot */}
//                       <div
//                         className="absolute h-[8px] left-0 rounded-full top-[4px] w-[8px]"
//                         style={{ backgroundColor: item.color }}
//                       />
//                       {/* Vertical connector line — between items */}
//                       {idx < activity.length - 1 && (
//                         <div className="absolute bg-[#f1f5f9] h-[65px] left-[3px] top-[16px] w-px" />
//                       )}
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               {/* PROFILE READINESS ─────────────────────────────────────────
//                   Figma: bg-white, border-[#f1f5f9], drop-shadow, rounded-[24px],
//                   gap-[16px], h-[170px], p-[25px]
//               ────────────────────────────────────────────────────────────── */}
//               <div className="bg-white border border-[#f1f5f9] drop-shadow-[0px_4px_6px_rgba(0,0,0,0.02)]
//                               flex flex-col gap-[16px] p-[25px] rounded-[24px] w-full">
//                 <p className="font-bold leading-[24px] text-[#0f172a] text-[16px] tracking-[-0.5px] whitespace-nowrap">
//                   Profile Readiness
//                 </p>

//                 <div className="flex gap-[24px] items-center w-full">
//                   {/* Donut — size-[85px] */}
//                   <div className="relative shrink-0 size-[85px]">
//                     <div className="absolute inset-0 flex items-center justify-center">
//                       <span className="font-bold text-[#0f172a] text-[14px] tracking-[-0.5px] whitespace-nowrap">
//                         {readiness}%
//                       </span>
//                     </div>
//                     <div className="p-[5px] size-[85px]">
//                       <img src={imgDonut} alt="" className="size-[80px] object-contain" />
//                     </div>
//                   </div>

//                   {/* Legend */}
//                   <div className="flex flex-col gap-[8px]">
//                     <div className="flex gap-[8px] items-center">
//                       <img src={imgDotFilled} alt="" className="size-[8px] object-contain shrink-0" />
//                       <p className="font-normal leading-[16px] text-[#475569] text-[12px] tracking-[-0.5px] whitespace-nowrap">
//                         Personal Info (Done)
//                       </p>
//                     </div>
//                     <div className="flex gap-[8px] items-center">
//                       <img src={imgDotFilled} alt="" className="size-[8px] object-contain shrink-0" />
//                       <p className="font-normal leading-[16px] text-[#475569] text-[12px] tracking-[-0.5px] whitespace-nowrap">
//                         Passport (Done)
//                       </p>
//                     </div>
//                     <div className="flex gap-[8px] items-center">
//                       <img src={imgDotEmpty} alt="" className="size-[8px] object-contain shrink-0" />
//                       <p className="font-normal leading-[16px] text-[#94a3b8] text-[12px] tracking-[-0.5px] whitespace-nowrap">
//                         Education History
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//             </div>{/* end RIGHT column */}
//           </div>{/* end TWO COLUMN ROW */}
//         </div>
//       </PageContent>
//     </div>
//   );
// }


// src/pages/employee/Dashboard.tsx
//
// Employee Dashboard — production-grade overview.
// Renders inside DashboardLayout — owns only PageHeader + PageContent.
// Patterns: same ToastStack, Drawer, ConfirmModal idioms as HR screens.

import { useMemo, useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText, FileCheck2, Upload, Clock, Calendar, AlertTriangle, CheckCircle2,
  ChevronRight, ArrowRight, MessageSquare, Phone, Mail, CreditCard, DollarSign,
  ShieldCheck, CircleDot, Circle, X, Info, Send, Briefcase,
  ClipboardList, CalendarClock, Receipt, ExternalLink,
} from 'lucide-react';
import { PageHeader, PageContent } from '../../components/layout/Pageheader';
import { useCurrentUser } from '../../hooks/useAuth';
import { useDashboard } from '../../hooks/employee/useDashboard';
import type {
  CaseStage, CaseStageStatus, ActionItem, ActionPriority, ActionCategory,
  DocumentSummaryItem, DocStatus, Deadline, DeadlineUrgency,
  ActivityItem, ActivityType, CaseTeamMember,
} from '../../types/employee/dashboard.types';

const PRIMARY = 'var(--theme-primary)';
const PRIMARY_GRADIENT = 'linear-gradient(135deg, var(--theme-primary) 0%, var(--theme-gradient-end) 100%)';

// ─────────────────────────────────────────────────────────────────────────────
// FORMATTERS
// ─────────────────────────────────────────────────────────────────────────────

// const _fmtDate = (iso: string) =>
//   new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

const fmtDateShort = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

function timeAgo(iso: string): string {
  const mins = Math.round((Date.now() - +new Date(iso)) / 60_000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.round(mins / 1440);
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days}d ago`;
  return fmtDateShort(iso);
}

const pct = (n: number, d: number) => d > 0 ? Math.round((n / d) * 100) : 0;

// ─────────────────────────────────────────────────────────────────────────────
// TOKENS
// ─────────────────────────────────────────────────────────────────────────────

function stageToken(s: CaseStageStatus) {
  switch (s) {
    case 'completed': return { ring: '#22c55e', fill: '#22c55e', text: '#15803d', bg: '#f0fdf4' };
    case 'active':    return { ring: PRIMARY,   fill: PRIMARY,   text: PRIMARY,   bg: '#eef2ff' };
    case 'upcoming':  return { ring: '#cbd5e1', fill: 'transparent', text: '#94a3b8', bg: '#f8fafc' };
    case 'blocked':   return { ring: '#ef4444', fill: '#ef4444', text: '#dc2626', bg: '#fef2f2' };
  }
}

function priorityToken(p: ActionPriority) {
  switch (p) {
    case 'urgent': return { bg: '#fef2f2', text: '#dc2626', dot: '#ef4444', label: 'Urgent' };
    case 'high':   return { bg: '#fff7ed', text: '#c2410c', dot: '#f97316', label: 'High' };
    case 'medium': return { bg: '#eff6ff', text: '#2563eb', dot: '#3b82f6', label: 'Medium' };
    case 'low':    return { bg: '#f0fdf4', text: '#15803d', dot: '#22c55e', label: 'Low' };
  }
}

function categoryIcon(c: ActionCategory): ReactNode {
  switch (c) {
    case 'document':    return <Upload size={14} />;
    case 'form':        return <ClipboardList size={14} />;
    case 'payment':     return <CreditCard size={14} />;
    case 'appointment': return <CalendarClock size={14} />;
    case 'review':      return <FileCheck2 size={14} />;
    case 'info':        return <Info size={14} />;
  }
}

function docStatusToken(s: DocStatus) {
  switch (s) {
    case 'verified':        return { bg: '#f0fdf4', text: '#15803d', dot: '#22c55e', label: 'Verified' };
    case 'pending_review':  return { bg: '#eff6ff', text: '#2563eb', dot: '#3b82f6', label: 'In Review' };
    case 'action_required': return { bg: '#fff7ed', text: '#c2410c', dot: '#f97316', label: 'Action Needed' };
    case 'not_uploaded':    return { bg: '#f8fafc', text: '#64748b', dot: '#cbd5e1', label: 'Not Uploaded' };
    case 'rejected':        return { bg: '#fef2f2', text: '#dc2626', dot: '#ef4444', label: 'Rejected' };
  }
}

function deadlineUrgencyToken(u: DeadlineUrgency) {
  switch (u) {
    case 'overdue':  return { text: '#dc2626', bg: '#fef2f2', icon: <AlertTriangle size={12} className="text-[#dc2626]" /> };
    case 'critical': return { text: '#dc2626', bg: '#fef2f2', icon: <AlertTriangle size={12} className="text-[#dc2626]" /> };
    case 'soon':     return { text: '#c2410c', bg: '#fff7ed', icon: <Clock size={12} className="text-[#c2410c]" /> };
    case 'normal':   return { text: '#64748b', bg: '#f8fafc', icon: <Calendar size={12} className="text-[#94a3b8]" /> };
  }
}

function activityIcon(t: ActivityType): { icon: ReactNode; bg: string; color: string } {
  switch (t) {
    case 'stage_advanced':        return { icon: <ArrowRight size={14} />,      bg: '#ede9fe', color: '#6d28d9' };
    case 'document_uploaded':     return { icon: <Upload size={14} />,          bg: '#dbeafe', color: '#1d4ed8' };
    case 'document_verified':     return { icon: <FileCheck2 size={14} />,      bg: '#dcfce7', color: '#15803d' };
    case 'document_rejected':     return { icon: <AlertTriangle size={14} />,   bg: '#fee2e2', color: '#dc2626' };
    case 'payment_received':      return { icon: <DollarSign size={14} />,      bg: '#dcfce7', color: '#15803d' };
    case 'message_received':      return { icon: <MessageSquare size={14} />,   bg: '#e0e7ff', color: '#4338ca' };
    case 'deadline_reminder':     return { icon: <Clock size={14} />,           bg: '#fef3c7', color: '#a16207' };
    case 'case_note':             return { icon: <Info size={14} />,            bg: '#f1f5f9', color: '#64748b' };
    case 'form_submitted':        return { icon: <ClipboardList size={14} />,   bg: '#ede9fe', color: '#6d28d9' };
    case 'appointment_scheduled': return { icon: <CalendarClock size={14} />,   bg: '#fef9c3', color: '#a16207' };
  }
}

const ownerLabel: Record<string, string> = {
  employee: 'You',
  attorney: 'Attorney',
  employer: 'Employer',
  uscis: 'USCIS',
};

// ─────────────────────────────────────────────────────────────────────────────
// REUSABLE UI PRIMITIVES
// ─────────────────────────────────────────────────────────────────────────────

function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`bg-white border border-[#f1f5f9] rounded-[16px] shadow-[0px_1px_2px_rgba(0,0,0,0.04)] ${className}`}>
      {children}
    </div>
  );
}

function CardHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-[12px] px-[20px] pt-[20px] pb-[4px]">
      <div className="min-w-0">
        <h3 className="text-[15px] font-semibold text-[#0f172a] tracking-[-0.5px]">{title}</h3>
        {subtitle && <p className="text-[12px] text-[#64748b] tracking-[-0.5px] mt-[2px]">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

function Badge({ bg, text, dot, label }: { bg: string; text: string; dot: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-[5px] px-[8px] py-[3px] rounded-[6px] text-[11px] font-medium tracking-[-0.3px] whitespace-nowrap"
          style={{ backgroundColor: bg, color: text }}>
      <span className="size-[6px] rounded-full shrink-0" style={{ backgroundColor: dot }} />
      {label}
    </span>
  );
}

function EmptyBlock({ icon, title, desc }: { icon: ReactNode; title: string; desc: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-[40px] text-center">
      <div className="size-[44px] rounded-full bg-[#f1f5f9] flex items-center justify-center mb-[10px] text-[#94a3b8]">
        {icon}
      </div>
      <p className="text-[14px] font-semibold text-[#0f172a] tracking-[-0.5px]">{title}</p>
      <p className="text-[12px] text-[#64748b] tracking-[-0.5px] mt-[2px] max-w-[260px]">{desc}</p>
    </div>
  );
}

function SkeletonCard({ h }: { h: number }) {
  return <div className="bg-white border border-[#f1f5f9] rounded-[16px] animate-pulse" style={{ height: h }} />;
}

function Drawer({ open, title, subtitle, onClose, children }: {
  open: boolean; title: string; subtitle?: string; onClose: () => void; children: ReactNode;
}) {
  if (!open) return null;
  return (
    <>
      <div className="fixed inset-0 bg-black/30 z-40" onClick={onClose} />
      <div className="fixed right-0 top-0 h-full w-full max-w-[480px] bg-white border-l border-[#e2e8f0] shadow-2xl z-50 flex flex-col">
        <div className="px-[20px] py-[16px] border-b border-[#f1f5f9] flex items-start justify-between gap-[12px]">
          <div className="min-w-0">
            <h3 className="text-[17px] font-semibold text-[#0f172a] tracking-[-0.5px]">{title}</h3>
            {subtitle && <p className="text-[12px] text-[#64748b] tracking-[-0.5px] mt-[2px]">{subtitle}</p>}
          </div>
          <button onClick={onClose}
            className="size-[34px] rounded-[10px] flex items-center justify-center text-[#64748b] hover:bg-[#f8fafc] shrink-0">
            <X size={18} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-[20px]">{children}</div>
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CASE PIPELINE — horizontal stage tracker
// ─────────────────────────────────────────────────────────────────────────────

function CasePipeline({ stages, currentStage }: { stages: CaseStage[]; currentStage: string }) {
  return (
    <div className="flex items-start gap-0 overflow-x-auto pb-[4px]">
      {stages.map((s, i) => {
        const tok = stageToken(s.status);
        const isCurrent = s.key === currentStage;
        return (
          <div key={s.key} className="flex items-start min-w-0 shrink-0" style={{ flex: '1 1 0' }}>
            {/* Node + connector */}
            <div className="flex flex-col items-center relative" style={{ minWidth: 28 }}>
              {/* Connector line to the left */}
              {i > 0 && (
                <div className="absolute top-[10px] right-[14px] h-[2px]"
                     style={{
                       width: 'calc(100% + 0px)',
                       transform: 'translateX(-100%)',
                       backgroundColor: s.status === 'completed' || s.status === 'active' ? '#c7d2fe' : '#e2e8f0',
                     }} />
              )}
              {/* Circle */}
              <div className={`relative z-10 flex items-center justify-center rounded-full shrink-0 transition-all ${
                isCurrent ? 'size-[22px] ring-4 ring-indigo-100' : 'size-[20px]'
              }`}
                   style={{ backgroundColor: tok.fill === 'transparent' ? '#fff' : tok.fill, border: `2px solid ${tok.ring}` }}>
                {s.status === 'completed' && (
                  <CheckCircle2 size={12} className="text-white" />
                )}
                {s.status === 'active' && (
                  <div className="size-[6px] rounded-full bg-white" />
                )}
              </div>
              {/* Label below */}
              <span className={`text-[10px] tracking-[-0.3px] mt-[6px] text-center leading-[13px] max-w-[80px] ${
                isCurrent ? 'font-bold' : 'font-medium'
              }`}
                    style={{ color: tok.text }}>
                {s.label}
              </span>
            </div>
            {/* Connector line to the right (except last) */}
            {i < stages.length - 1 && (
              <div className="flex-1 min-w-[12px] h-[2px] mt-[10px]"
                   style={{
                     backgroundColor: stages[i + 1].status === 'completed' || stages[i + 1].status === 'active' ? '#c7d2fe' : '#e2e8f0',
                   }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// KPI STAT CARD
// ─────────────────────────────────────────────────────────────────────────────

function KpiCard({ label, value, suffix, sub, icon, iconBg, iconColor, accent }: {
  label: string; value: string | number; suffix?: string; sub?: ReactNode;
  icon: ReactNode; iconBg: string; iconColor: string; accent?: string;
}) {
  return (
    <Card className="p-[18px] flex flex-col gap-[10px]">
      <div className="flex items-start justify-between gap-[8px]">
        <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#64748b] leading-[16px]">{label}</span>
        <div className="size-[34px] rounded-[10px] flex items-center justify-center shrink-0"
             style={{ backgroundColor: iconBg, color: iconColor }}>{icon}</div>
      </div>
      <div>
        <p className="text-[26px] font-bold text-[#0f172a] tracking-[-0.5px] leading-[32px]">
          {value}
          {suffix && <span className="text-[16px] font-normal text-[#94a3b8] ml-[4px]">{suffix}</span>}
        </p>
        {sub && <div className="mt-[4px]">{sub}</div>}
      </div>
      {accent && (
        <div className="h-[3px] rounded-full w-full mt-auto" style={{ background: accent }} />
      )}
    </Card>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ACTION ITEM ROW
// ─────────────────────────────────────────────────────────────────────────────

function ActionRow({ item, onNavigate }: { item: ActionItem; onNavigate: (route: string) => void }) {
  const p = priorityToken(item.priority);
  return (
    <div className={`flex items-start gap-[12px] px-[16px] py-[14px] border-b border-[#f1f5f9] last:border-b-0
                     hover:bg-[#fafbfc] transition cursor-pointer group ${item.completed ? 'opacity-50' : ''}`}
         onClick={() => item.route && onNavigate(item.route)}>
      {/* Icon */}
      <div className="size-[32px] rounded-[8px] flex items-center justify-center shrink-0 mt-[1px]"
           style={{ backgroundColor: item.completed ? '#f0fdf4' : p.bg, color: item.completed ? '#15803d' : p.text }}>
        {item.completed ? <CheckCircle2 size={14} /> : categoryIcon(item.category)}
      </div>
      {/* Content */}
      <div className="min-w-0 flex-1">
        <p className={`text-[13px] font-semibold tracking-[-0.5px] ${item.completed ? 'text-[#94a3b8] line-through' : 'text-[#0f172a]'}`}>
          {item.title}
        </p>
        <p className="text-[12px] text-[#64748b] tracking-[-0.5px] leading-[17px] mt-[2px] line-clamp-2">
          {item.description}
        </p>
        {item.due_date && !item.completed && (
          <p className="text-[11px] tracking-[-0.5px] mt-[4px]"
             style={{ color: (item.days_left ?? 99) <= 5 ? '#dc2626' : '#94a3b8' }}>
            Due {fmtDateShort(item.due_date)}{item.days_left !== undefined && ` · ${item.days_left}d left`}
          </p>
        )}
      </div>
      {/* Priority badge */}
      {!item.completed && <Badge {...p} />}
      {/* Arrow */}
      {item.route && (
        <ChevronRight size={14} className="text-[#cbd5e1] shrink-0 mt-[2px] group-hover:text-[#94a3b8] transition" />
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// DOCUMENT ROW
// ─────────────────────────────────────────────────────────────────────────────

function DocRow({ doc }: { doc: DocumentSummaryItem }) {
  const tok = docStatusToken(doc.status);
  return (
    <div className="flex items-center gap-[12px] px-[16px] py-[12px] border-b border-[#f1f5f9] last:border-b-0 hover:bg-[#fafbfc] transition">
      <div className="size-[30px] rounded-[8px] bg-[#f8fafc] border border-[#f1f5f9] flex items-center justify-center shrink-0 text-[#64748b]">
        <FileText size={14} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[13px] font-medium text-[#0f172a] tracking-[-0.5px] truncate">{doc.name}</p>
        <p className="text-[11px] text-[#94a3b8] tracking-[-0.5px]">
          {doc.category}{doc.uploaded_at ? ` · ${fmtDateShort(doc.uploaded_at)}` : ''}
        </p>
      </div>
      <Badge {...tok} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// DEADLINE ROW
// ─────────────────────────────────────────────────────────────────────────────

function DeadlineRow({ dl }: { dl: Deadline }) {
  const tok = deadlineUrgencyToken(dl.urgency);
  return (
    <div className="flex items-start gap-[10px] py-[10px] border-b border-[#f1f5f9] last:border-b-0">
      <div className="size-[28px] rounded-full flex items-center justify-center shrink-0 mt-[1px]"
           style={{ backgroundColor: tok.bg }}>{tok.icon}</div>
      <div className="min-w-0 flex-1">
        <p className="text-[13px] font-semibold text-[#0f172a] tracking-[-0.5px]">{dl.title}</p>
        <p className="text-[11px] text-[#94a3b8] tracking-[-0.5px] mt-[1px]">
          {fmtDateShort(dl.date)} · <span style={{ color: tok.text, fontWeight: 600 }}>
            {dl.days_left < 0 ? `${Math.abs(dl.days_left)}d overdue` : `${dl.days_left}d left`}
          </span>
          {' · '}{ownerLabel[dl.owner] ?? dl.owner}
        </p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ACTIVITY ROW
// ─────────────────────────────────────────────────────────────────────────────

function ActivityRow({ item }: { item: ActivityItem }) {
  const tok = activityIcon(item.type);
  return (
    <div className="flex items-start gap-[10px] py-[10px]">
      <div className="size-[28px] rounded-full flex items-center justify-center shrink-0 mt-[1px]"
           style={{ backgroundColor: tok.bg, color: tok.color }}>{tok.icon}</div>
      <div className="min-w-0 flex-1">
        <p className="text-[13px] font-semibold text-[#0f172a] tracking-[-0.5px]">{item.title}</p>
        <p className="text-[12px] text-[#64748b] tracking-[-0.5px] leading-[17px] mt-[1px] line-clamp-2">{item.description}</p>
        <p className="text-[11px] text-[#94a3b8] tracking-[-0.5px] mt-[2px]">
          {timeAgo(item.timestamp)}{item.actor ? ` · ${item.actor}` : ''}
        </p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CASE TEAM MEMBER
// ─────────────────────────────────────────────────────────────────────────────

function TeamMemberCard({ m }: { m: CaseTeamMember }) {
  const initials = m.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6'];
  const color = COLORS[m.name.split('').reduce((a, c) => a + c.charCodeAt(0), 0) % COLORS.length];

  return (
    <div className="flex items-center gap-[10px] py-[10px] border-b border-[#f1f5f9] last:border-b-0">
      <div className="size-[36px] rounded-full flex items-center justify-center text-white text-[12px] font-semibold shrink-0"
           style={{ backgroundColor: color }}>
        {initials}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[13px] font-semibold text-[#0f172a] tracking-[-0.5px] truncate">{m.name}</p>
        <p className="text-[11px] text-[#94a3b8] tracking-[-0.5px]">
          {m.role}
          {m.available
            ? <span className="text-[#22c55e] ml-[6px]">● Available</span>
            : <span className="text-[#94a3b8] ml-[6px]">○ Away</span>}
        </p>
      </div>
      <div className="flex items-center gap-[4px] shrink-0">
        {m.email && (
          <a href={`mailto:${m.email}`}
             className="size-[30px] rounded-[8px] border border-[#e2e8f0] flex items-center justify-center text-[#64748b] hover:bg-[#f8fafc] hover:text-indigo-700 transition">
            <Mail size={13} />
          </a>
        )}
        {m.phone && (
          <a href={`tel:${m.phone}`}
             className="size-[30px] rounded-[8px] border border-[#e2e8f0] flex items-center justify-center text-[#64748b] hover:bg-[#f8fafc] hover:text-indigo-700 transition">
            <Phone size={13} />
          </a>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// READINESS RING (SVG donut)
// ─────────────────────────────────────────────────────────────────────────────

function ReadinessDonut({ score }: { score: number }) {
  const size = 80, stroke = 8, r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  const color = score >= 80 ? '#22c55e' : score >= 50 ? '#f59e0b' : '#ef4444';
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#f1f5f9" strokeWidth={stroke} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke}
              strokeLinecap="round" strokeDasharray={`${dash} ${circ}`} />
      <text x={size / 2} y={size / 2} dy={5} textAnchor="middle"
            transform={`rotate(90 ${size / 2} ${size / 2})`}
            fill="#0f172a" fontSize={18} fontWeight={700} style={{ letterSpacing: '-0.5px' }}>
        {score}%
      </text>
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// DOC FILTER TABS
// ─────────────────────────────────────────────────────────────────────────────

type DocFilter = 'all' | 'action_required' | 'pending_review' | 'not_uploaded' | 'verified';
const DOC_FILTERS: { key: DocFilter; label: string }[] = [
  { key: 'all',             label: 'All' },
  { key: 'action_required', label: 'Action Needed' },
  { key: 'not_uploaded',    label: 'Missing' },
  { key: 'pending_review',  label: 'In Review' },
  { key: 'verified',        label: 'Verified' },
];

// ─────────────────────────────────────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────────────────────────────────────

export default function Dashboard() {
  const navigate = useNavigate();
  const { data: user } = useCurrentUser();
  const { data, isLoading } = useDashboard();

  const [search, setSearch] = useState('');
  const [docFilter, setDocFilter] = useState<DocFilter>('all');
  const [showAllActions, setShowAllActions] = useState(false);
  const [activityDrawer, setActivityDrawer] = useState(false);

  const firstName = user?.first_name ?? 'there';

  // ── Derived data ──────────────────────────────────────────────────────────
  const pendingActions = useMemo(
    () => (data?.action_items ?? []).filter(a => !a.completed),
    [data],
  );
  const completedActions = useMemo(
    () => (data?.action_items ?? []).filter(a => a.completed),
    [data],
  );

  const filteredDocs = useMemo(() => {
    if (!data) return [];
    return data.documents.filter(d => {
      if (docFilter !== 'all' && d.status !== docFilter) return false;
      return true;
    });
  }, [data, docFilter]);

  const docCounts = useMemo(() => {
    if (!data) return { verified: 0, review: 0, action: 0, missing: 0 };
    const docs = data.documents;
    return {
      verified: docs.filter(d => d.status === 'verified').length,
      review:   docs.filter(d => d.status === 'pending_review').length,
      action:   docs.filter(d => d.status === 'action_required').length,
      missing:  docs.filter(d => d.status === 'not_uploaded').length,
    };
  }, [data]);

  const s = data?.stats;
  const cs = data?.case_summary;

  return (
    <div className="flex flex-col h-full" style={{ fontFamily: 'Inter, sans-serif' }}>

      <PageHeader
        title="My Dashboard"
        subtitle={`Welcome back, ${firstName}. Here's your immigration case at a glance.`}
        showSearch
        searchValue={search}
        searchPlaceholder="Search documents, deadlines..."
        onSearchChange={setSearch}
      />

      <PageContent>
        {isLoading && !data ? (
          /* ── Skeleton ── */
          <div className="flex flex-col gap-[20px]">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[16px]">
              {[0, 1, 2, 3].map(i => <SkeletonCard key={i} h={130} />)}
            </div>
            <SkeletonCard h={100} />
            <div className="grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-[20px]">
              <SkeletonCard h={400} />
              <SkeletonCard h={400} />
            </div>
          </div>
        ) : data && (
          <div className="flex flex-col gap-[20px] sm:gap-[24px]">

            {/* ════════════════════════════════════════════════════════════════
                1. KPI ROW
            ════════════════════════════════════════════════════════════════ */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[16px]">
              <KpiCard
                label="Case Progress"
                value={`${cs?.overall_progress ?? 0}%`}
                icon={<ShieldCheck size={17} />} iconBg="#eef2ff" iconColor={PRIMARY}
                sub={
                  <p className="text-[12px] text-[#64748b] tracking-[-0.5px]">
                    {cs?.visa_label ?? 'No active case'}
                  </p>
                }
                accent={PRIMARY_GRADIENT}
              />

              <KpiCard
                label="Documents"
                value={`${s?.documents_verified ?? 0}/${s?.documents_total ?? 0}`}
                icon={<FileCheck2 size={17} />} iconBg="#f0fdf4" iconColor="#16a34a"
                sub={
                  <div className="flex items-center gap-[8px]">
                    <div className="bg-[#f1f5f9] h-[5px] rounded-full flex-1 overflow-hidden">
                      <div className="bg-[#22c55e] h-[5px] rounded-full transition-all"
                           style={{ width: `${pct(s?.documents_verified ?? 0, s?.documents_total ?? 1)}%` }} />
                    </div>
                    {(s?.documents_action_required ?? 0) > 0 && (
                      <span className="text-[11px] font-medium text-[#dc2626] tracking-[-0.3px] whitespace-nowrap">
                        {s?.documents_action_required} need action
                      </span>
                    )}
                  </div>
                }
              />

              <KpiCard
                label="Processing Time"
                value={s?.processing_days_elapsed ?? 0}
                suffix={`/ ${s?.processing_days_estimated ?? '—'} days`}
                icon={<Clock size={17} />} iconBg="#fff7ed" iconColor="#ea580c"
                sub={
                  <p className="text-[12px] text-[#64748b] tracking-[-0.5px]">{s?.processing_type ?? 'Standard'}</p>
                }
              />

              <KpiCard
                label="Next Deadline"
                value={s?.next_deadline_days !== undefined ? `${s.next_deadline_days}d` : '—'}
                icon={<AlertTriangle size={17} />}
                iconBg={(s?.next_deadline_days ?? 99) <= 7 ? '#fef2f2' : '#eff6ff'}
                iconColor={(s?.next_deadline_days ?? 99) <= 7 ? '#dc2626' : '#2563eb'}
                sub={
                  <p className="text-[12px] tracking-[-0.5px]"
                     style={{ color: (s?.next_deadline_days ?? 99) <= 7 ? '#dc2626' : '#64748b' }}>
                    {s?.next_deadline_label ?? 'No upcoming deadlines'}
                  </p>
                }
              />
            </div>

            {/* ════════════════════════════════════════════════════════════════
                2. CASE PIPELINE
            ════════════════════════════════════════════════════════════════ */}
            {cs && (
              <Card className="p-[20px]">
                <div className="flex items-center justify-between mb-[16px]">
                  <div>
                    <h3 className="text-[15px] font-semibold text-[#0f172a] tracking-[-0.5px]">
                      Application Progress
                    </h3>
                    <p className="text-[12px] text-[#64748b] tracking-[-0.5px] mt-[2px]">
                      {cs.visa_type} · {cs.visa_label}
                      {cs.filed_date && ` · Filed ${fmtDateShort(cs.filed_date)}`}
                      {cs.case_number && ` · ${cs.case_number}`}
                    </p>
                  </div>
                  <button onClick={() => navigate(`/applications/${cs.application_id}`)}
                    className="text-[12px] font-medium text-indigo-600 tracking-[-0.5px] hover:underline inline-flex items-center gap-[3px] shrink-0">
                    View Case <ExternalLink size={11} />
                  </button>
                </div>

                <CasePipeline stages={cs.stages} currentStage={cs.current_stage} />

                {/* Active stage note */}
                {cs.stages.find(st => st.key === cs.current_stage)?.note && (
                  <div className="mt-[14px] bg-indigo-50 border border-indigo-200 rounded-[10px] px-[14px] py-[10px] flex items-start gap-[8px]">
                    <Info size={14} className="text-indigo-600 shrink-0 mt-[2px]" />
                    <p className="text-[12px] text-[#3730a3] tracking-[-0.5px] leading-[17px]">
                      {cs.stages.find(st => st.key === cs.current_stage)!.note}
                    </p>
                  </div>
                )}
              </Card>
            )}

            {/* ════════════════════════════════════════════════════════════════
                3. MAIN GRID — left + right
            ════════════════════════════════════════════════════════════════ */}
            <div className="grid grid-cols-1 xl:grid-cols-[5fr_3fr] gap-[20px]">

              {/* ── LEFT COLUMN ────────────────────────────────────────────── */}
              <div className="flex flex-col gap-[20px] min-w-0">

                {/* ACTION ITEMS */}
                <Card>
                  <CardHeader
                    title="Action Items"
                    subtitle={`${pendingActions.length} pending · ${completedActions.length} completed`}
                    action={
                      pendingActions.length > 3 ? (
                        <button onClick={() => setShowAllActions(!showAllActions)}
                          className="text-[12px] font-medium text-indigo-600 tracking-[-0.5px] hover:underline inline-flex items-center gap-[3px]">
                          {showAllActions ? 'Show less' : 'View all'} <ChevronRight size={12} />
                        </button>
                      ) : undefined
                    }
                  />
                  <div className="mt-[8px]">
                    {pendingActions.length === 0 ? (
                      <EmptyBlock
                        icon={<CheckCircle2 size={20} />}
                        title="All caught up"
                        desc="You have no pending action items. We'll notify you when something needs your attention."
                      />
                    ) : (
                      <>
                        {(showAllActions ? pendingActions : pendingActions.slice(0, 4)).map(item => (
                          <ActionRow key={item.id} item={item} onNavigate={navigate} />
                        ))}
                        {completedActions.length > 0 && showAllActions && (
                          <>
                            <p className="px-[16px] pt-[12px] pb-[4px] text-[10px] font-semibold uppercase tracking-[0.08em] text-[#94a3b8]">
                              Completed
                            </p>
                            {completedActions.map(item => (
                              <ActionRow key={item.id} item={item} onNavigate={navigate} />
                            ))}
                          </>
                        )}
                      </>
                    )}
                  </div>
                </Card>

                {/* DOCUMENTS OVERVIEW */}
                <Card>
                  <CardHeader title="Documents" subtitle={`${data.documents.length} total documents across your case`} />

                  {/* Mini stat chips */}
                  <div className="px-[20px] mt-[8px] flex items-center gap-[8px] flex-wrap">
                    <span className="inline-flex items-center gap-[4px] px-[8px] py-[3px] rounded-[6px] bg-[#f0fdf4] text-[11px] font-medium text-[#15803d] tracking-[-0.3px]">
                      <CheckCircle2 size={11} /> {docCounts.verified} verified
                    </span>
                    <span className="inline-flex items-center gap-[4px] px-[8px] py-[3px] rounded-[6px] bg-[#eff6ff] text-[11px] font-medium text-[#2563eb] tracking-[-0.3px]">
                      <Clock size={11} /> {docCounts.review} in review
                    </span>
                    {docCounts.action > 0 && (
                      <span className="inline-flex items-center gap-[4px] px-[8px] py-[3px] rounded-[6px] bg-[#fff7ed] text-[11px] font-medium text-[#c2410c] tracking-[-0.3px]">
                        <AlertTriangle size={11} /> {docCounts.action} need action
                      </span>
                    )}
                    {docCounts.missing > 0 && (
                      <span className="inline-flex items-center gap-[4px] px-[8px] py-[3px] rounded-[6px] bg-[#f8fafc] text-[11px] font-medium text-[#64748b] tracking-[-0.3px]">
                        <Circle size={11} /> {docCounts.missing} missing
                      </span>
                    )}
                  </div>

                  {/* Filter tabs */}
                  <div className="px-[20px] mt-[12px] flex items-center gap-[6px] flex-wrap">
                    {DOC_FILTERS.map(f => (
                      <button key={f.key} onClick={() => setDocFilter(f.key)}
                        className={`h-[26px] px-[10px] rounded-[7px] text-[11px] font-medium tracking-[-0.5px] transition ${
                          docFilter === f.key
                            ? 'text-white shadow-sm'
                            : 'bg-[#f1f5f9] text-[#64748b] hover:bg-[#e2e8f0]'
                        }`}
                        style={docFilter === f.key ? { backgroundImage: PRIMARY_GRADIENT } : undefined}>
                        {f.label}
                      </button>
                    ))}
                  </div>

                  {/* Rows */}
                  <div className="mt-[8px]">
                    {filteredDocs.length === 0 ? (
                      <EmptyBlock icon={<FileText size={20} />} title="No documents"
                        desc={docFilter === 'all' ? 'No documents yet.' : 'No documents match this filter.'} />
                    ) : (
                      filteredDocs.map(doc => <DocRow key={doc.id} doc={doc} />)
                    )}
                  </div>

                  {/* Upload action */}
                  <div className="px-[16px] py-[14px] border-t border-[#f1f5f9]">
                    <button onClick={() => navigate('/documents/upload')}
                      className="w-full h-[38px] rounded-[10px] border-2 border-dashed border-indigo-200 text-indigo-600 text-[13px]
                                 font-medium hover:bg-indigo-50 transition inline-flex items-center justify-center gap-[6px]">
                      <Upload size={14} /> Upload Documents
                    </button>
                  </div>
                </Card>

                {/* RECENT ACTIVITY */}
                <Card>
                  <CardHeader
                    title="Recent Activity"
                    subtitle="Latest updates on your case"
                    action={
                      <button onClick={() => setActivityDrawer(true)}
                        className="text-[12px] font-medium text-indigo-600 tracking-[-0.5px] hover:underline inline-flex items-center gap-[3px]">
                        See all <ChevronRight size={12} />
                      </button>
                    }
                  />
                  <div className="px-[20px] pb-[16px] divide-y divide-[#f1f5f9]">
                    {data.activity.length === 0 ? (
                      <p className="text-[13px] text-[#94a3b8] py-[16px] text-center">No recent activity.</p>
                    ) : (
                      data.activity.slice(0, 5).map(item => <ActivityRow key={item.id} item={item} />)
                    )}
                  </div>
                </Card>
              </div>

              {/* ── RIGHT COLUMN ───────────────────────────────────────────── */}
              <div className="flex flex-col gap-[20px] min-w-0">

                {/* QUICK ACTIONS */}
                <Card className="p-[20px] flex flex-col gap-[10px]">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#64748b]">Quick Actions</span>
                  <div className="grid grid-cols-2 gap-[10px]">
                    {[
                      { label: 'Upload Docs',     icon: <Upload size={15} />,        route: '/documents/upload' },
                      { label: 'Messages',         icon: <MessageSquare size={15} />, route: '/messages' },
                      { label: 'My Applications',  icon: <Briefcase size={15} />,     route: '/applications/list' },
                      { label: 'Book Consultation', icon: <CalendarClock size={15} />, route: '/consultation' },
                    ].map(qa => (
                      <button key={qa.label} onClick={() => navigate(qa.route)}
                        className="h-[42px] rounded-[10px] border border-[#e2e8f0] bg-white text-[12px] font-medium text-[#334155]
                                   tracking-[-0.5px] hover:bg-[#f8fafc] hover:border-indigo-200 transition
                                   inline-flex items-center justify-center gap-[6px] shadow-[0px_1px_1px_rgba(0,0,0,0.04)]">
                        {qa.icon} {qa.label}
                      </button>
                    ))}
                  </div>
                </Card>

                {/* UPCOMING DEADLINES */}
                <Card>
                  <CardHeader title="Upcoming Deadlines" subtitle={`${data.deadlines.length} deadlines in the next 90 days`} />
                  <div className="px-[20px] pb-[16px]">
                    {data.deadlines.length === 0 ? (
                      <p className="text-[13px] text-[#94a3b8] py-[16px] text-center">No upcoming deadlines.</p>
                    ) : (
                      data.deadlines.slice(0, 5).map(dl => <DeadlineRow key={dl.id} dl={dl} />)
                    )}
                    {data.deadlines.length > 5 && (
                      <button className="mt-[8px] text-[12px] font-medium text-indigo-600 tracking-[-0.5px] hover:underline inline-flex items-center gap-[3px]">
                        View all deadlines <ArrowRight size={11} />
                      </button>
                    )}
                  </div>
                </Card>

                {/* CASE TEAM */}
                <Card>
                  <CardHeader title="Your Case Team" />
                  <div className="px-[20px] pb-[16px]">
                    {data.case_team.length === 0 ? (
                      <p className="text-[13px] text-[#94a3b8] py-[16px] text-center">No team assigned yet.</p>
                    ) : (
                      data.case_team.map(m => <TeamMemberCard key={m.id} m={m} />)
                    )}
                    <button onClick={() => navigate('/messages')}
                      className="mt-[10px] w-full h-[36px] rounded-[10px] border border-indigo-200 text-indigo-600 text-[12px]
                                 font-semibold hover:bg-indigo-50 transition inline-flex items-center justify-center gap-[6px]">
                      <Send size={13} /> Send a Message
                    </button>
                  </div>
                </Card>

                {/* PAYMENT SUMMARY */}
                <Card className="p-[20px]">
                  <div className="flex items-start justify-between mb-[12px]">
                    <h3 className="text-[15px] font-semibold text-[#0f172a] tracking-[-0.5px]">Payment Summary</h3>
                    <div className="size-[34px] rounded-[10px] bg-[#fef3c7] flex items-center justify-center text-[#a16207]">
                      <Receipt size={16} />
                    </div>
                  </div>
                  <div className="flex flex-col gap-[8px]">
                    {/* Progress bar */}
                    <div>
                      <div className="flex items-center justify-between text-[12px] tracking-[-0.5px] mb-[4px]">
                        <span className="text-[#64748b]">Paid</span>
                        <span className="font-semibold text-[#0f172a]">
                          ${data.payments.paid.toLocaleString()} / ${data.payments.total_fees.toLocaleString()}
                        </span>
                      </div>
                      <div className="bg-[#f1f5f9] h-[6px] rounded-full overflow-hidden">
                        <div className="bg-[#22c55e] h-[6px] rounded-full transition-all"
                             style={{ width: `${pct(data.payments.paid, data.payments.total_fees)}%` }} />
                      </div>
                    </div>
                    {/* Next payment */}
                    {data.payments.next_payment_label && (
                      <div className="bg-[#fffbeb] border border-[#fde68a] rounded-[10px] px-[12px] py-[10px] mt-[4px]">
                        <p className="text-[12px] font-semibold text-[#92400e] tracking-[-0.5px]">
                          Next: {data.payments.next_payment_label}
                        </p>
                        <p className="text-[11px] text-[#a16207] tracking-[-0.5px] mt-[2px]">
                          ${data.payments.next_payment_amount?.toLocaleString()} · Due {data.payments.next_payment_due ? fmtDateShort(data.payments.next_payment_due) : '—'}
                        </p>
                      </div>
                    )}
                    <button onClick={() => navigate('/payments')}
                      className="mt-[4px] text-[12px] font-medium text-indigo-600 tracking-[-0.5px] hover:underline inline-flex items-center gap-[3px]">
                      View all payments <ChevronRight size={12} />
                    </button>
                  </div>
                </Card>

                {/* PROFILE READINESS */}
                <Card className="p-[20px]">
                  <h3 className="text-[15px] font-semibold text-[#0f172a] tracking-[-0.5px] mb-[12px]">Profile Readiness</h3>
                  <div className="flex items-center gap-[18px]">
                    <ReadinessDonut score={s?.profile_readiness ?? 0} />
                    <div className="flex flex-col gap-[6px] min-w-0 flex-1">
                      {data.readiness.map(sec => (
                        <div key={sec.key} className="flex items-center gap-[8px]">
                          {sec.completed
                            ? <CircleDot size={13} className="text-[#22c55e] shrink-0" />
                            : <Circle size={13} className="text-[#cbd5e1] shrink-0" />}
                          <span className={`text-[12px] tracking-[-0.5px] truncate ${
                            sec.completed ? 'text-[#475569]' : 'text-[#94a3b8]'
                          }`}>
                            {sec.label}
                            {!sec.required && <span className="text-[10px] ml-[4px]">(optional)</span>}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <button onClick={() => navigate('/profile')}
                    className="mt-[14px] w-full h-[36px] rounded-[10px] text-white text-[12px] font-semibold hover:opacity-90 transition"
                    style={{ backgroundImage: PRIMARY_GRADIENT }}>
                    Complete Your Profile
                  </button>
                </Card>

                {/* SPONSOR INFO */}
                {s?.sponsor_name && (
                  <Card className="p-[20px]">
                    <div className="flex items-center gap-[10px]">
                      <div className="size-[40px] rounded-[10px] bg-indigo-50 flex items-center justify-center text-indigo-600">
                        <Briefcase size={18} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[14px] font-semibold text-[#0f172a] tracking-[-0.5px]">{s.sponsor_name}</p>
                        <p className="text-[12px] text-[#64748b] tracking-[-0.5px]">Sponsoring Employer</p>
                      </div>
                      {s.sponsor_verified && (
                        <span className="inline-flex items-center gap-[4px] px-[8px] py-[3px] rounded-[6px] bg-[#f0fdf4] text-[11px] font-medium text-[#15803d]">
                          <CheckCircle2 size={11} /> Verified
                        </span>
                      )}
                    </div>
                  </Card>
                )}
              </div>
            </div>
          </div>
        )}
      </PageContent>

      {/* Activity Drawer */}
      <Drawer
        open={activityDrawer}
        title="All Activity"
        subtitle="Complete timeline of your case"
        onClose={() => setActivityDrawer(false)}>
        <div className="divide-y divide-[#f1f5f9]">
          {data?.activity.map(item => (
            <div key={item.id} className="py-[2px]"><ActivityRow item={item} /></div>
          ))}
        </div>
      </Drawer>
    </div>
  );
}