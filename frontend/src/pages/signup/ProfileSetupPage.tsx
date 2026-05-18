import { useState } from "react";
import { useNavigate } from 'react-router-dom';
// ── Figma Asset URLs ──────────────────────────────────────────────────────────
// const imgCheckIcon   = "https://www.figma.com/api/mcp/asset/4bc09bf7-37ce-460f-b281-ae925acc57aa";
// const imgDashIcon    = "https://www.figma.com/api/mcp/asset/90609f3f-4971-418b-9c6a-906f89fccaf4";
// const imgLightningIcon = "https://www.figma.com/api/mcp/asset/ec6af7d6-5877-45ce-b646-b200da7cfe02";
// const imgNewsIcon    = "https://www.figma.com/api/mcp/asset/c28321a9-d713-48da-88f3-88dac7b9f52b";
// const imgChevronSvg  = "https://www.figma.com/api/mcp/asset/645e1f3c-31ec-47a3-8c6a-e2c3be9afde1";
// const imgArrowRight  = "https://www.figma.com/api/mcp/asset/04aa64f9-a3a5-46ea-942d-5c501049c6fe";
// const imgLockIcon    = "https://www.figma.com/api/mcp/asset/2f0b5dc4-fe1c-4106-9627-012106d1d1bd";
// const imgShieldIcon  = "https://www.figma.com/api/mcp/asset/9cbcf19a-d53a-4af1-a71b-169ca89e559e";
// const imgGlobeIcon   = "https://www.figma.com/api/mcp/asset/397b93fb-1316-4338-aa33-43f9efcb8f3b";
// const imgPrivacyIcon = "https://www.figma.com/api/mcp/asset/6bb48b2a-80bd-4848-ac02-4de68920bdfa";
// const imgLogoIcon    = "https://www.figma.com/api/mcp/asset/6bb48b2a-80bd-4848-ac02-4de68920bdfa";


// AFTER — permanent, never breaks ✅
import imgCheckIcon     from "../../assets/icons/check-icon.svg";
import imgDashIcon      from "../../assets/icons/dash-icon.svg";
import imgLightningIcon from "../../assets/icons/lightning-icon.svg";
import imgNewsIcon      from "../../assets/icons/news-icon.svg";
import imgChevronSvg    from "../../assets/icons/chevron.svg";
import imgArrowRight    from "../../assets/icons/arrow-right.svg";
import imgLockIcon      from "../../assets/icons/lock-icon.svg";
import imgShieldIcon    from "../../assets/icons/shield-icon.svg";
import imgGlobeIcon     from "../../assets/icons/globe-icon.svg";
import imgPrivacyIcon   from "../../assets/icons/privacy-logo-icon.svg";
import imgLogoIcon      from "../../assets/icons/privacy-logo-icon.svg"; // same file
import { useAuthStore } from '../../store/authStore';

// ── Types ─────────────────────────────────────────────────────────────────────
interface ProfileForm {
  full_legal_name: string;
  date_of_birth: string;
  gender: string;
  nationality: string;
  country_of_residence: string;
  visa_targets: string[];
  primary_visa: string;
  timezone: string;
  preferred_language: string;
}

const VISA_CHIPS = ["H-1B","F-1","O-1A","O-1B","L-1A","L-1B","EB-2","GREEN-CARD"];

const VISA_RADIO_CARDS = [
  { value: "H-1B", title: "H-1B Specialty Occupation", sub: "Employment-based temporary visa" },
  { value: "O-1A", title: "O-1 Extraordinary Ability", sub: "For individuals with extraordinary achievement" },
  { value: "EB-2", title: "EB-2", sub: "Advanced degree / NIW" },
  { value: "OTHER", title: "Other / Undecided", sub: "I need help figuring this out" },
];

const COUNTRIES = [
  "United States", "India", "China", "Canada", "United Kingdom",
  "Germany", "France", "Australia", "Brazil", "Mexico", "Japan",
  "South Korea", "Nigeria", "Pakistan", "Bangladesh", "Philippines",
];

