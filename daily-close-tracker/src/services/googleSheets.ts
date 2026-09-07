import { DayCloseCalculations, SpreadsheetInfo } from '../types';

export const SPREADSHEET_NAME = 'Restaurant Daily Close Database';
export const TAB_NAME = 'Daily Close';

export const REQUIRED_LABELS = [
  'Particulars',
  'Opening Cash',
  'Total POS Sales',
  'Total Sales',
  'ZOMATO',
  'SWIGGY',
  'EASY DINER',
  'PAYTM MACHINE',
  'CASH ACCOUNT',
  'CASH PAYMENT',
  'CREDIT BILLS',
  'CASH LOAD',
  'CLOSING CASH',
  '₹500 Qty',
  '₹200 Qty',
  '₹100 Qty',
  '₹50 Qty',
  '₹20 Qty',
  '₹10 Qty',
  '₹5 Qty',
  'TOTAL QUANTITY',
  'TOTAL PHYSICAL CASH',
  'DIFFERENCE',
];

export interface DateCheckResult {
  exists: boolean;
  columnLetter: string;
  columnIndex: number;
  spreadsheetId: string;
  spreadsheetUrl: string;
}

/**
 * Calls server-side endpoint to find or create the spreadsheet and verify permissions.
 */
export async function findOrCreateSpreadsheet(
  accessToken: string,
  _providedSpreadsheetId?: string
): Promise<SpreadsheetInfo> {
  const res = await fetch('/api/sheets/verify', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || `Server verification failed (${res.status})`);
  }

  const data = await res.json();
  return data.spreadsheet;
}

/**
 * Calls server-side endpoint to check if today's date already exists in Row 1.
 */
export async function checkDateInRow1(
  accessToken: string,
  spreadsheetId: string,
  dateStr: string
): Promise<DateCheckResult> {
  const res = await fetch('/api/sheets/check-date', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      spreadsheetId,
      dateStr,
    }),
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || `Date check failed (${res.status})`);
  }

  return await res.json();
}

/**
 * Builds the 23 row values and calls server-side endpoint to write to the designated column.
 * Final calculated values only are sent (no formulas).
 */
export async function saveDayCloseColumn(
  accessToken: string,
  spreadsheetId: string,
  columnLetter: string,
  dateStr: string,
  calculations: DayCloseCalculations,
  isUpdate: boolean = false
): Promise<any> {
  // Build the 23 exact rows matching A1:A23
  const values: (string | number)[] = [
    dateStr, // Row 1: Particulars / Date
    calculations.openingCashNum, // Row 2: Opening Cash
    calculations.totalPosSalesNum, // Row 3: Total POS Sales
    calculations.totalSales, // Row 4: Total Sales
    calculations.zomatoNum, // Row 5: ZOMATO
    calculations.swiggyNum, // Row 6: SWIGGY
    calculations.easyDinerNum, // Row 7: EASY DINER
    calculations.paytmMachineNum, // Row 8: PAYTM MACHINE
    calculations.cashAccountNum, // Row 9: CASH ACCOUNT
    calculations.cashPaymentNum, // Row 10: CASH PAYMENT
    calculations.creditBillsNum, // Row 11: CREDIT BILLS
    calculations.cashLoadNum, // Row 12: CASH LOAD
    calculations.closingCashNum, // Row 13: CLOSING CASH
    calculations.qty500Num, // Row 14: ₹500 Qty
    calculations.qty200Num, // Row 15: ₹200 Qty
    calculations.qty100Num, // Row 16: ₹100 Qty
    calculations.qty50Num, // Row 17: ₹50 Qty
    calculations.qty20Num, // Row 18: ₹20 Qty
    calculations.qty10Num, // Row 19: ₹10 Qty
    calculations.qty5Num, // Row 20: ₹5 Qty
    calculations.totalQuantity, // Row 21: TOTAL QUANTITY
    calculations.totalPhysicalCash, // Row 22: TOTAL PHYSICAL CASH
    calculations.difference, // Row 23: DIFFERENCE
  ];

  const res = await fetch('/api/sheets/save-column', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      spreadsheetId,
      columnLetter,
      dateStr,
      values,
      isUpdate,
    }),
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || `Save column failed (${res.status})`);
  }

  return await res.json();
}
