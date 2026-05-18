// src/pages/employee/ApplicationDetail.tsx
import { useRef, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useApplication, useApplicationTasks } from "../../hooks/useApplications";
import { completeTask } from "../../api/applications.api";
import type { Task, ApplicationStage } from "../../types/application.types";

// ── Assets ────────────────────────────────────────────────────────────────────
import imgBreadArrow  from "../../assets/icons/appdetail-breadarrow.svg";
import imgCheck       from "../../assets/icons/appdetail-check.svg";
import imgUploadCloud from "../../assets/icons/appdetail-upload-cloud.svg";
import imgPdfIcon     from "../../assets/icons/appdetail-pdf-icon.svg";
import imgEyeIcon     from "../../assets/icons/appdetail-eye-icon.svg";
import imgTrashIcon   from "../../assets/icons/appdetail-trash-icon.svg";
import imgMsgIcon     from "../../assets/icons/appdetail-msg-icon.svg";
import imgArrowRight  from "../../assets/icons/appdetail-arrow-right.svg";

// ── Helpers ───────────────────────────────────────────────────────────────────
function fmtDate(iso?: string): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function getStatusBadge(status: string) {
  switch (status) {
    case "approved":
      return { bg: "bg-[#ecfdf5]", border: "border-[#d1fae5]", text: "text-[#059669]", label: "Approved" };
    case "in_progress":
    case "submitted":
      return { bg: "bg-[#f0f5ff]", border: "border-[#e5edff]", text: "text-[#3a46e5]", label: "In Progress" };
    case "action_needed":
    case "rfe_response":
      return { bg: "bg-[#fff7ed]", border: "border-[#fed7aa]", text: "text-[#c2410c]", label: "Action Needed" };
    case "rejected":
      return { bg: "bg-[#fef2f2]", border: "border-[#fecaca]", text: "text-[#b91c1c]", label: "Rejected" };
    default:
      return { bg: "bg-[#f8fafc]", border: "border-[#e2e8f0]", text: "text-[#64748b]", label: "Draft" };
  }
}

// ── Timeline stages ───────────────────────────────────────────────────────────
const STAGES: { key: ApplicationStage; label: string }[] = [
  { key: "profile_eligibility", label: "Profile & Eligibility" },
  { key: "documentation",       label: "Documentation"         },
  { key: "lca_filing",          label: "LCA Filing"            },
  { key: "uscis_submission",    label: "USCIS Submission"       },
];

function StageItem({
  label, stageKey, currentStage, completedStages,
}: {
  label: string;
  stageKey: ApplicationStage;
  currentStage?: ApplicationStage;
  completedStages: ApplicationStage[];
}) {
  const isDone    = completedStages.includes(stageKey);
  const isCurrent = stageKey === currentStage;

  return (
    <div className="relative flex flex-col gap-[4px] items-start shrink-0 w-[280px]">
      {isDone ? (
        <div className="absolute -left-[31px] top-[4px] bg-[#ecfdf5] border-2 border-[#10b981]
                        flex items-center justify-center rounded-full size-[20px]">
          <img src={imgCheck} alt="" className="w-[8.75px] h-[10px] object-contain" />
        </div>
      ) : isCurrent ? (
        <div className="absolute -left-[31px] top-[4px] bg-[#f0f5ff] border-2 border-[#5269f2]
                        flex items-center justify-center rounded-full size-[20px] p-[7px]">
          <div className="bg-[#3a46e5] rounded-full shrink-0 size-[6px]" />
        </div>
      ) : (
        <div className="absolute -left-[31px] top-[4px] bg-white border-2 border-[#e2e8f0] rounded-full size-[20px]" />
      )}

      <p className={`leading-[20px] text-[14px] tracking-[-0.5px] whitespace-nowrap ${
        isDone || isCurrent ? "font-semibold text-[#0f172a]" : "font-medium text-[#64748b]"
      }`}>
        {label}
      </p>

      {isDone ? (
        <p className="text-[#64748b] text-[12px] leading-[16px] tracking-[-0.5px] whitespace-nowrap">Completed</p>
      ) : isCurrent ? (
        <p className="text-[#3a46e5] font-medium text-[12px] leading-[16px] tracking-[-0.5px] whitespace-nowrap">
          In Progress - Action Required
        </p>
      ) : (
        <p className="text-[#94a3b8] text-[12px] leading-[16px] tracking-[-0.5px] whitespace-nowrap">Pending</p>
      )}
    </div>
  );
}

