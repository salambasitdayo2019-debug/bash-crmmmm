import { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  getFirestore,
  collection,
  getDocs
} from "firebase/firestore";
import {
  getAuth,
  signOut,
  onAuthStateChanged
} from "firebase/auth";

// ------------------------------------------------------------------
// Firebase config – copy‑paste exactly what you already have
// ------------------------------------------------------------------
const firebaseConfig = {
  apiKey: "AIzaSyDPJPc2uE6E2wtUmtsrP5VWNWORmnG7x6Q",
  authDomain: "bash-crm-20898.firebaseapp.com",
  projectId: "bash-crm-20898",
  storageBucket: "bash-crm-20898.firebasestorage.app",
  messagingSenderId: "628581111391",
  appId: "1:628581111391:web:0f8af18589b9e4736d2dea",
  measurementId: "G-LM534K0F15"
};

const app = initializeApp(firebaseConfig);
if (typeof window !== "undefined") {
  // Analytics is optional; it will only run in the browser.
  getAnalytics(app);
}
const db = getFirestore(app);
const auth = getAuth(app);

// ------------------------------------------------------------------
// The **only** email address that may use the admin UI
// ------------------------------------------------------------------
const ADMIN_EMAIL = "salambasitdayo2019@gmail.com";

export default function Dashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  // ----------------------------------------------------------------
  // Listen for auth state changes – verify the user’s email
  // ----------------------------------------------------------------
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        // Not signed in – send to login page
        window.location.href = "/login";
        return;
      }

      // Is the signed‑in user the admin email?
      if (user.email === ADMIN_EMAIL) {
        // ✅ Authorized – fetch orders from Firestore
        const snapshot = await getDocs(collection(db, "orders"));
        const list = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));
        setOrders(list);
        setAuthorized(true);
      } else {
        // ❌ Signed‑in but not the admin email
        setAuthorized(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // ----------------------------------------------------------------
  // Update status via the existing Vercel API endpoint
  // ----------------------------------------------------------------
  const updateStatus = async (id, newStatus) => {
    await fetch("/api/update-status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId: id, newStatus })
    });
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o))
    );
  };

  // ----------------------------------------------------------------
  // Logout handler
  // ----------------------------------------------------------------
  const handleLogout = async () => {
    await signOut(auth);
    window.location.href = "/login";
  };

  // ----------------------------------------------------------------
  // UI rendering
  // ----------------------------------------------------------------
  if (loading) {
    return (
      <div className="container">
        <p className="text-center">Loading…</p>
      </div>
    );
  }

  if (!authorized) {
    return (
      <div className="container">
        <p className="text-center text-red-600">
          🚫 You are signed‑in but **do not have admin privileges**.
        </p>
        <button
          className="bg-primary text-white px-4 py-2 rounded mt-4"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    );
  }

  // ---------- Authorized admin view ----------
  return (
    <div className="container">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-secondary">
          BASH CRM Dashboard
        </h1>
        <button
          className="bg-primary text-white px-4 py-2 rounded"
          onClick={handleLogout}
        >
          Logout
        </button>
      </header>

      <table className="min-w-full bg-white rounded-lg overflow-hidden shadow">
        <thead className="bg-primary text-white">
          <tr>
            <th className="p-3 text-left">Order ID</th>
            <th className="p-3 text-left">Name</th>
            <th className="p-3 text-left">Email</th>
            <th className="p-3 text-left">Product</th>
            <th className="p-3 text-left">Qty</th>
            <th className="p-3 text-left">Status</th>
            <th className="p-3 text-left">Change</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id} className="border-b">
              <td className="p-3">{o.id}</td>
              <td className="p-3">{o.customerName}</td>
              <td className="p-3">{o.email}</td>
              <td className="p-3">{o.productId}</td>
              <td className="p-3">{o.quantity}</td>
              <td className="p-3">{o.status}</td>
              <td className="p-3">
                <select
                  value={o.status}
                  onChange={(e) => updateStatus(o.id, e.target.value)}
                  className="border rounded p-1"
                >
                  <option value="unconfirmed">unconfirmed</option>
                  <option value="confirmed">confirmed</option>
                  <option value="in_process">in_process</option>
                  <option value="delivered">delivered</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
