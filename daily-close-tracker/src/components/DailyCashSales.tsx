import React from 'react';
import { motion } from 'motion/react';
import { formatWholeCurrency } from '../utils/dateUtils';
import { ArrowDownRight, TrendingUp } from 'lucide-react';

interface DailyCashSalesProps {
  openingCash: string;
  totalPosSales: string;
  totalSales: number;
  onChange: (field: 'openingCash' | 'totalPosSales', val: string) => void;
}

export const DailyCashSales: React.FC<DailyCashSalesProps> = ({
  openingCash,
  totalPosSales,
  totalSales,
  onChange,
}) => {
  return (
    <motion.section
      id="section-daily-cash-sales"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
      className="relative overflow-hidden liquid-glass-card backdrop-blur-xl bg-white/40 border border-white/60 shadow-lg rounded-2xl p-5 sm:p-6 space-y-4"
    >
      {/* Liquid specular edge reflection */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent pointer-events-none" />

      {/* Section Header */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-b from-amber-500 to-orange-500 text-white font-black text-xs flex items-center justify-center shadow-[0_2px_10px_rgba(245,158,11,0.35)] shrink-0 border border-white/30">
          01
        </div>
        <div>
          <h2 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight uppercase">
            DAILY CASH & SALES
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
            Enter opening cash and total POS sales
          </p>
        </div>
      </div>

      {/* Inputs: Opening Cash & Total POS Sales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
        {/* Opening Cash Input Card */}
        <div className="group liquid-glass-input rounded-2xl p-4 transition-all">
          <label
            htmlFor="input-opening-cash"
            className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1"
          >
            Opening Cash
          </label>
          <div className="relative flex items-center">
            <span className="text-slate-400 dark:text-slate-500 font-bold text-lg select-none mr-2">
              ₹
            </span>
            <input
              id="input-opening-cash"
              type="text"
              inputMode="decimal"
              placeholder="0"
              value={openingCash}
              onChange={(e) => onChange('openingCash', e.target.value)}
              className="w-full text-lg sm:text-xl font-bold font-mono tracking-tight text-slate-900 dark:text-white bg-transparent placeholder-slate-400/60 focus:outline-none"
            />
          </div>
          <span className="block text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-1">
            Cash in till at start of day
          </span>
        </div>

        {/* Total POS Sales Input Card */}
        <div className="group liquid-glass-input rounded-2xl p-4 transition-all">
          <label
            htmlFor="input-pos-sales"
            className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1"
          >
            Total POS Sales
          </label>
          <div className="relative flex items-center">
            <span className="text-slate-400 dark:text-slate-500 font-bold text-lg select-none mr-2">
              ₹
            </span>
            <input
              id="input-pos-sales"
              type="text"
              inputMode="decimal"
              placeholder="0"
              value={totalPosSales}
              onChange={(e) => onChange('totalPosSales', e.target.value)}
              className="w-full text-lg sm:text-xl font-bold font-mono tracking-tight text-slate-900 dark:text-white bg-transparent placeholder-slate-400/60 focus:outline-none"
            />
          </div>
          <span className="block text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-1">
            Total system gross sales
          </span>
        </div>
      </div>

      {/* Readout Card: TOTAL SALES */}
      <div className="relative overflow-hidden liquid-glass-card-subtle rounded-2xl p-4 flex items-center justify-between">
        {/* Specular glass reflection */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent pointer-events-none" />

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-700 dark:text-amber-300 shrink-0">
            <TrendingUp className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <div className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300">
              TOTAL SALES
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1">
              <span>Opening Cash + Total POS Sales</span>
              <ArrowDownRight className="w-3 h-3 text-slate-400 dark:text-slate-500" />
            </div>
          </div>
        </div>

        <div className="text-right">
          <div className="text-xl sm:text-2xl font-black font-mono tracking-tight text-slate-900 dark:text-white">
            {formatWholeCurrency(totalSales)}
          </div>
          <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Combined Gross
          </span>
        </div>
      </div>
    </motion.section>
  );
};
