import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, ExternalLink, RefreshCw, X, ShieldAlert } from 'lucide-react';
import { AuthErrorInfo } from '../types';

interface AuthNoticeModalProps {
  isOpen: boolean;
  errorInfo: AuthErrorInfo | null;
  onClose: () => void;
  onRetry: () => void;
  isRetrying?: boolean;
}

export const AuthNoticeModal: React.FC<AuthNoticeModalProps> = ({
  isOpen,
  errorInfo,
  onClose,
  onRetry,
  isRetrying,
}) => {
  if (!isOpen || !errorInfo) return null;

  return (
    <AnimatePresence>
      <div
        id="modal-auth-notice"
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/30 backdrop-blur-md"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative overflow-hidden bg-white/90 backdrop-blur-2xl border border-white/90 rounded-3xl max-w-lg w-full p-6 shadow-[0_20px_50px_rgba(15,23,42,0.1)] ring-1 ring-slate-900/[0.04] space-y-5 text-slate-800"
        >
          {/* Specular top highlight */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent" />

          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-center justify-center text-amber-600 shrink-0 shadow-2xs">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {errorInfo.title}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Google Cloud Project: <span className="font-mono font-semibold text-slate-700">{errorInfo.projectId}</span>
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Message */}
          <div className="bg-amber-50/70 border border-amber-200/70 rounded-2xl p-4 text-xs text-amber-950 leading-relaxed font-medium">
            <p>{errorInfo.message}</p>
          </div>

          {/* Actionable Steps */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
              How to authorize in Google Cloud:
            </h4>
            <ol className="space-y-2 text-xs text-slate-600 bg-slate-50/70 rounded-2xl p-4 border border-slate-200/60">
              {errorInfo.steps.map((step, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="flex items-center justify-center w-4 h-4 rounded-full bg-slate-200/80 text-slate-700 font-bold text-[10px] shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="leading-normal">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Direct Link to Google Cloud Console */}
          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
            <span>Target account: <span className="font-semibold text-slate-700">{errorInfo.userEmail || 'karuneshbabber.38612@gmail.com'}</span></span>
            <a
              href={`https://console.cloud.google.com/apis/credentials/consent?project=${errorInfo.projectId || 'gen-lang-client-0132572263'}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 font-bold text-sky-600 hover:text-sky-700 hover:underline"
            >
              <span>Open OAuth Consent Screen</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              id="btn-close-auth-notice"
              onClick={onClose}
              className="flex-1 py-3 px-4 text-xs font-bold text-slate-600 hover:text-slate-800 bg-slate-100/90 hover:bg-slate-200/90 rounded-2xl transition active:scale-95 cursor-pointer"
            >
              Close
            </button>
            <button
              type="button"
              id="btn-retry-auth"
              onClick={onRetry}
              disabled={isRetrying}
              className="flex-1 py-3 px-4 text-xs font-bold text-white bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 rounded-2xl shadow-md shadow-sky-600/20 transition active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRetrying ? 'animate-spin' : ''}`} />
              <span>{isRetrying ? 'Connecting...' : 'Retry Google Connect'}</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
