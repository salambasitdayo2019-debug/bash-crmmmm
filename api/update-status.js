// File: api/update-status.js
// Deploy with Vercel (free tier). Expects JSON body { orderId, newStatus }.
// Uses Firebase Admin SDK – the service account key should be stored as VERCEL env var FIREBASE_SERVICE_ACCOUNT (JSON string).

const admin = require('firebase-admin');

if (!admin.apps.length) {
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT || '{}');
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const { orderId, newStatus } = req.body;
  if (!orderId || !newStatus) {
    return res.status(400).json({ error: 'orderId and newStatus required' });
  }
  try {
    const orderRef = db.collection('orders').doc(orderId);
    await orderRef.update({
      status: newStatus,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    return res.status(200).json({ success: true });
  } catch (e) {
    console.error('Update failed', e);
    return res.status(500).json({ error: e.message });
  }
}
