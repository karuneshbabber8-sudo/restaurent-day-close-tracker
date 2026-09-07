import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SaveResult } from '../types';
import {
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  CloudUpload,
  Loader2,
  Leaf,
  FileDown,
} from 'lucide-react';

interface ActionFooterProps {
  isSaving: boolean;
  saveStatus: 'idle' | 'saving' | 'saved' | 'error';
  saveResult: SaveResult | null;
  errorMessage: string | null;
  sheetUrl?: string;
  onSaveClick: () => void;
  onDownloadPdf: () => void;
  isGeneratingPdf?: boolean;
}

export const ActionFooter: React.FC<ActionFooterProps> = ({
  isSaving,
  saveStatus,
  saveResult,
  errorMessage,
  sheetUrl,
  onSaveClick,
  onDownloadPdf,
  isGeneratingPdf,
}) => {
  return (
    <div id="action-footer" className="space-y-3 sm:space-y-4 pt-1">
      {/* Notifications Section */}
      <AnimatePresence>
        {/* Success Banner */}
        {saveStatus === 'saved' && saveResult?.success && (
          <motion.div
            id="alert-save-success"
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-emerald-50/90 border border-emerald-300/80 text-emerald-950 p-4 rounded-3xl shadow-[0_8px_24px_rgba(16,185,129,0.12)] backdrop-blur-xl space-y-1.5"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-sm text-emerald-800">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>SAVED SUCCESSFULLY TO GOOGLE SHEETS</span>
              </div>
              {sheetUrl && (
                <a
                  href={sheetUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-900 underline inline-flex items-center gap-1 bg-white/70 px-2 py-0.5 rounded-lg"
                >
                  <span>Open Sheet</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
            <p className="text-xs text-slate-600">
              Entry for <span className="font-bold text-slate-900">{saveResult.dateStr}</span> recorded in{' '}
              {saveResult.columnLetter && (
                <span className="font-mono font-bold text-emerald-800">Column {saveResult.columnLetter}</span>
              )}
              .
            </p>
          </motion.div>
        )}

        {/* Error Banner */}
        {errorMessage && (
          <motion.div
            id="alert-save-error"
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-rose-50/90 border border-rose-200/90 text-rose-950 p-4 rounded-3xl shadow-sm backdrop-blur-xl flex items-start gap-3"
          >
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <p className="font-bold text-rose-900">Save Failed</p>
              <p className="text-rose-700 font-medium leading-relaxed">{errorMessage}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Primary Large SAVE DAY CLOSE Button */}
      <motion.button
        type="button"
        id="btn-save-day-close"
        onClick={onSaveClick}
        disabled={isSaving}
        whileHover={{ scale: isSaving ? 1 : 1.008 }}
        whileTap={{ scale: isSaving ? 1 : 0.985 }}
        className={`w-full py-4 sm:py-4.5 px-6 rounded-3xl font-extrabold text-base sm:text-lg tracking-wider text-white shadow-xl transition-all flex items-center justify-center gap-3 cursor-pointer select-none relative overflow-hidden ${
          saveStatus === 'saved'
            ? 'bg-gradient-to-r from-emerald-600 via-emerald-600 to-teal-600 shadow-emerald-600/25'
            : isSaving
            ? 'bg-gradient-to-r from-sky-700 to-blue-700 cursor-wait shadow-sky-600/20'
            : saveStatus === 'error'
            ? 'bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 shadow-rose-600/25'
            : 'bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 shadow-sky-600/30 ring-1 ring-white/20'
        }`}
      >
        {/* Button top light glint */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none" />

        {isSaving ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>SAVING TO GOOGLE SHEETS...</span>
          </>
        ) : saveStatus === 'saved' ? (
          <>
            <CheckCircle2 className="w-5 h-5" />
            <span>SAVED SUCCESSFULLY ✓</span>
          </>
        ) : saveStatus === 'error' ? (
          <>
            <CloudUpload className="w-5 h-5" />
            <span>RETRY SAVE DAY CLOSE</span>
          </>
        ) : (
          <>
            <CloudUpload className="w-5 h-5" />
            <span>SAVE DAY CLOSE</span>
          </>
        )}
      </motion.button>

      {/* PDF Summary Export Button */}
      <motion.button
        type="button"
        id="btn-download-pdf-report"
        onClick={onDownloadPdf}
        disabled={isGeneratingPdf}
        whileHover={{ scale: 1.008 }}
        whileTap={{ scale: 0.985 }}
        className="w-full py-3 sm:py-3.5 px-5 rounded-3xl font-bold text-sm tracking-wide text-slate-700 bg-white/90 hover:bg-slate-50 border border-slate-200/90 shadow-[0_4px_16px_rgba(15,23,42,0.04)] backdrop-blur-xl transition-all flex items-center justify-center gap-2.5 cursor-pointer select-none active:scale-[0.99] ring-1 ring-slate-900/[0.02]"
      >
        {isGeneratingPdf ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin text-sky-600" />
            <span>GENERATING PDF REPORT...</span>
          </>
        ) : (
          <>
            <FileDown className="w-4 h-4 text-sky-600" />
            <span>DOWNLOAD PDF REPORT</span>
          </>
        )}
      </motion.button>

      {/* Security Reassurance Pill */}
      <div className="bg-white/70 backdrop-blur-xl border border-white/80 rounded-2xl p-3 shadow-[0_4px_16px_rgba(15,23,42,0.02)] ring-1 ring-slate-900/[0.02] flex items-center justify-center gap-2 text-xs font-medium text-slate-500">
        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
        <span>Calculations verified on client • Direct secure sync to Google Sheets</span>
      </div>

      {/* Footer Branding Line */}
      <div className="flex items-center justify-center gap-2 text-xs text-slate-400 font-medium py-2">
        <span>Good Food</span>
        <span className="text-slate-300">•</span>
        <span>Better Numbers</span>
        <span className="text-slate-300">•</span>
        <span>One Day Closer to a Better Tomorrow</span>
        <Leaf className="w-3 h-3 text-emerald-500/70" />
      </div>
    </div>
  );
};
