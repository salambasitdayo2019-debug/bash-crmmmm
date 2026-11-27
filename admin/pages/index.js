import { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { getAuth, signOut } from "firebase/auth";

// ------------------------------------------------------------------
// Your Firebase configuration (copied from the script you provided)
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

// ------------------------------------------------------------------
// Initialise Firebase (App, Firestore, Auth, Analytics)
// ------------------------------------------------------------------
const app = initializeApp(firebaseConfig);
const analytics = typeof window !== "undefined" ? getAnalytics(app) : null; // safe for SSR
const db = getFirestore(app);
const auth = getAuth(app);

export default function Dashboard() {
  const [orders, setOrders] = useState([]);

  // ----------------------------------------------------------------
  // Load orders from Firestore
  // ----------------------------------------------------------------
  useEffect(() => {
    async function fetchOrders() {
      const snapshot = await getDocs(collection(db, "orders"));
      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setOrders(list);
    }
    fetchOrders();
  }, []);

  // ----------------------------------------------------------------
  // Update order status via the Vercel serverless function
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
  // Sign‑out the admin
  // ----------------------------------------------------------------
  const handleLogout = async () => {
    await signOut(auth);
    window.location.href = "/login";
  };

  // ----------------------------------------------------------------
  // UI (Tailwind‑styled)
  // ----------------------------------------------------------------
  return (
    <div className="container">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-secondary">
          BASH CRM Dashboard
        </h1>
        <button className="bg-primary text-white px-4 py-2 rounded" onClick={handleLogout}>
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
