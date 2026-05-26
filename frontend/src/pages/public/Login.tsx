// // src/pages/public/Login.tsx
// import { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import { authApi } from "../../api/auth.api";

// // ── Figma asset URLs (valid 7 days) ──────────────────────────────────────────
// const imgLogoIcon   = "https://www.figma.com/api/mcp/asset/85163262-e059-452c-90cd-05db65f54a90";
// const imgShieldIcon = "https://www.figma.com/api/mcp/asset/983a8ad7-a57f-47d4-8d52-197ab1aa5707";
// const imgBellIcon   = "https://www.figma.com/api/mcp/asset/a125670c-5883-4efb-8234-8920c78ac5ee";
// const imgTeamIcon   = "https://www.figma.com/api/mcp/asset/37190c1e-94a3-44e9-b187-f643dcd52b55";
// const imgLoginIcon  = "https://www.figma.com/api/mcp/asset/6e33a6f4-70a2-4d1e-96ad-8266bdd419d3";
// const imgEmailIcon  = "https://www.figma.com/api/mcp/asset/a18f65f5-170b-4ce9-9948-ecfa82827168";
// const imgLockIcon   = "https://www.figma.com/api/mcp/asset/4cf4ba9e-6325-4a7c-a759-d52deac44bce";
// const imgEyeIcon    = "https://www.figma.com/api/mcp/asset/091d7a02-4d36-4cbf-8aa4-2587de389eab";
// const imgArrowIcon  = "https://www.figma.com/api/mcp/asset/0c7ec985-9a13-410a-86d1-97f6fa11de7a";
// const imgGoogleIcon = "https://www.figma.com/api/mcp/asset/a50086db-ce4f-41df-ab37-a21f76346d9f";
// const imgMsIcon     = "https://www.figma.com/api/mcp/asset/d4d54d1d-4886-4eff-b67b-fb0bd795e9fd";
// const imgAppleIcon  = "https://www.figma.com/api/mcp/asset/36e3eb14-d5bd-402b-9e6b-c2ee83290ae5";
// const imgSoc2Icon   = "https://www.figma.com/api/mcp/asset/29830d32-535a-4bb0-a42d-46b30bab7510";
// const imgEncIcon    = "https://www.figma.com/api/mcp/asset/0747d287-eca0-4a52-bf0a-bc75ab20237c";
// const imgGdprIcon   = "https://www.figma.com/api/mcp/asset/6f3d5a03-86ef-4eaf-9854-d546e7da5edf";


// export default function Login() {
//   const navigate = useNavigate();
//   const [email,      setEmail]      = useState("");
//   const [password,   setPassword]   = useState("");
//   const [rememberMe, setRememberMe] = useState(false);
//   const [showPw,     setShowPw]     = useState(false);
//   const [loading,    setLoading]    = useState(false);
//   const [apiError,   setApiError]   = useState<string | null>(null);
//   const [emailErr,   setEmailErr]   = useState<string | null>(null);
//   const [pwErr,      setPwErr]      = useState<string | null>(null);

//   function validate() {
//     let ok = true;
//     if (!email || !/\S+@\S+\.\S+/.test(email)) { setEmailErr("Valid email is required."); ok = false; }
//     else setEmailErr(null);
//     if (!password) { setPwErr("Password is required."); ok = false; }
//     else setPwErr(null);
//     return ok;
//   }

//   async function handleLogin() {
//     if (!validate()) return;
//     setLoading(true);
//     setApiError(null);
//     try {
//       const data = await authApi.login({ email: email.trim().toLowerCase(), password });
//       localStorage.setItem("access_token",  data.access_token);
//       localStorage.setItem("refresh_token", data.refresh_token);
//       if (rememberMe) localStorage.setItem("remember_email", email.trim().toLowerCase());
//       else localStorage.removeItem("remember_email");
//       navigate("/dashboard");
//     } catch (e: unknown) {
//       setApiError(e instanceof Error ? e.message : "Invalid email or password.");
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <div className="bg-[#f9fafb] min-h-screen w-full flex">

//       {/* ── LEFT PANEL ─────────────────────────────────────────────────────── */}
//       <div
//         className="hidden lg:flex w-1/2 min-h-screen items-center justify-center px-[104px] relative overflow-hidden"
//         style={{ background: "linear-gradient(118.998deg, #667eea 0%, #764ba2 100%)" }}
//       >
//         {/* Decorative blurs */}
//         <div className="absolute inset-0 opacity-10 pointer-events-none">
//           <div className="absolute bg-white rounded-full h-[288px] left-[40px] right-[392px] top-[80px]" style={{ filter: "blur(32px)" }} />
//           <div className="absolute bg-white rounded-full h-[384px] left-[296px] right-[40px] top-[835px]" style={{ filter: "blur(32px)" }} />
//         </div>

