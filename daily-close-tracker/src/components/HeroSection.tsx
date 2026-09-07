import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, UtensilsCrossed } from 'lucide-react';
import culinaryHeroImage from '../assets/images/culinary_hero_1788673995241.jpg';

export const HeroSection: React.FC = () => {
  return (
    <motion.section
      id="hero-section"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="relative overflow-hidden liquid-glass-card backdrop-blur-xl bg-white/40 border border-white/60 shadow-lg rounded-2xl p-5 sm:p-7"
    >
      {/* Specular edge highlight */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/90 to-transparent pointer-events-none" />

      {/* Ambient liquid light orbs */}
      <div className="absolute -top-16 -right-16 w-56 h-56 bg-amber-200/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-10 w-48 h-48 bg-orange-100/35 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left Text Content */}
        <div className="w-full md:max-w-md lg:max-w-lg space-y-3 text-left">
          {/* Eyebrow Tag */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-800 dark:text-amber-300 dark:bg-amber-500/20 dark:border-amber-500/40 text-[11px] font-black tracking-wider uppercase backdrop-blur-md shadow-2xs">
            <Sparkles className="w-3 h-3 text-amber-600 dark:text-amber-400" />
            <span>FOOD TODAY</span>
          </div>

          {/* Main Headline */}
          <div className="space-y-0.5">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
              Great Food
            </h2>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 dark:from-amber-400 dark:via-orange-400 dark:to-amber-500 bg-clip-text text-transparent tracking-tight leading-tight">
              Better Numbers
            </h2>
          </div>

          {/* Subtitle */}
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium pt-1">
            Close your day with confidence.
            <br />
            <span className="text-slate-800 dark:text-slate-200 font-semibold">Simple. Smart. Beautiful.</span>
          </p>
        </div>

        {/* Right Culinary Visual Treatment with Liquid Glass Frame */}
        <div className="w-full md:w-auto shrink-0 flex justify-center md:justify-end">
          <div className="relative group overflow-hidden rounded-3xl border border-white/80 dark:border-white/20 shadow-[0_16px_36px_rgba(217,119,6,0.12)] max-w-sm w-full md:w-64 lg:w-72 aspect-[16/10] md:aspect-[4/3] bg-slate-100 dark:bg-slate-900">
            {/* Culinary dish image */}
            <img
              src={culinaryHeroImage}
              alt="Gourmet dining dish"
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
              referrerPolicy="no-referrer"
            />
            {/* Liquid glass gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/65 via-slate-950/15 to-transparent pointer-events-none" />

            {/* Specular glass reflection */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent pointer-events-none" />

            {/* Floating Liquid Glass Pill */}
            <div className="absolute bottom-3 left-3 right-3 p-2.5 rounded-2xl liquid-glass-card-subtle flex items-center justify-between text-slate-900 dark:text-white shadow-md">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-700 dark:text-amber-300 shrink-0">
                  <UtensilsCrossed className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-slate-900 dark:text-white leading-none">Daily Reconciliation</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium mt-0.5 leading-none">Precision Audit</p>
                </div>
              </div>
              <span className="text-[10px] font-bold tracking-wider text-emerald-700 dark:text-emerald-300 bg-emerald-100/80 dark:bg-emerald-950/60 border border-emerald-300/80 dark:border-emerald-700/50 px-2 py-0.5 rounded-full">
                Active
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};
