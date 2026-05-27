// src/pages/employee/DocumentViewer.tsx
//
// Document flow:
//   1. GET /api/v1/documents/:id/view  (port 8000 — main backend, authenticated)
//      → returns the raw file (image/pdf) as FileResponse
//   2. POST http://localhost:8002/api/v1/ocr/extract  (port 8002 — OCR service, no auth)
//      → sends the file blob → Claude extracts fields → returns JSON
//
// URL params:
//   /documents/viewer?doc_id=xxx
//   /documents/viewer?doc_id=xxx&application_id=yyy  (yyy used for "Back to Case" nav)

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useNavigate }      from "react-router-dom";
import { useDocument }                       from "../../hooks/useDocuments";
import documentsApi                          from "../../api/documents.api";

// ── Types ─────────────────────────────────────────────────────────────────────
interface OCRField {
  id:               string;
  field_name:       string;
  extracted_value:  string;
  confidence_score: number;
  needs_review:     boolean;
  is_confirmed:     boolean;
  is_editing:       boolean;
  edit_value:       string;
}

// ── OCR service — port 8002, no auth required ─────────────────────────────────
const OCR_BASE = import.meta.env.VITE_OCR_URL ?? "http://localhost:8002";

// ── Helpers ───────────────────────────────────────────────────────────────────
function confBadge(score: number) {
  if (score >= 90) return { bg: "bg-[#dcfce7]", text: "text-[#16a34a]" };
  if (score >= 75) return { bg: "bg-[#fef9c3]", text: "text-[#ca8a04]" };
  return               { bg: "bg-[#fee2e2]",    text: "text-[#dc2626]" };
}

function PageStatus({ status }: { status: string }) {
  if (status === "processed" || status === "confirmed")
    return <span className="text-[#16a34a] text-[10px] font-semibold">Processed</span>;
  if (status === "review_needed")
    return <span className="text-[#d97706] text-[10px] font-semibold">Review</span>;
  return <span className="text-[#6366f1] text-[10px] font-semibold">Processing</span>;
}

