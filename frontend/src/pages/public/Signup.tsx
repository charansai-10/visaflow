// // src/pages/public/Signup.tsx
// import { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import { authApi } from "../../api/auth.api";
// // ── Figma Assets (7-day URLs) ─────────────────────────────────────────────────
// const imgLogo         = "https://www.figma.com/api/mcp/asset/e213881b-856c-4d1a-9dc7-1d5a817e419b";
// const imgSecurityIcon = "https://www.figma.com/api/mcp/asset/f559994b-5898-40e4-ac79-780158243bce";
// const imgTimeIcon     = "https://www.figma.com/api/mcp/asset/40374205-b120-434d-995b-ffdb3ec43d20";
// const imgSupportIcon  = "https://www.figma.com/api/mcp/asset/286d0030-d811-4521-8790-d3447d4e559a";
// const imgTrustIcon    = "https://www.figma.com/api/mcp/asset/655482ea-5124-4ff9-80a7-54dae08437c2";
// const imgEmployeeIcon = "https://www.figma.com/api/mcp/asset/c02bb753-cd04-49ad-9334-4c3efa047e95";
// const imgEmployerIcon = "https://www.figma.com/api/mcp/asset/405db3f2-33fc-4518-88d1-7a929738db24";
// const imgAdminIcon    = "https://www.figma.com/api/mcp/asset/9aab39a0-5e85-4bb0-be3d-68ae97b329c9";
// const imgPersonIcon   = "https://www.figma.com/api/mcp/asset/f861b011-e1a5-4175-a2ad-d0e9921dfc47";
// const imgEmailIcon    = "https://www.figma.com/api/mcp/asset/3590ffb5-9b4d-49d3-8386-4761f3353554";
// const imgPhoneIcon    = "https://www.figma.com/api/mcp/asset/63f48d7f-9683-476b-9c32-70563ed8221e";
// const imgEyeIcon      = "https://www.figma.com/api/mcp/asset/fe5bd21d-262b-48cf-bb6a-d83e0c79b56c";
// const imgCheckIcon    = "https://www.figma.com/api/mcp/asset/e663c7da-4b1e-42eb-a1b0-25a66cd2aa7d";
// const imgSaveDraft    = "https://www.figma.com/api/mcp/asset/1f91cbcb-97ee-4b05-955b-99056ece56ce";
// const imgArrowRight   = "https://www.figma.com/api/mcp/asset/59780854-fc0b-4bde-8fab-5d00f870e46d";
// const imgGoogle       = "https://www.figma.com/api/mcp/asset/36e31a8e-176d-4ea8-bc60-54ccf9721017";
// const imgMicrosoft    = "https://www.figma.com/api/mcp/asset/ad188928-b6d8-49b6-ab3d-517fa131fafa";
// const imgLinkedIn     = "https://www.figma.com/api/mcp/asset/4fcae157-9e04-4505-8f0a-d52c003ace0f";

// // ── Types ─────────────────────────────────────────────────────────────────────
// type Role = "employee" | "hr" | "attorney" | "app_admin" | "";
// interface FormData {
//   role: Role; first_name: string; last_name: string; email: string; phone: string;
//   password: string; confirmPassword: string; referral_source: string;dialCode: string,
//   terms_accepted: boolean; marketing_opt_in: boolean; newsletter_opt_in: boolean;
// }
// type FieldErrors = Partial<Record<keyof FormData, string>>;

// // ── Shared StepBar export ─────────────────────────────────────────────────────
// export function StepBar({ current }: { current: number }) {
//   const steps = [
//     { n: 1, label: "Account Details", sub: "Basic information" },
//     { n: 2, label: "Profile Setup",   sub: "Your details" },
//     { n: 3, label: "Verification",    sub: "Confirm email" },
//   ];
//   return (
//     <div className="bg-white border-b border-[#e5e7eb] py-6">
//       <div className="max-w-[1440px] mx-auto px-20 flex items-center justify-center">
//         <div className="flex items-center max-w-[896px]">
//           {steps.map((s, i) => (
//             <div key={s.n} className="flex items-center">
//               <div className="flex items-center gap-3">
//                 <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold
//                   ${current === s.n ? "bg-[#2563eb] text-white" : current > s.n ? "bg-[#16a34a] text-white" : "bg-[#f3f4f6] text-[#9ca3af]"}`}>
//                   {current > s.n
//                     ? <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
//                     : s.n}
//                 </div>
//                 <div>
//                   <p className={`text-sm font-semibold tracking-[-0.5px] ${current === s.n ? "text-[#111827]" : current > s.n ? "text-[#16a34a]" : "text-[#9ca3af]"}`}>{s.label}</p>
//                   <p className="text-xs text-[#6b7280] tracking-[-0.5px]">{s.sub}</p>
//                 </div>
//               </div>
//               {i < steps.length - 1 && (
//                 <div className="mx-6 w-[201px] h-1 bg-[#e5e7eb] rounded-full">
//                   <div className="h-full bg-[#2563eb] rounded-full transition-all duration-500"
//                     style={{ width: current > s.n ? "100%" : current === s.n ? "33%" : "0%" }} />
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

// // ── Role data ─────────────────────────────────────────────────────────────────
// const ROLES = [
//   { value: "employee", label: "Employee/Student", sub: "Individual visa applicant",  icon: imgEmployeeIcon, iconBg: "bg-[#dbeafe]" },
//   { value: "hr",      label: "Employer/HR",      sub: "Company sponsoring visas",   icon: imgEmployerIcon, iconBg: "bg-[#f3e8ff]" },
//   { value: "attorney",           label: "Lawyer",           sub: "Immigration attorney",       icon: null,            iconBg: "bg-[#f3f4f6]" },
//   { value: "app_admin",            label: "Admin",            sub: "System administrator",       icon: imgAdminIcon,    iconBg: "bg-[#dcfce7]" },
// ];
// const COUNTRIES = [
//   { code: "US", flag: "🇺🇸", dial: "+1" },
//   { code: "GB", flag: "🇬🇧", dial: "+44" },
//   { code: "IN", flag: "🇮🇳", dial: "+91" },
//   { code: "CA", flag: "🇨🇦", dial: "+1" },
//   { code: "AU", flag: "🇦🇺", dial: "+61" },
//   { code: "DE", flag: "🇩🇪", dial: "+49" },
//   { code: "FR", flag: "🇫🇷", dial: "+33" },
//   { code: "AE", flag: "🇦🇪", dial: "+971" },
//   { code: "SG", flag: "🇸🇬", dial: "+65" },
//   { code: "JP", flag: "🇯🇵", dial: "+81" },
//   { code: "CN", flag: "🇨🇳", dial: "+86" },
//   { code: "BR", flag: "🇧🇷", dial: "+55" },
//   { code: "MX", flag: "🇲🇽", dial: "+52" },
//   { code: "ZA", flag: "🇿🇦", dial: "+27" },
//   { code: "NG", flag: "🇳🇬", dial: "+234" },
// ];


// export default function Signup() {
//   const navigate = useNavigate();
//   const [form, setForm] = useState<FormData>({
//     role: "employee", first_name: "", last_name: "", email: "", phone: "",
//     password: "", confirmPassword: "", referral_source: "",dialCode: "+1",
//     terms_accepted: false, marketing_opt_in: false, newsletter_opt_in: false,
//   });
//   const [showPw, setShowPw]     = useState(false);
//   const [showCpw, setShowCpw]   = useState(false);
//   const [loading, setLoading]   = useState(false);
//   const [apiError, setApiError] = useState<string | null>(null);
//   const [errors, setErrors]     = useState<FieldErrors>({});