//         <div className="flex flex-col gap-8 w-full max-w-[512px] relative">
//           {/* Logo */}
//           <div className="flex items-center gap-3">
//             <div className="bg-white rounded-[12px] w-12 h-12 flex items-center justify-center shrink-0 px-[14px] py-2">
//               <img src={imgLogoIcon} alt="VisaFlow" className="w-[21px] h-6" />
//             </div>
//             <span className="text-white font-bold text-[30px] tracking-[-0.5px] leading-9" style={{ fontFamily: "Inter, sans-serif" }}>
//               VisaFlow
//             </span>
//           </div>

//           {/* Headline */}
//           <h1 className="text-white font-bold text-[36px] tracking-[-0.5px] leading-[45px]" style={{ fontFamily: "Inter, sans-serif" }}>
//             Welcome Back to Your <br />Immigration Journey
//           </h1>

//           {/* Subtitle */}
//           <p className="text-[rgba(255,255,255,0.9)] font-normal text-[20px] tracking-[-0.5px] leading-[33px]" style={{ fontFamily: "Inter, sans-serif" }}>
//             Access your cases, track deadlines, collaborate with your team, and manage your immigration process—all in one secure platform.
//           </p>

//           {/* Feature list */}
//           <div className="flex flex-col gap-4">
//             {[
//               { icon: imgShieldIcon, iconW: "w-4", iconH: "h-4", title: "Bank-Level Security",     desc: "Your sensitive documents are protected with AES-256 encryption and SOC 2 compliance." },
//               { icon: imgBellIcon,   iconW: "w-4", iconH: "h-4", title: "Real-Time Updates",        desc: "Get instant notifications about case progress, deadline reminders, and policy changes." },
//               { icon: imgTeamIcon,   iconW: "w-5", iconH: "h-4", title: "Seamless Collaboration",   desc: "Work effortlessly with employers, lawyers, and HR teams in one unified workspace." },
//             ].map((f) => (
//               <div key={f.title} className="flex gap-3 items-start">
//                 <div className="bg-[rgba(255,255,255,0.2)] rounded-lg w-8 h-8 flex items-center justify-center shrink-0">
//                   <img src={f.icon} alt="" className={`${f.iconW} ${f.iconH}`} />
//                 </div>
//                 <div className="flex flex-col gap-1">
//                   <p className="text-white font-semibold text-base tracking-[-0.5px] leading-6" style={{ fontFamily: "Inter, sans-serif" }}>{f.title}</p>
//                   <p className="text-[rgba(255,255,255,0.8)] font-normal text-sm tracking-[-0.5px] leading-5" style={{ fontFamily: "Inter, sans-serif" }}>{f.desc}</p>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* Stats */}
//           <div className="flex gap-6 items-center pt-8 border-t border-[rgba(255,255,255,0.2)]">
//             {[
//               { value: "10,000+", label: "Cases Processed" },
//               { value: "98%",     label: "Success Rate" },
//               { value: "500+",    label: "Organizations" },
//             ].map((s) => (
//               <div key={s.label} className="flex flex-col gap-1 items-center">
//                 <p className="text-white font-bold text-[30px] tracking-[-0.5px] leading-9 text-center" style={{ fontFamily: "Inter, sans-serif" }}>{s.value}</p>
//                 <p className="text-[rgba(255,255,255,0.8)] font-normal text-sm tracking-[-0.5px] leading-5 text-center" style={{ fontFamily: "Inter, sans-serif" }}>{s.label}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* ── RIGHT PANEL ────────────────────────────────────────────────────── */}
//       <div className="flex-1 flex items-center justify-center px-[136px] py-12 bg-[#f9fafb]">
//         <div className="flex flex-col gap-6 w-full max-w-[448px]">

//           {/* White card */}
//           <div
//             className="bg-white rounded-[16px] p-10 flex flex-col gap-8"
//             style={{ boxShadow: "0px 20px 12.5px rgba(0,0,0,0.1), 0px 8px 5px rgba(0,0,0,0.1)" }}
//           >
//             {/* Card header */}
//             <div className="flex flex-col gap-4 items-center">
//               <div
//                 className="w-16 h-16 rounded-[16px] flex items-center justify-center"
//                 style={{ background: "linear-gradient(135deg, #dbeafe 0%, #f3e8ff 100%)" }}
//               >
//                 <img src={imgLoginIcon} alt="" className="w-[30px] h-6" />
//               </div>
//               <h2 className="text-[#111827] font-bold text-[30px] tracking-[-0.5px] leading-9 text-center" style={{ fontFamily: "Inter, sans-serif" }}>
//                 Sign In to Your Account
//               </h2>
//               <p className="text-[#4b5563] font-normal text-base tracking-[-0.5px] leading-6 text-center" style={{ fontFamily: "Inter, sans-serif" }}>
//                 Enter your credentials to access your dashboard
//               </p>
//             </div>

