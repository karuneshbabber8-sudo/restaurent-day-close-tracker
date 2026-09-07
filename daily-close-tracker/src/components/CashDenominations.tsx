import React from 'react';
import { motion } from 'motion/react';
import { formatWholeCurrency, formatNumber } from '../utils/dateUtils';
import { DayCloseCalculations, DayCloseFormState } from '../types';
import { Plus, Minus, FileText, RotateCcw } from 'lucide-react';

interface CashDenominationsProps {
  form: DayCloseFormState;
  calc: DayCloseCalculations;
  onChange: (field: keyof DayCloseFormState, val: string) => void;
  onLoadTestCase: () => void;
  onClearClick: () => void;
}

const DENOMINATIONS: Array<{
  value: number;
  label: string;
  field: keyof DayCloseFormState;
}> = [
  { value: 500, label: '₹500', field: 'qty500' },
  { value: 200, label: '₹200', field: 'qty200' },
  { value: 100, label: '₹100', field: 'qty100' },
  { value: 50, label: '₹50', field: 'qty50' },
  { value: 20, label: '₹20', field: 'qty20' },
  { value: 10, label: '₹10', field: 'qty10' },
  { value: 5, label: '₹5', field: 'qty5' },
];

export const CashDenominations: React.FC<CashDenominationsProps> = ({
  form,
  calc,
  onChange,
  onLoadTestCase,
  onClearClick,
}) => {
  const handleStep = (field: keyof DayCloseFormState, delta: number) => {
    const current = parseInt(form[field] || '0', 10);
    const updated = Math.max(0, (isNaN(current) ? 0 : current) + delta);
    onChange(field, updated === 0 ? '' : updated.toString());
  };

  return (
    <motion.section
      id="section-cash-denominations"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-3"
    >
      {/* Primary Glass Denomination Card */}
      <div className="relative overflow-hidden liquid-glass-card backdrop-blur-xl bg-white/40 border border-white/60 shadow-lg rounded-2xl p-5 sm:p-6 space-y-4">
        {/* Specular glass reflection */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent pointer-events-none" />

        {/* Section Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-b from-amber-500 to-orange-500 text-white font-black text-xs flex items-center justify-center shadow-[0_2px_10px_rgba(245,158,11,0.35)] shrink-0 border border-white/30">
              03
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight uppercase">
                CASH DENOMINATION
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                Enter quantity for each denomination
              </p>
            </div>
          </div>
        </div>

        {/* Denominations Table */}
        <div className="space-y-1.5 pt-1">
          {/* Table Column Headers */}
          <div className="grid grid-cols-12 text-[10px] sm:text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider px-3 pb-2 border-b border-white/60 dark:border-white/10">
            <span className="col-span-4">DENOMINATION</span>
            <span className="col-span-4 text-center">QTY</span>
            <span className="col-span-4 text-right">AMOUNT</span>
          </div>

          {/* Denomination Rows */}
          {DENOMINATIONS.map((item) => {
            const qty = parseInt(form[item.field] || '0', 10) || 0;
            const rowAmount = item.value * qty;

            return (
              <div
                key={item.field}
                id={`row-denom-${item.value}`}
                className="grid grid-cols-12 items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-2xl hover:bg-white/40 dark:hover:bg-white/5 transition-colors"
              >
                {/* Denomination Label */}
                <div className="col-span-4 flex items-center gap-2">
                  <span className="text-xs sm:text-sm font-black text-slate-800 dark:text-slate-200 font-mono">
                    {item.label}
                  </span>
                </div>

                {/* Stepper + Input */}
                <div className="col-span-4 flex items-center justify-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleStep(item.field, -1)}
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl liquid-glass-btn-secondary flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition active:scale-95 cursor-pointer"
                    title={`Decrease ${item.label}`}
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>

                  <input
                    id={`input-denom-${item.value}`}
                    type="text"
                    inputMode="numeric"
                    placeholder="0"
                    value={form[item.field]}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^0-9]/g, '');
                      onChange(item.field, val);
                    }}
                    className="w-11 sm:w-14 text-center text-xs sm:text-sm font-black font-mono liquid-glass-input rounded-xl py-1 px-1 focus:outline-none text-slate-900 dark:text-white"
                  />

                  <button
                    type="button"
                    onClick={() => handleStep(item.field, 1)}
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl liquid-glass-btn-secondary flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition active:scale-95 cursor-pointer"
                    title={`Increase ${item.label}`}
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Calculated Amount */}
                <div className="col-span-4 text-right">
                  <span
                    id={`amount-denom-${item.value}`}
                    className="text-xs sm:text-sm font-black font-mono text-slate-900 dark:text-white tracking-tight"
                  >
                    {formatWholeCurrency(rowAmount)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Denomination Totals Readout */}
        <div className="pt-2 border-t border-white/60 dark:border-white/10 grid grid-cols-2 gap-3">
          {/* Total Quantity */}
          <div className="p-3 rounded-2xl liquid-glass-card-subtle">
            <span className="block text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              TOTAL QUANTITY
            </span>
            <span
              id="display-total-quantity"
              className="text-lg sm:text-xl font-black font-mono text-slate-900 dark:text-white tracking-tight block mt-0.5"
            >
              {formatNumber(calc.totalQuantity)}
            </span>
          </div>

          {/* Total Physical Cash */}
          <div className="p-3 rounded-2xl liquid-glass-card-subtle text-right">
            <span className="block text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              PHYSICAL CASH
            </span>
            <span
              id="display-total-physical-cash"
              className="text-lg sm:text-xl font-black font-mono text-slate-900 dark:text-white tracking-tight block mt-0.5"
            >
              {formatWholeCurrency(calc.totalPhysicalCash)}
            </span>
          </div>
        </div>
      </div>

      {/* Quick Tools Pills: Sample Data & Clear Form */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          id="btn-load-test-case"
          onClick={onLoadTestCase}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 liquid-glass-btn-secondary rounded-2xl text-[11px] font-bold text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white transition-all hover:scale-[1.01] active:scale-95 cursor-pointer shadow-2xs"
          title="Populate test figures to preview layout"
        >
          <FileText className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
          <span>Load Sample Data</span>
        </button>

        <button
          type="button"
          id="btn-clear-form"
          onClick={onClearClick}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 liquid-glass-btn-secondary rounded-2xl text-[11px] font-bold text-slate-600 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 transition-all hover:scale-[1.01] active:scale-95 cursor-pointer shadow-2xs"
          title="Reset all fields to blank"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Clear Form</span>
        </button>
      </div>
    </motion.section>
  );
};
