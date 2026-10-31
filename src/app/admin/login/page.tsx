"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { data, error } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    if (data.user) {
      router.push("/admin");
    }
  }

  return (
    <main style={{
      minHeight: "100vh",
      background: "#080808",
      color: "#fff",
      display: "grid",
      placeItems: "center",
      padding: 24
    }}>
      <form onSubmit={handleLogin} style={{
        width: "100%",
        maxWidth: 420,
        padding: 30,
        background: "#171717",
        border: "1px solid #b89548",
        borderRadius: 16
      }}>
        <h1 style={{color: "#d6b15d"}}>
          SAMMEX IMPORTS
        </h1>
        <h2>Owner Login</h2>
        <p>Sign in to manage your store.</p>

        <label>Email address</label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          style={fieldStyle}
        />

        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          style={fieldStyle}
        />

        {error && <p style={{color: "#ff7777"}}>{error}</p>}

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: 14,
            marginTop: 20,
            background: "#d6b15d",
            color: "#080808",
            fontWeight: "bold",
            border: 0,
            borderRadius: 8
          }}
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </main>
  );
}

const fieldStyle = {
  display: "block",
  width: "100%",
  padding: 12,
  marginTop: 8,
  marginBottom: 18,
  background: "#252525",
  color: "white",
  border: "1px solid #555",
  borderRadius: 8
};
