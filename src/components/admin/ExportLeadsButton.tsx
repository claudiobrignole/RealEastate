'use client';

import { Download } from 'lucide-react';

export default function ExportLeadsButton() {
  return (
    <button
      type="button"
      onClick={() => {
        window.location.href = '/api/export/leads';
      }}
      className="px-5 py-2.5 border border-outline-variant text-primary font-semibold text-sm rounded-lg hover:bg-surface-container-low transition-colors flex items-center gap-2 shadow-sm"
      id="export-report-btn"
    >
      <Download className="w-4 h-4" />
      Export CSV
    </button>
  );
}
