import { useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { initializeApp } from "firebase/app";

// ------------------------------------------------------------------
// Same Firebase configuration as the dashboard
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
const auth = getAuth(app);

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // after successful sign‑in go to the dashboard
      window.location.href = "/";
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container max-w-sm">
      <h2 className="text-2xl font-bold text-center mb-4">Admin login</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full border rounded p-2"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full border rounded p-2"
        />
        <button
          type="submit"
          className="w-full bg-primary text-white py-2 rounded hover:bg-secondary"
        >
          Login
        </button>
        {error && <p className="text-red-600 mt-2">{error}</p>}
      </form>
    </div>
  );
}
