/**
 * Server-side Google Sheets & Drive API service.
 * Performs all spreadsheet searches, tab creations, header checks,
 * duplicate date checks, and column writes securely on the backend.
 */

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

export function numberToColumnLetter(colNum: number): string {
  let letter = '';
  let temp = colNum;
  while (temp > 0) {
    const remainder = (temp - 1) % 26;
    letter = String.fromCharCode(65 + remainder) + letter;
    temp = Math.floor((temp - 1) / 26);
  }
  return letter;
}

export function columnLetterToNumber(letter: string): number {
  let column = 0;
  for (let i = 0; i < letter.length; i++) {
    column = column * 26 + (letter.charCodeAt(i) - 64);
  }
  return column;
}

interface SpreadsheetInfoResult {
  id: string;
  name: string;
  url: string;
  tabName: string;
  userEmail?: string;
}

/**
 * Validates the user's OAuth access token with Google's tokeninfo endpoint.
 */
export async function validateUserToken(accessToken: string): Promise<{ email?: string; error?: string }> {
  try {
    const res = await fetch(`https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${encodeURIComponent(accessToken)}`);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return { error: err.error_description || err.error || 'Invalid or expired access token' };
    }
    const info = await res.json();
    return { email: info.email };
  } catch (e: any) {
    return { error: e.message || 'Token validation failed' };
  }
}

/**
 * Searches Google Drive for 'Restaurant Daily Close Database'.
 * If not found, creates it with worksheet tab 'Daily Close'.
 * Ensures Column A (A1:A23) contains the required 23 row labels.
 */
export async function findOrCreateSpreadsheet(
  accessToken: string,
  providedSpreadsheetId?: string
): Promise<SpreadsheetInfoResult> {
  let spreadsheetId: string | null = providedSpreadsheetId || null;
  let webViewLink = '';

  if (!spreadsheetId) {
    // 1. Search Google Drive for 'Restaurant Daily Close Database'
    const query = encodeURIComponent(
      `name = '${SPREADSHEET_NAME}' and mimeType = 'application/vnd.google-apps.spreadsheet' and trashed = false`
    );
    const driveRes = await fetch(
      `https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name,webViewLink)&pageSize=1`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    if (!driveRes.ok) {
      const errData = await driveRes.json().catch(() => ({}));
      const msg = errData?.error?.message || `Google Drive API error (${driveRes.status})`;
      throw new Error(msg);
    }

    const driveData = await driveRes.json();
    if (driveData.files && driveData.files.length > 0) {
      spreadsheetId = driveData.files[0].id;
      webViewLink = driveData.files[0].webViewLink || `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;
    }
  }

  // 2. If not found in Drive, create new Google Spreadsheet
  if (!spreadsheetId) {
    const createRes = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        properties: {
          title: SPREADSHEET_NAME,
        },
        sheets: [
          {
            properties: {
              title: TAB_NAME,
              gridProperties: {
                frozenRowCount: 1,
                frozenColumnCount: 1,
                rowCount: 50,
                columnCount: 26,
              },
            },
          },
        ],
      }),
    });

    if (!createRes.ok) {
      const errData = await createRes.json().catch(() => ({}));
      const msg = errData?.error?.message || `Failed to create spreadsheet (${createRes.status})`;
      throw new Error(msg);
    }

    const createdData = await createRes.json();
    spreadsheetId = createdData.spreadsheetId;
    webViewLink = createdData.spreadsheetUrl || `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;
  }

  // 3. Ensure 'Daily Close' tab exists in spreadsheet
  const metaRes = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!metaRes.ok) {
    const errData = await metaRes.json().catch(() => ({}));
    throw new Error(errData?.error?.message || 'Failed to read spreadsheet metadata');
  }

  const metaData = await metaRes.json();
  const sheets = metaData.sheets || [];
  let tabExists = sheets.some((s: any) => s.properties?.title === TAB_NAME);
  let sheetId = sheets.find((s: any) => s.properties?.title === TAB_NAME)?.properties?.sheetId;

  if (!tabExists) {
    // Add sheet tab 'Daily Close'
    const addSheetRes = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requests: [
            {
              addSheet: {
                properties: {
                  title: TAB_NAME,
                  gridProperties: {
                    frozenRowCount: 1,
                    frozenColumnCount: 1,
                    rowCount: 50,
                    columnCount: 26,
                  },
                },
              },
            },
          ],
        }),
      }
    );

    if (!addSheetRes.ok) {
      const errData = await addSheetRes.json().catch(() => ({}));
      throw new Error(errData?.error?.message || `Failed to add sheet '${TAB_NAME}'`);
    }

    const addSheetData = await addSheetRes.json();
    sheetId = addSheetData.replies?.[0]?.addSheet?.properties?.sheetId;
  }

  // 4. Ensure Column A (A1:A23) contains the exact required row labels
  await ensureColumnALabels(accessToken, spreadsheetId, sheetId);

  return {
    id: spreadsheetId,
    name: SPREADSHEET_NAME,
    url: webViewLink || `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`,
    tabName: TAB_NAME,
  };
}