//             {/* API error banner */}
//             {apiError && (
//               <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm" style={{ fontFamily: "Inter, sans-serif" }}>
//                 {apiError}
//               </div>
//             )}

//             {/* Fields */}
//             <div className="flex flex-col gap-6">

//               {/* Email field */}
//               <div className="flex flex-col gap-2">
//                 <label className="text-sm tracking-[-0.5px]" style={{ fontFamily: "Inter, sans-serif" }}>
//                   <span className="font-semibold text-[#374151]">Email Address </span>
//                   <span className="font-semibold text-[#ef4444]">*</span>
//                 </label>
//                 <div className="relative">
//                   <div className="absolute left-4 inset-y-0 flex items-center pointer-events-none">
//                     <img src={imgEmailIcon} alt="" className="w-4 h-4" />
//                   </div>
//                   <input
//                     type="email"
//                     placeholder="you@example.com"
//                     value={email}
//                     onChange={e => { setEmail(e.target.value); setEmailErr(null); setApiError(null); }}
//                     onKeyDown={e => e.key === "Enter" && handleLogin()}
//                     autoComplete="email"
//                     className={`w-full h-[54px] pl-11 pr-4 py-[14px] bg-white border rounded-[12px] text-[#111827] text-base tracking-[-0.5px] leading-6 outline-none transition
//                       focus:ring-2 focus:ring-[#2563eb]/20 focus:border-[#2563eb]
//                       ${emailErr ? "border-[#ef4444]" : "border-[#d1d5db]"}`}
//                     style={{ fontFamily: "Inter, sans-serif" }}
//                   />
//                 </div>
//                 {emailErr && <p className="text-[#ef4444] text-xs" style={{ fontFamily: "Inter, sans-serif" }}>{emailErr}</p>}
//               </div>

//               {/* Password field */}
//               <div className="flex flex-col gap-2">
//                 <div className="flex items-center justify-between">
//                   <label className="text-sm tracking-[-0.5px]" style={{ fontFamily: "Inter, sans-serif" }}>
//                     <span className="font-semibold text-[#374151]">Password </span>
//                     <span className="font-semibold text-[#ef4444]">*</span>
//                   </label>
//                   <Link
//                     to="/forgot-password"
//                     className="text-[#2563eb] font-medium text-sm tracking-[-0.5px] leading-5 hover:underline"
//                     style={{ fontFamily: "Inter, sans-serif" }}
//                   >
//                     Forgot password?
//                   </Link>
//                 </div>
//                 <div className="relative">
//                   <div className="absolute left-4 inset-y-0 flex items-center pointer-events-none">
//                     <img src={imgLockIcon} alt="" className="w-[14px] h-4" />
//                   </div>
//                   <input
//                     type={showPw ? "text" : "password"}
//                     placeholder="Enter your password"
//                     value={password}
//                     onChange={e => { setPassword(e.target.value); setPwErr(null); setApiError(null); }}
//                     onKeyDown={e => e.key === "Enter" && handleLogin()}
//                     autoComplete="current-password"
//                     className={`w-full h-[54px] pl-11 pr-12 py-[14px] bg-white border rounded-[12px] text-[#111827] text-base tracking-[-0.5px] leading-6 outline-none transition
//                       focus:ring-2 focus:ring-[#2563eb]/20 focus:border-[#2563eb]
//                       ${pwErr ? "border-[#ef4444]" : "border-[#d1d5db]"}`}
//                     style={{ fontFamily: "Inter, sans-serif" }}
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowPw(p => !p)}
//                     className="absolute right-4 inset-y-0 flex items-center text-gray-400 hover:text-gray-600 transition"
//                   >
//                     <img src={imgEyeIcon} alt="toggle" className="w-[18px] h-4" />
//                   </button>
//                 </div>
//                 {pwErr && <p className="text-[#ef4444] text-xs" style={{ fontFamily: "Inter, sans-serif" }}>{pwErr}</p>}
//               </div>

//               {/* Remember me */}
//               <div className="flex items-center gap-2">
//                 <input
//                   type="checkbox"
//                   id="remember"
//                   checked={rememberMe}
//                   onChange={e => setRememberMe(e.target.checked)}
//                   className="w-4 h-4 cursor-pointer accent-[#2563eb]"
//                   style={{ borderRadius: "1px" }}
//                 />
//                 <label
//                   htmlFor="remember"
//                   className="text-[#374151] font-normal text-sm tracking-[-0.5px] leading-5 cursor-pointer select-none"
//                   style={{ fontFamily: "Inter, sans-serif" }}
//                 >
//                   Remember me for 30 days
//                 </label>
//               </div>

