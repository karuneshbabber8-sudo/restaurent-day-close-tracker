import express, { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import {
  findOrCreateSpreadsheet,
  checkDateInRow1,
  saveDayCloseColumn,
  validateUserToken,
} from './server/sheetsService';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Helper to extract bearer token from Authorization header
  const getBearerToken = (req: Request): string | null => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return null;
    const parts = authHeader.split(' ');
    if (parts.length === 2 && parts[0].toLowerCase() === 'bearer') {
      return parts[1];
    }
    return null;
  };

  // 1. Health check endpoint
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // 2. Verify Google Sheets Connection & Ensure Database Spreadsheet Exists
  app.post('/api/sheets/verify', async (req: Request, res: Response) => {
    const token = getBearerToken(req);
    if (!token) {
      return res.status(401).json({ error: 'Missing or invalid Authorization Bearer token' });
    }

    try {
      // Validate token
      const tokenInfo = await validateUserToken(token);
      if (tokenInfo.error) {
        return res.status(401).json({ error: tokenInfo.error });
      }

      // Find or create spreadsheet on server
      const spreadsheet = await findOrCreateSpreadsheet(token);
      return res.json({
        success: true,
        connected: true,
        email: tokenInfo.email,
        spreadsheet,
      });
    } catch (err: any) {
      console.error('API /api/sheets/verify error:', err);
      const isForbidden = String(err.message).includes('403') || String(err.message).includes('access_denied');
      return res.status(isForbidden ? 403 : 500).json({
        error: err.message || 'Failed to verify Google Sheets connection',
        isForbidden,
      });
    }
  });

  // 3. Check whether today's date already exists in Row 1
  app.post('/api/sheets/check-date', async (req: Request, res: Response) => {
    const token = getBearerToken(req);
    if (!token) {
      return res.status(401).json({ error: 'Missing or invalid Authorization Bearer token' });
    }

    const { spreadsheetId, dateStr } = req.body;
    if (!spreadsheetId || !dateStr) {
      return res.status(400).json({ error: 'spreadsheetId and dateStr are required' });
    }

    try {
      const checkResult = await checkDateInRow1(token, spreadsheetId, dateStr);
      return res.json({
        success: true,
        ...checkResult,
      });
    } catch (err: any) {
      console.error('API /api/sheets/check-date error:', err);
      return res.status(500).json({
        error: err.message || 'Failed to check date in spreadsheet',
      });
    }
  });

  // 4. Save Day Close column data (all 23 rows)
  app.post('/api/sheets/save-column', async (req: Request, res: Response) => {
    const token = getBearerToken(req);
    if (!token) {
      return res.status(401).json({ error: 'Missing or invalid Authorization Bearer token' });
    }

    const { spreadsheetId, columnLetter, dateStr, values, isUpdate } = req.body;
    if (!spreadsheetId || !columnLetter || !dateStr || !Array.isArray(values)) {
      return res.status(400).json({
        error: 'spreadsheetId, columnLetter, dateStr, and values array are required',
      });
    }

    if (values.length !== 23) {
      return res.status(400).json({
        error: `Expected exactly 23 row values, received ${values.length}`,
      });
    }

    try {
      const saveResult = await saveDayCloseColumn(
        token,
        spreadsheetId,
        columnLetter,
        dateStr,
        values,
        Boolean(isUpdate)
      );
      return res.json({
        success: true,
        ...saveResult,
      });
    } catch (err: any) {
      console.error('API /api/sheets/save-column error:', err);
      return res.status(500).json({
        error: err.message || 'Failed to write day close column',
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
