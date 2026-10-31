"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";
export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [counts, setCounts] = useState({
    products: 0,
    orders: 0,
    categories: 0,
  });

  useEffect(() => {
    async function loadDashboard() {
      const { data: { user } } =
        await supabase.auth.getUser();

      if (!user) {
        router.replace("/admin/login");
        return;
      }

      const { data: isAdmin, error: adminError } =
        await supabase.rpc("is_sammex_admin");

      if (adminError || !isAdmin) {
        await supabase.auth.signOut();
        router.replace("/admin/login");
        return;
      }

      const [products, orders, categories] =
        await Promise.all([
          supabase.from("products").select("id", {
            count: "exact", head: true
          }),
          supabase.from("orders").select("id", {
            count: "exact", head: true
          }),
          supabase.from("categories").select("id", {
            count: "exact", head: true
          }),
        ]);

      setCounts({
        products: products.count ?? 0,
        orders: orders.count ?? 0,
        categories: categories.count ?? 0,
      });

      setLoading(false);
    }

    loadDashboard();
  }, [router]);

  async function logout() {
    await supabase.auth.signOut();
    router.replace("/admin/login");
  }

  if (loading) {
    return <main style={styles.page}>Loading Sammex Dashboard...</main>;
  }

  return (
    <main style={styles.page}>
      <header style={styles.header}>
        <h1>SAMMEX <span style={{color:"#d6b15d"}}>IMPORTS</span></h1>
        <button onClick={logout} style={styles.button}>
          Logout
        </button>
      </header>

      <h2>Owner Dashboard</h2>
      <p>Welcome to your Sammex Imports store management.</p>

      {error && <p>{error}</p>}

      <div style={styles.grid}>
        {[
          ["Products", counts.products],
          ["Orders", counts.orders],
          ["Categories", counts.categories],
        ].map(([name, value]) => (
          <div key={name} style={styles.card}>
            <h3>{name}</h3>
            <strong>{value}</strong>
          </div>
        ))}
      </div>

      <h2>Store Management</h2>
      <p>Product management and order management will be added next.</p>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "#090909",
    color: "white",
    padding: 24,
    fontFamily: "Arial, sans-serif",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 12,
    borderBottom: "1px solid #444",
    paddingBottom: 20,
  },
  button: {
    background: "#d6b15d",
    color: "#090909",
    padding: "12px 20px",
    border: 0,
    borderRadius: 8,
    fontWeight: "bold",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
    gap: 16,
    marginTop: 25,
    marginBottom: 35,
  },
  card: {
    background: "#191919",
    border: "1px solid #b89548",
    borderRadius: 12,
    padding: 22,
  },
};
