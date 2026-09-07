import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { DayCloseCalculations, DayCloseFormState } from '../types';

interface GeneratePdfOptions {
  displayDate: string;
  sheetDate: string;
  calculations: DayCloseCalculations;
  form: DayCloseFormState;
  restaurantName?: string;
}

/**
 * Format currency with 'Rs.' prefix for standard PDF fonts (ensures universal glyph compatibility).
 */
function formatPdfCurrency(amount: number): string {
  const isNegative = amount < -0.001;
  const absAmount = Math.abs(amount);
  const formatted = new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(absAmount);

  return isNegative ? `-Rs. ${formatted}` : `Rs. ${formatted}`;
}

function formatPdfWholeCurrency(amount: number): string {
  const isNegative = amount < -0.001;
  const absAmount = Math.abs(amount);
  const formatted = new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0,
  }).format(absAmount);

  return isNegative ? `-Rs. ${formatted}` : `Rs. ${formatted}`;
}

export function generateDailyClosePdf({
  displayDate,
  sheetDate,
  calculations,
  form,
  restaurantName = 'Restaurant Daily Day Close',
}: GeneratePdfOptions): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;

  // Primary palette colors
  const primaryNavy = [15, 23, 42]; // #0F172A
  const slateGray = [100, 116, 139]; // #64748B
  const lightBg = [248, 250, 252]; // #F8FAFC
  const borderGray = [226, 232, 240]; // #E2E8F0
  const skyBlue = [2, 132, 199]; // #0284C7

  let y = margin;

  // 1. HEADER SECTION
  // Decorative top colored bar
  doc.setFillColor(primaryNavy[0], primaryNavy[1], primaryNavy[2]);
  doc.rect(0, 0, pageWidth, 5, 'F');

  y += 6;

  // Restaurant Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(primaryNavy[0], primaryNavy[1], primaryNavy[2]);
  doc.text(restaurantName.toUpperCase(), margin, y);

  // Subtitle / Tagline
  y += 6;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(slateGray[0], slateGray[1], slateGray[2]);
  doc.text('Good Food  •  Better Numbers  •  Daily Financial Closing Report', margin, y);

  // Date block on right side
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(primaryNavy[0], primaryNavy[1], primaryNavy[2]);
  doc.text(`Report Date: ${displayDate}`, pageWidth - margin, y - 5, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(slateGray[0], slateGray[1], slateGray[2]);
  doc.text(`Sheet Column Date: ${sheetDate}`, pageWidth - margin, y, { align: 'right' });

  y += 5;
  // Subtle separator line
  doc.setDrawColor(borderGray[0], borderGray[1], borderGray[2]);
  doc.setLineWidth(0.4);
  doc.line(margin, y, pageWidth - margin, y);

  y += 6;

  // 2. SUMMARY KPI HIGHLIGHT CARDS (Total Sales, Total Physical Cash, Difference)
  const cardGap = 4;
  const cardWidth = (contentWidth - cardGap * 2) / 3;
  const cardHeight = 22;

  // Card 1: Total Sales
  doc.setFillColor(lightBg[0], lightBg[1], lightBg[2]);
  doc.setDrawColor(borderGray[0], borderGray[1], borderGray[2]);
  doc.roundedRect(margin, y, cardWidth, cardHeight, 2.5, 2.5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(slateGray[0], slateGray[1], slateGray[2]);
  doc.text('TOTAL SALES (OPENING + POS)', margin + 4, y + 6);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(primaryNavy[0], primaryNavy[1], primaryNavy[2]);
  doc.text(formatPdfWholeCurrency(calculations.totalSales), margin + 4, y + 15);

  // Card 2: Total Physical Cash
  const card2X = margin + cardWidth + cardGap;
  doc.setFillColor(lightBg[0], lightBg[1], lightBg[2]);
  doc.roundedRect(card2X, y, cardWidth, cardHeight, 2.5, 2.5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(slateGray[0], slateGray[1], slateGray[2]);
  doc.text('TOTAL PHYSICAL CASH', card2X + 4, y + 6);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(primaryNavy[0], primaryNavy[1], primaryNavy[2]);
  doc.text(formatPdfWholeCurrency(calculations.totalPhysicalCash), card2X + 4, y + 15);

  // Card 3: Difference
  const card3X = card2X + cardWidth + cardGap;
  const isZero = Math.abs(calculations.difference) < 0.001;
  const isNegative = calculations.difference < -0.001;

  if (isZero) {
    doc.setFillColor(240, 253, 244); // light green
    doc.setDrawColor(187, 247, 208);
  } else if (isNegative) {
    doc.setFillColor(255, 241, 242); // light red
    doc.setDrawColor(254, 205, 211);
  } else {
    doc.setFillColor(240, 249, 255); // light sky
    doc.setDrawColor(186, 230, 253);
  }
  doc.roundedRect(card3X, y, cardWidth, cardHeight, 2.5, 2.5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  if (isZero) {
    doc.setTextColor(22, 101, 52);
    doc.text('DIFFERENCE (BALANCED)', card3X + 4, y + 6);
  } else if (isNegative) {
    doc.setTextColor(159, 18, 57);
    doc.text('DIFFERENCE (SHORTFALL)', card3X + 4, y + 6);
  } else {
    doc.setTextColor(7, 89, 133);
    doc.text('DIFFERENCE (EXCESS)', card3X + 4, y + 6);
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  if (isZero) {
    doc.setTextColor(22, 101, 52);
  } else if (isNegative) {
    doc.setTextColor(190, 18, 60);
  } else {
    doc.setTextColor(3, 105, 161);
  }
  doc.text(formatPdfCurrency(calculations.difference), card3X + 4, y + 15);

  y += cardHeight + 7;

  // 3. TWO-COLUMN BREAKDOWN:
  // Left Column: Daily Cash & Sales + Payment Breakdown (11 items)
  // Right Column: Cash Denominations Table
  const colWidth = (contentWidth - 6) / 2;
  const leftColX = margin;
  const rightColX = margin + colWidth + 6;

  // LEFT COLUMN: Sales & Payment Breakdown Table
  const salesAndPaymentsData = [
    ['Opening Cash', formatPdfWholeCurrency(calculations.openingCashNum)],
    ['Total POS Sales', formatPdfWholeCurrency(calculations.totalPosSalesNum)],
    ['TOTAL SALES', formatPdfWholeCurrency(calculations.totalSales)],
    ['Zomato', formatPdfWholeCurrency(calculations.zomatoNum)],
    ['Swiggy', formatPdfWholeCurrency(calculations.swiggyNum)],
    ['Easy Diner', formatPdfWholeCurrency(calculations.easyDinerNum)],
    ['Paytm Machine', formatPdfWholeCurrency(calculations.paytmMachineNum)],
    ['Cash Account', formatPdfWholeCurrency(calculations.cashAccountNum)],
    ['Cash Payment', formatPdfWholeCurrency(calculations.cashPaymentNum)],
    ['Credit Bills', formatPdfWholeCurrency(calculations.creditBillsNum)],
    ['Cash Load', formatPdfWholeCurrency(calculations.cashLoadNum)],
    ['Closing Cash', formatPdfWholeCurrency(calculations.closingCashNum)],
  ];

  autoTable(doc, {
    startY: y,
    margin: { left: leftColX, right: pageWidth - (leftColX + colWidth) },
    tableWidth: colWidth,
    head: [['Particulars', 'Amount']],
    body: salesAndPaymentsData,
    theme: 'plain',
    headStyles: {
      fillColor: [15, 23, 42],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8.5,
      cellPadding: 2.8,
    },
    bodyStyles: {
      textColor: [30, 41, 59],
      fontSize: 8,
      cellPadding: 2.2,
      lineColor: [241, 245, 249],
      lineWidth: 0.2,
    },
    columnStyles: {
      0: { fontStyle: 'normal' },
      1: { halign: 'right', fontStyle: 'bold' },
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    didParseCell: (data) => {
      // Highlight TOTAL SALES row
      if (data.row.index === 2 && data.section === 'body') {
        data.cell.styles.fillColor = [224, 242, 254];
        data.cell.styles.textColor = [3, 105, 161];
        data.cell.styles.fontStyle = 'bold';
      }
    },
  });

  // RIGHT COLUMN: Denominations Table
  const denomData = [
    ['Rs. 500', form.qty500 || '0', formatPdfWholeCurrency(calculations.qty500Num * 500)],
    ['Rs. 200', form.qty200 || '0', formatPdfWholeCurrency(calculations.qty200Num * 200)],
    ['Rs. 100', form.qty100 || '0', formatPdfWholeCurrency(calculations.qty100Num * 100)],
    ['Rs. 50', form.qty50 || '0', formatPdfWholeCurrency(calculations.qty50Num * 50)],
    ['Rs. 20', form.qty20 || '0', formatPdfWholeCurrency(calculations.qty20Num * 20)],
    ['Rs. 10', form.qty10 || '0', formatPdfWholeCurrency(calculations.qty10Num * 10)],
    ['Rs. 5', form.qty5 || '0', formatPdfWholeCurrency(calculations.qty5Num * 5)],
    ['TOTAL QUANTITY', String(calculations.totalQuantity), ''],
    ['TOTAL PHYSICAL CASH', '', formatPdfWholeCurrency(calculations.totalPhysicalCash)],
  ];

  autoTable(doc, {
    startY: y,
    margin: { left: rightColX, right: margin },
    tableWidth: colWidth,
    head: [['Denomination', 'Qty', 'Amount']],
    body: denomData,
    theme: 'plain',
    headStyles: {
      fillColor: [30, 41, 59],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8.5,
      cellPadding: 2.8,
    },
    bodyStyles: {
      textColor: [30, 41, 59],
      fontSize: 8,
      cellPadding: 2.2,
      lineColor: [241, 245, 249],
      lineWidth: 0.2,
    },
    columnStyles: {
      0: { fontStyle: 'bold' },
      1: { halign: 'center' },
      2: { halign: 'right', fontStyle: 'bold' },
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    didParseCell: (data) => {
      // Highlight TOTAL PHYSICAL CASH row
      if (data.row.index === 8 && data.section === 'body') {
        data.cell.styles.fillColor = [220, 252, 231];
        data.cell.styles.textColor = [22, 101, 52];
        data.cell.styles.fontStyle = 'bold';
      }
      if (data.row.index === 7 && data.section === 'body') {
        data.cell.styles.fillColor = [241, 245, 249];
        data.cell.styles.fontStyle = 'bold';
      }
    },
  });

  // Calculate final Y after tables
  const finalY = Math.max(
    (doc as any).lastAutoTable?.finalY || 160,
    175
  );

  y = finalY + 8;

  // 4. RECONCILIATION SUMMARY BOX
  doc.setFillColor(lightBg[0], lightBg[1], lightBg[2]);
  doc.setDrawColor(borderGray[0], borderGray[1], borderGray[2]);
  doc.roundedRect(margin, y, contentWidth, 18, 2.5, 2.5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(primaryNavy[0], primaryNavy[1], primaryNavy[2]);
  doc.text('AUDIT RECONCILIATION FORMULA', margin + 5, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(slateGray[0], slateGray[1], slateGray[2]);
  doc.text(
    'Difference = (Zomato + Swiggy + Easy Diner + Paytm + Cash Acc + Cash Pmt + Credit + Cash Load + Closing Cash) - (Opening + POS Sales)',
    margin + 5,
    y + 12
  );

  y += 24;

  // 5. SIGNATURE & VERIFICATION SECTION
  const sigBoxWidth = (contentWidth - 20) / 2;

  // Cashier Signature Line
  doc.setDrawColor(borderGray[0], borderGray[1], borderGray[2]);
  doc.setLineWidth(0.4);
  doc.line(margin, y + 14, margin + sigBoxWidth, y + 14);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(slateGray[0], slateGray[1], slateGray[2]);
  doc.text('CASHIER / PREPARED BY', margin, y + 19);

  // Manager Signature Line
  const rightSigX = pageWidth - margin - sigBoxWidth;
  doc.line(rightSigX, y + 14, rightSigX + sigBoxWidth, y + 14);
  doc.text('MANAGER / AUDITED BY', rightSigX, y + 19);

  // 6. FOOTER
  const pageHeight = doc.internal.pageSize.getHeight();
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184); // #94A3B8
  const generatedTime = new Date().toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
  doc.text(
    `Generated on ${displayDate} at ${generatedTime} • Restaurant Daily Day Close Report`,
    margin,
    pageHeight - 8
  );

  doc.text('Page 1 of 1', pageWidth - margin, pageHeight - 8, { align: 'right' });

  // Save the PDF file to trigger download
  const sanitizedDate = sheetDate.replace(/[^a-zA-Z0-9_-]/g, '_');
  doc.save(`Daily_Close_Report_${sanitizedDate}.pdf`);
}
