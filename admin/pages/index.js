import { useEffect, useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, updateDoc, serverTimestamp } from 'firebase/firestore';

// TODO: replace with your Firebase config (same as in order form)
const firebaseConfig = {
  apiKey: "<YOUR_API_KEY>",
  authDomain: "<YOUR_PROJECT>.firebaseapp.com",
  projectId: "<YOUR_PROJECT>"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default function Dashboard() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    async function fetchOrders() {
      const snapshot = await getDocs(collection(db, 'orders'));
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setOrders(list);
    }
    fetchOrders();
  }, []);

  const updateStatus = async (id, newStatus) => {
    // Call Vercel function to safely update
    await fetch('/api/update-status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId: id, newStatus })
    });
    // Refresh list
    setOrders(prev => prev.map(o => (o.id === id ? { ...o, status: newStatus } : o)));
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>BASH CRM Dashboard</h1>
      <table border="1" cellPadding="5" style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Product</th>
            <th>Qty</th>
            <th>Status</th>
            <th>Change</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(o => (
            <tr key={o.id}>
              <td>{o.id}</td>
              <td>{o.customerName}</td>
              <td>{o.email}</td>
              <td>{o.productId}</td>
              <td>{o.quantity}</td>
              <td>{o.status}</td>
              <td>
                <select
                  value={o.status}
                  onChange={e => updateStatus(o.id, e.target.value)}
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