// ─────────────────────────────────────────────────────────────────────────────
export default function DocumentViewer() {
  const navigate       = useNavigate();
  const [searchParams] = useSearchParams();
  const docId          = searchParams.get("doc_id")          ?? undefined;
  const returnAppId    = searchParams.get("application_id")  ?? undefined;

  // ── Document metadata — GET /documents/:id ────────────────────────────────
  const { data: doc, isLoading: docLoading, error: docError } = useDocument(docId);

  // ── Viewer state ──────────────────────────────────────────────────────────
  const [fileUrl,     setFileUrl]    = useState<string | null>(null);
  const [fileName,    setFileName]   = useState<string>("");
  const [zoom,        setZoom]       = useState(100);
  const [rotation,    setRotation]   = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = doc?.total_pages ?? 1;

  // ── OCR state ─────────────────────────────────────────────────────────────
  const [fields,        setFields]       = useState<OCRField[]>([]);
  const [ocrLoading,    setOcrLoading]   = useState(false);
  const [ocrError,      setOcrError]     = useState<string | null>(null);
  const [rightOpen,     setRightOpen]    = useState(true);
  const [avgConfidence, setAvgConf]      = useState(0);
  const [fileBlob,      setFileBlob]     = useState<Blob | null>(null);

  // ── Step 1: Load file from main backend (port 8000) ───────────────────────
  // Uses authenticated axios instance — GET /documents/:id/view
  useEffect(() => {
    if (!docId) return;
    let objectUrl: string;

    documentsApi.getFile(docId)
      .then(({ blob, fileName: name }) => {
        objectUrl = URL.createObjectURL(blob);
        setFileUrl(objectUrl);
        setFileName(name);
        setFileBlob(blob);            // keep blob for OCR step
      })
      .catch(err => console.error("Failed to load document file:", err));

    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [docId]);

  // ── Step 2: Run OCR (port 8002 — no auth) ─────────────────────────────────
  // Called automatically once the file blob is loaded
  const runOcr = useCallback(async (blob: Blob, name: string) => {
    setOcrLoading(true);
    setOcrError(null);
    try {
      const form = new FormData();
      form.append("file", blob, name);

      // POST to OCR service — no Authorization header needed
      const res = await fetch(`${OCR_BASE}/api/v1/ocr/extract`, {
        method: "POST",
        body:   form,
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`OCR service error ${res.status}: ${text}`);
      }

      const data = await res.json() as {
        document_type: string;
        fields: { field_name: string; extracted_value: string; confidence_score: number; needs_review: boolean }[];
      };

      const mapped: OCRField[] = data.fields.map((f, i) => ({
        id:               `f-${i}`,
        field_name:       f.field_name,
        extracted_value:  f.extracted_value,
        confidence_score: f.confidence_score,
        needs_review:     f.needs_review,
        is_confirmed:     f.confidence_score >= 90 && !f.needs_review,
        is_editing:       false,
        edit_value:       f.extracted_value,
      }));

      setFields(mapped);
      const avg = mapped.length
        ? Math.round(mapped.reduce((s, f) => s + f.confidence_score, 0) / mapped.length)
        : 0;
      setAvgConf(avg);
    } catch (e) {
      setOcrError(e instanceof Error ? e.message : "OCR failed. Try again.");
    } finally {
      setOcrLoading(false);
    }
  }, []);

  // Auto-run OCR when blob is ready
  useEffect(() => {
    if (fileBlob && fileName && fields.length === 0) {
      void runOcr(fileBlob, fileName);
    }
  }, [fileBlob, fileName]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Field actions ─────────────────────────────────────────────────────────
  function startEdit(id: string) {
    setFields(prev => prev.map(f =>
      f.id === id ? { ...f, is_editing: true, edit_value: f.extracted_value } : f
    ));
  }

  function saveEdit(id: string) {
    setFields(prev => prev.map(f =>
      f.id === id
        ? { ...f, is_editing: false, extracted_value: f.edit_value, needs_review: false }
        : f
    ));
  }

  function confirmField(id: string) {
    setFields(prev => prev.map(f =>
      f.id === id
        ? { ...f, is_confirmed: true, needs_review: false, is_editing: false }
        : f
    ));
  }

  function confirmAll() {
    setFields(prev => prev.map(f => ({
      ...f, is_confirmed: true, needs_review: false, is_editing: false,
    })));
  }

  function exportData() {
    const rows = fields.map(f =>
      `"${f.field_name}","${f.extracted_value}",${f.confidence_score},${f.is_confirmed}`
    );
    const csv  = ["Field Name,Extracted Value,Confidence,Confirmed", ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = `${doc?.name ?? "document"}_data.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleDownload() {
    if (!fileUrl || !doc) return;
    const a    = document.createElement("a");
    a.href     = fileUrl;
    a.download = doc.name;
    a.click();
  }

  // ── Derived ───────────────────────────────────────────────────────────────
  const confirmedCount = fields.filter(f => f.is_confirmed).length;
  const reviewCount    = fields.filter(f => f.needs_review && !f.is_confirmed).length;
  const isPdf          = doc?.file_type === "pdf" || fileName.endsWith(".pdf");

  // ── Loading ───────────────────────────────────────────────────────────────
  if (docLoading) {
    return (
      <div className="flex items-center justify-center py-[64px]">
        <svg className="w-8 h-8 animate-spin text-[#3a46e5]" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
        </svg>
      </div>
    );
  }

  // ── Error ─────────────────────────────────────────────────────────────────
  if (docError || !doc) {
    return (
      <div className="flex items-center justify-center py-[64px]">
        <div className="text-center">
          <p className="text-[#ef4444] text-[15px] font-medium mb-[4px]">Document not found</p>
          <p className="text-[#64748b] text-[13px] mb-[12px]">{docError ?? "Check the document ID"}</p>
          <button onClick={() => navigate("/documents")}
            className="text-[#3a46e5] text-[13px] font-medium hover:underline">
            ← Back to Document Hub
          </button>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col overflow-hidden bg-[#f9fafb]"
         style={{ fontFamily: "Inter, sans-serif", height: "calc(100vh - 72px)" }}>

      {/* ══ TOP BAR ══ */}
      <div className="bg-white border-b border-[#e5e7eb] flex items-center
                      h-[52px] px-[16px] shrink-0 gap-[12px]">

        {/* Back to Case */}
        <button
          onClick={() => navigate(returnAppId ? `/applications/${returnAppId}` : "/documents")}
          className="flex items-center gap-[6px] text-[#64748b] text-[13px] font-medium
                     hover:text-[#0f172a] transition whitespace-nowrap shrink-0"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M5 12l7 7M5 12l7-7" stroke="currentColor" strokeWidth="2"
                  strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back to Case
        </button>

        {/* Divider */}
        <div className="h-[20px] w-px bg-[#e5e7eb] shrink-0" />

        {/* Filename + meta */}
        <div className="flex items-center gap-[8px] min-w-0 flex-1">
          <div className="bg-[#fee2e2] rounded-[5px] flex items-center justify-center
                          w-[28px] h-[32px] shrink-0">
            <span className="text-[#ef4444] text-[7px] font-black">PDF</span>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[#0f172a] text-[13px] font-semibold leading-[16px] truncate">
              {doc.name}
            </span>
            <span className="text-[#94a3b8] text-[11px] leading-[14px] whitespace-nowrap">
              Uploaded 2 hours ago •{" "}
              {doc.file_size_bytes
                ? `${(doc.file_size_bytes / 1024 / 1024).toFixed(1)} MB`
                : ""}
            </span>
          </div>
        </div>

        {/* Zoom */}
        <div className="flex items-center gap-[3px] shrink-0">
          <button
            onClick={() => setZoom(z => Math.max(50, z - 10))}
            className="size-[26px] border border-[#e5e7eb] rounded-[5px] text-[#374151]
                       flex items-center justify-center hover:bg-[#f9fafb] transition
                       text-[14px] font-medium"
          >−</button>
          <span className="text-[#374151] text-[12px] font-medium w-[42px] text-center">
            {zoom}%
          </span>
          <button
            onClick={() => setZoom(z => Math.min(200, z + 10))}
            className="size-[26px] border border-[#e5e7eb] rounded-[5px] text-[#374151]
                       flex items-center justify-center hover:bg-[#f9fafb] transition
                       text-[14px] font-medium"
          >+</button>
        </div>

        {/* Rotate */}
        <button
          onClick={() => setRotation(r => (r + 90) % 360)}
          className="flex items-center gap-[5px] h-[30px] px-[10px] border border-[#e5e7eb]
                     rounded-[7px] text-[#374151] text-[12px] font-medium
                     hover:bg-[#f9fafb] transition shrink-0"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
            <path d="M23 4v6h-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          Rotate
        </button>

        {/* Download */}
        <button
          onClick={handleDownload}
          className="flex items-center gap-[5px] h-[30px] px-[10px] border border-[#e5e7eb]
                     rounded-[7px] text-[#374151] text-[12px] font-medium
                     hover:bg-[#f9fafb] transition shrink-0"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          Download
        </button>

        {/* Approve All */}
        <button
          onClick={confirmAll}
          className="flex items-center gap-[5px] h-[30px] px-[12px] rounded-[7px]
                     text-white text-[12px] font-semibold shrink-0
                     hover:opacity-90 transition"
          style={{ background: "linear-gradient(135deg, #3a46e5, #6366f1)" }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
            <path d="M20 6L9 17l-5-5" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
          Approve All
        </button>
      </div>

      {/* ══ 3-PANEL BODY ══ */}
      <div className="flex flex-1 min-h-0 overflow-hidden">

        {/* ── LEFT: Document Pages ── */}
        <div className="w-[168px] shrink-0 bg-white border-r border-[#e5e7eb]
                        flex flex-col overflow-hidden">

          {/* Header */}
          <div className="px-[12px] pt-[14px] pb-[10px] border-b border-[#f1f5f9]">
            <div className="flex items-center justify-between mb-[8px]">
              <span className="text-[#0f172a] text-[12px] font-bold tracking-[-0.3px]">
                Document Pages
              </span>
              <span className="text-[#94a3b8] text-[10px]">{totalPages} pages</span>
            </div>
            {/* Upload More */}
            <button
              className="w-full h-[28px] rounded-[7px] text-white text-[11px] font-semibold
                         flex items-center justify-center gap-[4px] hover:opacity-90 transition"
              style={{ background: "linear-gradient(135deg, #3a46e5, #6366f1)" }}
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"
                      stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
              </svg>
              Upload More
            </button>
          </div>

          {/* Page thumbnails */}
          <div className="flex-1 overflow-y-auto px-[10px] py-[10px] flex flex-col gap-[10px]">
            {Array.from({ length: Math.max(totalPages, 3) }).map((_, i) => {
              const pageNum  = i + 1;
              const isActive = currentPage === pageNum;
              const status   = i === 0 ? "processed"
                             : i === 2 ? "processing"
                             : "processed";
              return (
                <div
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`cursor-pointer rounded-[8px] overflow-hidden border-2 transition-all ${
                    isActive
                      ? "border-[#3a46e5] shadow-[0_0_0_2px_rgba(58,70,229,0.12)]"
                      : "border-[#e5e7eb] hover:border-[#c7d2fe]"
                  }`}
                >
                  {/* Thumbnail */}
                  <div className="bg-[#f8fafc] h-[104px] flex items-center justify-center relative">
                    {fileUrl && !isPdf && i === 0 ? (
                      <img src={fileUrl} alt={`Page ${pageNum}`}
                           className="w-full h-full object-cover"
                           style={{ transform: `rotate(${rotation}deg)` }} />
                    ) : (
                      <div className="flex flex-col items-center gap-[4px]">
                        <svg width="28" height="34" viewBox="0 0 28 34" fill="none">
                          <rect width="28" height="34" rx="4" fill="#fef2f2"/>
                          <path d="M6 4h12l6 6v20a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2z"
                                fill="#fee2e2"/>
                          <path d="M16 4l6 6h-6V4z" fill="#fca5a5"/>
                          <text x="5" y="24" fontSize="5" fill="#ef4444" fontWeight="bold">PDF</text>
                        </svg>
                      </div>
                    )}
                  </div>
                  {/* Label */}
                  <div className="bg-white px-[6px] py-[4px] flex items-center justify-between
                                  border-t border-[#f1f5f9]">
                    <span className="text-[#64748b] text-[10px]">Page {pageNum}</span>
                    <PageStatus status={status} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── CENTER: Document viewer ── */}
        <div className="flex-1 min-w-0 bg-[#e8ecf0] flex flex-col overflow-hidden relative">

          {/* Page badge */}
          <div className="absolute top-[12px] right-[14px] z-10 bg-white/90 backdrop-blur-sm
                          border border-[#e5e7eb] rounded-[6px] px-[8px] py-[3px]
                          text-[11px] text-[#64748b] font-medium shadow-sm">
            Page {currentPage} of {totalPages}
          </div>

          {/* Document area */}
          <div className="flex-1 overflow-auto flex items-start justify-center p-[28px] pt-[24px]">
            {fileUrl ? (
              <div
                className="bg-white shadow-[0_8px_32px_rgba(0,0,0,0.12)] rounded-[6px]
                           overflow-hidden transition-transform duration-200 origin-top"
                style={{ transform: `scale(${zoom / 100}) rotate(${rotation}deg)` }}
              >
                {isPdf ? (
                  <iframe
                    src={fileUrl}
                    title={doc.name}
                    className="w-[600px] h-[848px]"
                    style={{ border: "none", display: "block" }}
                  />
                ) : (
                  <img
                    src={fileUrl}
                    alt={doc.name}
                    className="max-w-[600px] w-full block"
                  />
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center gap-[12px] pt-[80px]">
                <svg className="w-8 h-8 animate-spin text-[#3a46e5]" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                <p className="text-[#64748b] text-[13px]">Loading document…</p>
              </div>
            )}
          </div>

          {/* Bottom nav */}
          <div className="bg-white border-t border-[#e5e7eb] flex items-center
                          justify-between px-[20px] h-[44px] shrink-0">
            <button
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              className="flex items-center gap-[4px] text-[#374151] text-[12px] font-medium
                         disabled:opacity-40 hover:text-[#3a46e5] transition"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              Previous
            </button>

            <span className="text-[#64748b] text-[12px]">
              Page {currentPage} of {totalPages}
            </span>

            <button
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              className="flex items-center gap-[4px] text-[#374151] text-[12px] font-medium
                         disabled:opacity-40 hover:text-[#3a46e5] transition"
            >
              Next
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>

          {/* Review button — shown when right panel is closed */}
          {!rightOpen && (
            <div className="absolute bottom-[56px] right-[16px]">
              <button
                onClick={() => setRightOpen(true)}
                className="flex items-center gap-[6px] h-[34px] px-[12px] rounded-[8px]
                           bg-white border border-[#e5e7eb] text-[#374151] text-[12px]
                           font-medium shadow-md hover:bg-[#f9fafb] transition"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="11" width="18" height="10" rx="2" stroke="#3a46e5" strokeWidth="1.5"/>
                  <circle cx="12" cy="5" r="2" stroke="#3a46e5" strokeWidth="1.5"/>
                  <path d="M12 7v4M8 15h.01M16 15h.01"
                        stroke="#3a46e5" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                Review Extracted Data
              </button>
            </div>
          )}
        </div>

        {/* ── RIGHT: Extracted Data panel ── */}
        {rightOpen && (
          <div className="w-[280px] shrink-0 bg-white border-l border-[#e5e7eb]
                          flex flex-col overflow-hidden">

            {/* Panel header */}
            <div className="px-[14px] py-[12px] border-b border-[#f1f5f9] shrink-0">
              <div className="flex items-center justify-between mb-[10px]">
                <span className="text-[#0f172a] text-[13px] font-bold tracking-[-0.3px]">
                  Extracted Data
                </span>
                <button
                  onClick={() => setRightOpen(false)}
                  className="text-[#94a3b8] hover:text-[#374151] transition p-[2px]"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2"
                          strokeLinecap="round"/>
                  </svg>
                </button>
              </div>

              {/* Avg confidence bar */}
              <div className="bg-[#f1f5f9] rounded-full h-[6px] overflow-hidden mb-[4px]">
                <div
                  className="h-full rounded-full bg-[#22c55e] transition-all duration-700"
                  style={{ width: `${avgConfidence}%` }}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#94a3b8] text-[11px]">Average confidence score</span>
                <span className="text-[#0f172a] text-[12px] font-bold">{avgConfidence}%</span>
              </div>
            </div>

            {/* Fields scroll area */}
            <div className="flex-1 overflow-y-auto px-[10px] py-[10px] flex flex-col gap-[8px]">

              {/* OCR loading */}
              {ocrLoading && (
                <div className="flex flex-col items-center gap-[8px] py-[40px]">
                  <svg className="w-6 h-6 animate-spin text-[#3a46e5]" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  <p className="text-[#64748b] text-[12px] text-center">
                    Extracting data from document…
                  </p>
                </div>
              )}

              {/* OCR error */}
              {!ocrLoading && ocrError && (
                <div className="bg-[#fef2f2] border border-[#fca5a5] rounded-[8px] p-[12px]">
                  <p className="text-[#dc2626] text-[12px] leading-[16px]">{ocrError}</p>
                  <button
                    onClick={() => fileBlob && void runOcr(fileBlob, fileName)}
                    className="mt-[6px] text-[#3a46e5] text-[11px] font-medium hover:underline"
                  >
                    Retry OCR
                  </button>
                </div>
              )}

              {/* No fields yet */}
              {!ocrLoading && !ocrError && fields.length === 0 && (
                <div className="text-center py-[40px]">
                  <p className="text-[#94a3b8] text-[12px]">No fields extracted yet.</p>
                  <button
                    onClick={() => fileBlob && void runOcr(fileBlob, fileName)}
                    className="mt-[8px] text-[#3a46e5] text-[12px] font-medium hover:underline"
                  >
                    Run OCR
                  </button>
                </div>
              )}

              {/* Field cards */}
              {fields.map(field => {
                const cb = confBadge(field.confidence_score);
                return (
                  <div
                    key={field.id}
                    className={`rounded-[10px] border overflow-hidden ${
                      field.is_confirmed
                        ? "border-[#d1fae5]"
                        : field.needs_review
                        ? "border-[#fde68a]"
                        : "border-[#e5e7eb]"
                    }`}
                  >
                    {/* Card header row */}
                    <div className={`flex items-center justify-between px-[10px] py-[7px] ${
                      field.is_confirmed
                        ? "bg-[#dcfce7]"
                        : field.needs_review
                        ? "bg-[#fef3c7]"
                        : "bg-[#f8fafc]"
                    }`}>
                      <div className="flex items-center gap-[5px] min-w-0">
                        {/* Small colored icon */}
                        <div className={`size-[14px] rounded-[3px] flex items-center justify-center shrink-0 ${
                          field.is_confirmed ? "bg-[#16a34a]"
                          : field.needs_review ? "bg-[#d97706]"
                          : "bg-[#6366f1]"
                        } bg-opacity-20`}>
                          <svg width="8" height="8" viewBox="0 0 24 24" fill="none">
                            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"
                                  stroke={field.is_confirmed ? "#16a34a" : field.needs_review ? "#d97706" : "#6366f1"}
                                  strokeWidth="2" strokeLinecap="round"/>
                          </svg>
                        </div>
                        <span className="text-[#111827] text-[11px] font-semibold truncate">
                          {field.field_name}
                        </span>
                      </div>
                      <span className={`${cb.bg} ${cb.text} text-[10px] font-bold
                                        px-[5px] py-[1px] rounded-full shrink-0 ml-[4px]`}>
                        {field.confidence_score}%
                      </span>
                    </div>

                    {/* Value */}
                    <div className="px-[10px] pt-[8px]">
                      {field.is_editing ? (
                        <input
                          autoFocus
                          value={field.edit_value}
                          onChange={e => setFields(prev => prev.map(f =>
                            f.id === field.id ? { ...f, edit_value: e.target.value } : f
                          ))}
                          onKeyDown={e => { if (e.key === "Enter") saveEdit(field.id); }}
                          className="w-full text-[12px] text-[#0f172a] bg-white border border-[#6366f1]
                                     rounded-[6px] px-[8px] py-[5px] focus:outline-none"
                          style={{ fontFamily: "Inter, sans-serif" }}
                        />
                      ) : (
                        <p className="text-[#0f172a] text-[13px] font-medium leading-[18px]
                                      break-words">
                          {field.extracted_value || <span className="text-[#94a3b8]">—</span>}
                        </p>
                      )}

                      {/* Warning for needs_review */}
                      {field.needs_review && !field.is_confirmed && (
                        <p className="flex items-center gap-[3px] text-[#d97706] text-[10px]
                                      mt-[3px] leading-[14px]">
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4M12 17h.01"
                                  stroke="#d97706" strokeWidth="2" strokeLinecap="round"/>
                          </svg>
                          Please verify this date is correct
                        </p>
                      )}
                    </div>

                    {/* Edit / Confirm actions */}
                    <div className="flex items-center gap-[4px] px-[10px] py-[7px]">
                      {field.is_editing ? (
                        <>
                          <button onClick={() => saveEdit(field.id)}
                                  className="text-[#3a46e5] text-[11px] font-medium hover:underline">
                            Save
                          </button>
                          <span className="text-[#e5e7eb] text-[10px]">•</span>
                          <button onClick={() => setFields(prev => prev.map(f =>
                                    f.id === field.id ? { ...f, is_editing: false } : f
                                  ))}
                                  className="text-[#94a3b8] text-[11px] hover:text-[#374151] transition">
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => startEdit(field.id)}
                                  className="flex items-center gap-[3px] text-[#64748b] text-[11px]
                                             font-medium hover:text-[#374151] transition">
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"
                                    stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"
                                    stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                            </svg>
                            Edit
                          </button>
                          <span className="text-[#e5e7eb] text-[10px]">•</span>
                          {field.is_confirmed ? (
                            <span className="flex items-center gap-[3px] text-[#16a34a] text-[11px]
                                             font-medium">
                              <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                                <path d="M20 6L9 17l-5-5" stroke="#16a34a" strokeWidth="2.5"
                                      strokeLinecap="round"/>
                              </svg>
                              Confirmed
                            </span>
                          ) : (
                            <button onClick={() => confirmField(field.id)}
                                    className="flex items-center gap-[3px] text-[#64748b] text-[11px]
                                               font-medium hover:text-[#16a34a] transition">
                              <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                                <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5"
                                      strokeLinecap="round"/>
                              </svg>
                              Confirm
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ══ BOTTOM STATUS BAR ══ */}
      <div className="bg-white border-t border-[#e5e7eb] flex items-center justify-between
                      h-[40px] px-[16px] shrink-0">

        {/* Status counts */}
        <div className="flex items-center gap-[14px]">
          <span className="flex items-center gap-[5px] text-[11px] text-[#374151]">
            <span className="size-[7px] rounded-full bg-[#22c55e] shrink-0" />
            {confirmedCount} fields confirmed
          </span>
          <span className="flex items-center gap-[5px] text-[11px] text-[#374151]">
            <span className="size-[7px] rounded-full bg-[#f59e0b] shrink-0" />
            {reviewCount} needs review
          </span>
          {ocrLoading && (
            <span className="flex items-center gap-[5px] text-[11px] text-[#374151]">
              <span className="size-[7px] rounded-full bg-[#3b82f6] shrink-0 animate-pulse" />
              1 page processing
            </span>
          )}
        </div>

        {/* Auto-save */}
        <div className="flex items-center gap-[4px] text-[11px] text-[#94a3b8]">
          <span className="size-[7px] rounded-full bg-[#22c55e] shrink-0" />
          Auto-save: Active
        </div>

        {/* Actions */}
        <div className="flex items-center gap-[8px]">
          <button
            onClick={exportData}
            className="flex items-center gap-[4px] h-[26px] px-[10px] border border-[#e5e7eb]
                       rounded-[6px] text-[#374151] text-[11px] font-medium
                       hover:bg-[#f9fafb] transition"
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            Export Data
          </button>

          <button
            onClick={() => navigate("/documents")}
            className="flex items-center gap-[4px] h-[26px] px-[10px] rounded-[6px]
                       text-white text-[11px] font-semibold hover:opacity-90 transition"
            style={{ background: "linear-gradient(135deg, #3a46e5, #6366f1)" }}
          >
            Next Document
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
              <path d="M5 12h14M12 5l7 7-7 7" stroke="white" strokeWidth="2"
                    strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}