//               {/* Sign In button */}
//               <button
//                 type="button"
//                 onClick={handleLogin}
//                 disabled={loading}
//                 className="w-full h-[52px] rounded-[12px] flex items-center justify-center gap-3 text-white font-semibold text-base tracking-[-0.5px] leading-6 transition disabled:opacity-60 disabled:cursor-not-allowed"
//                 style={{
//                   background: loading ? "#9ca3af" : "linear-gradient(to right, #2563eb, #9333ea)",
//                   boxShadow: "0px 10px 7.5px rgba(0,0,0,0.1), 0px 4px 3px rgba(0,0,0,0.1)",
//                   fontFamily: "Inter, sans-serif",
//                 }}
//               >
//                 {loading ? (
//                   <>
//                     <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
//                       <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
//                       <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
//                     </svg>
//                     Signing in…
//                   </>
//                 ) : (
//                   <>
//                     Sign In
//                     <img src={imgArrowIcon} alt="" className="w-[14px] h-4" />
//                   </>
//                 )}
//               </button>
//             </div>

//             {/* Divider */}
//             <div className="relative flex items-center h-5">
//               <div className="absolute inset-x-0 border-t border-[#d1d5db]" />
//               <div className="relative mx-auto bg-white px-4">
//                 <span
//                   className="text-[#6b7280] font-medium text-sm tracking-[-0.5px] leading-5"
//                   style={{ fontFamily: "Inter, sans-serif" }}
//                 >
//                   Or continue with
//                 </span>
//               </div>
//             </div>

//             {/* Social login */}
//             <div className="flex flex-col gap-3">
//               {[
//                 { icon: imgGoogleIcon, label: "Sign in with Google",   iw: "w-[19px]", ih: "h-5" },
//                 { icon: imgMsIcon,     label: "Sign in with Microsoft", iw: "w-[18px]", ih: "h-5" },
//                 { icon: imgAppleIcon,  label: "Sign in with Apple",     iw: "w-[15px]", ih: "h-5" },
//               ].map((s) => (
//                 <button
//                   key={s.label}
//                   type="button"
//                   className="w-full h-[54px] bg-white border border-[#d1d5db] rounded-[12px] flex items-center justify-center gap-3 text-[#374151] font-medium text-base tracking-[-0.5px] leading-6 hover:bg-gray-50 transition"
//                   style={{ boxShadow: "0px 1px 1px rgba(0,0,0,0.05)", fontFamily: "Inter, sans-serif" }}
//                 >
//                   <img src={s.icon} alt="" className={`${s.iw} ${s.ih} shrink-0`} />
//                   {s.label}
//                 </button>
//               ))}
//             </div>

//             {/* Sign up link */}
//             <div className="flex flex-col items-center">
//               <p
//                 className="text-[#4b5563] font-normal text-base tracking-[-0.5px] leading-6 text-center"
//                 style={{ fontFamily: "Inter, sans-serif" }}
//               >
//                 Don't have an account?
//               </p>
//               <Link
//                 to="/signup"
//                 className="text-[#2563eb] font-semibold text-base tracking-[-0.5px] leading-6 text-center hover:underline"
//                 style={{ fontFamily: "Inter, sans-serif" }}
//               >
//                 Sign up for free
//               </Link>
//             </div>

//             {/* Security badges */}
//             <div className="border-t border-[#e5e7eb] pt-6 flex items-center justify-center gap-6">
//               {[
//                 { icon: imgSoc2Icon, lines: ["SOC 2", "Certified"],   iw: "w-3", ih: "h-3" },
//                 { icon: imgEncIcon,  lines: ["256-bit", "Encryption"], iw: "w-3", ih: "h-3" },
//                 { icon: imgGdprIcon, lines: ["GDPR", "Compliant"],     iw: "w-3", ih: "h-3" },
//               ].map((b) => (
//                 <div key={b.lines[0]} className="flex items-center gap-2">
//                   <img src={b.icon} alt="" className={`${b.iw} ${b.ih} shrink-0`} />
//                   <div
//                     className="text-[#6b7280] font-normal text-[12px] tracking-[-0.5px] leading-4"
//                     style={{ fontFamily: "Inter, sans-serif" }}
//                   >
//                     {b.lines[0]}<br />{b.lines[1]}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Help links below card */}
//           <div className="flex flex-col items-center gap-2">
//             <p className="text-[#4b5563] font-normal text-sm tracking-[-0.5px] leading-5 text-center" style={{ fontFamily: "Inter, sans-serif" }}>
//               Need help?
//             </p>
//             <a href="mailto:support@visaflow.com" className="text-[#2563eb] font-medium text-base tracking-[-0.5px] leading-6 text-center hover:underline" style={{ fontFamily: "Inter, sans-serif" }}>
//               Contact Support
//             </a>
//             <p className="text-[#6b7280] font-normal text-xs tracking-[-0.5px] leading-4 text-center" style={{ fontFamily: "Inter, sans-serif" }}>
//               By signing in, you agree to our
//             </p>
//             <div className="flex items-center gap-1 flex-wrap justify-center">
//               <Link to="/terms" className="text-[#2563eb] font-normal text-base tracking-[-0.5px] leading-6 hover:underline" style={{ fontFamily: "Inter, sans-serif" }}>Terms of Service</Link>
//               <span className="text-black font-normal text-base tracking-[-0.5px] leading-6" style={{ fontFamily: "Inter, sans-serif" }}> and </span>
//               <Link to="/privacy" className="text-[#2563eb] font-normal text-base tracking-[-0.5px] leading-6 hover:underline" style={{ fontFamily: "Inter, sans-serif" }}>Privacy Policy</Link>
//             </div>
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// }



