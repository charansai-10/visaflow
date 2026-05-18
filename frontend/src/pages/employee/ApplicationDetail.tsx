// src/pages/employee/ApplicationDetail.tsx
import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useApplication, useApplicationTasks } from "../../hooks/useApplications";
import { completeTask } from "../../api/applications.api";
import type { Task, ApplicationStage } from "../../types/application.types";

// ── Assets ────────────────────────────────────────────────────────────────────
import imgBreadArrow from "../../assets/icons/appdetail-breadarrow.svg";
import imgCheck      from "../../assets/icons/appdetail-check.svg";
import imgPdfIcon    from "../../assets/icons/appdetail-pdf-icon.svg";
import imgMsgIcon    from "../../assets/icons/appdetail-msg-icon.svg";
import imgArrowRight from "../../assets/icons/appdetail-arrow-right.svg";

// ── Helpers ───────────────────────────────────────────────────────────────────
function fmtDate(iso?: string): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
}

function fmtFileSize(bytes?: number): string {
  if (!bytes) return "";
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
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
        <div className="absolute -left-[31px] top-[4px] bg-white border-2 border-[#e2e8f0]
                        rounded-full size-[20px]" />
      )}

      <p className={`leading-[20px] text-[14px] tracking-[-0.5px] whitespace-nowrap ${
        isDone || isCurrent ? "font-semibold text-[#0f172a]" : "font-medium text-[#64748b]"
      }`}>
        {label}
      </p>

      {isDone ? (
        <p className="text-[#64748b] text-[12px] leading-[16px] tracking-[-0.5px] whitespace-nowrap">
          Completed
        </p>
      ) : isCurrent ? (
        <p className="text-[#3a46e5] font-medium text-[12px] leading-[16px] tracking-[-0.5px] whitespace-nowrap">
          In Progress - Action Required
        </p>
      ) : (
        <p className="text-[#94a3b8] text-[12px] leading-[16px] tracking-[-0.5px] whitespace-nowrap">
          Pending
        </p>
      )}
    </div>
  );
}

