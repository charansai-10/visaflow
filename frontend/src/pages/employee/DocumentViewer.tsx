// src/pages/employee/DocumentViewer.tsx
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Download, ZoomIn, ZoomOut, RotateCw } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:8001/api/v1";

type FileFormat = "jpg" | "jpeg" | "png" | "pdf" | "other";

interface DocMeta {
  id:          string;
  file_name:   string;
  file_format: FileFormat;
  file_url:    string;   // object URL created from blob
}

export default function DocumentViewer() {
  const navigate            = useNavigate();
  const [searchParams]      = useSearchParams();
  const docId               = searchParams.get("doc_id");

  const [doc,       setDoc]       = useState<DocMeta | null>(null);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState<string | null>(null);
  const [zoom,      setZoom]      = useState(1);
  const [rotation,  setRotation]  = useState(0);

  // ── Fetch file as blob and create object URL ──────────────────────────────
  useEffect(() => {
    if (!docId) { setError("No document ID provided."); setLoading(false); return; }

    (async () => {
      try {
        const token = localStorage.getItem("access_token");
        const res   = await fetch(`${API_BASE}/documents/${docId}/view`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        if (!res.ok) {
          const json = await res.json().catch(() => ({}));
          throw new Error(json.detail ?? `Error ${res.status}`);
        }

        // Read file_name and format from response headers
        const disposition = res.headers.get("content-disposition") ?? "";
        const nameMatch   = disposition.match(/filename[^;=\n]*=["']?([^"';\n]+)["']?/);
        const fileName    = nameMatch?.[1]?.trim() ?? "document";
        const contentType = res.headers.get("content-type") ?? "";
        const fmt         = contentType.includes("pdf")
          ? "pdf"
          : contentType.includes("png")
          ? "png"
          : contentType.includes("jpeg") || contentType.includes("jpg")
          ? "jpg"
          : "other";

        const blob    = await res.blob();
        const fileUrl = URL.createObjectURL(blob);

        setDoc({ id: docId, file_name: fileName, file_format: fmt as FileFormat, file_url: fileUrl });
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load document.");
      } finally {
        setLoading(false);
      }
    })();

    // Cleanup blob URL on unmount
    return () => {
      if (doc?.file_url) URL.revokeObjectURL(doc.file_url);
    };
  }, [docId]);

  function handleDownload() {
    if (!doc) return;
    const a    = document.createElement("a");
    a.href     = doc.file_url;
    a.download = doc.file_name;
    a.click();
  }

  const isImage = doc?.file_format === "jpg" || doc?.file_format === "jpeg" || doc?.file_format === "png";
  const isPdf   = doc?.file_format === "pdf";

  // ── Loading ───────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex flex-col flex-1 min-h-0 overflow-hidden bg-[#0f172a]"
           style={{ fontFamily: "Inter, sans-serif" }}>
        <div className="flex flex-1 items-center justify-center">
          <div className="flex flex-col items-center gap-[16px]">
            <svg className="w-10 h-10 animate-spin text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <p className="text-white text-[14px] opacity-60">Loading document…</p>
          </div>
        </div>
      </div>
    );
  }

  // ── Error ─────────────────────────────────────────────────────────────────
  if (error || !doc) {
    return (
      <div className="flex flex-col flex-1 min-h-0 overflow-hidden bg-[#0f172a]"
           style={{ fontFamily: "Inter, sans-serif" }}>
        <div className="flex flex-1 items-center justify-center">
          <div className="flex flex-col items-center gap-[16px] text-center px-[24px]">
            <div className="bg-[#ef4444]/20 rounded-full p-[20px]">
              <svg className="w-8 h-8 text-[#ef4444]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-white text-[16px] font-medium">Failed to load document</p>
            <p className="text-white/50 text-[14px]">{error ?? "Document not found"}</p>
            <button
              onClick={() => navigate(-1)}
              className="mt-[8px] bg-white/10 hover:bg-white/20 text-white text-[14px] font-medium
                         px-[20px] py-[10px] rounded-[10px] transition"
            >
              ← Go back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 min-h-0 overflow-hidden bg-[#0f172a]"
         style={{ fontFamily: "Inter, sans-serif" }}>

      {/* ── Top bar ── */}
      <header className="shrink-0 bg-[#1e293b] border-b border-white/10
                         flex items-center justify-between
                         px-[16px] sm:px-[24px] h-[60px] z-10">
        {/* Left — back + filename */}
        <div className="flex items-center gap-[12px] min-w-0">
          <button
            onClick={() => navigate(-1)}
            className="bg-white/10 hover:bg-white/20 text-white rounded-[8px]
                       p-[8px] transition shrink-0"
            aria-label="Go back"
          >
            <ArrowLeft size={16} />
          </button>
          <p className="text-white text-[14px] font-medium truncate">
            {doc.file_name}
          </p>
        </div>

        {/* Right — zoom controls (images only) + download */}
        <div className="flex items-center gap-[8px] shrink-0">
          {isImage && (
            <>
              <button
                onClick={() => setZoom(z => Math.max(0.25, +(z - 0.25).toFixed(2)))}
                disabled={zoom <= 0.25}
                className="bg-white/10 hover:bg-white/20 disabled:opacity-30 text-white
                           rounded-[8px] p-[8px] transition"
                aria-label="Zoom out"
              >
                <ZoomOut size={16} />
              </button>
              <span className="text-white/60 text-[13px] w-[44px] text-center select-none">
                {Math.round(zoom * 100)}%
              </span>
              <button
                onClick={() => setZoom(z => Math.min(4, +(z + 0.25).toFixed(2)))}
                disabled={zoom >= 4}
                className="bg-white/10 hover:bg-white/20 disabled:opacity-30 text-white
                           rounded-[8px] p-[8px] transition"
                aria-label="Zoom in"
              >
                <ZoomIn size={16} />
              </button>
              <button
                onClick={() => setRotation(r => (r + 90) % 360)}
                className="bg-white/10 hover:bg-white/20 text-white rounded-[8px] p-[8px] transition"
                aria-label="Rotate"
              >
                <RotateCw size={16} />
              </button>
              <div className="w-px h-[24px] bg-white/20 mx-[4px]" />
            </>
          )}
          <button
            onClick={handleDownload}
            className="bg-white/10 hover:bg-white/20 text-white rounded-[8px]
                       flex items-center gap-[6px] px-[12px] py-[8px] transition
                       text-[13px] font-medium"
          >
            <Download size={14} />
            <span className="hidden sm:inline">Download</span>
          </button>
        </div>
      </header>

      {/* ── Viewer area ── */}
      <div className="flex-1 overflow-auto flex items-start justify-center p-[16px] sm:p-[24px]">

        {/* ── Image viewer ── */}
        {isImage && (
          <div className="flex items-center justify-center min-w-full min-h-full">
            <img
              src={doc.file_url}
              alt={doc.file_name}
              style={{
                transform:     `scale(${zoom}) rotate(${rotation}deg)`,
                transformOrigin: "center center",
                transition:    "transform 0.2s ease",
                maxWidth:      zoom <= 1 ? "100%" : "none",
                borderRadius:  "8px",
                boxShadow:     "0 25px 50px -12px rgba(0,0,0,0.8)",
              }}
            />
          </div>
        )}

        {/* ── PDF viewer — uses browser native renderer ── */}
        {isPdf && (
          <iframe
            src={`${doc.file_url}#toolbar=1&navpanes=0&scrollbar=1&view=FitH`}
            title={doc.file_name}
            className="w-full rounded-[8px] shadow-2xl"
            style={{
              height:    "calc(100vh - 60px - 48px)",  // viewport - topbar - padding
              minHeight: "400px",
              border:    "none",
              background: "white",
            }}
          />
        )}

        {/* ── Unsupported format fallback ── */}
        {!isImage && !isPdf && (
          <div className="flex flex-col items-center gap-[20px] text-center py-[64px]">
            <div className="bg-white/10 rounded-full p-[24px]">
              <svg className="w-12 h-12 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414A1 1 0 0119 9.414V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <p className="text-white text-[16px] font-medium mb-[6px]">{doc.file_name}</p>
              <p className="text-white/50 text-[14px] mb-[20px]">
                This file type cannot be previewed in the browser.
              </p>
              <button
                onClick={handleDownload}
                className="flex items-center gap-[8px] mx-auto bg-[#3a46e5] hover:bg-[#2f3ad4]
                           text-white text-[14px] font-medium px-[20px] py-[10px] rounded-[10px] transition"
              >
                <Download size={16} />
                Download to view
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}