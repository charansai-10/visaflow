// src/pages/employee/DocumentUpload.tsx
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDocuments } from "../../hooks/useDocuments";
// import { useCurrentUser } from "../../hooks/useAuth";

// ── Assets ────────────────────────────────────────────────────────────────────
import imgProgressIcon from "../../assets/icons/docup2-progress-icon.svg";
import imgIdentityIcon from "../../assets/icons/docup2-identity-icon.svg";
import imgPdfIcon      from "../../assets/icons/docup2-pdf-icon.svg";
import imgEyeIcon      from "../../assets/icons/docup2-eye-icon.svg";
import imgTrashIcon    from "../../assets/icons/docup2-trash-icon.svg";
import imgImgIcon      from "../../assets/icons/docup2-img-icon.svg";
import imgEmployIcon   from "../../assets/icons/docup2-employ-icon.svg";
import imgUploadIcon   from "../../assets/icons/docup2-upload-icon.svg";

// ── Types ─────────────────────────────────────────────────────────────────────
type DocStatus = "uploaded" | "pending_review" | "required" | "verified";

interface DocRow {
  id:          string;
  title:       string;
  titleLine2?: string;
  description: string;
  status:      DocStatus;
  file?: {
    name:  string;
    size:  string;
    date:  string;
    note?: string;
    type:  "pdf" | "img";
  };
}

// ── Status badge config ───────────────────────────────────────────────────────
function getStatusBadge(status: DocStatus) {
  switch (status) {
    case "uploaded":
    case "verified":
      return {
        bg: "bg-[#d1fae5]", border: "border border-[#a7f3d0]",
        text: "text-[#047857]", label: "Uploaded",
      };
    case "pending_review":
      return {
        bg: "bg-[#fef3c7]", border: "border border-[#fde68a]",
        text: "text-[#b45309]", label: "Pending\nReview",
      };
    default:
      return {
        bg: "bg-[#f3f4f6]", border: "border border-[#e5e7eb]",
        text: "text-[#4b5563]", label: "Required",
      };
  }
}

// ── Document data ─────────────────────────────────────────────────────────────
const IDENTITY_DOCS: DocRow[] = [
  {
    id:          "passport",
    title:       "Valid Passport",
    description: "Biographical page showing photo, details,\nand expiration date.",
    status:      "uploaded",
    file:        { name: "passport_scan_2023.pdf", size: "2.4 MB", date: "Uploaded Oct 12", type: "pdf" },
  },
  {
    id:          "national_id",
    title:       "National ID / Driver's",
    titleLine2:  "License",
    description: "Front and back of your current government-\nissued ID.",
    status:      "pending_review",
    file:        { name: "drivers_license_front.jpg", size: "", date: "", note: "Awaiting manager approval", type: "img" },
  },
];

const EMPLOYMENT_DOCS: DocRow[] = [
  {
    id:          "offer_letter",
    title:       "Offer Letter",
    description: "Signed offer letter from your sponsoring\nemployer.",
    status:      "required",
  },
  {
    id:          "employment_verification",
    title:       "Employment Verification",
    description: "Letter confirming your current employment\nstatus and salary.",
    status:      "required",
  },
];

// ── Upload Dropzone ───────────────────────────────────────────────────────────
function UploadZone({ onFile }: { onFile: (f: File) => void }) {
  const ref      = useRef<HTMLInputElement>(null);
  const [drag, setDrag] = useState(false);
  return (
    <div
      onClick={() => ref.current?.click()}
      onDragOver={e  => { e.preventDefault(); setDrag(true);  }}
      onDragLeave={() => setDrag(false)}
      onDrop={e => {
        e.preventDefault(); setDrag(false);
        if (e.dataTransfer.files[0]) onFile(e.dataTransfer.files[0]);
      }}
      className={`border-2 border-dashed rounded-[12px] flex flex-col gap-[4px] items-center
                  p-[26px] cursor-pointer transition w-full ${
        drag
          ? "border-[#2563eb] bg-[#eff6ff]"
          : "border-[#d1d5db] bg-white hover:border-[#2563eb] hover:bg-[#f9fafb]"
      }`}
    >
      <div className="bg-[#f3f4f6] rounded-full flex items-center justify-center size-[40px] shrink-0 mb-[8px]">
        <img src={imgUploadIcon} alt="" className="w-[22.5px] h-[18px] object-contain" />
      </div>
      <p className="font-medium text-[#111827] text-[14px] leading-[20px] text-center whitespace-nowrap">
        Click to upload or drag and drop
      </p>
      <p className="font-normal text-[#6b7280] text-[12px] leading-[16px] text-center whitespace-nowrap">
        PDF, JPG, PNG (max. 10MB)
      </p>
      <input ref={ref} type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden"
        onChange={e => { if (e.target.files?.[0]) onFile(e.target.files[0]); }} />
    </div>
  );
}