const TIMEZONES = [
  "Eastern Time (ET) - Auto-detected",
  "Central Time (CT)",
  "Mountain Time (MT)",
  "Pacific Time (PT)",
  "UTC",
  "IST (India Standard Time)",
];

const LANGUAGES = ["English", "Spanish", "French", "German", "Hindi", "Mandarin", "Portuguese"];

const API_BASE = import.meta.env.VITE_API_BASE_URL;

// ── Component ─────────────────────────────────────────────────────────────────
export default function ProfileSetupStep2() {
  const navigate    = useNavigate();                    
  const token = useAuthStore((s) => s.accessToken); 

  const [form, setForm] = useState<ProfileForm>({
    full_legal_name: "",
    date_of_birth: "",
    gender: "",
    nationality: "",
    country_of_residence: "",
    visa_targets: ["H-1B", "O-1A"],
    primary_visa: "H-1B",
    timezone: "Eastern Time (ET) - Auto-detected",
    preferred_language: "English",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof ProfileForm, string>>>({});

  // ── Helpers ───────────────────────────────────────────────────────────────
  function setField<K extends keyof ProfileForm>(key: K, value: ProfileForm[K]) {
    setForm(p => ({ ...p, [key]: value }));
    setFieldErrors(p => ({ ...p, [key]: undefined }));
    setError(null);
  }

  function toggleVisaChip(visa: string) {
    setForm(p => ({
      ...p,
      visa_targets: p.visa_targets.includes(visa)
        ? p.visa_targets.filter(v => v !== visa)
        : [...p.visa_targets, visa],
    }));
  }

  function validate(): boolean {
    const errs: Partial<Record<keyof ProfileForm, string>> = {};
    if (!form.full_legal_name.trim()) errs.full_legal_name = "Full legal name is required.";
    if (!form.nationality) errs.nationality = "Please select your nationality.";
    if (form.visa_targets.length === 0) errs.visa_targets = "Select at least one visa type.";
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleContinue() {
    if (!validate()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/onboarding/profile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          full_legal_name:      form.full_legal_name.trim(),
          date_of_birth:        form.date_of_birth || null,
          gender:               form.gender || null,
          nationality:          form.nationality,
          country_of_residence: form.country_of_residence || null,
          visa_targets:         form.visa_targets,
          primary_visa:         form.primary_visa || null,
          timezone:             form.timezone || null,
          preferred_language:   form.preferred_language || null,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail ?? "Failed to save profile.");

      // Step 2 — mark onboarding complete
      const completeRes = await fetch(`${API_BASE}/onboarding/complete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const completeData = await completeRes.json();
      if (!completeRes.ok) throw new Error(completeData.detail ?? "Failed to complete onboarding.");

      // Step 3 — navigate without full page reload
      navigate("/signup/verification");

    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveProgress() {
    if (!form.full_legal_name.trim()) return;
    try {
      const token = useAuthStore((s) => s.accessToken);

      await fetch(`${API_BASE}/onboarding/profile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          full_legal_name:      form.full_legal_name.trim(),
          date_of_birth:        form.date_of_birth || null,
          gender:               form.gender || null,
          nationality:          form.nationality || "Unknown",
          country_of_residence: form.country_of_residence || null,
          visa_targets:         form.visa_targets.length ? form.visa_targets : ["Unknown"],
          primary_visa:         form.primary_visa || null,
          timezone:             form.timezone || null,
          preferred_language:   form.preferred_language || null,
        }),
      });
    } catch {
      // silent — save progress is best-effort
    }
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="bg-white min-h-screen relative w-full font-['Inter',sans-serif]">

      {/* ── Header ── */}
      <div className="bg-white border-b border-[#f3f4f6] flex h-[72px] items-center justify-center left-0 px-12 right-0 top-0 fixed z-20 w-full">
        <div className="flex-1 max-w-[1440px] flex items-center justify-between">
          <div className="flex gap-2 items-center">
            <div className="bg-gradient-to-r from-[#4f46e5] to-[#7c3aed] flex items-center justify-center rounded-[8px] size-8">
              <img alt="logo" className="block" src={imgLogoIcon} style={{ width: 17.5, height: 12.97 }} />
            </div>
            <span className="font-bold text-[#111827] text-[20px] tracking-[-0.5px] leading-[28px]">VisaFlow</span>
          </div>
          <div className="flex gap-1 font-medium text-[14px] items-center">
            <span className="text-[#4b5563]">Already have an account? </span>
            <a href="/login" className="text-[#4f46e5]">Sign In</a>
          </div>
        </div>
      </div>

      {/* ── Progress Bar ── */}
      <div className="bg-white border-b border-[#f3f4f6] flex flex-col items-start left-0 pb-[25px] pt-[24px] px-[240px] right-0 fixed top-[72px] z-10 w-full">
        <div className="relative w-full">
          <div className="flex items-center justify-between relative w-full">
            {/* Background line */}
            <div className="absolute bg-[#e5e7eb] h-[2px] left-0 right-0 top-1/2 -translate-y-1/2" />
            {/* Active line — 50% (halfway between step 1 and 2) */}
            <div className="absolute bg-[#4f46e5] h-[2px] left-0 right-1/2 top-1/2 -translate-y-1/2" />

            {/* Step 1 — completed */}
            <div className="bg-white flex flex-col gap-2 items-center px-2 relative shrink-0 z-10">
              <div className="bg-[#4f46e5] drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] flex items-center justify-center rounded-full size-8">
                <img alt="check" src={imgCheckIcon} style={{ width: 12.25, height: 8.75 }} />
              </div>
              <div className="flex flex-col gap-0.5 items-center">
                <span className="font-semibold text-[#4f46e5] text-[12px] tracking-[0.6px] uppercase leading-[16px]">STEP 1</span>
                <span className="font-medium text-[#111827] text-[14px] leading-[20px] text-center">Account Details</span>
              </div>
            </div>

            {/* Step 2 — active */}
            <div className="bg-white flex flex-col gap-2 items-center px-2 relative shrink-0 z-10">
              <div className="bg-[#4f46e5] flex items-center justify-center relative rounded-full size-8">
                {/* Glow ring */}
                <div className="absolute -translate-x-1/2 left-1/2 rounded-full shadow-[0px_0px_0px_4px_#eef2ff,0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)] size-8 top-0 bg-transparent" />
                <span className="font-semibold text-white text-[14px] leading-[20px] relative z-10">2</span>
              </div>
              <div className="flex flex-col gap-0.5 items-center">
                <span className="font-semibold text-[#4f46e5] text-[12px] tracking-[0.6px] uppercase leading-[16px]">STEP 2</span>
                <span className="font-medium text-[#111827] text-[14px] leading-[20px] text-center">Profile Setup</span>
              </div>
            </div>

            {/* Step 3 — upcoming */}
            <div className="bg-white flex flex-col gap-2 items-center px-2 relative shrink-0 z-10">
              <div className="bg-[#f3f4f6] border-2 border-[#e5e7eb] flex items-center justify-center p-0.5 rounded-full size-8">
                <span className="font-semibold text-[#9ca3af] text-[14px] leading-[20px]">3</span>
              </div>
              <div className="flex flex-col gap-0.5 items-center">
                <span className="font-semibold text-[#9ca3af] text-[12px] tracking-[0.6px] uppercase leading-[16px]">STEP 3</span>
                <span className="font-medium text-[#9ca3af] text-[14px] leading-[20px] text-center">Verification</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="bg-white flex flex-col items-start left-0 px-[208px] py-[48px] right-0 absolute" style={{ top: 199 }}>
        <div className="flex gap-[48px] items-start max-w-[1024px] px-8 relative w-full">

          {/* ── Left Sidebar ── */}
          <div className="flex flex-col items-start justify-center self-stretch shrink-0 w-[320px]">
            <div className="bg-[#f9fafb] border border-[#f3f4f6] flex flex-1 flex-col items-start min-h-0 p-[33px] rounded-[16px] w-full">

              {/* Title */}
              <div className="pb-4 w-full">
                <p className="font-bold text-[#111827] text-[24px] leading-[32px]">Complete Your<br />Profile</p>
              </div>

              {/* Description */}
              <div className="mb-[31px]">
                <p className="font-normal text-[#4b5563] text-[14px] leading-[22.75px]">
                  This information helps us personalise<br />
                  your immigration journey and connect<br />
                  you with the right resources.
                </p>
              </div>

              {/* Features */}
              <div className="flex flex-col gap-6 items-start w-full flex-1">
                {[
                  { icon: imgDashIcon, w: 16, h: 14, title: "Personalised dashboard", sub: "Your visa type targets will shape your homepage" },
                  { icon: imgLightningIcon, w: 12.008, h: 16.002, title: "Faster case setup", sub: "Pre-filled forms based on your nationality and residence" },
                  { icon: imgNewsIcon, w: 16, h: 14, title: "Relevant news", sub: "Immigration updates filtered to your situation" },
                ].map((f) => (
                  <div key={f.title} className="flex gap-4 items-start w-full">
                    <div className="bg-[#eef2ff] flex items-center justify-center rounded-full shrink-0 size-10">
                      <img alt="" src={f.icon} style={{ width: f.w, height: f.h }} />
                    </div>
                    <div className="flex flex-col gap-1 items-start self-stretch">
                      <p className="font-semibold text-[#111827] text-[14px] leading-[20px]">{f.title}</p>
                      <p className="font-normal text-[#6b7280] text-[12px] leading-[19.5px]">{f.sub}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Progress */}
              <div className="pt-8 w-full">
                <div className="border-t border-[#e5e7eb] flex flex-col gap-3 items-start pt-[25px] w-full">
                  <div className="flex items-center justify-between w-full">
                    <span className="font-normal text-[#6b7280] text-[14px] leading-[20px]">Progress</span>
                    <span className="font-medium text-[#111827] text-[14px] leading-[20px]">Step 2 of 3</span>
                  </div>
                  <div className="bg-[#e5e7eb] h-2 rounded-full w-full overflow-hidden">
                    <div className="bg-[#4f46e5] h-full rounded-full" style={{ width: "66.67%" }} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Main Form ── */}
          <div className="flex flex-1 flex-col gap-8 items-start max-w-[672px] min-w-0 self-stretch">

            {/* Heading */}
            <div className="flex flex-col gap-2 items-start w-full">
              <p className="font-bold text-[#111827] text-[30px] leading-[36px]">Step 2: Profile Setup</p>
              <p className="font-normal text-[#6b7280] text-[16px] leading-[24px]">
                Tell us a little about yourself so we can personalise your experience.
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm w-full">
                {error}
              </div>
            )}

            <div className="flex flex-col gap-10 items-start w-full">

              {/* ── Section: Personal Details ── */}
              <div className="flex flex-col gap-6 items-start w-full">
                <div className="border-b border-[#f3f4f6] pb-[9px] w-full">
                  <p className="font-semibold text-[#111827] text-[18px] leading-[28px]">Personal Details</p>
                </div>

                {/* Full Legal Name */}
                <div className="flex flex-col gap-1 items-start w-full">
                  <label className="font-medium text-[#111827] text-[14px] leading-[21px]">
                    Full Legal Name (as on passport)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. John Michael Smith"
                    value={form.full_legal_name}
                    onChange={e => setField("full_legal_name", e.target.value)}
                    className={`bg-white border h-[54px] overflow-hidden px-[17px] rounded-[8px] w-full font-normal text-[14px] leading-normal focus:outline-none focus:ring-2 focus:ring-[#4f46e5] focus:border-[#4f46e5] transition placeholder-[#9ca3af] ${
                      fieldErrors.full_legal_name ? "border-red-400 bg-red-50" : "border-[#e5e7eb]"
                    }`}
                  />
                  {fieldErrors.full_legal_name
                    ? <p className="text-red-500 text-[12px]">{fieldErrors.full_legal_name}</p>
                    : <p className="font-normal text-[#6b7280] text-[12px] leading-[18px]">Enter your name exactly as it appears on your passport</p>
                  }
                </div>

                {/* DOB & Gender Row */}
                <div className="grid grid-cols-2 gap-6 w-full">
                  {/* Date of Birth */}
                  <div className="flex flex-col gap-2 items-start">
                    <label className="font-medium text-[#111827] text-[14px] leading-[21px]">Date of Birth</label>
                    <input
                      type="text"
                      placeholder="YYYY-MM-DD"
                      value={form.date_of_birth}
                      onChange={e => setField("date_of_birth", e.target.value)}
                      className="bg-white border border-[#e5e7eb] h-[50px] px-[17px] rounded-[8px] w-full font-normal text-[#6b7280] text-[14px] leading-[21px] focus:outline-none focus:ring-2 focus:ring-[#4f46e5] focus:border-[#4f46e5] transition placeholder-[#6b7280]"
                    />
                  </div>

                  {/* Gender */}
                  <div className="flex flex-col gap-2 items-start">
                    <label className="font-medium text-[#111827] text-[14px] leading-[21px]">Gender</label>
                    <div className="relative w-full">
                      <select
                        value={form.gender}
                        onChange={e => setField("gender", e.target.value)}
                        className="appearance-none bg-white border border-[#e5e7eb] h-[50px] pl-[17px] pr-10 rounded-[8px] w-full font-normal text-[#111827] text-[14px] leading-[21px] focus:outline-none focus:ring-2 focus:ring-[#4f46e5] focus:border-[#4f46e5] transition"
                      >
                        <option value="">Select gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="non_binary">Non-binary</option>
                        <option value="prefer_not">Prefer not to say</option>
                      </select>
                      <img alt="" src={imgChevronSvg} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ width: 21, height: 21 }} />
                    </div>
                  </div>
                </div>

                {/* Nationality & Country of Residence */}
                <div className="grid grid-cols-2 gap-6 w-full">
                  {/* Nationality */}
                  <div className="flex flex-col gap-1 items-start">
                    <label className="font-medium text-[#111827] text-[14px] leading-[21px]">Nationality</label>
                    <div className="relative w-full">
                      <select
                        value={form.nationality}
                        onChange={e => setField("nationality", e.target.value)}
                        className={`appearance-none bg-white border h-[54px] pl-[17px] pr-10 rounded-[8px] w-full font-normal text-[#111827] text-[14px] leading-[21px] focus:outline-none focus:ring-2 focus:ring-[#4f46e5] focus:border-[#4f46e5] transition ${
                          fieldErrors.nationality ? "border-red-400 bg-red-50" : "border-[#e5e7eb]"
                        }`}
                      >
                        <option value="">Select your nationality</option>
                        {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                      <img alt="" src={imgChevronSvg} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ width: 21, height: 21 }} />
                    </div>
                    {fieldErrors.nationality
                      ? <p className="text-red-500 text-[12px]">{fieldErrors.nationality}</p>
                      : <p className="font-normal text-[#6b7280] text-[12px] leading-[18px]">Country of your passport</p>
                    }
                  </div>

                  {/* Country of Residence */}
                  <div className="flex flex-col gap-1 items-start">
                    <label className="font-medium text-[#111827] text-[14px] leading-[21px]">Country of Residence</label>
                    <div className="relative w-full">
                      <select
                        value={form.country_of_residence}
                        onChange={e => setField("country_of_residence", e.target.value)}
                        className="appearance-none bg-white border border-[#e5e7eb] h-[54px] pl-[17px] pr-10 rounded-[8px] w-full font-normal text-[#111827] text-[14px] leading-[21px] focus:outline-none focus:ring-2 focus:ring-[#4f46e5] focus:border-[#4f46e5] transition"
                      >
                        <option value="">Select country</option>
                        {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                      <img alt="" src={imgChevronSvg} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ width: 21, height: 21 }} />
                    </div>
                    <p className="font-normal text-[#6b7280] text-[12px] leading-[18px]">Where you currently live</p>
                  </div>
                </div>
              </div>

              {/* ── Section: Immigration Preferences ── */}
              <div className="flex flex-col gap-6 items-start w-full">
                <div className="border-b border-[#f3f4f6] pb-[9px] w-full">
                  <p className="font-semibold text-[#111827] text-[18px] leading-[28px]">Immigration Preferences</p>
                </div>

                {/* Target Visa Types — chips */}
                <div className="flex flex-col gap-3 items-start w-full">
                  <label className="font-medium text-[#111827] text-[14px] leading-[21px]">Target Visa Types</label>
                  <div className="flex flex-wrap gap-2 items-start w-full">
                    {VISA_CHIPS.map(visa => {
                      const selected = form.visa_targets.includes(visa);
                      return (
                        <button
                          key={visa}
                          type="button"
                          onClick={() => toggleVisaChip(visa)}
                          className={`border flex flex-col items-start px-[17px] py-[9px] rounded-full transition ${
                            selected
                              ? "bg-[#eef2ff] border-[#c7d2fe]"
                              : "border-[#e5e7eb]"
                          }`}
                        >
                          <span className={`font-medium text-[14px] leading-[20px] ${selected ? "text-[#4338ca]" : "text-[#4b5563]"}`}>
                            {visa}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                  {fieldErrors.visa_targets
                    ? <p className="text-red-500 text-[12px]">{fieldErrors.visa_targets}</p>
                    : <p className="font-normal text-[#6b7280] text-[12px] leading-[18px]">Select all visa types you are interested in. You can change this later.</p>
                  }
                </div>

                {/* Primary Visa — radio cards */}
                <div className="flex flex-col gap-4 items-start pt-4 w-full">
                  <label className="font-medium text-[#111827] text-[14px] leading-[21px]">
                    Which visa type is your main goal right now?
                  </label>
                  <div className="grid grid-cols-2 gap-4 w-full">
                    {VISA_RADIO_CARDS.map(card => {
                      const selected = form.primary_visa === card.value;
                      return (
                        <button
                          key={card.value}
                          type="button"
                          onClick={() => setField("primary_visa", card.value)}
                          className={`border flex isolate items-start p-[17px] rounded-[12px] text-left transition w-full ${
                            selected
                              ? "bg-[rgba(79,70,229,0.05)] border-[#4f46e5]"
                              : "border-[#e5e7eb]"
                          }`}
                        >
                          {/* Radio */}
                          <div className="h-5 w-7 shrink-0 z-[2] flex items-start">
                            <div className="pt-1">
                              {selected ? (
                                <div className="border border-[#4f46e5] flex flex-col items-center justify-center p-px rounded-full size-4">
                                  <div className="bg-[#4f46e5] rounded-[4px] size-2" />
                                </div>
                              ) : (
                                <div className="border border-[#d1d5db] rounded-full size-4" />
                              )}
                            </div>
                          </div>
                          {/* Text */}
                          <div className="flex flex-col gap-1 items-start relative z-[1]">
                            <p className="font-medium text-[#111827] text-[14px] leading-[20px]">{card.title}</p>
                            <p className="font-normal text-[#6b7280] text-[12px] leading-[16px]">{card.sub}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* ── Section: Account Preferences ── */}
              <div className="flex flex-col gap-6 items-start w-full">
                <div className="border-b border-[#f3f4f6] pb-[9px] w-full">
                  <p className="font-semibold text-[#111827] text-[18px] leading-[28px]">Account Preferences</p>
                </div>
                <div className="grid grid-cols-2 gap-6 w-full">
                  {/* Timezone */}
                  <div className="flex flex-col gap-2 items-start">
                    <label className="font-medium text-[#111827] text-[14px] leading-[21px]">Timezone</label>
                    <div className="relative w-full">
                      <select
                        value={form.timezone}
                        onChange={e => setField("timezone", e.target.value)}
                        className="appearance-none bg-white border border-[#e5e7eb] h-[50px] pl-[17px] pr-10 rounded-[8px] w-full font-normal text-[#111827] text-[14px] leading-[21px] focus:outline-none focus:ring-2 focus:ring-[#4f46e5] transition"
                      >
                        {TIMEZONES.map(tz => <option key={tz} value={tz}>{tz}</option>)}
                      </select>
                      <img alt="" src={imgChevronSvg} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ width: 21, height: 21 }} />
                    </div>
                  </div>

                  {/* Preferred Language */}
                  <div className="flex flex-col gap-2 items-start">
                    <label className="font-medium text-[#111827] text-[14px] leading-[21px]">Preferred Language</label>
                    <div className="relative w-full">
                      <select
                        value={form.preferred_language}
                        onChange={e => setField("preferred_language", e.target.value)}
                        className="appearance-none bg-white border border-[#e5e7eb] h-[50px] pl-[17px] pr-10 rounded-[8px] w-full font-normal text-[#111827] text-[14px] leading-[21px] focus:outline-none focus:ring-2 focus:ring-[#4f46e5] transition"
                      >
                        {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
                      </select>
                      <img alt="" src={imgChevronSvg} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ width: 21, height: 21 }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Footer Actions ── */}
              <div className="border-t border-[#e5e7eb] flex items-center justify-between pt-[33px] w-full">
                <button
                  type="button"
                  onClick={handleSaveProgress}
                  className="font-medium text-[#6b7280] text-[14px] leading-[20px] hover:text-[#111827] transition"
                >
                  Save my progress
                </button>
                <div className="flex gap-3 items-center">
                  <button
                    type="button"
                    onClick={() => window.history.back()}
                    className="bg-white border border-[#e5e7eb] flex flex-col h-12 items-center justify-center px-[25px] rounded-[8px] font-medium text-[#374151] text-[14px] leading-[20px] hover:bg-gray-50 transition"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleContinue}
                    disabled={loading}
                    className="bg-gradient-to-r from-[#4f46e5] to-[#7c3aed] drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] flex gap-2 h-12 items-center justify-center px-6 rounded-[8px] w-[156px] font-medium text-white text-[14px] leading-[20px] hover:opacity-90 transition disabled:opacity-60"
                  >
                    {loading ? (
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                    ) : (
                      <>
                        <span>Continue</span>
                        <img alt="" src={imgArrowRight} style={{ width: 10.5, height: 9 }} />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Security Badges & Footer ── */}
      <div className="bg-white border-t border-[#f3f4f6] flex flex-col items-start left-0 pb-8 pt-[33px] px-[208px] right-0 bottom-0 w-full" style={{ position: "absolute", top: "calc(199px + 1400px)" }}>
        <div className="max-w-[1024px] w-full px-8 flex flex-col gap-8 items-start">
          {/* Badges */}
          <div className="flex gap-12 items-start justify-center opacity-60 w-full">
            {[
              { icon: imgLockIcon, w: 12.25, h: 14, label: "AES-256 Encryption" },
              { icon: imgShieldIcon, w: 13.128, h: 13.918, label: "SOC 2 Certified" },
              { icon: imgGlobeIcon, w: 15.752, h: 14, label: "GDPR Compliant" },
              { icon: imgPrivacyIcon, w: 17.502, h: 14, label: "Privacy First" },
            ].map(b => (
              <div key={b.label} className="flex gap-2 items-center">
                <img alt="" src={b.icon} style={{ width: b.w, height: b.h }} className="shrink-0" />
                <span className="font-medium text-[#4b5563] text-[14px] leading-[20px]">{b.label}</span>
              </div>
            ))}
          </div>
          {/* Links */}
          <div className="flex items-center justify-between w-full">
            <span className="font-normal text-[#6b7280] text-[12px] leading-[16px]">© 2024 VisaFlow Inc. All rights reserved.</span>
            <div className="flex gap-6 items-start">
              {["Terms of Service", "Privacy Policy", "Contact Support"].map(link => (
                <a key={link} href="#" className="font-normal text-[#6b7280] text-[12px] leading-[16px] hover:text-[#111827] transition">
                  {link}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}