// src/pages/public/Login.tsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { useMsal } from "@azure/msal-react";
import { authApi } from "../../api/auth.api";
import { callSSOEndpoint } from "../../lib/sso";
import { useAuthStore } from '../../store/authStore';
import imgLogoIcon     from "../../assets/icons/logo-icon.svg";
import imgShieldIcon   from "../../assets/icons/shield-icon.svg";
import imgBellIcon     from "../../assets/icons/bell-icon.svg";
import imgTeamIcon     from "../../assets/icons/team-icon.svg";
import imgLoginIcon    from "../../assets/icons/login-icon.svg";
import imgEmailIcon    from "../../assets/icons/email-icon.svg";
import imgLockIcon     from "../../assets/icons/lock-icon.svg";
import imgEyeIcon      from "../../assets/icons/eye-icon.svg";
import imgArrowIcon    from "../../assets/icons/arrow-icon.svg";
import imgGoogleIcon   from "../../assets/icons/google-icon.svg";
import imgMsIcon       from "../../assets/icons/microsoft-icon.svg";
import imgLinkedInIcon from "../../assets/icons/linkedin-icon.svg";
import imgSoc2Icon     from "../../assets/icons/soc2-icon.svg";
import imgEncIcon      from "../../assets/icons/enc-icon.svg";
import imgGdprIcon     from "../../assets/icons/gdpr-icon.svg";
import type { AxiosError } from 'axios';
import { ErrorAlert } from '../../components/ui/Alert';

export default function Login() {
  const navigate = useNavigate();
  const { instance: msalInstance } = useMsal();

  // ── Form state ──
  const [email,      setEmail]      = useState("");
  const [password,   setPassword]   = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPw,     setShowPw]     = useState(false);
  const [loading,    setLoading]    = useState(false);
  const [apiError,   setApiError]   = useState<string | null>(null);
  const [emailErr,   setEmailErr]   = useState<string | null>(null);
  const [pwErr,      setPwErr]      = useState<string | null>(null);

  // ── SSO state ──
  const [ssoLoading, setSsoLoading] = useState<string | null>(null);
  const [ssoError,   setSsoError]   = useState<string | null>(null);

  function validate() {
    let ok = true;
    if (!email || !/\S+@\S+\.\S+/.test(email)) { setEmailErr("Valid email is required."); ok = false; }
    else setEmailErr(null);
    if (!password) { setPwErr("Password is required."); ok = false; }
    else setPwErr(null);
    return ok;
  }



