// File: admin/lib/firebaseAdmin.js
// This module initializes the Firebase Admin SDK for server‑side code (Next.js API routes, Vercel functions).
// The service account JSON must be stored in the VERCEL environment variable
// `FIREBASE_SERVICE_ACCOUNT`. Vercel automatically injects it at build/runtime.

import admin from 'firebase-admin';

if (!admin.apps.length) {
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT || '{}');
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

export const db = admin.firestore();
export const auth = admin.auth();
