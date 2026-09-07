import { DayCloseFormState, DayCloseCalculations } from '../types';

export function parseNumber(val: string | undefined | null): number {
  if (!val) return 0;
  const cleaned = val.toString().replace(/,/g, '').trim();
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
}

export function parseInteger(val: string | undefined | null): number {
  if (!val) return 0;
  const cleaned = val.toString().replace(/,/g, '').trim();
  const num = parseInt(cleaned, 10);
  return isNaN(num) || num < 0 ? 0 : num;
}

export function computeCalculations(form: DayCloseFormState): DayCloseCalculations {
  const openingCashNum = parseNumber(form.openingCash);
  const totalPosSalesNum = parseNumber(form.totalPosSales);
  
  // Section 1: Total Sales = Opening Cash + Total POS Sales
  const totalSales = openingCashNum + totalPosSalesNum;

  // Section 2: Payment Breakdown
  const zomatoNum = parseNumber(form.zomato);
  const swiggyNum = parseNumber(form.swiggy);
  const easyDinerNum = parseNumber(form.easyDiner);
  const paytmMachineNum = parseNumber(form.paytmMachine);
  const cashAccountNum = parseNumber(form.cashAccount);
  const cashPaymentNum = parseNumber(form.cashPayment);
  const creditBillsNum = parseNumber(form.creditBills);
  const cashLoadNum = parseNumber(form.cashLoad);
  const closingCashNum = parseNumber(form.closingCash);

  // EXACT DIFFERENCE FORMULA:
  // Settlements collected minus Total Sales expected
  // DIFFERENCE =
  //   (ZOMATO + SWIGGY + EASY DINER + PAYTM MACHINE + CASH ACCOUNT + CASH PAYMENT + CREDIT BILLS + CASH LOAD + CLOSING CASH)
  //   - (OPENING CASH + TOTAL POS SALES)
  // Result < 0 -> Shortfall (e.g. -₹62.00)
  // Result > 0 -> Excess (e.g. +₹62.00)
  // Result = 0 -> Balanced (₹0.00)
  const totalDeductions = 
    zomatoNum +
    swiggyNum +
    easyDinerNum +
    paytmMachineNum +
    cashAccountNum +
    cashPaymentNum +
    creditBillsNum +
    cashLoadNum +
    closingCashNum;

  // Preserves actual mathematical sign without Math.abs
  const difference = totalDeductions - totalSales;

  // Section 3: Denominations
  const qty500Num = parseInteger(form.qty500);
  const qty200Num = parseInteger(form.qty200);
  const qty100Num = parseInteger(form.qty100);
  const qty50Num = parseInteger(form.qty50);
  const qty20Num = parseInteger(form.qty20);
  const qty10Num = parseInteger(form.qty10);
  const qty5Num = parseInteger(form.qty5);

  const totalQuantity =
    qty500Num +
    qty200Num +
    qty100Num +
    qty50Num +
    qty20Num +
    qty10Num +
    qty5Num;

  // Denomination Amounts
  const amt500 = 500 * qty500Num;
  const amt200 = 200 * qty200Num;
  const amt100 = 100 * qty100Num;
  const amt50 = 50 * qty50Num;
  const amt20 = 20 * qty20Num;
  const amt10 = 10 * qty10Num;
  const amt5 = 5 * qty5Num;

  // TOTAL PHYSICAL CASH is completely separate from Difference
  const totalPhysicalCash =
    amt500 + amt200 + amt100 + amt50 + amt20 + amt10 + amt5;

  return {
    openingCashNum,
    totalPosSalesNum,
    totalSales,

    zomatoNum,
    swiggyNum,
    easyDinerNum,
    paytmMachineNum,
    cashAccountNum,
    cashPaymentNum,
    creditBillsNum,
    cashLoadNum,
    closingCashNum,

    difference,

    qty500Num,
    qty200Num,
    qty100Num,
    qty50Num,
    qty20Num,
    qty10Num,
    qty5Num,

    totalQuantity,
    totalPhysicalCash,
  };
}

export const INITIAL_FORM_STATE: DayCloseFormState = {
  openingCash: '',
  totalPosSales: '',
  zomato: '',
  swiggy: '',
  easyDiner: '',
  paytmMachine: '',
  cashAccount: '',
  cashPayment: '',
  creditBills: '',
  cashLoad: '',
  closingCash: '',
  qty500: '',
  qty200: '',
  qty100: '',
  qty50: '',
  qty20: '',
  qty10: '',
  qty5: '',
};

export const TEST_CASE_FORM_STATE: DayCloseFormState = {
  openingCash: '3000',
  totalPosSales: '205083',
  zomato: '9489',
  swiggy: '16566',
  easyDiner: '520',
  paytmMachine: '92111',
  cashAccount: '83690',
  cashPayment: '0',
  creditBills: '695',
  cashLoad: '1950',
  closingCash: '3000',
  qty500: '28',
  qty200: '2',
  qty100: '14',
  qty50: '24',
  qty20: '25',
  qty10: '24',
  qty5: '5',
};
