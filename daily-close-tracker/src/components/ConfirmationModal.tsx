import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, AlertCircle } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  type: 'duplicateDate' | 'clearForm';
  dateStr?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  type,
  dateStr,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        id={`modal-${type}`}
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/30 backdrop-blur-md"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative overflow-hidden liquid-glass-dropdown rounded-3xl max-w-sm w-full p-6 shadow-[0_24px_60px_rgba(15,23,42,0.18)] space-y-4 text-slate-800 dark:text-slate-100"
        >
          {/* Specular top highlight */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white dark:via-white/20 to-transparent" />

          {type === 'duplicateDate' ? (
            <>
              <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/70 dark:border-amber-700/50 flex items-center justify-center text-amber-600 dark:text-amber-400 shadow-2xs">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Today's entry already exists
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                  Data for <span className="font-bold text-slate-800 dark:text-slate-200">{dateStr}</span> already exists in the closing records.
                </p>
                <p className="text-xs text-slate-700 dark:text-slate-300 mt-2 font-medium">
                  Do you want to update the existing record with these new figures?
                </p>
              </div>
              <div className="flex items-center gap-2.5 pt-2">
                <button
                  type="button"
                  id="btn-cancel-duplicate"
                  onClick={onCancel}
                  className="flex-1 py-3 px-3 text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white bg-slate-100/90 dark:bg-white/10 hover:bg-slate-200/90 dark:hover:bg-white/20 rounded-2xl transition active:scale-95 cursor-pointer"
                >
                  CANCEL
                </button>
                <button
                  type="button"
                  id="btn-confirm-duplicate"
                  onClick={onConfirm}
                  className="flex-1 py-3 px-3 text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 rounded-2xl shadow-sm transition active:scale-95 cursor-pointer"
                >
                  UPDATE EXISTING
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200/70 dark:border-rose-700/50 flex items-center justify-center text-rose-600 dark:text-rose-400 shadow-2xs">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Clear All Entries?
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                  Are you sure you want to reset all daily sales figures and denominations back to blank/zero?
                </p>
              </div>
              <div className="flex items-center gap-2.5 pt-2">
                <button
                  type="button"
                  id="btn-cancel-clear"
                  onClick={onCancel}
                  className="flex-1 py-3 px-3 text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white bg-slate-100/90 dark:bg-white/10 hover:bg-slate-200/90 dark:hover:bg-white/20 rounded-2xl transition active:scale-95 cursor-pointer"
                >
                  CANCEL
                </button>
                <button
                  type="button"
                  id="btn-confirm-clear"
                  onClick={onConfirm}
                  className="flex-1 py-3 px-3 text-xs font-bold text-white bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 rounded-2xl shadow-sm transition active:scale-95 cursor-pointer"
                >
                  CLEAR FORM
                </button>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
