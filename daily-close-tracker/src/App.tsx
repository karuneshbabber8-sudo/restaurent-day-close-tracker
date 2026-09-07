/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { DailyCashSales } from './components/DailyCashSales';
import { PaymentBreakdown } from './components/PaymentBreakdown';
import { DifferenceCard } from './components/DifferenceCard';
import { CashDenominations } from './components/CashDenominations';
import { QuickActions, PdfExportStatus } from './components/QuickActions';
import { ConfirmationModal } from './components/ConfirmationModal';
import {
  DayCloseFormState,
  SpreadsheetInfo,
  AuthStatus,
  AuthErrorInfo,
} from './types';
import {
  INITIAL_FORM_STATE,
  TEST_CASE_FORM_STATE,
  computeCalculations,
} from './utils/calculationUtils';
import {
  formatDateDisplay,
  formatDateForSheet,
} from './utils/dateUtils';
import { generateDailyClosePdf } from './utils/pdfGenerator';
import {
  signInWithGoogle,
  signOutUser,
  getAccessToken,
  parseAuthError,
  isPopupCancelled,
} from './services/googleAuth';

interface AppUser {
  email?: string;
  displayName?: string;
}

export default function App() {
  // Theme State with localStorage persistence and system preference detection
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('restaurant_dayclose_theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Sync dark class on document element
  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      localStorage.setItem('restaurant_dayclose_theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('restaurant_dayclose_theme', 'light');
    }
  }, [isDarkMode]);

  // Date State (Defaults to current local date)
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const displayDate = useMemo(() => formatDateDisplay(selectedDate), [selectedDate]);
  const sheetDate = useMemo(() => formatDateForSheet(selectedDate), [selectedDate]);

  // Form State
  const [form, setForm] = useState<DayCloseFormState>(INITIAL_FORM_STATE);

  // Real-time Calculations
  const calculations = useMemo(() => computeCalculations(form), [form]);

  // Auth & User Profile State (Pre-populated with authenticated user details from metadata)
  const [user, setUser] = useState<AppUser | null>({
    email: 'karuneshbabber.38612@gmail.com',
    displayName: 'Karunesh',
  });
  const [token, setToken] = useState<string | null>(null);
  const [, setAuthStatus] = useState<AuthStatus>('connected');
  const [, setSpreadsheetInfo] = useState<SpreadsheetInfo | null>(null);
  const [, setAuthErrorInfo] = useState<AuthErrorInfo | null>(null);

  // PDF Export States
  const [pdfStatus, setPdfStatus] = useState<PdfExportStatus>('ready');
  const [pdfErrorMessage, setPdfErrorMessage] = useState<string | null>(null);

  // Modals
  const [clearModalOpen, setClearModalOpen] = useState(false);

  // Real Working PDF Generation Flow
  const handleExportPdf = async () => {
    setPdfErrorMessage(null);
    setPdfStatus('generating');

    try {
      // Allow UI render state to transition
      await new Promise((resolve) => setTimeout(resolve, 250));

      generateDailyClosePdf({
        displayDate,
        sheetDate,
        calculations,
        form,
        restaurantName: 'Restaurant Daily Day Close',
      });

      setPdfStatus('generated');

      // Return to ready after 4 seconds
      setTimeout(() => {
        setPdfStatus((current) => (current === 'generated' ? 'ready' : current));
      }, 4000);
    } catch (err: any) {
      console.error('PDF export error:', err);
      setPdfStatus('failed');
      setPdfErrorMessage(err?.message || 'Failed to generate PDF report.');
    }
  };

  // Real Print Handler
  const handlePrint = () => {
    window.print();
  };

  // Google Sign In
  const handleSignIn = async () => {
    try {
      setAuthStatus('connecting');
      const result = await signInWithGoogle();
      if (result && result.accessToken) {
        setUser({
          email: result.email,
          displayName: result.email?.split('@')[0] || 'Karunesh',
        });
        setToken(result.accessToken);
        setAuthStatus('connected');
        if (result.spreadsheet) {
          setSpreadsheetInfo(result.spreadsheet);
        }
      }
    } catch (err: any) {
      if (isPopupCancelled(err)) {
        return;
      }
      console.warn('Sign-in cancelled or failed:', err);
      const parsed = parseAuthError(err);
      setAuthErrorInfo(parsed);
    }
  };

  // Google Sign Out
  const handleSignOut = async () => {
    await signOutUser();
    setUser(null);
    setToken(null);
    setSpreadsheetInfo(null);
    setAuthStatus('not_connected');
  };

  // Form Field Change
  const handleFieldChange = (field: keyof DayCloseFormState, val: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: val,
    }));
    if (pdfStatus === 'failed') {
      setPdfStatus('ready');
      setPdfErrorMessage(null);
    }
  };

  // Load Sample Data
  const handleLoadTestCase = () => {
    setForm(TEST_CASE_FORM_STATE);
    setPdfStatus('ready');
    setPdfErrorMessage(null);
  };

  // Clear Form
  const handleConfirmClear = () => {
    setForm(INITIAL_FORM_STATE);
    setClearModalOpen(false);
    setPdfStatus('ready');
    setPdfErrorMessage(null);
  };

  return (
    <div
      className={`min-h-screen flex flex-col font-sans pb-16 relative overflow-x-hidden selection:bg-amber-500/20 selection:text-amber-950 transition-colors duration-500 ${
        isDarkMode
          ? 'dark bg-gradient-to-br from-slate-950 via-zinc-950 to-neutral-950 text-slate-100'
          : 'bg-gradient-to-br from-amber-100 via-orange-50 to-orange-100 text-slate-900'
      }`}
    >
      {/* Ambient specular background illumination - Apple Vision Pro liquid glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 transition-opacity duration-500">
        <div
          className={`absolute -top-32 -left-32 w-[34rem] h-[34rem] rounded-full blur-[130px] transition-all duration-500 ${
            isDarkMode ? 'bg-amber-600/10' : 'bg-amber-200/50'
          }`}
        />
        <div
          className={`absolute top-1/4 -right-32 w-[30rem] h-[30rem] rounded-full blur-[140px] transition-all duration-500 ${
            isDarkMode ? 'bg-orange-600/10' : 'bg-orange-200/40'
          }`}
        />
        <div
          className={`absolute -bottom-36 left-1/3 w-[36rem] h-[36rem] rounded-full blur-[140px] transition-all duration-500 ${
            isDarkMode ? 'bg-amber-900/15' : 'bg-amber-100/60'
          }`}
        />
      </div>

      {/* Main Container */}
      <div className="relative z-10 flex flex-col flex-1 max-w-xl lg:max-w-6xl xl:max-w-7xl mx-auto w-full px-3.5 sm:px-6 pt-3.5 sm:pt-6 space-y-4 sm:space-y-6">
        {/* Header: Brand, Current Date & Compact Google Account Dropdown */}
        <div className="relative z-50">
          <Header
            displayDate={displayDate}
            sheetDate={sheetDate}
            user={user}
            onSignIn={handleSignIn}
            onSignOut={handleSignOut}
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
            isDarkMode={isDarkMode}
            onToggleDarkMode={() => setIsDarkMode((prev) => !prev)}
          />
        </div>

        {/* Hero Section: Food Today, Great Food / Better Numbers */}
        <HeroSection />

        {/* Main 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-start">
          {/* Left Column: 01 DAILY CASH & SALES + 02 PAYMENT BREAKDOWN */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-6">
            {/* Section 01: DAILY CASH & SALES */}
            <DailyCashSales
              openingCash={form.openingCash}
              totalPosSales={form.totalPosSales}
              totalSales={calculations.totalSales}
              onChange={handleFieldChange}
            />

            {/* Section 02: PAYMENT BREAKDOWN */}
            <PaymentBreakdown
              form={form}
              onChange={handleFieldChange}
            />
          </div>

          {/* Right Column: DIFFERENCE + 03 CASH DENOMINATION + QUICK ACTIONS */}
          <div className="lg:col-span-5 space-y-4 sm:space-y-6">
            {/* Prominent DIFFERENCE Card */}
            <DifferenceCard difference={calculations.difference} />

            {/* Section 03: CASH DENOMINATION */}
            <CashDenominations
              form={form}
              calc={calculations}
              onChange={handleFieldChange}
              onLoadTestCase={handleLoadTestCase}
              onClearClick={() => setClearModalOpen(true)}
            />

            {/* QUICK ACTIONS: Export Day Close as PDF (Main Action) + Print */}
            <QuickActions
              pdfStatus={pdfStatus}
              errorMessage={pdfErrorMessage}
              onExportPdf={handleExportPdf}
              onPrint={handlePrint}
            />
          </div>
        </div>

        {/* Clear Form Confirmation Modal */}
        <ConfirmationModal
          isOpen={clearModalOpen}
          type="clearForm"
          onConfirm={handleConfirmClear}
          onCancel={() => setClearModalOpen(false)}
        />
      </div>
    </div>
  );
}