//   const pw = form.password;
//   const strength = { len: pw.length >= 8, upper: /[A-Z]/.test(pw), special: /[0-9!@#$%^&*]/.test(pw) };

//   function set<K extends keyof FormData>(k: K, v: FormData[K]) {
//     setForm(p => ({ ...p, [k]: v }));
//     setErrors(p => ({ ...p, [k]: undefined }));
//     setApiError(null);
//   }

//   function validate(): boolean {
//     const e: FieldErrors = {};
//     if (!form.role)                                        e.role = "Please select a role.";
//     if (!form.first_name.trim())                           e.first_name = "First name is required.";
//     if (!form.last_name.trim())                            e.last_name = "Last name is required.";
//     if (!form.email || !/\S+@\S+\.\S+/.test(form.email))  e.email = "Valid email is required.";
//     if (!pw)                                               e.password = "Password is required.";
//     else if (!strength.len || !strength.upper || !strength.special) e.password = "Password doesn't meet requirements.";
//     if (form.confirmPassword !== pw)                       e.confirmPassword = "Passwords do not match.";
//     if (!form.terms_accepted)                              e.terms_accepted = "You must accept the Terms of Service.";
//     setErrors(e);
//     return Object.keys(e).length === 0;
//   }

//   async function handleSubmit() {
//     if (!validate()) return;
//     setLoading(true); setApiError(null);
//     try {
//       const data = await authApi.signup({
//         first_name: form.first_name.trim(), last_name: form.last_name.trim(),
//         email: form.email.trim().toLowerCase(), phone: form.phone ? `${form.dialCode}${form.phone}` : undefined,
//         password: form.password, role: form.role as string,
//         terms_accepted: form.terms_accepted, marketing_opt_in: form.marketing_opt_in,
//         newsletter_opt_in: form.newsletter_opt_in, referral_source: form.referral_source || undefined,
//       });
//       localStorage.setItem("access_token",  data.access_token);
//       localStorage.setItem("refresh_token", data.refresh_token);
//       localStorage.setItem("signup_email",  form.email.trim().toLowerCase());
//       navigate("/signup/verify-email");
//     } catch (e: unknown) {
//       setApiError(e instanceof Error ? e.message : "Something went wrong.");
//     } finally {
//       setLoading(false);
//     }
//   }

//   const inputBase = "bg-white border border-[#d1d5db] rounded-lg h-[50px] px-4 py-3 text-base text-[#111827] tracking-[-0.5px] w-full focus:outline-none focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb] transition placeholder:text-[#9ca3af]";

//   return (
//     <div className="min-h-screen bg-[#f9fafb]">
//       {/* ── Navbar ── */}
//       <header className="bg-white border-b border-[#e5e7eb] h-[72px] flex items-center sticky top-0 z-20">
//         <div className="max-w-[1440px] mx-auto w-full px-20 flex items-center justify-between">
//           <Link to="/" className="flex items-center gap-3">
//             <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-[#e5e7eb]">
//               <img src={imgLogo} alt="" className="w-[18px] h-7 object-contain" />
//             </div>
//             <span className="text-2xl font-bold text-[#111827] tracking-[-0.5px]">VisaFlow</span>
//           </Link>
//           <div className="flex items-center gap-1 text-sm tracking-[-0.5px]">
//             <span className="text-[#6b7280]">Already have an account?</span>
//             <Link to="/login" className="text-[#2563eb] font-semibold hover:underline ml-1">Sign In</Link>
//           </div>
//         </div>
//       </header>

//       {/* ── Hero ── */}
//       <div className="bg-white border-b border-[#e5e7eb] py-8 text-center px-6">
//         <h1 className="text-[36px] font-bold text-[#111827] tracking-[-0.5px] mb-3">Create Your Account</h1>
//         <p className="text-[#4b5563] text-base tracking-[-0.5px] max-w-2xl mx-auto leading-relaxed">
//           Join thousands of users managing their immigration journey with VisaFlow. Get started in minutes with our streamlined registration process.
//         </p>
//         <div className="flex items-center justify-center gap-6 mt-4">
//           {["14-day free trial", "No credit card required", "Cancel anytime"].map(t => (
//             <span key={t} className="flex items-center gap-1.5 text-sm text-[#4b5563] tracking-[-0.5px]">
//               <svg className="w-3.5 h-3.5 text-[#16a34a]" fill="currentColor" viewBox="0 0 20 20">
//                 <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
//               </svg>
//               {t}
//             </span>
//           ))}
//         </div>
//       </div>

//       <StepBar current={1} />

//       {/* ── Body ── */}
//       <div className="max-w-[1440px] mx-auto px-20 py-12">
//         <div className="max-w-[1024px] mx-auto flex gap-8 items-start">

//           {/* ── Sidebar ── */}
//           <aside className="w-[320px] shrink-0">
//             <div className="bg-white rounded-2xl shadow-[0px_2px_2px_rgba(0,0,0,0.06),0px_4px_3px_rgba(0,0,0,0.1)] p-6 sticky top-24">
//               <h3 className="text-lg font-bold text-[#111827] tracking-[-0.5px] mb-6">Why Choose VisaFlow?</h3>
//               <div className="flex flex-col gap-4">
//                 {[
//                   { icon: imgSecurityIcon, bg: "bg-[#dbeafe]", title: "Bank-Level Security",  desc: "Your data is encrypted and protected with enterprise-grade security." },
//                   { icon: imgTimeIcon,     bg: "bg-[#f3e8ff]", title: "Save Time & Effort",   desc: "Automated workflows and AI assistance streamline your immigration process." },
//                   { icon: imgSupportIcon,  bg: "bg-[#dcfce7]", title: "Expert Support",       desc: "Access to immigration experts and 24/7 customer support." },
//                   { icon: imgTrustIcon,    bg: "bg-[#ffedd5]", title: "Trusted by Thousands", desc: "Join 10,000+ successful cases processed through our platform." },
//                 ].map(f => (
//                   <div key={f.title} className="flex gap-3">
//                     <div className={`${f.bg} w-10 h-10 rounded-lg flex items-center justify-center shrink-0`}>
//                       <img src={f.icon} alt="" className="w-4 h-4 object-contain" />
//                     </div>
//                     <div>
//                       <p className="text-sm font-semibold text-[#111827] tracking-[-0.5px]">{f.title}</p>
//                       <p className="text-xs text-[#4b5563] tracking-[-0.5px] mt-0.5 leading-4">{f.desc}</p>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//               <div className="border-t border-[#e5e7eb] mt-6 pt-6">
//                 <div className="flex justify-center gap-2 mb-3">
//                   {[...Array(5)].map((_, i) => (
//                     <svg key={i} className="w-[19px] h-4 text-[#f59e0b]" fill="currentColor" viewBox="0 0 20 20">
//                       <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
//                     </svg>
//                   ))}
//                 </div>
//                 <p className="text-sm italic text-[#4b5563] text-center tracking-[-0.5px] leading-5">
//                   "VisaFlow made my H-1B process seamless. Highly recommended!"
//                 </p>
//                 <p className="text-xs text-[#6b7280] text-center tracking-[-0.5px] mt-1">- Priya S., Software Engineer</p>
//               </div>
//             </div>
//           </aside>

