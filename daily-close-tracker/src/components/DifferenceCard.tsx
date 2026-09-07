import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, TrendingDown, TrendingUp } from 'lucide-react';
import { formatCurrency } from '../utils/dateUtils';

interface DifferenceCardProps {
  difference: number;
}

export const DifferenceCard: React.FC<DifferenceCardProps> = ({ difference }) => {
  const isZero = Math.abs(difference) < 0.001;
  const isNegative = difference < -0.001;

  return (
    <motion.div
      id="section-difference-card"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
      className={`relative overflow-hidden p-5 sm:p-6 transition-all duration-300 liquid-glass-card backdrop-blur-xl bg-white/40 border border-white/60 shadow-lg rounded-2xl ${
        isZero
          ? 'ring-1 ring-emerald-500/20'
          : isNegative
          ? 'ring-1 ring-rose-500/20'
          : 'ring-1 ring-sky-500/20'
      }`}
    >
      {/* Liquid specular light highlight on top edge */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/90 to-transparent pointer-events-none" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Left: Icon & Title & Status */}
        <div className="flex items-center gap-3.5">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm border backdrop-blur-md ${
              isZero
                ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-700 dark:text-emerald-400 dark:border-emerald-500/40'
                : isNegative
                ? 'bg-rose-500/15 border-rose-500/30 text-rose-700 dark:text-rose-400 dark:border-rose-500/40'
                : 'bg-sky-500/15 border-sky-500/30 text-sky-700 dark:text-sky-400 dark:border-sky-500/40'
            }`}
          >
            {isZero ? (
              <CheckCircle2 className="w-6 h-6" strokeWidth={2.2} />
            ) : isNegative ? (
              <TrendingDown className="w-6 h-6" strokeWidth={2.2} />
            ) : (
              <TrendingUp className="w-6 h-6" strokeWidth={2.2} />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black tracking-wider uppercase text-slate-600 dark:text-slate-300">
                DIFFERENCE
              </span>
              <span
                id="badge-difference-status"
                className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black tracking-wider uppercase border shadow-2xs ${
                  isZero
                    ? 'bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border-emerald-500/30'
                    : isNegative
                    ? 'bg-rose-500/15 text-rose-800 dark:text-rose-300 border-rose-500/30'
                    : 'bg-sky-500/15 text-sky-800 dark:text-sky-300 border-sky-500/30'
                }`}
              >
                {isZero ? 'BALANCED' : isNegative ? 'SHORTFALL' : 'EXCESS'}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
              Opening + POS Sales – All Payment Modes
            </p>
          </div>
        </div>

        {/* Right: Prominent Difference Value */}
        <div className="text-left sm:text-right">
          <div
            id="display-difference"
            className={`text-2xl sm:text-3xl lg:text-4xl font-black font-mono tracking-tight tabular-nums ${
              isZero
                ? 'text-emerald-700 dark:text-emerald-400'
                : isNegative
                ? 'text-rose-600 dark:text-rose-400'
                : 'text-sky-700 dark:text-sky-400'
            }`}
          >
            {formatCurrency(difference)}
          </div>
          <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            {isZero ? 'Exact Match' : isNegative ? 'Deficit To Reconcile' : 'Surplus Received'}
          </span>
        </div>
      </div>
    </motion.div>
  );
};
