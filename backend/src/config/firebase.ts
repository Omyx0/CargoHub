import { initializeApp, cert, getApps, getApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getDatabase } from 'firebase-admin/database';

// Parse the private key intelligently
let privateKey = process.env.FIREBASE_PRIVATE_KEY || '';

// If the key is just raw base64 without headers or newlines
if (privateKey && !privateKey.includes('BEGIN PRIVATE KEY')) {
  // Remove any whitespace or literal \n
  const cleanKey = privateKey.replace(/\\n/g, '').replace(/\s+/g, '').replace(/^"|"$/g, '');
  // Chunk into 64 characters
  const matched = cleanKey.match(/.{1,64}/g);
  if (matched) {
    privateKey = `-----BEGIN PRIVATE KEY-----\n${matched.join('\n')}\n-----END PRIVATE KEY-----\n`;
  }
} else {
  // If it already has headers, just ensure newlines are processed
  if (privateKey.includes('\\n')) {
    privateKey = privateKey.replace(/\\n/g, '\n');
  }
  privateKey = privateKey.replace(/^"|"$/g, '');
}

let app;

try {
  if (!getApps().length) {
    if (process.env.FIREBASE_PROJECT_ID && privateKey) {
      app = initializeApp({
        credential: cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey,
        }),
        databaseURL: process.env.FIREBASE_DATABASE_URL,
      });
      console.log('Firebase Admin SDK initialized successfully.');
    } else {
      console.warn('Firebase config missing. Initializing dummy app for test mode.');
      app = initializeApp({ projectId: 'mock-project' });
    }
  } else {
    app = getApp();
  }
} catch (error) {
  console.error('Firebase Admin SDK initialization error', error);
}

export const auth = app ? getAuth(app) : null;
export const rtdb = app ? getDatabase(app) : null;