// ── Doc Row Item ──────────────────────────────────────────────────────────────
function DocRowItem({
  doc, onUpload, onDelete,
}: {
  doc: DocRow;
  onUpload: (id: string, file: File) => void;
  onDelete: (id: string) => void;
}) {
  const badge         = getStatusBadge(doc.status);
  const isPending     = doc.status === "pending_review";
  // const isRequired    = doc.status === "required";
  const hasBadgeLine2 = badge.label.includes("\n");

  return (
    <div className="flex gap-[24px] items-center p-[24px] w-full">

      {/* Left: title + description — w-[303.33px] */}
      <div className="flex flex-col gap-[8px] items-start shrink-0 w-[303px]">
        <div className="flex gap-[12px] items-center w-full flex-wrap">
          {/* Title — may be two lines */}
          <div className="flex flex-col items-start shrink-0">
            {doc.title.split("\n").map((line, i) => (
              <span key={i} className="font-semibold text-[#111827] text-[16px] leading-[24px] whitespace-nowrap">
                {line}
              </span>
            ))}
            {doc.titleLine2 && (
              <span className="font-semibold text-[#111827] text-[16px] leading-[24px] whitespace-nowrap">
                {doc.titleLine2}
              </span>
            )}
          </div>
          {/* Status badge */}
          <span className={`${badge.bg} ${badge.border} ${badge.text} font-medium text-[12px]
                            leading-[16px] px-[11px] py-[5px] rounded-full shrink-0 whitespace-pre-wrap text-center`}>
            {hasBadgeLine2
              ? badge.label.split("\n").map((l, i) => <span key={i} className="block leading-[16px]">{l}</span>)
              : badge.label}
          </span>
        </div>
        {/* Description — whitespace preserved */}
        <p className="font-normal text-[#6b7280] text-[14px] leading-[20px]">
          {doc.description.split("\n").map((line, i) => (
            <span key={i}>{line}{i < doc.description.split("\n").length - 1 && <br />}</span>
          ))}
        </p>
      </div>

      {/* Right: file row or upload zone — flex-1 */}
      <div className="flex-1 min-w-0">
        {doc.file ? (
          /* ── Uploaded file row ── */
          <div className={`flex items-center justify-between p-[13px] rounded-[12px] border ${
            isPending
              ? "bg-[rgba(255,251,235,0.5)] border-[#fde68a]"
              : "bg-[#f9fafb] border-[#e5e7eb]"
          }`}>
            {/* File info */}
            <div className="flex gap-[12px] items-center min-w-0">
              <img
                src={doc.file.type === "pdf" ? imgPdfIcon : imgImgIcon}
                alt=""
                className="size-[24px] object-contain shrink-0"
              />
              <div className="flex flex-col min-w-0">
                <span className="font-medium text-[#111827] text-[14px] leading-[20px] whitespace-nowrap">
                  {doc.file.name}
                </span>
                {doc.file.note ? (
                  <span className="font-normal text-[#d97706] text-[12px] leading-[16px] whitespace-nowrap">
                    {doc.file.note}
                  </span>
                ) : (
                  <span className="font-normal text-[#6b7280] text-[12px] leading-[16px] whitespace-nowrap">
                    {doc.file.size}{doc.file.size && doc.file.date ? " • " : ""}{doc.file.date}
                  </span>
                )}
              </div>
            </div>
            {/* Action buttons */}
            <div className="flex gap-[8px] items-center pl-[16px] shrink-0">
              <button
                type="button"
                className="flex flex-col items-center justify-center px-[8px] py-[6px]
                           rounded-[8px] hover:bg-[#f3f4f6] transition"
              >
                <img src={imgEyeIcon} alt="View" className="w-[18px] h-[16px] object-contain" />
              </button>
              {!isPending && (
                <button
                  type="button"
                  onClick={() => onDelete(doc.id)}
                  className="flex flex-col items-center justify-center px-[8px] py-[6px]
                             rounded-[8px] hover:bg-[#fee2e2] transition"
                >
                  <img src={imgTrashIcon} alt="Delete" className="w-[14px] h-[16px] object-contain" />
                </button>
              )}
            </div>
          </div>
        ) : (
          /* ── Upload dropzone ── */
          <UploadZone onFile={file => onUpload(doc.id, file)} />
        )}
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function DocumentUpload() {
  const navigate = useNavigate();
  // const { data: user } = useCurrentUser();
  const { isLoading, error } = useDocuments();

  const [identityDocs,   setIdentityDocs]   = useState<DocRow[]>(IDENTITY_DOCS);
  const [employmentDocs, setEmploymentDocs] = useState<DocRow[]>(EMPLOYMENT_DOCS);
  const [saving,         setSaving]         = useState(false);
  const [submitting,     setSubmitting]     = useState(false);

  const allDocs      = [...identityDocs, ...employmentDocs];
  const uploaded     = allDocs.filter(d => d.file).length;
  const total        = allDocs.length;
  const progressPct  = total > 0 ? Math.round((uploaded / total) * 100) : 60;
  // const firstName    = user?.first_name ?? "Alex";
  // const lastName     = user?.last_name  ?? "Johnson";

  function handleUpload(id: string, file: File) {
    const size  = `${(file.size / 1024 / 1024).toFixed(1)} MB`;
    const isImg = file.type.startsWith("image/");
    const update = (docs: DocRow[]) =>
      docs.map(d =>
        d.id === id
          ? { ...d, status: "uploaded" as DocStatus, file: { name: file.name, size, date: "Just now", type: isImg ? "img" : "pdf" as "img" | "pdf" } }
          : d
      );
    setIdentityDocs(prev => update(prev));
    setEmploymentDocs(prev => update(prev));
  }

  function handleDelete(id: string) {
    const update = (docs: DocRow[]) =>
      docs.map(d => d.id === id ? { ...d, status: "required" as DocStatus, file: undefined } : d);
    setIdentityDocs(prev => update(prev));
    setEmploymentDocs(prev => update(prev));
  }

  async function handleSaveDraft() {
    setSaving(true);
    setTimeout(() => { setSaving(false); navigate("/documents"); }, 800);
  }

  async function handleSubmit() {
    setSubmitting(true);
    setTimeout(() => { setSubmitting(false); navigate("/applications"); }, 800);
  }

  // ── Loading ──────────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-[64px]">
        <svg className="w-8 h-8 animate-spin text-[#2563eb]" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
    );
  }

  // ── Error ────────────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="flex items-center justify-center py-[64px]">
        <div className="text-center">
          <p className="text-[#ef4444] text-[16px] font-medium mb-[4px]">Failed to load documents</p>
          <p className="text-[#6b7280] text-[14px]">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-[32px] pb-[48px]" style={{ fontFamily: "Inter, sans-serif" }}>

      {/* ── Page Header ── */}
      <div className="flex flex-col gap-[8px]">
        <h1 className="font-bold text-[#111827] text-[30px] leading-[36px] tracking-[-0.75px]">
          Upload Your Documents
        </h1>
        <p className="font-normal text-[#4b5563] text-[18px] leading-[28px]">
          Please provide the required documentation for your H-1B visa application. Ensure all files are clear and legible.
        </p>
      </div>

      {/* ── Progress Summary Card ── */}
      <div className="bg-white border border-[#f3f4f6] rounded-[16px]
                      shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.05),0px_2px_4px_-1px_rgba(0,0,0,0.03)]
                      flex flex-col gap-[12px] p-[33px] w-full">
        {/* Header row */}
        <div className="flex items-center justify-between pb-[12px]">
          <div className="flex flex-col gap-[4px]">
            <div className="flex gap-[8px] items-center">
              <img src={imgProgressIcon} alt="" className="w-[22.5px] h-[20px] object-contain shrink-0" />
              <span className="font-bold text-[#111827] text-[20px] leading-[28px] whitespace-nowrap">
                Application Progress
              </span>
            </div>
            <p className="font-normal text-[#6b7280] text-[14px] leading-[20px] whitespace-nowrap">
              {uploaded} of {total} required documents uploaded
            </p>
          </div>
          {/* In Progress badge */}
          <div className="bg-[rgba(37,99,235,0.1)] flex gap-[8px] items-center
                          px-[16px] py-[8px] rounded-full shrink-0">
            <div className="bg-[#2563eb] rounded-full size-[8px] shrink-0" />
            <span className="font-semibold text-[#2563eb] text-[14px] leading-[20px] whitespace-nowrap">
              In Progress
            </span>
          </div>
        </div>

        {/* Progress bar — bg-[#f3f4f6], h-[16px], rounded-full */}
        <div className="bg-[#f3f4f6] h-[16px] rounded-full w-full overflow-hidden">
          <div
            className="h-[16px] rounded-full transition-all duration-500"
            style={{
              width: `${progressPct}%`,
              backgroundImage: "linear-gradient(to right, #2563eb, #7c3aed)",
            }}
          />
        </div>

        {/* Labels */}
        <div className="flex items-center justify-between">
          <span className="font-medium text-[#4f46e5] text-[14px] leading-[20px]">
            {progressPct}% Complete
          </span>
          <span className="font-medium text-[#6b7280] text-[14px] leading-[20px]">100%</span>
        </div>
      </div>

      {/* ── Document Categories ── */}
      <div className="flex flex-col gap-[32px] pt-[8px] w-full">

        {/* ── Identity Documents Section ── */}
        <div className="bg-white border border-[#f3f4f6] rounded-[16px]
                        shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.05),0px_2px_4px_-1px_rgba(0,0,0,0.03)]
                        overflow-hidden w-full">
          {/* Section header */}
          <div className="bg-[rgba(249,250,251,0.8)] border-b border-[#f3f4f6]
                          flex gap-[12px] items-center px-[24px] pb-[17px] pt-[16px]">
            <div className="bg-[#dbeafe] rounded-[8px] flex items-center justify-center size-[32px] shrink-0">
              <img src={imgIdentityIcon} alt="" className="w-[18px] h-[16px] object-contain" />
            </div>
            <span className="font-semibold text-[#111827] text-[18px] leading-[28px] whitespace-nowrap">
              Identity Documents
            </span>
          </div>
          {/* Rows */}
          <div className="flex flex-col divide-y divide-[#f3f4f6]">
            {identityDocs.map(doc => (
              <DocRowItem key={doc.id} doc={doc} onUpload={handleUpload} onDelete={handleDelete} />
            ))}
          </div>
        </div>

        {/* ── Employment Documents Section ── */}
        <div className="bg-white border border-[#f3f4f6] rounded-[16px]
                        shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.05),0px_2px_4px_-1px_rgba(0,0,0,0.03)]
                        overflow-hidden w-full">
          {/* Section header */}
          <div className="bg-[rgba(249,250,251,0.8)] border-b border-[#f3f4f6]
                          flex gap-[12px] items-center px-[24px] pb-[17px] pt-[16px]">
            <div className="bg-[#f3e8ff] rounded-[8px] flex items-center justify-center size-[32px] shrink-0">
              <img src={imgEmployIcon} alt="" className="size-[16px] object-contain" />
            </div>
            <span className="font-semibold text-[#111827] text-[18px] leading-[28px] whitespace-nowrap">
              Employment Documents
            </span>
          </div>
          {/* Rows */}
          <div className="flex flex-col divide-y divide-[#f3f4f6]">
            {employmentDocs.map(doc => (
              <DocRowItem key={doc.id} doc={doc} onUpload={handleUpload} onDelete={handleDelete} />
            ))}
          </div>
        </div>
      </div>

      {/* ── Sticky Footer Actions ── */}
      <div className="sticky bottom-0 bg-white border-t border-[#e5e7eb]
                      shadow-[0px_-4px_6px_-1px_rgba(0,0,0,0.05)]
                      flex items-center justify-between px-[32px] py-[16px] -mx-[32px]">
        <p className="font-normal text-[#4b5563] text-[14px] leading-[20px]">
          Please ensure all documents are accurate before submitting.
        </p>
        <div className="flex gap-[16px] items-center">
          {/* Save Draft */}
          <button
            type="button"
            onClick={handleSaveDraft}
            disabled={saving}
            className="border border-[#d1d5db] flex items-center justify-center
                       px-[25px] py-[11px] rounded-[8px] text-[#374151] text-[16px]
                       font-medium leading-[24px] hover:bg-[#f9fafb] transition
                       disabled:opacity-60 whitespace-nowrap"
          >
            {saving ? "Saving…" : "Save Draft"}
          </button>
          {/* Submit for Review */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="flex items-center justify-center px-[32px] py-[10px] rounded-[8px]
                       text-white text-[16px] font-medium leading-[24px] opacity-80
                       shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)]
                       hover:opacity-100 transition disabled:opacity-40 whitespace-nowrap"
            style={{ backgroundImage: "linear-gradient(to right, #2563eb, #7c3aed)" }}
          >
            {submitting ? "Submitting…" : "Submit for Review"}
          </button>
        </div>
      </div>
    </div>
  );
}