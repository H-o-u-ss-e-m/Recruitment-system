import React, { useState } from "react";
import { Download, FileText, Loader2, ExternalLink } from "lucide-react";
import { resolveBackendUrl } from "../lib/api";

interface PDFViewerProps {
  cvUrl: string;
  fileName: string;
}

export const PDFViewer: React.FC<PDFViewerProps> = ({ cvUrl, fileName }) => {
  const [loading, setLoading] = useState(true);

  // Append a timestamp to avoid any browser-side caching during dev/re-testing
  const resolvedCvUrl = resolveBackendUrl(cvUrl);
  const iframeSrc = `${resolvedCvUrl}?t=${Date.now()}`;

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col h-[550px]" id="pdf-viewer-container">
      {/* Title Bar with Actions */}
      <div className="bg-slate-50 border-b border-slate-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 min-w-0">
          <FileText className="h-5 w-5 text-brand-blue-500 shrink-0" />
          <span className="text-sm font-medium text-slate-700 truncate" title={fileName}>
            {fileName}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {/* External open link (great fallback for mobile/tablets where inline PDF can be finicky) */}
          <a
            href={resolvedCvUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Agrandir</span>
          </a>
          {/* Download button */}
          <a
            href={resolvedCvUrl}
            download={fileName}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-brand-blue-600 hover:bg-brand-blue-700 rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Télécharger</span>
          </a>
        </div>
      </div>

      {/* Embed Frame */}
      <div className="relative flex-1 bg-slate-100">
        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50 z-10">
            <Loader2 className="h-8 w-8 text-brand-blue-500 animate-spin" />
            <p className="mt-2 text-sm text-slate-500 font-medium">Chargement du document PDF...</p>
          </div>
        )}
        <iframe
          src={iframeSrc}
          title="Visualiseur de CV PDF"
          className="w-full h-full border-none"
          onLoad={() => setLoading(false)}
        />
      </div>
    </div>
  );
};