/**
 * Checks and writes Column A labels A1:A23 if missing or incomplete.
 */
async function ensureColumnALabels(
  accessToken: string,
  spreadsheetId: string,
  sheetId?: number
): Promise<void> {
  const readRes = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/'${encodeURIComponent(
      TAB_NAME
    )}'!A1:A23`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );

  let needsWrite = false;
  if (readRes.ok) {
    const readData = await readRes.json();
    const existingValues = readData.values || [];
    if (existingValues.length < REQUIRED_LABELS.length) {
      needsWrite = true;
    } else {
      for (let i = 0; i < REQUIRED_LABELS.length; i++) {
        if (!existingValues[i] || existingValues[i][0] !== REQUIRED_LABELS[i]) {
          needsWrite = true;
          break;
        }
      }
    }
  } else {
    needsWrite = true;
  }

  if (needsWrite) {
    const labelValues = REQUIRED_LABELS.map((lbl) => [lbl]);
    await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/'${encodeURIComponent(
        TAB_NAME
      )}'!A1:A23?valueInputOption=USER_ENTERED`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          range: `'${TAB_NAME}'!A1:A23`,
          majorDimension: 'ROWS',
          values: labelValues,
        }),
      }
    );

    // Apply header and label styling (bold, subtle gray fill for Column A)
    if (sheetId !== undefined) {
      try {
        await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            requests: [
              {
                repeatCell: {
                  range: {
                    sheetId: sheetId,
                    startRowIndex: 0,
                    endRowIndex: 23,
                    startColumnIndex: 0,
                    endColumnIndex: 1,
                  },
                  cell: {
                    userEnteredFormat: {
                      textFormat: { bold: true },
                      backgroundColor: { red: 0.95, green: 0.96, blue: 0.98 },
                    },
                  },
                  fields: 'userEnteredFormat(textFormat,backgroundColor)',
                },
              },
              {
                repeatCell: {
                  range: {
                    sheetId: sheetId,
                    startRowIndex: 0,
                    endRowIndex: 1,
                    startColumnIndex: 0,
                    endColumnIndex: 50,
                  },
                  cell: {
                    userEnteredFormat: {
                      textFormat: { bold: true },
                      horizontalAlignment: 'CENTER',
                      backgroundColor: { red: 0.90, green: 0.94, blue: 0.99 },
                    },
                  },
                  fields: 'userEnteredFormat(textFormat,horizontalAlignment,backgroundColor)',
                },
              },
            ],
          }),
        });
      } catch (styleErr) {
        console.warn('Styling notice:', styleErr);
      }
    }
  }
}

export interface DateCheckResult {
  exists: boolean;
  columnLetter: string;
  columnIndex: number;
  spreadsheetId: string;
  spreadsheetUrl: string;
}

/**
 * Reads Row 1 of tab 'Daily Close' to check if today's date already exists.
 * Returns whether it exists, and the exact column letter (either existing or next empty).
 */