//           {/* ── Main Form ── */}
//           <main className="flex-1 flex flex-col gap-8">
//             {/* Main form card */}
//             <div className="bg-white rounded-2xl shadow-[0px_2px_2px_rgba(0,0,0,0.06),0px_4px_3px_rgba(0,0,0,0.1)] p-8">
//               <h2 className="text-2xl font-bold text-[#111827] tracking-[-0.5px] mb-2">Step 1: Account Details</h2>
//               <p className="text-base text-[#4b5563] tracking-[-0.5px] mb-8 leading-6">
//                 Let's start with your basic account information. All fields marked with <span className="text-[#ef4444]">*</span> are required.
//               </p>

//               {apiError && (
//                 <div className="mb-6 bg-[#fef2f2] border border-[#fca5a5] text-[#dc2626] rounded-xl px-4 py-3 text-sm flex gap-2 items-center tracking-[-0.5px]">
//                   <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/></svg>
//                   {apiError}
//                 </div>
//               )}

//               <div className="flex flex-col gap-6">
//                 {/* Role selector */}
//                 <div>
//                   <label className="block text-sm tracking-[-0.5px] mb-3">
//                     <span className="font-semibold text-[#ef4444]">*</span>
//                     <span className="font-semibold text-[#111827]"> I am registering as:</span>
//                   </label>
//                   <div className="grid grid-cols-2 gap-4">
//                     {ROLES.map(r => (
//                       <button key={r.value} type="button" onClick={() => set("role", r.value as Role)}
//                         className={`rounded-lg border-2 p-[18px] text-left transition-all focus:outline-none
//                           ${form.role === r.value ? "border-[#2563eb] bg-[#eff6ff]" : "border-[#e5e7eb] bg-white hover:border-[#93c5fd]"}`}>
//                         <div className={`${r.iconBg} w-10 h-10 rounded-lg flex items-center justify-center mb-2`}>
//                           {r.icon
//                             ? <img src={r.icon} alt="" className="w-4 h-4 object-contain" />
//                             : <span className="text-sm text-[#6b7280]">⚖️</span>}
//                         </div>
//                         <p className="text-base font-semibold text-[#111827] tracking-[-0.5px]">{r.label}</p>
//                         <p className="text-xs text-[#4b5563] tracking-[-0.5px] mt-0.5">{r.sub}</p>
//                       </button>
//                     ))}
//                   </div>
//                   {errors.role && <p className="text-[#ef4444] text-xs mt-1.5 tracking-[-0.5px]">{errors.role}</p>}
//                 </div>

//                 {/* Name row */}
//                 <div className="grid grid-cols-2 gap-6">
//                   <div>
//                     <label className="block text-sm tracking-[-0.5px] mb-2">
//                       <span className="font-semibold text-[#ef4444]">*</span>
//                       <span className="font-semibold text-[#111827]"> First Name</span>
//                     </label>
//                     <div className="relative">
//                       <input type="text" placeholder="Enter your first name" value={form.first_name}
//                         onChange={e => set("first_name", e.target.value)}
//                         className={`${inputBase} pr-10 ${errors.first_name ? "border-[#ef4444]" : ""}`} />
//                       <img src={imgPersonIcon} alt="" className="absolute right-4 top-[17px] w-3.5 h-4 object-contain opacity-40" />
//                     </div>
//                     {errors.first_name && <p className="text-[#ef4444] text-xs mt-1 tracking-[-0.5px]">{errors.first_name}</p>}
//                   </div>
//                   <div>
//                     <label className="block text-sm tracking-[-0.5px] mb-2">
//                       <span className="font-semibold text-[#ef4444]">*</span>
//                       <span className="font-semibold text-[#111827]"> Last Name</span>
//                     </label>
//                     <div className="relative">
//                       <input type="text" placeholder="Enter your last name" value={form.last_name}
//                         onChange={e => set("last_name", e.target.value)}
//                         className={`${inputBase} pr-10 ${errors.last_name ? "border-[#ef4444]" : ""}`} />
//                       <img src={imgPersonIcon} alt="" className="absolute right-4 top-[17px] w-3.5 h-4 object-contain opacity-40" />
//                     </div>
//                     {errors.last_name && <p className="text-[#ef4444] text-xs mt-1 tracking-[-0.5px]">{errors.last_name}</p>}
//                   </div>
//                 </div>

//                 {/* Email */}
//                 <div>
//                   <label className="block text-sm tracking-[-0.5px] mb-2">
//                     <span className="font-semibold text-[#ef4444]">*</span>
//                     <span className="font-semibold text-[#111827]"> Email Address</span>
//                   </label>
//                   <div className="relative">
//                     <input type="email" placeholder="you@example.com" value={form.email}
//                       onChange={e => set("email", e.target.value)}
//                       className={`${inputBase} pr-10 ${errors.email ? "border-[#ef4444]" : ""}`} />
//                     <img src={imgEmailIcon} alt="" className="absolute right-4 top-[17px] w-4 h-4 object-contain opacity-40" />
//                   </div>
//                   {errors.email
//                     ? <p className="text-[#ef4444] text-xs mt-1 tracking-[-0.5px]">{errors.email}</p>
//                     : <p className="text-[#6b7280] text-xs mt-1 tracking-[-0.5px]">We'll send a verification email to this address</p>}
//                 </div>

//                 {/* Phone */}
//                 {/* <div>
//                   <label className="block text-sm tracking-[-0.5px] mb-2">
//                     <span className="font-semibold text-[#111827]">Phone Number </span>
//                     <span className="font-semibold text-[#6b7280] text-xs">(Optional)</span>
//                   </label>
//                   <div className="flex gap-3">
//                     <div className="w-[195px] h-[50px] bg-[#efefef] border border-[#d1d5db] rounded-lg shrink-0 flex items-center px-4">
//                       <span className="text-sm text-[#6b7280] tracking-[-0.5px]">🇺🇸 +1</span>
//                     </div>
//                     <div className="relative flex-1">
//                       <input type="tel" placeholder="(555) 123-4567" value={form.phone}
//                         onChange={e => set("phone", e.target.value)} className={`${inputBase} pr-10`} />
//                       <img src={imgPhoneIcon} alt="" className="absolute right-4 top-[17px] w-4 h-4 object-contain opacity-40" />
//                     </div>
//                   </div>
//                   <p className="text-[#6b7280] text-xs mt-1 tracking-[-0.5px]">For SMS notifications and two-factor authentication</p>
//                 </div> */}