// ── Task Row ──────────────────────────────────────────────────────────────────
// Handles BOTH scenarios:
//   Scenario 1 — new application, task not completed → show Upload button
//   Scenario 2 — returning user, task completed with doc → show file info + View button
function TaskRow({
  task,
  applicationId,
  onToggle,
}: {
  task: Task;
  applicationId: string;
  onToggle: (id: string, done: boolean) => void;
}) {
  const navigate   = useNavigate();
  const isComplete = task.is_completed;

  // Has an uploaded document linked to this task (Scenario 2)
  const hasDocument = isComplete && !!task.document_name;

  function handleUploadOrView() {
    if (hasDocument && task.document_id) {
      // Scenario 2: already uploaded — go to document viewer
      navigate(`/documents/viewer?doc_id=${task.document_id}`);
    } else {
      // Scenario 1: not yet uploaded — go to document upload
      navigate(`/documents/upload?application_id=${applicationId}&task_id=${task.id}`);
    }
  }

  return (
    <div className={`flex items-center justify-between p-[17px] rounded-[12px] border w-full
                     transition ${
      isComplete
        ? "bg-[rgba(236,253,245,0.3)] border-[#d1fae5] min-h-[72px]"
        : "bg-[rgba(240,245,255,0.3)] border-[#cddbfe] h-[72px] drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)]"
    }`}>

      {/* ── Left: checkbox / check + task info ── */}
      <div className="flex items-start gap-[16px] flex-1 min-w-0">

        {/* Checkbox or green check */}
        <div className="shrink-0 mt-[2px]">
          {isComplete ? (
            <div className="bg-[#d1fae5] flex items-center justify-center rounded-full size-[24px]">
              <img src={imgCheck} alt="" className="w-[10.5px] h-[12px] object-contain" />
            </div>
          ) : (
            <button
              onClick={() => onToggle(task.id, true)}
              className="rounded-[6px] border-2 border-[#5269f2] bg-white size-[24px]
                         transition hover:border-[#3a46e5] shrink-0"
            />
          )}
        </div>

        {/* Task name + subtitle */}
        <div className="flex flex-col gap-[4px] min-w-0 flex-1">
          <p className="font-semibold text-[14px] text-[#0f172a] leading-[20px] tracking-[-0.5px]
                        whitespace-nowrap">
            {task.name}
          </p>

          {/* Scenario 2: show uploaded file name + size + date */}
          {hasDocument ? (
            <div className="flex items-center gap-[8px] mt-[4px]">
              <img src={imgPdfIcon} alt="" className="w-[16px] h-[16px] object-contain shrink-0" />
              <div className="flex flex-col gap-[1px] min-w-0">
                <span className="font-medium text-[12px] text-[#0f172a] leading-[16px]
                                 tracking-[-0.5px] truncate">
                  {task.document_name}
                </span>
                <span className="text-[11px] text-[#64748b] leading-[14px] tracking-[-0.5px]
                                 whitespace-nowrap">
                  {[
                    task.document_size_bytes ? fmtFileSize(task.document_size_bytes) : null,
                    task.document_uploaded_at
                      ? `Uploaded ${fmtDate(task.document_uploaded_at)}`
                      : "Uploaded",
                  ].filter(Boolean).join(" • ")}
                </span>
              </div>
            </div>
          ) : (
            /* Scenario 1 or completed without doc info */
            <p className={`text-[12px] leading-[16px] tracking-[-0.5px] whitespace-nowrap ${
              isComplete ? "text-[#059669] font-medium" : "text-[#3a46e5] font-medium"
            }`}>
              {isComplete
                ? "✓ Uploaded & Verified"
                : task.description ?? "Upload required"}
            </p>
          )}
        </div>
      </div>

      {/* ── Right: action button ── */}
      <div className="shrink-0 ml-[16px]">
        {isComplete ? (
          // Scenario 2: View uploaded document
          <button
            onClick={handleUploadOrView}
            className="bg-white border border-[#e2e8f0] h-[30px] px-[12px] rounded-[8px]
                       text-[#64748b] text-[12px] font-medium tracking-[-0.5px]
                       whitespace-nowrap hover:bg-[#f9fafb] transition"
          >
            View
          </button>
        ) : (
          // Scenario 1: Upload document
          <button
            onClick={handleUploadOrView}
            className="bg-[#3a46e5] h-[28px] px-[16px] rounded-[8px] text-white text-[12px]
                       font-medium tracking-[-0.5px] whitespace-nowrap
                       drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] hover:bg-[#2f35ca] transition"
          >
            Upload
          </button>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
export default function ApplicationDetail() {
  const { id }   = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: app,   isLoading: appLoading,   error: appError  } = useApplication(id);
  const { data: tasks, isLoading: tasksLoading, setData: setTasks } = useApplicationTasks(id);

  const [submitting, setSubmitting] = useState(false);

  // Derived
  const badge          = getStatusBadge(app?.status ?? "draft");
  const progressPct    = app?.progress_percent ?? 0;
  const tasksArr       = tasks ?? [];
  const completedCount = tasksArr.filter(t => t.is_completed).length;
  const totalCount     = tasksArr.length;
  const allDone        = totalCount > 0 && completedCount === totalCount;

  const stageOrder      = STAGES.map(s => s.key);
  const currentIdx      = stageOrder.indexOf(app?.current_stage ?? "profile_eligibility");
  const completedStages = stageOrder.slice(0, Math.max(0, currentIdx)) as ApplicationStage[];

  async function handleToggleTask(taskId: string, done: boolean) {
    try {
      await completeTask(id!, taskId, done);
      setTasks(prev => (prev ?? []).map(t =>
        t.id === taskId ? { ...t, is_completed: done } : t
      ));
    } catch { /* ignore */ }
  }

  async function handleSubmit() {
    setSubmitting(true);
    setTimeout(() => { setSubmitting(false); navigate("/applications/list"); }, 800);
  }

  // ── Loading ──────────────────────────────────────────────────────────────────
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

  // ── Error ────────────────────────────────────────────────────────────────────
  if (appError || !app) {
    return (
      <div className="flex items-center justify-center py-[64px]">
        <div className="text-center">
          <p className="text-[#ef4444] text-[16px] font-medium mb-[4px]">
            Failed to load application
          </p>
          <p className="text-[#64748b] text-[14px]">{appError ?? "Application not found"}</p>
          <button
            onClick={() => navigate("/applications/list")}
            className="mt-[16px] text-[#3a46e5] text-[14px] font-medium hover:underline"
          >
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
        <Link
          to="/applications/list"
          className="text-[#64748b] text-[14px] font-normal tracking-[-0.5px] leading-[20px]
                     hover:text-[#0f172a] transition-colors"
        >
          Applications
        </Link>
        <img src={imgBreadArrow} alt="" className="w-[6.25px] h-[10px] object-contain" />
        <span className="text-[#0f172a] text-[14px] font-medium tracking-[-0.5px] leading-[20px]
                         whitespace-nowrap">
          {app.visa_type?.name ?? "Application Detail"}
        </span>
      </div>

      {/* ── Two-column layout ── */}
      <div className="flex gap-[24px] items-start w-full">

        {/* ── LEFT column ── */}
        <div className="flex flex-col gap-[24px] shrink-0 w-[356px]">

          {/* Application Summary Card */}
          <div className="bg-white border border-[#f1f5f9] rounded-[16px]
                          shadow-[0px_4px_12px_0px_rgba(0,0,0,0.02)]
                          flex flex-col gap-[16px] p-[25px] overflow-hidden relative">
            <div className="absolute bg-[#f0f5ff] h-[128px] left-[226px] right-0 top-0
                            rounded-bl-full opacity-50 pointer-events-none" />

            {/* Visa + badge */}
            <div className="flex items-center justify-between w-[306px]">
              <h2 className="font-bold text-[#0f172a] text-[18px] leading-[28px] tracking-[-0.5px]
                             whitespace-nowrap">
                {app.visa_type?.code ?? "—"} Visa
              </h2>
              <span className={`${badge.bg} border ${badge.border} ${badge.text} font-bold
                                text-[12px] leading-[16px] tracking-[-0.5px] px-[10px] py-[5px]
                                rounded-[6px] whitespace-nowrap`}>
                {badge.label}
              </span>
            </div>

            {/* Sponsor */}
            <p className="text-[#64748b] text-[14px] font-normal leading-[20px] tracking-[-0.5px]
                          whitespace-nowrap">
              {app.sponsor_employer ?? "No sponsor"}
            </p>

            {/* Progress bar */}
            <div className="bg-[#f8fafc] border border-[#f1f5f9] rounded-[12px] p-[17px]
                            flex flex-col gap-[8px] w-[306px]">
              <div className="flex items-center justify-between">
                <span className="text-[#64748b] font-medium text-[12px] leading-[16px]
                                 tracking-[-0.5px] whitespace-nowrap">
                  Overall Progress
                </span>
                <span className="text-[#3a46e5] font-bold text-[12px] leading-[16px]
                                 tracking-[-0.5px] whitespace-nowrap">
                  {progressPct}%
                </span>
              </div>
              <div className="bg-[#e2e8f0] rounded-full h-[6px] w-full overflow-hidden">
                <div
                  className="h-[6px] rounded-full transition-all duration-500"
                  style={{
                    width: `${progressPct}%`,
                    backgroundImage:
                      "linear-gradient(177.18deg, rgb(58,70,229) 0%, rgb(157,78,221) 100%)",
                  }}
                />
              </div>
            </div>

            {/* Dates */}
            <div className="flex items-center justify-between w-[306px]">
              <span className="text-[#64748b] text-[12px] font-normal leading-[16px]
                               tracking-[-0.5px] whitespace-nowrap">
                Started: {fmtDate(app.start_date ?? app.created_at)}
              </span>
              <span className="text-[#64748b] text-[12px] font-normal leading-[16px]
                               tracking-[-0.5px] whitespace-nowrap">
                Due: {fmtDate(app.due_date)}
              </span>
            </div>
          </div>

          {/* Application Timeline */}
          <div className="bg-white border border-[#f1f5f9] rounded-[16px]
                          drop-shadow-[0px_4px_6px_rgba(0,0,0,0.02)]
                          flex flex-col gap-[24px] p-[25px] w-[356px]">
            <h3 className="font-semibold text-[#0f172a] text-[16px] leading-[24px]
                           tracking-[-0.5px] whitespace-nowrap">
              Application Timeline
            </h3>
            <div className="border-l-2 border-[#f1f5f9] flex flex-col gap-[32px] pl-[26px]
                            w-[306px]">
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

        {/* ── RIGHT column ── */}
        <div className="flex flex-col gap-[24px] flex-1 min-w-0">

          {/* Required Tasks Card */}
          <div className="bg-white border border-[#f1f5f9] rounded-[16px]
                          drop-shadow-[0px_4px_6px_rgba(0,0,0,0.02)]
                          flex flex-col gap-[24px] p-[25px] w-full">

            {/* Header */}
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-[#0f172a] text-[18px] leading-[28px]
                             tracking-[-0.5px] whitespace-nowrap">
                Required Tasks
              </h3>
              <span className="bg-[#f8fafc] border border-[#e2e8f0] text-[#64748b] font-medium
                               text-[12px] leading-[16px] tracking-[-0.5px] px-[10px] py-[5px]
                               rounded-[6px] whitespace-nowrap">
                {completedCount} of {totalCount} Completed
              </span>
            </div>

            {/* Task list
                Scenario 1: new app → all rows show Upload button (blue, no file info)
                Scenario 2: returning → completed rows show filename + View button
                            incomplete rows still show Upload button
            */}
            <div className="flex flex-col gap-[12px]">
              {tasksArr.length > 0 ? (
                tasksArr.map(task => (
                  <TaskRow
                    key={task.id}
                    task={task}
                    applicationId={id!}
                    onToggle={handleToggleTask}
                  />
                ))
              ) : (
                <p className="text-[#64748b] text-[14px] text-center py-[16px]">
                  No tasks found for this application.
                </p>
              )}
            </div>

            {/* Info tip — only when tasks pending */}
            {tasksArr.length > 0 && !allDone && (
              <div className="bg-[rgba(240,245,255,0.5)] border border-[#e5edff] rounded-[10px]
                              px-[16px] py-[12px] flex items-start gap-[8px]">
                <span className="text-[#3a46e5] text-[14px] shrink-0">ℹ</span>
                <p className="text-[#334155] text-[12px] leading-[18px]">
                  Click <span className="font-semibold">Upload</span> on each task to upload
                  the required document for your{" "}
                  <span className="font-semibold">{app.visa_type?.code ?? "visa"}</span>{" "}
                  application.
                </p>
              </div>
            )}

            {/* All done banner */}
            {allDone && (
              <div className="bg-[rgba(236,253,245,0.6)] border border-[#d1fae5] rounded-[10px]
                              px-[16px] py-[12px] flex items-center gap-[8px]">
                <div className="bg-[#d1fae5] flex items-center justify-center rounded-full
                                shrink-0 size-[20px]">
                  <img src={imgCheck} alt="" className="w-[8.75px] h-[10px] object-contain" />
                </div>
                <p className="text-[#059669] text-[12px] font-medium leading-[18px]">
                  All documents uploaded. You can now submit for review.
                </p>
              </div>
            )}
          </div>

          {/* Footer actions */}
          <div className="border-t border-[#e2e8f0] flex items-center justify-between pt-[25px]">

            {/* Message Support */}
            <button
              onClick={() => navigate("/messages")}
              className="bg-white border border-[#e2e8f0] flex items-center gap-[8px] h-[42px]
                         px-[25px] rounded-[12px] text-[#334155] text-[14px] font-medium
                         tracking-[-0.5px] leading-[20px] hover:bg-[#f9fafb] transition"
            >
              <img
                src={imgMsgIcon}
                alt=""
                className="w-[14px] h-[14px] object-contain shrink-0"
              />
              Message Support
            </button>

            <div className="flex items-center gap-[12px]">
              {/* Save Draft — go back to list */}
              <button
                onClick={() => navigate("/applications/list")}
                className="bg-[#f1f5f9] flex items-center justify-center h-[40px] px-[24px]
                           rounded-[12px] text-[#334155] text-[14px] font-medium tracking-[-0.5px]
                           leading-[20px] hover:bg-[#e2e8f0] transition"
              >
                Save Draft
              </button>

              {/* Submit when ready */}
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="flex items-center gap-[8px] h-[40px] px-[24px] rounded-[12px]
                           text-white text-[14px] font-medium tracking-[-0.5px] leading-[20px]
                           opacity-75 drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)]
                           hover:opacity-100 transition disabled:opacity-40"
                style={{
                  backgroundImage:
                    "linear-gradient(168.63deg, rgb(58,70,229) 0%, rgb(157,78,221) 100%)",
                }}
              >
                {submitting ? "Submitting…" : "Submit when ready"}
                <img
                  src={imgArrowRight}
                  alt=""
                  className="size-[14px] object-contain shrink-0"
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}