export async function checkDateInRow1(
  accessToken: string,
  spreadsheetId: string,
  dateStr: string
): Promise<DateCheckResult> {
  const spreadsheetUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;

  const readRes = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/'${encodeURIComponent(
      TAB_NAME
    )}'!1:1`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );

  if (!readRes.ok) {
    const errData = await readRes.json().catch(() => ({}));
    throw new Error(errData?.error?.message || 'Failed to read Row 1 from worksheet');
  }

  const readData = await readRes.json();
  const rowValues: string[] = (readData.values && readData.values[0]) || [];

  // Check from column B onwards (index 1+)
  for (let i = 1; i < rowValues.length; i++) {
    const cellValue = String(rowValues[i] || '').trim();
    if (cellValue.toLowerCase() === dateStr.toLowerCase()) {
      const colLetter = numberToColumnLetter(i + 1);
      return {
        exists: true,
        columnLetter: colLetter,
        columnIndex: i,
        spreadsheetId,
        spreadsheetUrl,
      };
    }
  }

  // If date does not exist: find the next empty column
  let nextColNum = 2; // Column B is minimum
  if (rowValues.length >= 1) {
    // Look for first blank from index 1, or end of array + 1
    let foundBlank = false;
    for (let i = 1; i < rowValues.length; i++) {
      if (!rowValues[i] || String(rowValues[i]).trim() === '') {
        nextColNum = i + 1;
        foundBlank = true;
        break;
      }
    }
    if (!foundBlank) {
      nextColNum = rowValues.length + 1;
    }
  }

  const colLetter = numberToColumnLetter(nextColNum);
  return {
    exists: false,
    columnLetter: colLetter,
    columnIndex: nextColNum - 1,
    spreadsheetId,
    spreadsheetUrl,
  };
}

export interface SaveColumnResult {
  success: boolean;
  columnLetter: string;
  dateStr: string;
  spreadsheetId: string;
  spreadsheetUrl: string;
  isUpdate: boolean;
}

/**
 * Saves all 23 rows for the given date into the target column.
 * Writes final calculated numerical values only (no formulas).
 */
export async function saveDayCloseColumn(
  accessToken: string,
  spreadsheetId: string,
  columnLetter: string,
  dateStr: string,
  values: (string | number)[],
  isUpdate: boolean
): Promise<SaveColumnResult> {
  const spreadsheetUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;
  const targetColIndex = columnLetterToNumber(columnLetter);

  // 1. Expand grid if column exceeds current dimensions
  const metaRes = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (metaRes.ok) {
    const metaData = await metaRes.json();
    const currentSheet = metaData.sheets?.find(
      (s: any) => s.properties?.title === TAB_NAME
    );
    const currentCols = currentSheet?.properties?.gridProperties?.columnCount || 26;
    const sheetId = currentSheet?.properties?.sheetId;

    if (targetColIndex > currentCols && sheetId !== undefined) {
      await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            requests: [
              {
                updateSheetProperties: {
                  properties: {
                    sheetId: sheetId,
                    gridProperties: {
                      columnCount: targetColIndex + 10,
                    },
                  },
                  fields: 'gridProperties.columnCount',
                },
              },
            ],
          }),
        }
      );
    }
  }

  // 2. Prepare the 23 row values (Column array: 23 rows, 1 column each)
  // Row 1: dateStr
  // Row 2-23: values passed in (pure numbers or formatted values)
  const formattedColumnValues = values.map((val) => [val]);

  const range = `'${TAB_NAME}'!${columnLetter}1:${columnLetter}23`;
  const writeRes = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(
      range
    )}?valueInputOption=USER_ENTERED`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        range,
        majorDimension: 'ROWS',
        values: formattedColumnValues,
      }),
    }
  );

  if (!writeRes.ok) {
    const errData = await writeRes.json().catch(() => ({}));
    throw new Error(errData?.error?.message || `Failed to write column ${columnLetter} to sheet`);
  }

  return {
    success: true,
    columnLetter,
    dateStr,
    spreadsheetId,
    spreadsheetUrl,
    isUpdate,
  };
}