//                 <div className="flex gap-3">
//                   <select
//                     value={form.dialCode}
//                     onChange={e => set("dialCode", e.target.value)}
//                     className="w-[140px] h-[50px] bg-[#efefef] border border-[#d1d5db] rounded-lg shrink-0 px-3 text-sm text-[#374151] tracking-[-0.5px] cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400"
//                   >
//                     {COUNTRIES.map(c => (
//                       <option key={c.code} value={c.dial}>
//                         {c.flag} {c.dial}
//                       </option>
//                     ))}
//                   </select>
//                   <div className="relative flex-1">
//                     <input
//                       type="tel"
//                       placeholder="(555) 123-4567"
//                       value={form.phone}
//                       onChange={e => set("phone", e.target.value)}
//                       className={`${inputBase} pr-10`}
//                     />
//                     <img src={imgPhoneIcon} alt="" className="absolute right-4 top-[17px] w-4 h-4 object-contain opacity-40" />
//                   </div>
//                 </div>
//                 {/* Password */}
//                 <div>
//                   <label className="block text-sm tracking-[-0.5px] mb-2">
//                     <span className="font-semibold text-[#ef4444]">*</span>
//                     <span className="font-semibold text-[#111827]"> Password</span>
//                   </label>
//                   <div className="relative">
//                     <input type={showPw ? "text" : "password"} placeholder="Create a strong password"
//                       value={form.password} onChange={e => set("password", e.target.value)}
//                       className={`${inputBase} pr-12 ${errors.password ? "border-[#ef4444]" : ""}`} />
//                     <button type="button" onClick={() => setShowPw(p => !p)}
//                       className="absolute right-4 top-[13px] p-1 text-[#6b7280] hover:text-[#374151]">
//                       <img src={imgEyeIcon} alt="" className="w-[18px] h-4 object-contain" />
//                     </button>
//                   </div>
//                   {errors.password && <p className="text-[#ef4444] text-xs mt-1 tracking-[-0.5px]">{errors.password}</p>}
//                   {pw && (
//                     <div className="flex flex-col gap-2 mt-3">
//                       {[
//                         { ok: strength.len,     label: "At least 8 characters" },
//                         { ok: strength.upper,   label: "One uppercase letter" },
//                         { ok: strength.special, label: "One number or special character" },
//                       ].map(r => (
//                         <div key={r.label} className="flex items-center gap-2">
//                           <img src={imgCheckIcon} alt="" className={`w-3 h-3 object-contain ${r.ok ? "opacity-100" : "opacity-30"}`} />
//                           <span className={`text-xs tracking-[-0.5px] ${r.ok ? "text-[#16a34a]" : "text-[#4b5563]"}`}>{r.label}</span>
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </div>

//                 {/* Confirm password */}
//                 <div>
//                   <label className="block text-sm tracking-[-0.5px] mb-2">
//                     <span className="font-semibold text-[#ef4444]">*</span>
//                     <span className="font-semibold text-[#111827]"> Confirm Password</span>
//                   </label>
//                   <div className="relative">
//                     <input type={showCpw ? "text" : "password"} placeholder="Re-enter your password"
//                       value={form.confirmPassword} onChange={e => set("confirmPassword", e.target.value)}
//                       className={`${inputBase} pr-12 ${errors.confirmPassword ? "border-[#ef4444]" : ""}`} />
//                     <button type="button" onClick={() => setShowCpw(p => !p)}
//                       className="absolute right-4 top-[13px] p-1 text-[#6b7280] hover:text-[#374151]">
//                       <img src={imgEyeIcon} alt="" className="w-[18px] h-4 object-contain" />
//                     </button>
//                   </div>
//                   {errors.confirmPassword && <p className="text-[#ef4444] text-xs mt-1 tracking-[-0.5px]">{errors.confirmPassword}</p>}
//                 </div>

//                 {/* Referral */}
//                 <div>
//                   <label className="block text-sm tracking-[-0.5px] mb-2">
//                     <span className="font-semibold text-[#111827]">How did you hear about us? </span>
//                     <span className="font-semibold text-[#6b7280] text-xs">(Optional)</span>
//                   </label>
//                   <select value={form.referral_source} onChange={e => set("referral_source", e.target.value)}
//                     className="bg-[#efefef] border border-[#d1d5db] rounded-lg h-12 px-4 text-base text-[#111827] tracking-[-0.5px] w-full focus:outline-none focus:border-[#2563eb]">
//                     <option value="">Select an option</option>
//                     <option value="google">Google Search</option>
//                     <option value="linkedin">LinkedIn</option>
//                     <option value="friend">Friend / Colleague</option>
//                     <option value="immigration_attorney">Immigration Attorney</option>
//                     <option value="social_media">Social Media</option>
//                     <option value="other">Other</option>
//                   </select>
//                 </div>

//                 {/* Checkboxes */}
//                 <div className="flex flex-col gap-3">
//                   <label className="flex items-start gap-3 cursor-pointer">
//                     <input type="checkbox" checked={form.terms_accepted} onChange={e => set("terms_accepted", e.target.checked)}
//                       className="mt-0.5 w-4 h-4 border border-black rounded-sm shrink-0" />
//                     <span className="text-sm text-[#374151] tracking-[-0.5px] leading-5">
//                       <span className="text-[#ef4444]">*</span> I agree to the{" "}
//                       <Link to="/terms" className="text-[#2563eb] font-semibold hover:underline">Terms of Service</Link>
//                       {" "}and{" "}
//                       <Link to="/privacy" className="text-[#2563eb] font-semibold hover:underline">Privacy Policy</Link>
//                     </span>
//                   </label>
//                   {errors.terms_accepted && <p className="text-[#ef4444] text-xs ml-7 tracking-[-0.5px]">{errors.terms_accepted}</p>}

//                   <label className="flex items-start gap-3 cursor-pointer">
//                     <input type="checkbox" checked={form.marketing_opt_in} onChange={e => set("marketing_opt_in", e.target.checked)}
//                       className="mt-0.5 w-4 h-4 border border-black rounded-sm shrink-0" />
//                     <span className="text-sm text-[#374151] tracking-[-0.5px]">
//                       I'd like to receive product updates, immigration news, and special offers via email
//                     </span>
//                   </label>

//                   <label className="flex items-start gap-3 cursor-pointer">
//                     <input type="checkbox" checked={form.newsletter_opt_in} onChange={e => set("newsletter_opt_in", e.target.checked)}
//                       className="mt-0.5 w-4 h-4 border border-black rounded-sm shrink-0" />
//                     <span className="text-sm text-[#374151] tracking-[-0.5px]">
//                       Subscribe to our monthly immigration insights newsletter
//                     </span>
//                   </label>
//                 </div>

//                 {/* Actions */}
//                 <div className="border-t border-[#e5e7eb] pt-6 flex items-center justify-between">
//                   <button type="button" className="flex items-center gap-2 text-[#4b5563] text-base font-semibold tracking-[-0.5px] hover:text-[#111827] transition">
//                     <img src={imgSaveDraft} alt="" className="w-3.5 h-4 object-contain" />
//                     Save Draft
//                   </button>
//                   <div className="flex gap-3">
//                     <Link to="/"
//                       className="border border-[#d1d5db] rounded-lg h-[50px] px-6 flex items-center text-[#374151] text-base font-semibold tracking-[-0.5px] hover:bg-[#f9fafb] transition">
//                       Cancel
//                     </Link>
//                     <button type="button" onClick={handleSubmit} disabled={loading}
//                       className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white rounded-lg h-12 px-8 flex items-center gap-1.5 text-base font-semibold tracking-[-0.5px] shadow-[0px_4px_3px_rgba(0,0,0,0.1),0px_10px_7.5px_rgba(0,0,0,0.1)] transition disabled:opacity-60">
//                       {loading
//                         ? <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg> Creating…</>
//                         : <>Continue <img src={imgArrowRight} alt="→" className="w-3.5 h-4 object-contain" /></>}
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Social signup card */}
//             <div className="bg-white rounded-2xl shadow-[0px_2px_2px_rgba(0,0,0,0.06),0px_4px_3px_rgba(0,0,0,0.1)] p-8">
//               <p className="text-base text-[#4b5563] tracking-[-0.5px] text-center mb-6">Or sign up with</p>
//               <div className="grid grid-cols-3 gap-4">
//                 {[
//                   { icon: imgGoogle,    label: "Google" },
//                   { icon: imgMicrosoft, label: "Microsoft" },
//                   { icon: imgLinkedIn,  label: "LinkedIn" },
//                 ].map(s => (
//                   <button key={s.label} type="button"
//                     className="border border-[#d1d5db] rounded-lg h-[54px] flex items-center justify-center gap-2 text-base font-semibold text-[#374151] tracking-[-0.5px] hover:bg-[#f9fafb] transition shadow-[0px_1px_1px_rgba(0,0,0,0.05)]">
//                     <img src={s.icon} alt={s.label} className="w-[19px] h-5 object-contain" />
//                     {s.label}
//                   </button>
//                 ))}
//               </div>
//             </div>
//           </main>
//         </div>
//       </div>
//     </div>
//   );
// }




