import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChefHat,
  Calendar,
  ChevronDown,
  LogOut,
  X,
  Check,
  Sun,
  Moon,
} from 'lucide-react';
import { formatDayOfWeek } from '../utils/dateUtils';

interface HeaderUser {
  email?: string;
  displayName?: string;
}

interface HeaderProps {
  displayDate: string;
  sheetDate: string;
  user: HeaderUser | null;
  onSignIn: () => void;
  onSignOut: () => void;
  selectedDate: Date;
  onDateChange: (d: Date) => void;
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  displayDate,
  user,
  onSignIn,
  onSignOut,
  selectedDate,
  onDateChange,
  isDarkMode = false,
  onToggleDarkMode,
}) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const accountMenuRef = useRef<HTMLDivElement>(null);

  // Close account dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        accountMenuRef.current &&
        !accountMenuRef.current.contains(event.target as Node)
      ) {
        setShowAccountMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDateInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      const [year, month, day] = e.target.value.split('-').map(Number);
      const newDate = new Date(year, month - 1, day);
      onDateChange(newDate);
      setShowDatePicker(false);
    }
  };

  const formattedIsoDate = `${selectedDate.getFullYear()}-${String(
    selectedDate.getMonth() + 1
  ).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`;

  const dayOfWeek = formatDayOfWeek(selectedDate);

  // Compute initials and first name
  const userEmail = user?.email || 'karuneshbabber.38612@gmail.com';
  let firstName = 'Karunesh';
  let initials = 'KB';

  if (user?.displayName) {
    const parts = user.displayName.trim().split(' ');
    firstName = parts[0] || 'Karunesh';
    initials = parts.map((p) => p[0]?.toUpperCase()).slice(0, 2).join('') || 'KB';
  } else if (user?.email) {
    const local = user.email.split('@')[0];
    if (local.toLowerCase().includes('karunesh')) {
      firstName = 'Karunesh';
      initials = 'KB';
    } else {
      firstName = local.charAt(0).toUpperCase() + local.slice(1, 10);
      initials = local.slice(0, 2).toUpperCase();
    }
  }

  const isSignedIn = Boolean(user?.email);

  return (
    <header className="w-full space-y-2.5 relative z-50">
      {/* Top Glass Navigation Bar - Liquid Glass Card */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="relative overflow-visible liquid-glass-card backdrop-blur-xl bg-white/40 border border-white/60 shadow-lg rounded-2xl p-3.5 sm:p-5 z-50"
      >
        {/* Specular glass reflection line on top edge */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent pointer-events-none rounded-t-2xl" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 sm:gap-4">
          {/* Left: Chef / Restaurant Brand Identity */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-b from-amber-500/15 via-white/60 to-white/20 dark:from-amber-500/20 dark:via-white/10 dark:to-transparent border border-white/70 dark:border-white/20 shadow-[0_4px_16px_rgba(217,119,6,0.1)] flex items-center justify-center text-amber-700 dark:text-amber-400 shrink-0 backdrop-blur-md">
              <ChefHat className="w-6 h-6 text-amber-600 dark:text-amber-400" strokeWidth={1.9} />
            </div>
            <div>
              <div className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-amber-700 dark:text-amber-400">
                Restaurant
              </div>
              <h1 className="text-base sm:text-lg lg:text-xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
                DAILY DAY CLOSE
              </h1>
              <p className="text-[11px] sm:text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1.5">
                <span>Good Food</span>
                <span className="text-slate-300 dark:text-slate-600">•</span>
                <span>Better Numbers</span>
              </p>
            </div>
          </div>

          {/* Right Controls: Theme Toggle + Date Pill + Google Account Dropdown */}
          <div className="flex items-center gap-2 sm:gap-3 self-stretch sm:self-auto justify-between sm:justify-end relative z-[9999]">
            {/* Dark Mode Toggle Button */}
            {onToggleDarkMode && (
              <button
                type="button"
                id="btn-toggle-dark-mode"
                onClick={onToggleDarkMode}
                className="flex items-center gap-1.5 liquid-glass-btn-secondary rounded-2xl px-2.5 py-2 sm:px-3 sm:py-2 transition-all hover:scale-[1.04] active:scale-[0.96] text-left cursor-pointer group"
                title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                aria-label={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-amber-500/15 border border-amber-500/25 flex items-center justify-center text-amber-700 dark:text-amber-300 shrink-0 group-hover:bg-amber-500/25 transition-colors">
                  {isDarkMode ? (
                    <Sun className="w-4 h-4 text-amber-400" />
                  ) : (
                    <Moon className="w-4 h-4 text-slate-700" />
                  )}
                </div>
                <span className="hidden sm:inline text-xs font-bold text-slate-800 dark:text-slate-200">
                  {isDarkMode ? 'Dark' : 'Light'}
                </span>
              </button>
            )}

            {/* Date Glass Pill */}
            <button
              type="button"
              id="btn-header-date-pill"
              onClick={() => setShowDatePicker(!showDatePicker)}
              className="flex items-center gap-2.5 liquid-glass-btn-secondary rounded-2xl px-3 py-2 sm:px-3.5 sm:py-2 transition-all hover:scale-[1.02] active:scale-[0.98] text-left cursor-pointer group"
              title="Click to change reporting date"
            >
              <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/25 flex items-center justify-center text-amber-700 dark:text-amber-400 shrink-0 group-hover:bg-amber-500/25 transition-colors">
                <Calendar className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <div className="text-xs font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                  {displayDate}
                </div>
                <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 leading-tight">
                  {dayOfWeek}
                </div>
              </div>
            </button>

            {/* Google Account Control Container with High Z-Index */}
            <div className="relative z-[9999]" ref={accountMenuRef}>
              {isSignedIn ? (
                <button
                  type="button"
                  id="btn-google-account-menu"
                  onClick={() => setShowAccountMenu(!showAccountMenu)}
                  className="flex items-center gap-2 liquid-glass-btn-secondary rounded-2xl p-1.5 pr-2.5 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                >
                  {/* Avatar Initials Circle */}
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 text-white font-extrabold text-xs flex items-center justify-center shadow-sm border border-white/40">
                    {initials}
                  </div>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {firstName}
                  </span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-slate-500 dark:text-slate-400 transition-transform duration-200 ${
                      showAccountMenu ? 'rotate-180' : ''
                    }`}
                  />
                </button>
              ) : (
                <button
                  type="button"
                  id="btn-google-signin"
                  onClick={onSignIn}
                  className="flex items-center gap-2 liquid-glass-btn-secondary text-slate-800 dark:text-slate-200 text-xs font-bold py-2 px-3.5 rounded-2xl transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                >
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>Sign in with Google</span>
                </button>
              )}

              {/* Premium Liquid Glass Dropdown with Highest Z-Index (z-[9999]) */}
              <AnimatePresence>
                {showAccountMenu && isSignedIn && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.96, y: -6 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96, y: -6 }}
                    transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute right-0 top-full mt-2 w-72 liquid-glass-dropdown rounded-3xl p-3.5 z-[9999] text-slate-800 dark:text-slate-100 space-y-2.5 shadow-[0_24px_50px_rgba(15,23,42,0.18)]"
                    style={{ zIndex: 9999 }}
                  >
                    {/* User profile info header */}
                    <div className="px-2.5 py-1.5 border-b border-white/60 dark:border-white/10">
                      <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
                        Account
                      </div>
                      <div className="text-sm font-extrabold text-slate-900 dark:text-white truncate mt-0.5">
                        {firstName}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 font-mono truncate">
                        {userEmail}
                      </div>
                    </div>

                    {/* Authentication Status Badge */}
                    <div className="px-2.5 py-2 rounded-2xl bg-white/60 dark:bg-white/10 border border-white/70 dark:border-white/15 flex items-center gap-2 text-xs text-slate-700 dark:text-slate-200 font-semibold shadow-2xs">
                      <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span>Signed in with Google</span>
                    </div>

                    {/* Sign Out Button */}
                    <button
                      type="button"
                      id="btn-google-signout"
                      onClick={() => {
                        setShowAccountMenu(false);
                        onSignOut();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2.5 text-xs font-bold text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 hover:bg-rose-50/80 dark:hover:bg-rose-950/40 rounded-2xl transition-all cursor-pointer active:scale-95"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign out</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Date Picker Dropdown Override - Liquid Glass Card */}
      <AnimatePresence>
        {showDatePicker && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden relative z-40"
          >
            <div className="p-3.5 sm:p-4 liquid-glass-card backdrop-blur-xl bg-white/40 border border-white/60 shadow-lg rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <label htmlFor="input-date-override" className="font-bold text-slate-800 dark:text-slate-200">
                  Select Custom Closing Date:
                </label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  id="input-date-override"
                  type="date"
                  value={formattedIsoDate}
                  onChange={handleDateInputChange}
                  className="liquid-glass-input rounded-xl px-3 py-1.5 text-xs text-slate-800 dark:text-slate-100 font-bold focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowDatePicker(false)}
                  className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white rounded-xl hover:bg-white/60 dark:hover:bg-white/10 transition"
                  title="Close date selector"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
