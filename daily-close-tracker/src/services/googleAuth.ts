/**
 * Google Workspace OAuth Authentication Service.
 * Uses Google AI Studio's native Google Identity Services (GIS) token client.
 * No custom OAuth client or Firebase popup OAuth.
 * All tokens are cached purely in-memory.
 */

import firebaseConfig from '../../firebase-applet-config.json';
import { AuthErrorInfo, SpreadsheetInfo } from '../types';

export const CLIENT_ID = firebaseConfig.oAuthClientId;

export const SCOPES = [
  'https://www.googleapis.com/auth/spreadsheets',
  'https://www.googleapis.com/auth/drive.file',
];

declare global {
  interface Window {
    google?: any;
  }
}

let cachedAccessToken: string | null = null;
let cachedUserEmail: string | null = null;
let isAuthorizing = false;

export interface GoogleAuthResult {
  accessToken: string;
  email?: string;
  spreadsheet?: SpreadsheetInfo;
}

/**
 * Returns currently cached in-memory access token.
 */
export const getAccessToken = async (): Promise<string | null> => {
  return cachedAccessToken;
};

export const setAccessToken = (token: string | null) => {
  cachedAccessToken = token;
};

export const getCachedEmail = (): string | null => {
  return cachedUserEmail;
};

export const signOutUser = async () => {
  if (cachedAccessToken && typeof window !== 'undefined' && window.google?.accounts?.oauth2?.revoke) {
    try {
      window.google.accounts.oauth2.revoke(cachedAccessToken, () => {
        console.log('Google token revoked');
      });
    } catch (e) {
      console.warn('Token revocation notice:', e);
    }
  }
  cachedAccessToken = null;
  cachedUserEmail = null;
};

/**
 * Helper to check if the error is due to the user closing or cancelling the popup.
 */
export function isPopupCancelled(error: any): boolean {
  const errMsg = String(error?.message || error?.type || error || '').toLowerCase();
  return (
    errMsg.includes('popup_closed') ||
    errMsg.includes('popup window closed') ||
    errMsg.includes('cancelled') ||
    errMsg.includes('user_cancel') ||
    errMsg.includes('popup_closed_by_user')
  );
}

/**
 * Helper to check if the popup was blocked by the browser.
 */
export function isPopupBlocked(error: any): boolean {
  const errMsg = String(error?.message || error?.type || error || '').toLowerCase();
  return (
    errMsg.includes('popup_failed_to_open') ||
    errMsg.includes('popup_blocked') ||
    errMsg.includes('blocked')
  );
}

/**
 * Parses Google Workspace OAuth errors to provide precise, user-friendly guidance.
 */
export function parseAuthError(error: any): AuthErrorInfo {
  const errMsg = String(error?.message || error?.error || error || '');
  const isAccessDenied =
    errMsg.includes('403') ||
    errMsg.includes('access_denied') ||
    errMsg.includes('verification process') ||
    errMsg.includes('developer-approved') ||
    errMsg.includes('unverified');

  const projectId = firebaseConfig.projectId || 'gen-lang-client-0132572263';

  if (isAccessDenied) {
    return {
      title: 'Google Authorization Action Needed (403: access_denied)',
      message:
        'Google Workspace (Sheets & Drive) requires approval for the Cloud project: ' +
        projectId +
        '. In Google Cloud, projects with sensitive scopes in "Testing" mode require your email to be added to Test Users or the app to be published.',
      projectId,
      userEmail: cachedUserEmail || 'karuneshbabber.38612@gmail.com',
      steps: [
        '1. In Google AI Studio: ensure Google Workspace / Sheets permissions were accepted.',
        '2. In Google Cloud Console (APIs & Services > OAuth consent screen):',
        '   • Confirm project is ' + projectId,
        '   • Under "Test users", click "+ ADD USERS" and add: karuneshbabber.38612@gmail.com',
        '   • Or click "PUBLISH APP" to allow access.',
        '3. Click "Connect Google Sheets" to connect directly.',
      ],
    };
  }

  if (isPopupBlocked(error)) {
    return {
      title: 'Sign-in Popup Blocked',
      message: 'Your browser or the preview iframe blocked the Google sign-in window.',
      projectId,
      steps: [
        '1. Allow popups for this site in your browser address bar settings.',
        '2. If you are inside the AI Studio preview iframe, open the app in a new browser tab using the top-right button.',
        '3. Click "Connect Google Sheets" again to sign in.',
      ],
    };
  }

  if (isPopupCancelled(error)) {
    return {
      title: 'Authorization Window Closed',
      message: 'The Google Sign-In window was closed. Connect whenever you are ready.',
      projectId,
      steps: ['Click "Connect Google Sheets" whenever you are ready to authorize.'],
    };
  }

  return {
    title: 'Google Sheets Connection Error',
    message: errMsg || 'Unable to complete Google Workspace authorization.',
    projectId,
    steps: [
      'Ensure popups are enabled in your browser.',
      'Verify your network connection and click "Connect Google Sheets" again.',
    ],
  };
}

/**
 * Initializes Google Identity Services (GIS) token client and requests an OAuth token.
 */
export const signInWithGoogle = async (): Promise<GoogleAuthResult> => {
  if (isAuthorizing) {
    throw new Error('Authorization is already in progress');
  }

  isAuthorizing = true;

  try {
    // 1. Wait for Google Identity Services script to be available on window
    let retries = 0;
    while ((!window.google || !window.google.accounts || !window.google.accounts.oauth2) && retries < 20) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      retries++;
    }

    if (!window.google?.accounts?.oauth2?.initTokenClient) {
      throw new Error('Google Identity Services client is not loaded. Please refresh the page.');
    }

    // 2. Request token using official GIS client
    const tokenResult = await new Promise<{ access_token: string }>((resolve, reject) => {
      try {
        const client = window.google.accounts.oauth2.initTokenClient({
          client_id: CLIENT_ID,
          scope: SCOPES.join(' '),
          prompt: '',
          callback: (response: any) => {
            if (response.error) {
              reject(new Error(response.error_description || response.error));
              return;
            }
            if (response.access_token) {
              resolve({ access_token: response.access_token });
            } else {
              reject(new Error('No access token returned from Google.'));
            }
          },
          error_callback: (err: any) => {
            const message = err?.message || err?.type || 'Popup window closed';
            const error = new Error(message);
            (error as any).type = err?.type || 'popup_closed';
            reject(error);
          },
        });

        client.requestAccessToken();
      } catch (err) {
        reject(err);
      }
    });

    const accessToken = tokenResult.access_token;
    cachedAccessToken = accessToken;

    // 3. Real server-side verification: Call /api/sheets/verify to test real Google Sheets API
    const verifyRes = await fetch('/api/sheets/verify', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!verifyRes.ok) {
      const errData = await verifyRes.json().catch(() => ({}));
      const errorMsg = errData.error || `Server verification failed with status ${verifyRes.status}`;
      throw new Error(errorMsg);
    }

    const verifyData = await verifyRes.json();
    cachedUserEmail = verifyData.email || 'karuneshbabber.38612@gmail.com';

    return {
      accessToken,
      email: cachedUserEmail,
      spreadsheet: verifyData.spreadsheet,
    };
  } finally {
    isAuthorizing = false;
  }
};