// src/pages/public/Signup.tsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { useMsal } from "@azure/msal-react";
import { authApi } from "../../api/auth.api";
import { callSSOEndpoint } from "../../lib/sso";
import imgLogo         from "../../assets/icons/nav-logo-icon.svg";   // same as CaseCreation logo
import imgSecurityIcon from "../../assets/icons/signup-security.svg";
import imgTimeIcon     from "../../assets/icons/signup-time.svg";
import imgSupportIcon  from "../../assets/icons/signup-support.svg";
import imgTrustIcon    from "../../assets/icons/signup-trust.svg";
import imgEmployeeIcon from "../../assets/icons/signup-employee.svg";
import imgEmployerIcon from "../../assets/icons/signup-employer.svg";
import imgAdminIcon    from "../../assets/icons/signup-admin.svg";
import imgPersonIcon   from "../../assets/icons/signup-person.svg";
import imgEmailIcon    from "../../assets/icons/signup-email.svg";
import imgPhoneIcon    from "../../assets/icons/signup-phone.svg";
import imgEyeIcon      from "../../assets/icons/signup-eye.svg";
import imgCheckIcon    from "../../assets/icons/signup-check.svg";
import imgSaveDraft    from "../../assets/icons/signup-save-draft.svg";
import imgArrowRight   from "../../assets/icons/signup-arrow-right.svg";
import imgGoogle       from "../../assets/icons/signup-google.svg";
import imgMicrosoft    from "../../assets/icons/signup-microsoft.svg";
import imgLinkedIn     from "../../assets/icons/signup-linkedin.svg";
import { useAuthStore } from '../../store/authStore';

// ── Types ─────────────────────────────────────────────────────────────────────
type Role = "employee" | "hr" | "attorney" | "app_admin" | "";
interface FormData {
  role: Role; first_name: string; last_name: string; email: string; phone: string;
  password: string; confirmPassword: string; referral_source: string; dialCode: string;
  terms_accepted: boolean; marketing_opt_in: boolean; newsletter_opt_in: boolean;
}
type FieldErrors = Partial<Record<keyof FormData, string>>;