async function handleLogin() {
  if (!validate()) return;
  setLoading(true);
  setApiError(null);
  try {
    const data = await authApi.login({
      email:    email.trim().toLowerCase(),
      password,
    });
 
    // ✅ Store access token in memory only — refresh token is now a httpOnly cookie
    useAuthStore.getState().setAuth({
      access_token: data.access_token,
      user:         data.user,
      roles:data.roles,
    });
 
    // Navigate based on role / onboarding
    const roles = data.roles ?? [];
    if (roles.includes('employee')) {
      navigate('/dashboard');
    } else if (roles.includes('hr')) {
      navigate('/dashboard');
    } else {
      navigate('/dashboard');
    }
 
    } catch (e: unknown) {
      const err = e as AxiosError<{ detail: string }>;
      setApiError(
        err.response?.data?.detail ?? 
        (e instanceof Error ? e.message : 'Invalid email or password.')
      );
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
 
    navigate('/dashboard');
  } catch (e: unknown) {
    setSsoError(e instanceof Error ? e.message : 'SSO sign-in failed. Please try again.');
  } finally {
    setSsoLoading(null);
  }
}

  // ── Google (popup) ──
  const loginWithGoogle = useGoogleLogin({
    onSuccess: (res) => handleSSOSuccess("google", res.access_token),
    onError:   ()    => setSsoError("Google sign-in was cancelled or failed."),
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
      setSsoError("Microsoft sign-in was cancelled or failed.");
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
    // Store where to redirect after LinkedIn callback
    sessionStorage.setItem("linkedin_post_login", "/dashboard");
    window.location.href =
      `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&state=${state}`;
  }

  const SSO_BUTTONS = [
    { icon: imgGoogleIcon,   label: "Sign in with Google",    provider: "google",    iw: "w-[19px]", ih: "h-5", onClick: () => loginWithGoogle()    },
    { icon: imgMsIcon,       label: "Sign in with Microsoft", provider: "microsoft", iw: "w-[18px]", ih: "h-5", onClick: () => loginWithMicrosoft() },
    { icon: imgLinkedInIcon, label: "Sign in with LinkedIn",  provider: "linkedin",  iw: "w-[18px]", ih: "h-5", onClick: () => loginWithLinkedIn()  },
  ];

  return (
    <div className="bg-[#f9fafb] min-h-screen w-full flex">

      {/* ── LEFT PANEL ── */}
      <div
        className="hidden lg:flex w-1/2 min-h-screen items-center justify-center px-[104px] relative overflow-hidden"
        style={{ background: "linear-gradient(118.998deg, #667eea 0%, #764ba2 100%)" }}
      >
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute bg-white rounded-full h-[288px] left-[40px] right-[392px] top-[80px]" style={{ filter: "blur(32px)" }} />
          <div className="absolute bg-white rounded-full h-[384px] left-[296px] right-[40px] top-[835px]" style={{ filter: "blur(32px)" }} />
        </div>

        <div className="flex flex-col gap-8 w-full max-w-[512px] relative">
          <div className="flex items-center gap-3">
            <div className="bg-white rounded-[12px] w-12 h-12 flex items-center justify-center shrink-0 px-[14px] py-2">
              <img src={imgLogoIcon} alt="VisaFlow" className="w-[21px] h-6" />
            </div>
            <span className="text-white font-bold text-[30px] tracking-[-0.5px] leading-9" style={{ fontFamily: "Inter, sans-serif" }}>
              VisaFlow
            </span>
          </div>

          <h1 className="text-white font-bold text-[36px] tracking-[-0.5px] leading-[45px]" style={{ fontFamily: "Inter, sans-serif" }}>
            Welcome Back to Your <br />Immigration Journey
          </h1>

          <p className="text-[rgba(255,255,255,0.9)] font-normal text-[20px] tracking-[-0.5px] leading-[33px]" style={{ fontFamily: "Inter, sans-serif" }}>
            Access your cases, track deadlines, collaborate with your team, and manage your immigration process—all in one secure platform.
          </p>

          <div className="flex flex-col gap-4">
            {[
              { icon: imgShieldIcon, iconW: "w-4", iconH: "h-4", title: "Bank-Level Security",   desc: "Your sensitive documents are protected with AES-256 encryption and SOC 2 compliance." },
              { icon: imgBellIcon,   iconW: "w-4", iconH: "h-4", title: "Real-Time Updates",      desc: "Get instant notifications about case progress, deadline reminders, and policy changes." },
              { icon: imgTeamIcon,   iconW: "w-5", iconH: "h-4", title: "Seamless Collaboration", desc: "Work effortlessly with employers, lawyers, and HR teams in one unified workspace." },
            ].map((f) => (
              <div key={f.title} className="flex gap-3 items-start">
                <div className="bg-[rgba(255,255,255,0.2)] rounded-lg w-8 h-8 flex items-center justify-center shrink-0">
                  <img src={f.icon} alt="" className={`${f.iconW} ${f.iconH}`} />
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-white font-semibold text-base tracking-[-0.5px] leading-6" style={{ fontFamily: "Inter, sans-serif" }}>{f.title}</p>
                  <p className="text-[rgba(255,255,255,0.8)] font-normal text-sm tracking-[-0.5px] leading-5" style={{ fontFamily: "Inter, sans-serif" }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-6 items-center pt-8 border-t border-[rgba(255,255,255,0.2)]">
            {[
              { value: "10,000+", label: "Cases Processed" },
              { value: "98%",     label: "Success Rate" },
              { value: "500+",    label: "Organizations" },
            ].map((s) => (
              <div key={s.label} className="flex flex-col gap-1 items-center">
                <p className="text-white font-bold text-[30px] tracking-[-0.5px] leading-9 text-center" style={{ fontFamily: "Inter, sans-serif" }}>{s.value}</p>
                <p className="text-[rgba(255,255,255,0.8)] font-normal text-sm tracking-[-0.5px] leading-5 text-center" style={{ fontFamily: "Inter, sans-serif" }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="flex-1 flex items-center justify-center px-[136px] py-12 bg-[#f9fafb]">
        <div className="flex flex-col gap-6 w-full max-w-[448px]">

          <div
            className="bg-white rounded-[16px] p-10 flex flex-col gap-8"
            style={{ boxShadow: "0px 20px 12.5px rgba(0,0,0,0.1), 0px 8px 5px rgba(0,0,0,0.1)" }}
          >
            {/* Card header */}
            <div className="flex flex-col gap-4 items-center">
              <div
                className="w-16 h-16 rounded-[16px] flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, #dbeafe 0%, #f3e8ff 100%)" }}
              >
                <img src={imgLoginIcon} alt="" className="w-[30px] h-6" />
              </div>
              <h2 className="text-[#111827] font-bold text-[30px] tracking-[-0.5px] leading-9 text-center" style={{ fontFamily: "Inter, sans-serif" }}>
                Sign In to Your Account
              </h2>
              <p className="text-[#4b5563] font-normal text-base tracking-[-0.5px] leading-6 text-center" style={{ fontFamily: "Inter, sans-serif" }}>
                Enter your credentials to access your dashboard
              </p>
            </div>

            {/* API error */}
            {/* {apiError && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm" style={{ fontFamily: "Inter, sans-serif" }}>
                {apiError}
              </div>
            )} */}
            <ErrorAlert
              title="Login Failed"
              message={apiError}
              onClose={() => setApiError(null)}
            />
            {/* SSO error */}
            {ssoError && (
              <div className="bg-[#fef2f2] border border-[#fca5a5] text-[#dc2626] rounded-xl px-4 py-3 text-sm flex gap-2 items-center" style={{ fontFamily: "Inter, sans-serif" }}>
                <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                </svg>
                {ssoError}
              </div>
            )}

            {/* Fields */}
            <div className="flex flex-col gap-6">
              {/* Email */}
              <div className="flex flex-col gap-2">
                <label className="text-sm tracking-[-0.5px]" style={{ fontFamily: "Inter, sans-serif" }}>
                  <span className="font-semibold text-[#374151]">Email Address </span>
                  <span className="font-semibold text-[#ef4444]">*</span>
                </label>
                <div className="relative">
                  <div className="absolute left-4 inset-y-0 flex items-center pointer-events-none">
                    <img src={imgEmailIcon} alt="" className="w-4 h-4" />
                  </div>
                  <input
                    type="email" placeholder="you@example.com" value={email}
                    onChange={e => { setEmail(e.target.value); setEmailErr(null); setApiError(null); }}
                    onKeyDown={e => e.key === "Enter" && handleLogin()}
                    autoComplete="email"
                    className={`w-full h-[54px] pl-11 pr-4 py-[14px] bg-white border rounded-[12px] text-[#111827] text-base tracking-[-0.5px] leading-6 outline-none transition
                      focus:ring-2 focus:ring-[#2563eb]/20 focus:border-[#2563eb]
                      ${emailErr ? "border-[#ef4444]" : "border-[#d1d5db]"}`}
                    style={{ fontFamily: "Inter, sans-serif" }}
                  />
                </div>
                {emailErr && <p className="text-[#ef4444] text-xs">{emailErr}</p>}
              </div>

              {/* Password */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm tracking-[-0.5px]" style={{ fontFamily: "Inter, sans-serif" }}>
                    <span className="font-semibold text-[#374151]">Password </span>
                    <span className="font-semibold text-[#ef4444]">*</span>
                  </label>
                  <Link to="/forgot-password" className="text-[#2563eb] font-medium text-sm tracking-[-0.5px] leading-5 hover:underline" style={{ fontFamily: "Inter, sans-serif" }}>
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <div className="absolute left-4 inset-y-0 flex items-center pointer-events-none">
                    <img src={imgLockIcon} alt="" className="w-[14px] h-4" />
                  </div>
                  <input
                    type={showPw ? "text" : "password"} placeholder="Enter your password" value={password}
                    onChange={e => { setPassword(e.target.value); setPwErr(null); setApiError(null); }}
                    onKeyDown={e => e.key === "Enter" && handleLogin()}
                    autoComplete="current-password"
                    className={`w-full h-[54px] pl-11 pr-12 py-[14px] bg-white border rounded-[12px] text-[#111827] text-base tracking-[-0.5px] leading-6 outline-none transition
                      focus:ring-2 focus:ring-[#2563eb]/20 focus:border-[#2563eb]
                      ${pwErr ? "border-[#ef4444]" : "border-[#d1d5db]"}`}
                    style={{ fontFamily: "Inter, sans-serif" }}
                  />
                  <button type="button" onClick={() => setShowPw(p => !p)}
                    className="absolute right-4 inset-y-0 flex items-center text-gray-400 hover:text-gray-600 transition">
                    <img src={imgEyeIcon} alt="toggle" className="w-[18px] h-4" />
                  </button>
                </div>
                {pwErr && <p className="text-[#ef4444] text-xs">{pwErr}</p>}
              </div>

              {/* Remember me */}
              <div className="flex items-center gap-2">
                <input type="checkbox" id="remember" checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                  className="w-4 h-4 cursor-pointer accent-[#2563eb]" />
                <label htmlFor="remember" className="text-[#374151] font-normal text-sm tracking-[-0.5px] leading-5 cursor-pointer select-none" style={{ fontFamily: "Inter, sans-serif" }}>
                  Remember me for 30 days
                </label>
              </div>

              {/* Sign In button */}
              <button type="button" onClick={handleLogin} disabled={loading}
                className="w-full h-[52px] rounded-[12px] flex items-center justify-center gap-3 text-white font-semibold text-base tracking-[-0.5px] leading-6 transition cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                style={{
                  background: loading ? "#9ca3af" : "linear-gradient(to right, #2563eb, #9333ea)",
                  boxShadow: "0px 10px 7.5px rgba(0,0,0,0.1), 0px 4px 3px rgba(0,0,0,0.1)",
                  fontFamily: "Inter, sans-serif",
                }}>
                {loading ? (
                  <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg> Signing in…</>
                ) : (
                  <>Sign In <img src={imgArrowIcon} alt="" className="w-[14px] h-4" /></>
                )}
              </button>
            </div>

            {/* Divider */}
            <div className="relative flex items-center h-5">
              <div className="absolute inset-x-0 border-t border-[#d1d5db]" />
              <div className="relative mx-auto bg-white px-4">
                <span className="text-[#6b7280] font-medium text-sm tracking-[-0.5px] leading-5" style={{ fontFamily: "Inter, sans-serif" }}>
                  Or continue with
                </span>
              </div>
            </div>

            {/* SSO buttons */}
            <div className="flex flex-col gap-3">
              {SSO_BUTTONS.map((s) => (
                <button key={s.label} type="button" onClick={s.onClick}
                  disabled={!!ssoLoading}
                  className="w-full h-[54px] bg-white border border-[#d1d5db] rounded-[12px] flex items-center justify-center gap-3 text-[#374151] font-medium text-base tracking-[-0.5px] leading-6 hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ boxShadow: "0px 1px 1px rgba(0,0,0,0.05)", fontFamily: "Inter, sans-serif" }}>
                  {ssoLoading === s.provider
                    ? <svg className="w-4 h-4 animate-spin text-[#6b7280]" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                      </svg>
                    : <img src={s.icon} alt="" className={`${s.iw} ${s.ih} shrink-0`} />}
                  {s.label}
                </button>
              ))}
            </div>

            {/* Sign up link */}
            <div className="flex flex-col items-center">
              <p className="text-[#4b5563] font-normal text-base tracking-[-0.5px] leading-6 text-center" style={{ fontFamily: "Inter, sans-serif" }}>
                Don't have an account?
              </p>
              <Link to="/signup" className="text-[#2563eb] font-semibold text-base tracking-[-0.5px] leading-6 text-center hover:underline" style={{ fontFamily: "Inter, sans-serif" }}>
                Sign up for free
              </Link>
            </div>

            {/* Security badges */}
            <div className="border-t border-[#e5e7eb] pt-6 flex items-center justify-center gap-6">
              {[
                { icon: imgSoc2Icon, lines: ["SOC 2", "Certified"],   iw: "w-3", ih: "h-3" },
                { icon: imgEncIcon,  lines: ["256-bit", "Encryption"], iw: "w-3", ih: "h-3" },
                { icon: imgGdprIcon, lines: ["GDPR", "Compliant"],     iw: "w-3", ih: "h-3" },
              ].map((b) => (
                <div key={b.lines[0]} className="flex items-center gap-2">
                  <img src={b.icon} alt="" className={`${b.iw} ${b.ih} shrink-0`} />
                  <div className="text-[#6b7280] font-normal text-[12px] tracking-[-0.5px] leading-4" style={{ fontFamily: "Inter, sans-serif" }}>
                    {b.lines[0]}<br />{b.lines[1]}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Help links */}
          <div className="flex flex-col items-center gap-2">
            <p className="text-[#4b5563] font-normal text-sm tracking-[-0.5px] leading-5 text-center" style={{ fontFamily: "Inter, sans-serif" }}>Need help?</p>
            <a href="mailto:support@visaflow.com" className="text-[#2563eb] font-medium text-base tracking-[-0.5px] leading-6 text-center hover:underline" style={{ fontFamily: "Inter, sans-serif" }}>
              Contact Support
            </a>
            <p className="text-[#6b7280] font-normal text-xs tracking-[-0.5px] leading-4 text-center" style={{ fontFamily: "Inter, sans-serif" }}>
              By signing in, you agree to our
            </p>
            <div className="flex items-center gap-1 flex-wrap justify-center">
              <Link to="/terms" className="text-[#2563eb] font-normal text-base tracking-[-0.5px] leading-6 hover:underline" style={{ fontFamily: "Inter, sans-serif" }}>Terms of Service</Link>
              <span className="text-black font-normal text-base tracking-[-0.5px] leading-6" style={{ fontFamily: "Inter, sans-serif" }}> and </span>
              <Link to="/privacy" className="text-[#2563eb] font-normal text-base tracking-[-0.5px] leading-6 hover:underline" style={{ fontFamily: "Inter, sans-serif" }}>Privacy Policy</Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}