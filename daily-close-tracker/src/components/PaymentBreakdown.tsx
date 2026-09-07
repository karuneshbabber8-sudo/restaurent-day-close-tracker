import React from 'react';
import { motion } from 'motion/react';
import { DayCloseFormState } from '../types';

interface PaymentBreakdownProps {
  form: DayCloseFormState;
  onChange: (field: keyof DayCloseFormState, val: string) => void;
}

export const PaymentBreakdown: React.FC<PaymentBreakdownProps> = ({
  form,
  onChange,
}) => {
  const fields: Array<{
    key: keyof DayCloseFormState;
    label: string;
    placeholder?: string;
    optional?: boolean;
    helper?: string;
  }> = [
    { key: 'zomato', label: 'Zomato', helper: 'Online aggregator orders' },
    { key: 'swiggy', label: 'Swiggy', helper: 'Online aggregator orders' },
    { key: 'easyDiner', label: 'Easy Diner', helper: 'Dining & table reservations' },
    { key: 'paytmMachine', label: 'Paytm Machine', helper: 'Cards & UPI machine swipes' },
    { key: 'cashAccount', label: 'Cash Account', helper: 'Cash settlements account' },
    {
      key: 'cashPayment',
      label: 'Cash Payment',
      placeholder: '0',
      optional: true,
      helper: 'Blank = 0',
    },
    { key: 'creditBills', label: 'Credit Bills', helper: 'Unpaid / credit customer bills' },
    { key: 'cashLoad', label: 'Cash Load', helper: 'Additional cash loaded to drawer' },
    {
      key: 'closingCash',
      label: 'Closing Cash',
      helper: 'End of day drawer cash balance',
    },
  ];

  return (
    <motion.section
      id="section-payment-breakdown"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="relative overflow-hidden liquid-glass-card backdrop-blur-xl bg-white/40 border border-white/60 shadow-lg rounded-2xl p-5 sm:p-6 space-y-4"
    >
      {/* Liquid specular edge highlight */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent pointer-events-none" />

      {/* Section Header */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-b from-amber-500 to-orange-500 text-white font-black text-xs flex items-center justify-center shadow-[0_2px_10px_rgba(245,158,11,0.35)] shrink-0 border border-white/30">
          02
        </div>
        <div>
          <h2 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight uppercase">
            PAYMENT BREAKDOWN
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
            Enter all payment modes and closing cash
          </p>
        </div>
      </div>

      {/* Responsive Grid: Desktop 3 cols, Tablet 2 cols, Mobile 1 col */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
        {fields.map((field) => (
          <div
            key={field.key}
            className="group liquid-glass-input rounded-2xl p-3 sm:p-3.5 transition-all"
          >
            <div className="flex items-center justify-between mb-1">
              <label
                htmlFor={`input-${field.key}`}
                className="block text-xs font-bold text-slate-700 dark:text-slate-300"
              >
                {field.label}
              </label>
              {field.optional && (
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider">
                  Optional
                </span>
              )}
            </div>

            <div className="relative flex items-center">
              <span className="text-slate-400 dark:text-slate-500 font-bold text-base select-none mr-1.5">
                ₹
              </span>
              <input
                id={`input-${field.key}`}
                type="text"
                inputMode="decimal"
                placeholder={field.placeholder || '0'}
                value={form[field.key]}
                onChange={(e) => onChange(field.key, e.target.value)}
                className="w-full text-base sm:text-lg font-bold font-mono tracking-tight text-slate-900 dark:text-white bg-transparent placeholder-slate-400/60 focus:outline-none"
              />
            </div>

            {field.helper && (
              <span className="block text-[10px] text-slate-500 dark:text-slate-400 font-medium mt-1 truncate">
                {field.helper}
              </span>
            )}
          </div>
        ))}
      </div>
    </motion.section>
  );
};