// ── StepBar ───────────────────────────────────────────────────────────────────
export function StepBar({ current }: { current: number }) {
  const steps = [
    { n: 1, label: "Account Details", sub: "Basic information" },
    { n: 2, label: "Profile Setup",   sub: "Your details" },
    { n: 3, label: "Verification",    sub: "Confirm email" },
  ];
  return (
    <div className="bg-white border-b border-[#e5e7eb] py-6">
      <div className="max-w-[1440px] mx-auto px-20 flex items-center justify-center">
        <div className="flex items-center max-w-[896px]">
          {steps.map((s, i) => (
            <div key={s.n} className="flex items-center">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold
                  ${current === s.n ? "bg-[#2563eb] text-white" : current > s.n ? "bg-[#16a34a] text-white" : "bg-[#f3f4f6] text-[#9ca3af]"}`}>
                  {current > s.n
                    ? <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                    : s.n}
                </div>
                <div>
                  <p className={`text-sm font-semibold tracking-[-0.5px] ${current === s.n ? "text-[#111827]" : current > s.n ? "text-[#16a34a]" : "text-[#9ca3af]"}`}>{s.label}</p>
                  <p className="text-xs text-[#6b7280] tracking-[-0.5px]">{s.sub}</p>
                </div>
              </div>
              {i < steps.length - 1 && (
                <div className="mx-6 w-[201px] h-1 bg-[#e5e7eb] rounded-full">
                  <div className="h-full bg-[#2563eb] rounded-full transition-all duration-500"
                    style={{ width: current > s.n ? "100%" : current === s.n ? "33%" : "0%" }} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Constants ─────────────────────────────────────────────────────────────────
const ROLES = [
  { value: "employee", label: "Employee/Student", sub: "Individual visa applicant",  icon: imgEmployeeIcon, iconBg: "bg-[#dbeafe]" },
  { value: "hr",       label: "Employer/HR",      sub: "Company sponsoring visas",   icon: imgEmployerIcon, iconBg: "bg-[#f3e8ff]" },
  { value: "attorney", label: "Lawyer",            sub: "Immigration attorney",       icon: null,            iconBg: "bg-[#f3f4f6]" },
  { value: "app_admin",label: "Admin",             sub: "System administrator",       icon: imgAdminIcon,    iconBg: "bg-[#dcfce7]" },
];

const COUNTRIES = [
  { code: "US", flag: "🇺🇸", dial: "+1"   },
  { code: "GB", flag: "🇬🇧", dial: "+44"  },
  { code: "IN", flag: "🇮🇳", dial: "+91"  },
  { code: "CA", flag: "🇨🇦", dial: "+1"   },
  { code: "AU", flag: "🇦🇺", dial: "+61"  },
  { code: "DE", flag: "🇩🇪", dial: "+49"  },
  { code: "FR", flag: "🇫🇷", dial: "+33"  },
  { code: "AE", flag: "🇦🇪", dial: "+971" },
  { code: "SG", flag: "🇸🇬", dial: "+65"  },
  { code: "JP", flag: "🇯🇵", dial: "+81"  },
  { code: "CN", flag: "🇨🇳", dial: "+86"  },
  { code: "BR", flag: "🇧🇷", dial: "+55"  },
  { code: "MX", flag: "🇲🇽", dial: "+52"  },
  { code: "ZA", flag: "🇿🇦", dial: "+27"  },
  { code: "NG", flag: "🇳🇬", dial: "+234" },
];

// ── Component ─────────────────────────────────────────────────────────────────
export default function Signup() {
  const navigate = useNavigate();
  const { instance: msalInstance } = useMsal();

  // ── Form state ──
  const [form, setForm] = useState<FormData>({
    role: "employee", first_name: "", last_name: "", email: "", phone: "",
    password: "", confirmPassword: "", referral_source: "", dialCode: "+1",
    terms_accepted: false, marketing_opt_in: false, newsletter_opt_in: false,
  });
  const [showPw,   setShowPw]   = useState(false);
  const [showCpw,  setShowCpw]  = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [errors,   setErrors]   = useState<FieldErrors>({});

  // ── SSO state ──
  const [ssoLoading, setSsoLoading] = useState<string | null>(null);
  const [ssoError,   setSsoError]   = useState<string | null>(null);

  const pw = form.password;
  const strength = {
    len:     pw.length >= 8,
    upper:   /[A-Z]/.test(pw),
    special: /[0-9!@#$%^&*]/.test(pw),
  };

  function set<K extends keyof FormData>(k: K, v: FormData[K]) {
    setForm(p => ({ ...p, [k]: v }));
    setErrors(p => ({ ...p, [k]: undefined }));
    setApiError(null);
  }

  // ── Validation ──
  function validate(): boolean {
    const e: FieldErrors = {};
    if (!form.role)                                        e.role            = "Please select a role.";
    if (!form.first_name.trim())                           e.first_name      = "First name is required.";
    if (!form.last_name.trim())                            e.last_name       = "Last name is required.";
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email))  e.email           = "Valid email is required.";
    if (!pw)                                               e.password        = "Password is required.";
    else if (!strength.len || !strength.upper || !strength.special)
                                                           e.password        = "Password doesn't meet requirements.";
    if (form.confirmPassword !== pw)                       e.confirmPassword = "Passwords do not match.";
    if (!form.terms_accepted)                              e.terms_accepted  = "You must accept the Terms of Service.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  // ── Email/password submit ──
async function handleSubmit() {
  if (!validate()) return;
  setLoading(true);
  setApiError(null);
  try {
    const data = await authApi.signup({
      first_name:        form.first_name.trim(),
      last_name:         form.last_name.trim(),
      email:             form.email.trim().toLowerCase(),
      phone:             form.phone || undefined,
      country_code: form.dialCode|| undefined,
      password:          form.password,
      role:              form.role as string,
      terms_accepted:    form.terms_accepted,
      marketing_opt_in:  form.marketing_opt_in,
      newsletter_opt_in: form.newsletter_opt_in,
      referral_source:   form.referral_source || undefined,
    });
    
    // Store email for OTP page to display (non-sensitive, sessionStorage is fine)
    sessionStorage.setItem('signup_email', form.email.trim().toLowerCase());

    // ✅ Store access token in memory only — refresh token is now a httpOnly cookie
    useAuthStore.getState().setAuth({
      access_token: data.access_token,
      user:         data.user,
      roles:        data.roles,
    });

    navigate('/signup/verify-email');
 
  } catch (e: unknown) {
    setApiError(e instanceof Error ? e.message : 'Something went wrong.');
  } finally {
    setLoading(false);
  }
}

async function handleSSOSuccess(provider: string, token: string) {
  setSsoLoading(provider);
  setSsoError(null);
  try {
    const data = await callSSOEndpoint(provider, token);
    
    // ✅ Store access token in memory only
    useAuthStore.getState().setAuth({
      access_token: data.access_token,
      user:         data.user,
      roles:        data.roles,
    });

    navigate('/signup/verify-email');
 
  } catch (e: unknown) {
    // ✅ Properly extract the backend error message
    const err = e as import('axios').AxiosError<{ detail: string }>;
    setApiError(
      err.response?.data?.detail ??
      (e instanceof Error ? e.message : 'Something went wrong.')
    );
  } finally {
    setLoading(false);
  }
}
  // ── Google (popup) ──
  const loginWithGoogle = useGoogleLogin({
    onSuccess: (res) => handleSSOSuccess("google", res.access_token),
    onError:   ()    => setSsoError("Google sign-up was cancelled or failed."),
    flow: "implicit",
    scope: "openid email profile",
  });

  // ── Microsoft (MSAL popup) ──
  async function loginWithMicrosoft() {
    setSsoLoading("microsoft"); setSsoError(null);
    try {
      const res = await msalInstance.loginPopup({
        scopes: ["openid", "profile", "email","User.Read"],
      });
      await handleSSOSuccess("microsoft", res.idToken);
    } catch {
      setSsoError("Microsoft sign-up was cancelled or failed.");
      setSsoLoading(null);
    }
  }

  // ── LinkedIn (redirect) ──
  function loginWithLinkedIn() {
    const clientId    = import.meta.env.VITE_LINKEDIN_CLIENT_ID;
    const redirectUri = encodeURIComponent(window.location.origin + "/auth/linkedin/callback");
    const scope       = encodeURIComponent("openid profile email");
    const state       = crypto.randomUUID();
    sessionStorage.setItem("linkedin_state", state);
    window.location.href =
      `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&state=${state}`;
  }

  const inputBase = "bg-white border border-[#d1d5db] rounded-lg h-[50px] px-4 py-3 text-base text-[#111827] tracking-[-0.5px] w-full focus:outline-none focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb] transition placeholder:text-[#9ca3af]";

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#f9fafb]">

      {/* ── Navbar ── */}
      <header className="bg-white border-b border-[#e5e7eb] h-[72px] flex items-center sticky top-0 z-20">
        <div className="max-w-[1440px] mx-auto w-full px-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-[#e5e7eb]">
              <img src={imgLogo} alt="" className="w-[18px] h-7 object-contain" />
            </div>
            <span className="text-2xl font-bold text-[#111827] tracking-[-0.5px]">VisaFlow</span>
          </Link>
          <div className="flex items-center gap-1 text-sm tracking-[-0.5px]">
            <span className="text-[#6b7280]">Already have an account?</span>
            <Link to="/login" className="text-[#2563eb] font-semibold hover:underline ml-1">Sign In</Link>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <div className="bg-white border-b border-[#e5e7eb] py-8 text-center px-6">
        <h1 className="text-[36px] font-bold text-[#111827] tracking-[-0.5px] mb-3">Create Your Account</h1>
        <p className="text-[#4b5563] text-base tracking-[-0.5px] max-w-2xl mx-auto leading-relaxed">
          Join thousands of users managing their immigration journey with VisaFlow. Get started in minutes with our streamlined registration process.
        </p>
        <div className="flex items-center justify-center gap-6 mt-4">
          {["14-day free trial", "No credit card required", "Cancel anytime"].map(t => (
            <span key={t} className="flex items-center gap-1.5 text-sm text-[#4b5563] tracking-[-0.5px]">
              <svg className="w-3.5 h-3.5 text-[#16a34a]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
              {t}
            </span>
          ))}
        </div>
      </div>

      <StepBar current={1} />

      {/* ── Body ── */}
      <div className="max-w-[1440px] mx-auto px-20 py-12">
        <div className="max-w-[1024px] mx-auto flex gap-8 items-start">

          {/* ── Sidebar ── */}
          <aside className="w-[320px] shrink-0">
            <div className="bg-white rounded-2xl shadow-[0px_2px_2px_rgba(0,0,0,0.06),0px_4px_3px_rgba(0,0,0,0.1)] p-6 sticky top-24">
              <h3 className="text-lg font-bold text-[#111827] tracking-[-0.5px] mb-6">Why Choose VisaFlow?</h3>
              <div className="flex flex-col gap-4">
                {[
                  { icon: imgSecurityIcon, bg: "bg-[#dbeafe]", title: "Bank-Level Security",  desc: "Your data is encrypted and protected with enterprise-grade security." },
                  { icon: imgTimeIcon,     bg: "bg-[#f3e8ff]", title: "Save Time & Effort",   desc: "Automated workflows and AI assistance streamline your immigration process." },
                  { icon: imgSupportIcon,  bg: "bg-[#dcfce7]", title: "Expert Support",       desc: "Access to immigration experts and 24/7 customer support." },
                  { icon: imgTrustIcon,    bg: "bg-[#ffedd5]", title: "Trusted by Thousands", desc: "Join 10,000+ successful cases processed through our platform." },
                ].map(f => (
                  <div key={f.title} className="flex gap-3">
                    <div className={`${f.bg} w-10 h-10 rounded-lg flex items-center justify-center shrink-0`}>
                      <img src={f.icon} alt="" className="w-4 h-4 object-contain" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#111827] tracking-[-0.5px]">{f.title}</p>
                      <p className="text-xs text-[#4b5563] tracking-[-0.5px] mt-0.5 leading-4">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-[#e5e7eb] mt-6 pt-6">
                <div className="flex justify-center gap-2 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-[19px] h-4 text-[#f59e0b]" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                  ))}
                </div>
                <p className="text-sm italic text-[#4b5563] text-center tracking-[-0.5px] leading-5">
                  "VisaFlow made my H-1B process seamless. Highly recommended!"
                </p>
                <p className="text-xs text-[#6b7280] text-center tracking-[-0.5px] mt-1">- Priya S., Software Engineer</p>
              </div>
            </div>
          </aside>

          {/* ── Main Form ── */}
          <main className="flex-1 flex flex-col gap-8">
            <div className="bg-white rounded-2xl shadow-[0px_2px_2px_rgba(0,0,0,0.06),0px_4px_3px_rgba(0,0,0,0.1)] p-8">
              <h2 className="text-2xl font-bold text-[#111827] tracking-[-0.5px] mb-2">Step 1: Account Details</h2>
              <p className="text-base text-[#4b5563] tracking-[-0.5px] mb-8 leading-6">
                Let's start with your basic account information. All fields marked with <span className="text-[#ef4444]">*</span> are required.
              </p>

              {/* API Error */}
              {apiError && (
                <div className="mb-6 bg-[#fef2f2] border border-[#fca5a5] text-[#dc2626] rounded-xl px-4 py-3 text-sm flex gap-2 items-center tracking-[-0.5px]">
                  <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                  </svg>
                  {apiError}
                </div>
              )}

              <div className="flex flex-col gap-6">
                {/* Role selector */}
                <div>
                  <label className="block text-sm tracking-[-0.5px] mb-3">
                    <span className="font-semibold text-[#ef4444]">*</span>
                    <span className="font-semibold text-[#111827]"> I am registering as:</span>
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    {ROLES.map(r => (
                      <button key={r.value} type="button" onClick={() => set("role", r.value as Role)}
                        className={`rounded-lg border-2 p-[18px] text-left transition-all focus:outline-none
                          ${form.role === r.value ? "border-[#2563eb] bg-[#eff6ff]" : "border-[#e5e7eb] bg-white hover:border-[#93c5fd]"}`}>
                        <div className={`${r.iconBg} w-10 h-10 rounded-lg flex items-center justify-center mb-2`}>
                          {r.icon
                            ? <img src={r.icon} alt="" className="w-4 h-4 object-contain" />
                            : <span className="text-sm">⚖️</span>}
                        </div>
                        <p className="text-base font-semibold text-[#111827] tracking-[-0.5px]">{r.label}</p>
                        <p className="text-xs text-[#4b5563] tracking-[-0.5px] mt-0.5">{r.sub}</p>
                      </button>
                    ))}
                  </div>
                  {errors.role && <p className="text-[#ef4444] text-xs mt-1.5 tracking-[-0.5px]">{errors.role}</p>}
                </div>

                {/* Name row */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm tracking-[-0.5px] mb-2">
                      <span className="font-semibold text-[#ef4444]">*</span>
                      <span className="font-semibold text-[#111827]"> First Name</span>
                    </label>
                    <div className="relative">
                      <input type="text" placeholder="Enter your first name" value={form.first_name}
                        onChange={e => set("first_name", e.target.value)}
                        className={`${inputBase} pr-10 ${errors.first_name ? "border-[#ef4444]" : ""}`} />
                      <img src={imgPersonIcon} alt="" className="absolute right-4 top-[17px] w-3.5 h-4 object-contain opacity-40" />
                    </div>
                    {errors.first_name && <p className="text-[#ef4444] text-xs mt-1 tracking-[-0.5px]">{errors.first_name}</p>}
                  </div>
                  <div>
                    <label className="block text-sm tracking-[-0.5px] mb-2">
                      <span className="font-semibold text-[#ef4444]">*</span>
                      <span className="font-semibold text-[#111827]"> Last Name</span>
                    </label>
                    <div className="relative">
                      <input type="text" placeholder="Enter your last name" value={form.last_name}
                        onChange={e => set("last_name", e.target.value)}
                        className={`${inputBase} pr-10 ${errors.last_name ? "border-[#ef4444]" : ""}`} />
                      <img src={imgPersonIcon} alt="" className="absolute right-4 top-[17px] w-3.5 h-4 object-contain opacity-40" />
                    </div>
                    {errors.last_name && <p className="text-[#ef4444] text-xs mt-1 tracking-[-0.5px]">{errors.last_name}</p>}
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm tracking-[-0.5px] mb-2">
                    <span className="font-semibold text-[#ef4444]">*</span>
                    <span className="font-semibold text-[#111827]"> Email Address</span>
                  </label>
                  <div className="relative">
                    <input type="email" placeholder="you@example.com" value={form.email}
                      onChange={e => set("email", e.target.value)}
                      className={`${inputBase} pr-10 ${errors.email ? "border-[#ef4444]" : ""}`} />
                    <img src={imgEmailIcon} alt="" className="absolute right-4 top-[17px] w-4 h-4 object-contain opacity-40" />
                  </div>
                  {errors.email
                    ? <p className="text-[#ef4444] text-xs mt-1 tracking-[-0.5px]">{errors.email}</p>
                    : <p className="text-[#6b7280] text-xs mt-1 tracking-[-0.5px]">We'll send a verification email to this address</p>}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm tracking-[-0.5px] mb-2">
                    <span className="font-semibold text-[#111827]">Phone Number </span>
                    <span className="font-semibold text-[#6b7280] text-xs">(Optional)</span>
                  </label>
                  <div className="flex gap-3">
                    <select value={form.dialCode} onChange={e => set("dialCode", e.target.value)}
                      className="w-[140px] h-[50px] bg-[#efefef] border border-[#d1d5db] rounded-lg shrink-0 px-3 text-sm text-[#374151] tracking-[-0.5px] cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400">
                      {COUNTRIES.map(c => (
                        <option key={c.code} value={c.dial}>{c.flag} {c.dial}</option>
                      ))}
                    </select>
                    <div className="relative flex-1">
                      <input type="tel" placeholder="(555) 123-4567" value={form.phone}
                        onChange={e => set("phone", e.target.value)} className={`${inputBase} pr-10`} />
                      <img src={imgPhoneIcon} alt="" className="absolute right-4 top-[17px] w-4 h-4 object-contain opacity-40" />
                    </div>
                  </div>
                  <p className="text-[#6b7280] text-xs mt-1 tracking-[-0.5px]">For SMS notifications and two-factor authentication</p>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm tracking-[-0.5px] mb-2">
                    <span className="font-semibold text-[#ef4444]">*</span>
                    <span className="font-semibold text-[#111827]"> Password</span>
                  </label>
                  <div className="relative">
                    <input type={showPw ? "text" : "password"} placeholder="Create a strong password"
                      value={form.password} onChange={e => set("password", e.target.value)}
                      className={`${inputBase} pr-12 ${errors.password ? "border-[#ef4444]" : ""}`} />
                    <button type="button" onClick={() => setShowPw(p => !p)}
                      className="absolute right-4 top-[13px] p-1 text-[#6b7280] hover:text-[#374151]">
                      <img src={imgEyeIcon} alt="" className="w-[18px] h-4 object-contain" />
                    </button>
                  </div>
                  {errors.password && <p className="text-[#ef4444] text-xs mt-1 tracking-[-0.5px]">{errors.password}</p>}
                  {pw && (
                    <div className="flex flex-col gap-2 mt-3">
                      {[
                        { ok: strength.len,     label: "At least 8 characters" },
                        { ok: strength.upper,   label: "One uppercase letter" },
                        { ok: strength.special, label: "One number or special character" },
                      ].map(r => (
                        <div key={r.label} className="flex items-center gap-2">
                          <img src={imgCheckIcon} alt="" className={`w-3 h-3 object-contain ${r.ok ? "opacity-100" : "opacity-30"}`} />
                          <span className={`text-xs tracking-[-0.5px] ${r.ok ? "text-[#16a34a]" : "text-[#4b5563]"}`}>{r.label}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm tracking-[-0.5px] mb-2">
                    <span className="font-semibold text-[#ef4444]">*</span>
                    <span className="font-semibold text-[#111827]"> Confirm Password</span>
                  </label>
                  <div className="relative">
                    <input type={showCpw ? "text" : "password"} placeholder="Re-enter your password"
                      value={form.confirmPassword} onChange={e => set("confirmPassword", e.target.value)}
                      className={`${inputBase} pr-12 ${errors.confirmPassword ? "border-[#ef4444]" : ""}`} />
                    <button type="button" onClick={() => setShowCpw(p => !p)}
                      className="absolute right-4 top-[13px] p-1 text-[#6b7280] hover:text-[#374151]">
                      <img src={imgEyeIcon} alt="" className="w-[18px] h-4 object-contain" />
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="text-[#ef4444] text-xs mt-1 tracking-[-0.5px]">{errors.confirmPassword}</p>}
                </div>

                {/* Referral */}
                <div>
                  <label className="block text-sm tracking-[-0.5px] mb-2">
                    <span className="font-semibold text-[#111827]">How did you hear about us? </span>
                    <span className="font-semibold text-[#6b7280] text-xs">(Optional)</span>
                  </label>
                  <select value={form.referral_source} onChange={e => set("referral_source", e.target.value)}
                    className="bg-[#efefef] border border-[#d1d5db] rounded-lg h-12 px-4 text-base text-[#111827] tracking-[-0.5px] w-full focus:outline-none focus:border-[#2563eb]">
                    <option value="">Select an option</option>
                    <option value="google">Google Search</option>
                    <option value="linkedin">LinkedIn</option>
                    <option value="friend">Friend / Colleague</option>
                    <option value="immigration_attorney">Immigration Attorney</option>
                    <option value="social_media">Social Media</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Checkboxes */}
                <div className="flex flex-col gap-3">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" checked={form.terms_accepted}
                      onChange={e => set("terms_accepted", e.target.checked)}
                      className="mt-0.5 w-4 h-4 border border-black rounded-sm shrink-0" />
                    <span className="text-sm text-[#374151] tracking-[-0.5px] leading-5">
                      <span className="text-[#ef4444]">*</span> I agree to the{" "}
                      <Link to="/terms" className="text-[#2563eb] font-semibold hover:underline">Terms of Service</Link>
                      {" "}and{" "}
                      <Link to="/privacy" className="text-[#2563eb] font-semibold hover:underline">Privacy Policy</Link>
                    </span>
                  </label>
                  {errors.terms_accepted && <p className="text-[#ef4444] text-xs ml-7 tracking-[-0.5px]">{errors.terms_accepted}</p>}

                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" checked={form.marketing_opt_in}
                      onChange={e => set("marketing_opt_in", e.target.checked)}
                      className="mt-0.5 w-4 h-4 border border-black rounded-sm shrink-0" />
                    <span className="text-sm text-[#374151] tracking-[-0.5px]">
                      I'd like to receive product updates, immigration news, and special offers via email
                    </span>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" checked={form.newsletter_opt_in}
                      onChange={e => set("newsletter_opt_in", e.target.checked)}
                      className="mt-0.5 w-4 h-4 border border-black rounded-sm shrink-0" />
                    <span className="text-sm text-[#374151] tracking-[-0.5px]">
                      Subscribe to our monthly immigration insights newsletter
                    </span>
                  </label>
                </div>

                {/* Actions */}
                <div className="border-t border-[#e5e7eb] pt-6 flex items-center justify-between">
                  <button type="button"
                    className="flex items-center gap-2 text-[#4b5563] text-base font-semibold tracking-[-0.5px] hover:text-[#111827] transition">
                    <img src={imgSaveDraft} alt="" className="w-3.5 h-4 object-contain" />
                    Save Draft
                  </button>
                  <div className="flex gap-3">
                    <Link to="/"
                      className="border border-[#d1d5db] rounded-lg h-[50px] px-6 flex items-center text-[#374151] text-base font-semibold tracking-[-0.5px] hover:bg-[#f9fafb] transition">
                      Cancel
                    </Link>
                    <button type="button" onClick={handleSubmit} disabled={loading}
                      className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white rounded-lg h-12 px-8 flex items-center gap-1.5 text-base font-semibold tracking-[-0.5px] shadow-[0px_4px_3px_rgba(0,0,0,0.1),0px_10px_7.5px_rgba(0,0,0,0.1)] transition disabled:opacity-60">
                      {loading
                        ? <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                          </svg> Creating…</>
                        : <>Continue <img src={imgArrowRight} alt="→" className="w-3.5 h-4 object-contain" /></>}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Social Signup Card ── */}
            <div className="bg-white rounded-2xl shadow-[0px_2px_2px_rgba(0,0,0,0.06),0px_4px_3px_rgba(0,0,0,0.1)] p-8">
              <p className="text-base text-[#4b5563] tracking-[-0.5px] text-center mb-6">Or sign up with</p>

              {ssoError && (
                <div className="mb-4 bg-[#fef2f2] border border-[#fca5a5] text-[#dc2626] rounded-xl px-4 py-3 text-sm tracking-[-0.5px] flex gap-2 items-center">
                  <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                  </svg>
                  {ssoError}
                </div>
              )}

              <div className="grid grid-cols-3 gap-4">
                {[
                  { icon: imgGoogle,    label: "Google",    provider: "google",    onClick: () => loginWithGoogle()        },
                  { icon: imgMicrosoft, label: "Microsoft", provider: "microsoft", onClick: () => loginWithMicrosoft()     },
                  { icon: imgLinkedIn,  label: "LinkedIn",  provider: "linkedin",  onClick: () => loginWithLinkedIn()      },
                ].map(s => (
                  <button key={s.label} type="button" onClick={s.onClick}
                    disabled={!!ssoLoading}
                    className="border border-[#d1d5db] rounded-lg h-[54px] flex items-center justify-center gap-2 text-base font-semibold text-[#374151] tracking-[-0.5px] hover:bg-[#f9fafb] transition shadow-[0px_1px_1px_rgba(0,0,0,0.05)] disabled:opacity-50 disabled:cursor-not-allowed">
                    {ssoLoading === s.provider
                      ? <svg className="w-4 h-4 animate-spin text-[#6b7280]" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                        </svg>
                      : <img src={s.icon} alt={s.label} className="w-[19px] h-5 object-contain" />}
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

          </main>
        </div>
      </div>
    </div>
  );
}