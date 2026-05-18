// import { useState, useRef, useEffect } from "react";
import { useState, useRef, useEffect } from "react";
import type { KeyboardEvent, ClipboardEvent } from "react";

// ── Figma asset URLs ───────────────────────────────────────

import imgLeftPanelBg from "../../assets/icons/left-panel-bg.svg";
import imgGlobeIcon   from "../../assets/icons/globe-icon.svg";
import imgLockIcon    from "../../assets/icons/lock-icon.svg";
import { useAuthStore } from '../../store/authStore';
import { useNavigate } from 'react-router-dom';


// ── Types ─────────────────────────────────────────────────────────────────────
// interface AccountVerificationProps {
//   email?: string;                              // passed from signup state
//   onSuccess?: (tokens: { access_token: string; refresh_token: string }) => void;
//   onBack?: () => void;
// }


interface AccountVerificationProps {
  email?: string;
  onSuccess?: (tokens: { access_token: string; refresh_token: string }) => void;
}

const API_BASE = import.meta.env.VITE_API_BASE_URL;

// ── Component ─────────────────────────────────────────────────────────────────
export default function AccountVerification({
  // email = "john.smith@example.com",
  email = sessionStorage.getItem("signup_email") ?? "",
  onSuccess,
}: AccountVerificationProps) {
  const OTP_LENGTH = 6;
  const navigate = useNavigate();
  const [digits, setDigits]         = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState<string | null>(null);
  const [success, setSuccess]       = useState(false);
  const [resendTimer, setResendTimer] = useState(0);   // countdown seconds
  const [resendMsg, setResendMsg]   = useState<string | null>(null);

  const inputRefs = useRef<(HTMLInputElement | null)[]>(Array(OTP_LENGTH).fill(null));

  // Auto-focus first box on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  // Resend countdown ticker
  useEffect(() => {
    if (resendTimer <= 0) return;
    const id = setTimeout(() => setResendTimer((t) => t - 1), 1000);
    return () => clearTimeout(id);
  }, [resendTimer]);

  // ── Helpers ─────────────────────────────────────────────────────────────────
  const otp = digits.join("");
  const isComplete = otp.length === OTP_LENGTH && digits.every((d) => d !== "");

  function focusAt(index: number) {
    inputRefs.current[Math.max(0, Math.min(index, OTP_LENGTH - 1))]?.focus();
  }

  function handleChange(index: number, value: string) {
    const char = value.replace(/\D/g, "").slice(-1); // digits only, last char
    const next = [...digits];
    next[index] = char;
    setDigits(next);
    setError(null);
    if (char && index < OTP_LENGTH - 1) focusAt(index + 1);
  }

  function handleKeyDown(index: number, e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace") {
      if (digits[index]) {
        const next = [...digits];
        next[index] = "";
        setDigits(next);
      } else {
        focusAt(index - 1);
      }
    } else if (e.key === "ArrowLeft") {
      focusAt(index - 1);
    } else if (e.key === "ArrowRight") {
      focusAt(index + 1);
    }
  }

  function handlePaste(e: ClipboardEvent<HTMLInputElement>) {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    if (!pasted) return;
    const next = Array(OTP_LENGTH).fill("");
    pasted.split("").forEach((c, i) => { next[i] = c; });
    setDigits(next);
    focusAt(Math.min(pasted.length, OTP_LENGTH - 1));
    setError(null);
  }

  // ── API: Verify ──────────────────────────────────────────────────────────────
  async function handleVerify() {
    if (!isComplete) return;
    setLoading(true);
    setError(null);
    try {
      const token = useAuthStore.getState().accessToken;
      const res = await fetch(`${API_BASE}/onboarding/verify-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ otp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail ?? "Verification failed.");
      // Store updated tokens
      useAuthStore.getState().setTokens({ access_token: data.access_token });
      setSuccess(true);
      onSuccess?.(data);
      // Navigate after short delay to show success state
      setTimeout(() => {
        navigate("/signup/profile-setup");
      }, 1200);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
      // Shake + clear on error
      setDigits(Array(OTP_LENGTH).fill(""));
      setTimeout(() => focusAt(0), 50);
    } finally {
      setLoading(false);
    }
  }

  // ── API: Resend ──────────────────────────────────────────────────────────────
  async function handleResend() {
    if (resendTimer > 0) return;
    setResendMsg(null);
    setError(null);
    try {
      const token = useAuthStore.getState().accessToken;
      const res = await fetch(`${API_BASE}/onboarding/resend-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail ?? "Failed to resend.");
      setResendTimer(60);
      setResendMsg("Code sent! Check your inbox.");
      setDigits(Array(OTP_LENGTH).fill(""));
      setTimeout(() => focusAt(0), 50);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to resend code.");
    }
  }

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div className="flex items-start justify-center relative w-full h-screen overflow-hidden bg-gray-50">

      {/* ── LEFT PANEL ── */}
      <div
        className="relative flex flex-1 h-full items-center justify-center overflow-hidden"
        style={{
          background: "linear-gradient(90deg, #312e81 0%, #312e81 100%)",
        }}
      >
        {/* Figma SVG background overlay */}
        <img
          src={imgLeftPanelBg}
          alt=""
          className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
        />

        {/* Radial colour overlays — exact from Figma */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `
              radial-gradient(ellipse 100% 70% at 0% 0%, rgba(16,15,21,0.9) 0%, rgba(16,15,21,0) 60%),
              radial-gradient(ellipse 50% 70% at 50% 0%, rgba(47,62,106,0.8) 0%, rgba(47,62,106,0) 60%),
              radial-gradient(ellipse 100% 70% at 100% 0%, rgba(114,39,65,0.7) 0%, rgba(114,39,65,0) 60%)
            `,
          }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center gap-4 max-w-[512px] px-12">

          {/* Globe icon with glass circle */}
          <div className="flex items-center justify-center w-full mb-2">
            <div
              className="flex items-center justify-center w-24 h-24 rounded-full border border-white/20"
              style={{
                background: "rgba(255,255,255,0.1)",
                backdropFilter: "blur(6px)",
              }}
            >
              <img src={imgGlobeIcon} alt="Globe" className="w-9 h-9 opacity-90" />
            </div>
          </div>

          {/* Heading */}
          <div className="flex flex-col items-center pt-4 w-full">
            <h2
              className="text-white text-center font-bold text-[30px] leading-[36px] tracking-normal"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              Global Reach, Local Touch
            </h2>
          </div>

          {/* Subtext */}
          <div className="flex flex-col items-center w-full">
            <p
              className="text-[#e0e7ff] text-[18px] text-center leading-[29.25px]"
              style={{ fontFamily: "Inter, sans-serif", fontWeight: 400 }}
            >
              Secure your VisaFlow account to unlock seamless international processing and dedicated support.
            </p>
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="bg-white flex flex-1 flex-col h-full items-start justify-center relative min-w-0">

        {/* Step indicator — top right — exact from Figma */}
        <div className="absolute top-0 right-0 p-8 flex items-center">
          <span
            className="text-[#9ca3af] text-[14px] font-medium leading-5 mr-2"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            Step 3 of 3
          </span>
          <div className="flex items-center gap-1 ml-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-[6px] w-8 rounded-full bg-[#6366f1]"
              />
            ))}
          </div>
        </div>

        {/* Main content */}
        <div className="flex flex-1 flex-col items-start justify-center w-full px-32 min-h-0">

          {/* Heading block */}
          <div className="flex flex-col w-full pb-10">
            <div className="flex flex-col gap-3 w-full">
              <h1
                className="text-[#111827] text-[32px] font-bold leading-[48px] tracking-[-0.8px] w-full"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                Check Your Email
              </h1>
              <div className="flex flex-col w-full">
                <p
                  className="text-[#6b7280] text-[16px] font-normal leading-6"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  We've sent a 6-digit verification code to
                </p>
                <p
                  className="text-[#111827] text-[16px] font-medium leading-6"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  {email}
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="flex flex-col w-full pb-4">
            <div className="flex flex-col gap-12 w-full">

              {/* OTP inputs — 6 round pill boxes, exact Figma layout */}
              <div className="relative h-16 w-[384px]">
                {Array.from({ length: OTP_LENGTH }).map((_, i) => (
                  <input
                    key={i}
                    ref={(el) => { inputRefs.current[i] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digits[i]}
                    onChange={(e) => handleChange(i, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(i, e)}
                    onPaste={handlePaste}
                    disabled={loading || success}
                    className={[
                      "absolute top-0 h-16 w-14 rounded-full border text-center",
                      "text-[24px] font-semibold text-[#111827]",
                      "bg-[#f9fafb] outline-none transition-all duration-150",
                      "disabled:opacity-60 disabled:cursor-not-allowed",
                      error
                        ? "border-red-400 bg-red-50"
                        : success
                        ? "border-green-400 bg-green-50"
                        : digits[i]
                        ? "border-[#6366f1] bg-white"
                        : "border-[#e5e7eb]",
                      "focus:border-[#6366f1] focus:ring-2 focus:ring-[#6366f1]/20",
                    ].join(" ")}
                    style={{
                      left: `${i * 72}px`,
                      fontFamily: "Inter, sans-serif",
                    }}
                  />
                ))}
              </div>

              {/* Error message */}
              {error && (
                <p className="text-red-500 text-sm -mt-8" style={{ fontFamily: "Inter, sans-serif" }}>
                  {error}
                </p>
              )}

              {/* Resend confirmation */}
              {resendMsg && !error && (
                <p className="text-green-600 text-sm -mt-8" style={{ fontFamily: "Inter, sans-serif" }}>
                  {resendMsg}
                </p>
              )}

              {/* Verify button — exact Figma: bg #4f46e5, rounded-xl, py-4 */}
              <button
                type="button"
                onClick={handleVerify}
                disabled={!isComplete || loading || success}
                className={[
                  "flex items-center justify-center w-[384px] py-4 rounded-xl",
                  "text-white text-[15px] font-medium leading-[22.5px] text-center",
                  "drop-shadow-sm transition-all duration-150",
                  "disabled:opacity-50 disabled:cursor-not-allowed",
                  success
                    ? "bg-green-500"
                    : "bg-[#4f46e5] hover:bg-[#4338ca] active:scale-[0.99]",
                ].join(" ")}
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                {success ? (
                  <span className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    Verified!
                  </span>
                ) : loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Verifying…
                  </span>
                ) : (
                  "Verify Email"
                )}
              </button>
            </div>
          </div>

          {/* Resend row — exact Figma layout */}
          <div className="flex items-center pt-8 w-full">
            <span
              className="text-[#6b7280] text-[14px] font-normal leading-5"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              Didn't receive the code?{" "}
            </span>
            <button
              type="button"
              onClick={handleResend}
              disabled={resendTimer > 0}
              className={[
                "text-[14px] font-medium leading-5 text-center ml-0",
                resendTimer > 0
                  ? "text-[#9ca3af] cursor-not-allowed"
                  : "text-[#4f46e5] hover:underline cursor-pointer",
              ].join(" ")}
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Click to resend"}
            </button>
          </div>
        </div>

        {/* Footer note — absolute bottom, exact Figma position */}
        <div className="absolute bottom-8 left-32 right-32 border-t border-[#f3f4f6] pt-6">
          <div className="relative flex items-center h-[39px]">
            {/* Lock icon */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2">
              <img src={imgLockIcon} alt="" className="w-[13px] h-[13px]" />
            </div>
            <p
              className="absolute left-[21px] top-1/2 -translate-y-1/2 text-[#9ca3af] text-[13px] leading-[19.5px] w-[384px]"
              style={{ fontFamily: "Inter, sans-serif", fontWeight: 400 }}
            >
              What happens next? Once verified, you'll be redirected to your dashboard to complete your profile.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}