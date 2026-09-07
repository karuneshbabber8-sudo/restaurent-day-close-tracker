import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Printer,
  CheckCircle2,
  AlertCircle,
  Loader2,
  FileDown,
  Sparkles,
} from 'lucide-react';

export type PdfExportStatus = 'ready' | 'generating' | 'generated' | 'failed';

interface QuickActionsProps {
  pdfStatus: PdfExportStatus;
  errorMessage: string | null;
  onExportPdf: () => void;
  onPrint: () => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  pdfStatus,
  errorMessage,
  onExportPdf,
  onPrint,
}) => {
  return (
    <motion.section
      id="section-quick-actions"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
      className="relative overflow-hidden liquid-glass-card backdrop-blur-xl bg-white/40 border border-white/60 shadow-lg rounded-2xl p-5 sm:p-6 space-y-4"
    >
      {/* Liquid specular edge reflection line */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent pointer-events-none" />

      {/* Decorative ambient glass glow */}
      <div className="absolute -bottom-10 -right-10 w-44 h-44 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Section Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight uppercase">
            QUICK ACTIONS
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/15 dark:bg-amber-500/25 border border-amber-500/30 dark:border-amber-500/40 text-amber-800 dark:text-amber-300 text-[10px] font-black uppercase tracking-wider shadow-2xs">
            <Sparkles className="w-2.5 h-2.5" />
            Primary
          </span>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
          Save or export your day close report
        </p>
      </div>

      {/* Notifications / Alerts */}
      <AnimatePresence>
        {pdfStatus === 'generated' && (
          <motion.div
            id="alert-pdf-success"
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6 }}
            className="liquid-glass-card-subtle bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-300/80 dark:border-emerald-800/60 text-emerald-950 dark:text-emerald-200 px-4 py-3 rounded-2xl shadow-xs flex items-center justify-between text-xs"
          >
            <div className="flex items-center gap-2 font-bold text-emerald-800 dark:text-emerald-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>PDF Generated & Downloaded Successfully</span>
            </div>
            <span className="text-[10px] font-mono font-bold text-emerald-800 dark:text-emerald-200 bg-white/70 dark:bg-white/10 px-2 py-0.5 rounded-lg border border-emerald-200 dark:border-emerald-700/50">
              A4 Format
            </span>
          </motion.div>
        )}

        {pdfStatus === 'failed' && (
          <motion.div
            id="alert-pdf-error"
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6 }}
            className="liquid-glass-card-subtle bg-rose-50/70 dark:bg-rose-950/40 border-rose-200/90 dark:border-rose-800/60 text-rose-950 dark:text-rose-200 px-4 py-3 rounded-2xl shadow-xs flex items-start gap-2.5 text-xs"
          >
            <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-rose-900 dark:text-rose-300">PDF Export Failed</p>
              <p className="text-rose-700 dark:text-rose-400 font-medium">{errorMessage || 'Could not compile report.'}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action Buttons Grid */}
      <div className="space-y-2.5 pt-1">
        {/* Main Large Button: EXPORT DAY CLOSE AS PDF (Liquid Glass with Warm Orange Tint) */}
        <motion.button
          type="button"
          id="btn-export-pdf-main"
          onClick={onExportPdf}
          disabled={pdfStatus === 'generating'}
          className={`group relative w-full py-4 px-6 rounded-2xl font-extrabold text-white flex items-center justify-center gap-3 cursor-pointer select-none overflow-hidden specular-sheen-hover bg-gradient-to-r from-orange-500/80 to-amber-500/80 backdrop-blur-md border border-white/40 shadow-md hover:scale-105 transition-all duration-200 active:scale-95 ${
            pdfStatus === 'generating'
              ? 'opacity-90 cursor-wait'
              : pdfStatus === 'generated'
              ? '!bg-gradient-to-r !from-emerald-600 !via-teal-600 !to-emerald-700 !shadow-[0_8px_32px_rgba(16,185,129,0.34)]'
              : pdfStatus === 'failed'
              ? '!bg-gradient-to-r !from-rose-600 !to-orange-600 !shadow-[0_8px_32px_rgba(225,29,72,0.34)]'
              : ''
          }`}
        >
          {/* Top specular reflection highlight */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent pointer-events-none" />

          {/* Animated specular highlight sheen moving across the button on hover */}
          <div className="sheen-element pointer-events-none absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Left Icon with Glass Badge */}
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center shrink-0 shadow-inner">
            {pdfStatus === 'generating' ? (
              <Loader2 className="w-5 h-5 animate-spin text-white" />
            ) : pdfStatus === 'generated' ? (
              <CheckCircle2 className="w-5 h-5 text-white" />
            ) : (
              <FileDown className="w-5 h-5 text-white" strokeWidth={2.4} />
            )}
          </div>

          {/* Center Text & Subtitle */}
          <div className="text-left flex-1 pl-1 relative z-10">
            <div className="text-sm sm:text-base tracking-wide font-black leading-tight drop-shadow-xs">
              {pdfStatus === 'generating'
                ? 'Generating PDF...'
                : pdfStatus === 'generated'
                ? 'PDF Generated'
                : pdfStatus === 'failed'
                ? 'PDF Export Failed'
                : 'EXPORT DAY CLOSE AS PDF'}
            </div>
            <div className="text-[11px] sm:text-xs font-semibold text-white/90 leading-tight mt-0.5">
              {pdfStatus === 'generating'
                ? 'Compiling calculations...'
                : 'Generate & Download Report'}
            </div>
          </div>
        </motion.button>

        {/* Secondary Button: PRINT */}
        <motion.button
          type="button"
          id="btn-print-day-close"
          onClick={onPrint}
          className="w-full py-3.5 px-5 rounded-2xl font-bold text-xs sm:text-sm text-slate-700 dark:text-slate-200 liquid-glass-btn-secondary backdrop-blur-md border border-white/40 shadow-xs hover:scale-105 transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 cursor-pointer select-none"
        >
          <Printer className="w-4 h-4 text-slate-600 dark:text-slate-300" />
          <span className="tracking-wider uppercase font-black">PRINT</span>
        </motion.button>
      </div>
    </motion.section>
  );
};