// ── Task row ──────────────────────────────────────────────────────────────────
function TaskRow({ task, onToggle }: { task: Task; onToggle: (id: string, done: boolean) => void }) {
  const isComplete = task.is_completed;
  const isMissing  = !isComplete && (task.description?.toLowerCase().includes("missing") ?? false);

  return (
    <div className={`flex h-[72px] items-center justify-between p-[17px] rounded-[12px] border shrink-0 w-full ${
      isComplete
        ? "bg-[rgba(236,253,245,0.3)] border-[#d1fae5]"
        : isMissing
        ? "bg-[rgba(240,245,255,0.3)] border-[#cddbfe] drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)]"
        : "bg-white border-[#f1f5f9]"
    }`}>
      <div className="flex items-center gap-[16px] h-[40px]">
        {isComplete ? (
          <div className="bg-[#d1fae5] flex items-center justify-center rounded-full shrink-0 size-[24px]">
            <img src={imgCheck} alt="" className="w-[10.5px] h-[12px] object-contain" />
          </div>
        ) : (
          <button
            onClick={() => onToggle(task.id, true)}
            className={`rounded-[6px] border-2 shrink-0 size-[24px] transition hover:border-[#3a46e5] ${
              isMissing ? "border-[#5269f2] bg-white" : "border-[#cbd5e1] bg-white"
            }`}
          />
        )}
        <div className="flex flex-col gap-[2px]">
          <p className="font-semibold text-[14px] text-[#0f172a] leading-[20px] tracking-[-0.5px] whitespace-nowrap">
            {task.name}
          </p>
          <p className={`text-[12px] leading-[16px] tracking-[-0.5px] whitespace-nowrap ${
            isMissing ? "font-medium text-[#3a46e5]" : "font-normal text-[#64748b]"
          }`}>
            {task.description ?? "Required"}
          </p>
        </div>
      </div>

      {isComplete ? (
        <button className="bg-white border border-[#e2e8f0] h-[30px] px-[12px] rounded-[8px]
                           text-[#64748b] text-[12px] font-medium tracking-[-0.5px]
                           whitespace-nowrap hover:bg-[#f9fafb] transition">
          View
        </button>
      ) : isMissing ? (
        <button className="bg-[#3a46e5] h-[28px] px-[16px] rounded-[8px] text-white text-[12px]
                           font-medium tracking-[-0.5px] whitespace-nowrap
                           drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] hover:bg-[#2f35ca] transition">
          Upload
        </button>
      ) : (
        <button className="bg-white border border-[#e2e8f0] h-[30px] px-[12px] rounded-[8px]
                           text-[#64748b] text-[12px] font-medium tracking-[-0.5px]
                           whitespace-nowrap hover:bg-[#f9fafb] transition">
          Upload
        </button>
      )}
    </div>
  );
}

// ── Upload dropzone ────────────────────────────────────────────────────────────
function UploadZone({ onFile }: { onFile: (f: File) => void }) {
  const ref = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  return (
    <div
      onClick={() => ref.current?.click()}
      onDragOver={e => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={e => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) onFile(f); }}
      className={`flex flex-col gap-[16px] items-center justify-center h-[172px] rounded-[12px]
                  border-2 border-dashed cursor-pointer transition w-full ${
        dragging
          ? "border-[#5269f2] bg-[rgba(240,245,255,0.4)]"
          : "border-[#a4bdfc] bg-[rgba(240,245,255,0.2)] hover:border-[#5269f2] hover:bg-[rgba(240,245,255,0.3)]"
      }`}
    >
      <div className="bg-[#e5edff] flex items-center justify-center rounded-full size-[48px]">
        <img src={imgUploadCloud} alt="" className="w-[25px] h-[20px] object-contain" />
      </div>
      <p className="font-semibold text-[14px] text-[#0f172a] text-center tracking-[-0.5px] leading-[20px] whitespace-nowrap">
        Click to upload or drag and drop
      </p>
      <p className="text-[12px] text-[#64748b] text-center tracking-[-0.5px] leading-[16px] whitespace-nowrap">
        SVG, PNG, JPG or PDF (max. 10MB)
      </p>
      <input ref={ref} type="file" accept=".pdf,.jpg,.jpeg,.png,.svg" className="hidden"
        onChange={e => { if (e.target.files?.[0]) onFile(e.target.files[0]); }} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
export default function ApplicationDetail() {
  const { id }   = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: app,   isLoading: appLoading,  error: appError   } = useApplication(id);
  const { data: tasks, isLoading: tasksLoading, setData: setTasks } = useApplicationTasks(id);

  const [uploadedFile, setUploadedFile] = useState<{ name: string; size: string } | null>(null);
  const [submitting,   setSubmitting]   = useState(false);

  const badge         = getStatusBadge(app?.status ?? "draft");
  const progressPct   = app?.progress_percent ?? 0;
  const tasksArr      = tasks ?? [];
  const completedCount = tasksArr.filter(t => t.is_completed).length;
  const totalCount    = tasksArr.length;

  const stageOrder       = STAGES.map(s => s.key);
  const currentIdx       = stageOrder.indexOf(app?.current_stage ?? "profile_eligibility");
  const completedStages  = stageOrder.slice(0, Math.max(0, currentIdx)) as ApplicationStage[];

  async function handleToggleTask(taskId: string, done: boolean) {
    try {
      await completeTask(id!, taskId, done);
      setTasks(prev => (prev ?? []).map(t => t.id === taskId ? { ...t, is_completed: done } : t));
    } catch { /* ignore */ }
  }

  async function handleSubmit() {
    setSubmitting(true);
    setTimeout(() => { setSubmitting(false); navigate("/applications"); }, 800);
  }

  if (appLoading || tasksLoading) {
    return (
      <div className="flex items-center justify-center py-[64px]">
        <svg className="w-8 h-8 animate-spin text-[#3a46e5]" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
    );
  }

  if (appError || !app) {
    return (
      <div className="flex items-center justify-center py-[64px]">
        <div className="text-center">
          <p className="text-[#ef4444] text-[16px] font-medium mb-[4px]">Failed to load application</p>
          <p className="text-[#64748b] text-[14px]">{appError ?? "Application not found"}</p>
          <button onClick={() => navigate("/applications")}
            className="mt-[16px] text-[#3a46e5] text-[14px] font-medium hover:underline">
            ← Back to Applications
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-[32px] pb-[48px]" style={{ fontFamily: "Inter, sans-serif" }}>

      {/* ── Breadcrumb ── */}
      <div className="flex items-center gap-[8px]">
        <Link to="/applications/list"
          className="text-[#64748b] text-[14px] font-normal tracking-[-0.5px] leading-[20px]
                     hover:text-[#0f172a] transition-colors">
          Applications
        </Link>
        <img src={imgBreadArrow} alt="" className="w-[6.25px] h-[10px] object-contain" />
        <span className="text-[#0f172a] text-[14px] font-medium tracking-[-0.5px] leading-[20px] whitespace-nowrap">
          {app.visa_type?.name ?? "Application Detail"}
        </span>
      </div>

      {/* ── Two-column layout ── */}
      <div className="flex gap-[24px] items-start w-full">

        {/* ── LEFT — w-[356px] ── */}
        <div className="flex flex-col gap-[24px] shrink-0 w-[356px]">

          {/* Summary card */}
          <div className="bg-white border border-[#f1f5f9] rounded-[16px]
                          shadow-[0px_4px_12px_0px_rgba(0,0,0,0.02)]
                          flex flex-col gap-[16px] p-[25px] overflow-hidden relative">
            <div className="absolute bg-[#f0f5ff] h-[128px] left-[226px] right-0 top-0 rounded-bl-full opacity-50 pointer-events-none" />

            {/* Title + badge */}
            <div className="flex items-center justify-between w-[306px]">
              <h2 className="font-bold text-[#0f172a] text-[18px] leading-[28px] tracking-[-0.5px] whitespace-nowrap">
                {app.visa_type?.code ?? "—"} Visa
              </h2>
              <span className={`${badge.bg} border ${badge.border} ${badge.text} font-bold text-[12px]
                                leading-[16px] tracking-[-0.5px] px-[10px] py-[5px] rounded-[6px] whitespace-nowrap`}>
                {badge.label}
              </span>
            </div>

            {/* Sponsor */}
            <p className="text-[#64748b] text-[14px] font-normal leading-[20px] tracking-[-0.5px] whitespace-nowrap">
              {app.sponsor_employer ?? "No sponsor"}
            </p>

            {/* Progress */}
            <div className="bg-[#f8fafc] border border-[#f1f5f9] rounded-[12px] p-[17px] flex flex-col gap-[8px] w-[306px]">
              <div className="flex items-center justify-between">
                <span className="text-[#64748b] font-medium text-[12px] leading-[16px] tracking-[-0.5px] whitespace-nowrap">Overall Progress</span>
                <span className="text-[#3a46e5] font-bold text-[12px] leading-[16px] tracking-[-0.5px] whitespace-nowrap">{progressPct}%</span>
              </div>
              <div className="bg-[#e2e8f0] rounded-full h-[6px] w-full overflow-hidden">
                <div
                  className="h-[6px] rounded-full transition-all duration-500"
                  style={{ width: `${progressPct}%`, backgroundImage: "linear-gradient(177.18deg, rgb(58,70,229) 0%, rgb(157,78,221) 100%)" }}
                />
              </div>
            </div>

            {/* Dates */}
            <div className="flex items-center justify-between w-[306px]">
              <span className="text-[#64748b] text-[12px] font-normal leading-[16px] tracking-[-0.5px] whitespace-nowrap">
                Started: {fmtDate(app.start_date ?? app.created_at)}
              </span>
              <span className="text-[#64748b] text-[12px] font-normal leading-[16px] tracking-[-0.5px] whitespace-nowrap">
                Due: {fmtDate(app.due_date)}
              </span>
            </div>
          </div>

          {/* Timeline card */}
          <div className="bg-white border border-[#f1f5f9] rounded-[16px]
                          drop-shadow-[0px_4px_6px_rgba(0,0,0,0.02)]
                          flex flex-col gap-[24px] p-[25px] w-[356px]">
            <h3 className="font-semibold text-[#0f172a] text-[16px] leading-[24px] tracking-[-0.5px] whitespace-nowrap">
              Application Timeline
            </h3>
            <div className="border-l-2 border-[#f1f5f9] flex flex-col gap-[32px] pl-[26px] w-[306px]">
              {STAGES.map(stage => (
                <StageItem
                  key={stage.key}
                  label={stage.label}
                  stageKey={stage.key}
                  currentStage={app.current_stage}
                  completedStages={completedStages}
                />
              ))}
            </div>
          </div>
        </div>

        {/* ── RIGHT ── */}
        <div className="flex flex-col gap-[24px] flex-1 min-w-0">

          {/* Required Tasks */}
          <div className="bg-white border border-[#f1f5f9] rounded-[16px]
                          drop-shadow-[0px_4px_6px_rgba(0,0,0,0.02)]
                          flex flex-col gap-[24px] p-[25px] w-full">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-[#0f172a] text-[18px] leading-[28px] tracking-[-0.5px] whitespace-nowrap">
                Required Tasks
              </h3>
              <span className="bg-[#f8fafc] border border-[#e2e8f0] text-[#64748b] font-medium
                               text-[12px] leading-[16px] tracking-[-0.5px] px-[10px] py-[5px]
                               rounded-[6px] whitespace-nowrap">
                {completedCount} of {totalCount} Completed
              </span>
            </div>
            <div className="flex flex-col gap-[12px]">
              {tasksArr.length > 0 ? (
                tasksArr.map(task => (
                  <TaskRow key={task.id} task={task} onToggle={handleToggleTask} />
                ))
              ) : (
                <p className="text-[#64748b] text-[14px] text-center py-[16px]">No tasks found for this application.</p>
              )}
            </div>
          </div>

          {/* Document Upload */}
          <div className="bg-white border border-[#f1f5f9] rounded-[16px]
                          drop-shadow-[0px_4px_6px_rgba(0,0,0,0.02)]
                          flex flex-col gap-[24px] p-[25px] w-full">
            <h3 className="font-semibold text-[#0f172a] text-[18px] leading-[28px] tracking-[-0.5px] whitespace-nowrap">
              Document Upload
            </h3>
            <p className="text-[#64748b] text-[14px] font-normal leading-[20px] tracking-[-0.5px] -mt-4">
              Upload your required files here. Accepted formats: PDF, JPG, PNG (Max 10MB).
            </p>

            <UploadZone onFile={f => setUploadedFile({ name: f.name, size: `${(f.size / 1024 / 1024).toFixed(1)} MB` })} />

            {/* File row */}
            <div className="bg-[#f8fafc] border border-[#f1f5f9] rounded-[12px]
                            flex items-center justify-between p-[13px] h-[62px] w-full">
              <div className="flex items-center gap-[12px]">
                <img src={imgPdfIcon} alt="" className="size-[18px] object-contain shrink-0" />
                <div className="flex flex-col">
                  <span className="text-[#0f172a] font-medium text-[14px] leading-[20px] tracking-[-0.5px] whitespace-nowrap">
                    {uploadedFile ? uploadedFile.name : "passport_scan_2023.pdf"}
                  </span>
                  <span className="text-[#64748b] text-[12px] leading-[16px] tracking-[-0.5px] whitespace-nowrap">
                    {uploadedFile ? `${uploadedFile.size} • Just uploaded` : "2.4 MB • Uploaded Oct 12"}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-[8px]">
                <button className="flex items-center justify-center px-[6px] py-[8px] h-[36px] rounded-[8px] hover:bg-[#f1f5f9] transition">
                  <img src={imgEyeIcon} alt="View" className="w-[18px] h-[16px] object-contain" />
                </button>
                <button
                  onClick={() => setUploadedFile(null)}
                  className="flex items-center justify-center px-[6px] py-[8px] h-[36px] rounded-[8px] hover:bg-[#fee2e2] transition"
                >
                  <img src={imgTrashIcon} alt="Delete" className="w-[14px] h-[16px] object-contain" />
                </button>
              </div>
            </div>
          </div>

          {/* Footer actions */}
          <div className="border-t border-[#e2e8f0] flex items-center justify-between pt-[25px]">
            <button
              onClick={() => navigate("/messages")}
              className="bg-white border border-[#e2e8f0] flex items-center gap-[8px] h-[42px]
                         px-[25px] rounded-[12px] text-[#334155] text-[14px] font-medium
                         tracking-[-0.5px] leading-[20px] hover:bg-[#f9fafb] transition"
            >
              <img src={imgMsgIcon} alt="" className="w-[14px] h-[14px] object-contain shrink-0" />
              Message Support
            </button>

            <div className="flex items-center gap-[12px]">
              <button
                onClick={() => navigate("/applications")}
                className="bg-[#f1f5f9] flex items-center justify-center h-[40px] px-[24px]
                           rounded-[12px] text-[#334155] text-[14px] font-medium tracking-[-0.5px]
                           leading-[20px] hover:bg-[#e2e8f0] transition"
              >
                Save Draft
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="flex items-center gap-[8px] h-[40px] px-[24px] rounded-[12px] text-white
                           text-[14px] font-medium tracking-[-0.5px] leading-[20px] opacity-75
                           drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] hover:opacity-100
                           transition disabled:opacity-40"
                style={{ backgroundImage: "linear-gradient(168.63deg, rgb(58,70,229) 0%, rgb(157,78,221) 100%)" }}
              >
                {submitting ? "Submitting…" : "Submit when ready"}
                <img src={imgArrowRight} alt="" className="size-[14px] object-contain shrink-0" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}