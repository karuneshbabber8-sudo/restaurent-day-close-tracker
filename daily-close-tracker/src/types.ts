export interface DayCloseFormState {
  // Section 1: Daily Cash & Sales
  openingCash: string;
  totalPosSales: string;

  // Section 2: Payment Breakdown
  zomato: string;
  swiggy: string;
  easyDiner: string;
  paytmMachine: string;
  cashAccount: string;
  cashPayment: string;
  creditBills: string;
  cashLoad: string;
  closingCash: string;

  // Section 3: Denominations (quantities)
  qty500: string;
  qty200: string;
  qty100: string;
  qty50: string;
  qty20: string;
  qty10: string;
  qty5: string;
}

export interface DayCloseCalculations {
  openingCashNum: number;
  totalPosSalesNum: number;
  totalSales: number;

  zomatoNum: number;
  swiggyNum: number;
  easyDinerNum: number;
  paytmMachineNum: number;
  cashAccountNum: number;
  cashPaymentNum: number;
  creditBillsNum: number;
  cashLoadNum: number;
  closingCashNum: number;

  difference: number;

  qty500Num: number;
  qty200Num: number;
  qty100Num: number;
  qty50Num: number;
  qty20Num: number;
  qty10Num: number;
  qty5Num: number;

  totalQuantity: number;
  totalPhysicalCash: number;
}

export interface SpreadsheetInfo {
  id: string;
  name: string;
  url: string;
  tabName: string;
}

export interface SaveResult {
  success: boolean;
  message: string;
  columnLetter?: string;
  dateStr?: string;
  isUpdate?: boolean;
}

export type AuthStatus = 'not_connected' | 'connecting' | 'connected' | 'auth_failed';

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

export interface AuthErrorInfo {
  title: string;
  message: string;
  projectId?: string;
  userEmail?: string;
  steps: string[];
}
