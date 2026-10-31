"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "../../lib/supabase";

type Product = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  currency: string;
  product_type: string;
  stock_quantity: number;
  category_id: string | null;
  image_url: string | null;
  is_active: boolean;
};

type Category = {
  id: string;
  name: string;
};

export default function ProductsPage() {
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [productType, setProductType] = useState("ready_stock");
  const [stock, setStock] = useState("0");
  const [imageFile, setImageFile] = useState<File | null>(null);
  useEffect(() => {
    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser();

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

      const [productResult, categoryResult] = await Promise.all([
        supabase.from("products").select("*").order("created_at", {
          ascending: false,
        }),
        supabase.from("categories").select("id, name").order("name"),
      ]);

      if (productResult.error) setError(productResult.error.message);
      else setProducts((productResult.data ?? []) as Product[]);

      if (categoryResult.error) setError(categoryResult.error.message);
      else setCategories((categoryResult.data ?? []) as Category[]);

      setLoading(false);
    }

    loadData();
  }, [router]);

  function resetForm() {
    setName("");
    setDescription("");
    setPrice("");
    setCategoryId("");
    setProductType("ready_stock");
    setStock("0");
    setImageUrl("");
    setImageFile(null);
    setEditingId(null);
    setError("");
  }

  function editProduct(product: Product) {
    setEditingId(product.id);
    setName(product.name);
    setDescription(product.description ?? "");
    setPrice(String(product.price));
    setCategoryId(product.category_id ?? "");
    setProductType(product.product_type);
    setStock(String(product.stock_quantity));
    setImageUrl(product.image_url ?? "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function saveProduct(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError("");

    let uploadedImageUrl = imageUrl || null;

if (imageFile) {
  const fileName = `${Date.now()}-${imageFile.name.replace(/[^a-zA-Z0-9.-]/g, "-")}`;

  const { error: uploadError } = await supabase.storage
    .from("product-images")
    .upload(fileName, imageFile, {
      cacheControl: "3600",
      upsert: false,
      contentType: imageFile.type,
    });

  if (uploadError) {
    setError(uploadError.message);
    setSaving(false);
    return;
  }

  const { data: publicUrlData } = supabase.storage
    .from("product-images")
    .getPublicUrl(fileName);

  uploadedImageUrl = publicUrlData.publicUrl;
}

const productData = {
  name,
  description,
  price: Number(price),
  currency: "GHS",
  category_id: categoryId || null,
  product_type: productType,
  stock_quantity: Number(stock),
  image_url: uploadedImageUrl,
};
    const result = editingId
      ? await supabase.from("products").update(productData).eq("id", editingId)
      : await supabase.from("products").insert(productData);

    setSaving(false);

    if (result.error) {
      setError(result.error.message);
      return;
    }

    resetForm();

    const { data } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    setProducts((data ?? []) as Product[]);
  }

  async function deleteProduct(id: string) {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", id);

    if (error) {
      setError(error.message);
      return;
    }

    setProducts(products.filter((product) => product.id !== id));
  }

  if (loading) {
    return <main style={styles.page}>Loading products...</main>;
  }

  return (
    <main style={styles.page}>
      <header style={styles.header}>
        <h1>SAMMEX <span style={{ color: "#d6b15d" }}>IMPORTS</span></h1>
        <Link href="/admin" style={styles.backButton}>Dashboard</Link>
      </header>

      <h2>Product Management</h2>
      <p>Add and manage products in your Sammex Imports store.</p>

      <form onSubmit={saveProduct} style={styles.form}>
        <h3>{editingId ? "Edit Product" : "Add New Product"}</h3>

        <label>Product Name</label>
        <input required value={name} onChange={e => setName(e.target.value)} style={styles.input} />

        <label>Description</label>
        <textarea value={description} onChange={e => setDescription(e.target.value)} style={styles.input} />

        <label>Price (GHS)</label>
        <input required type="number" min="0" step="0.01" value={price} onChange={e => setPrice(e.target.value)} style={styles.input} />

        <label>Category</label>
        <select value={categoryId} onChange={e => setCategoryId(e.target.value)} style={styles.input}>
          <option value="">Choose a category</option>
          {categories.map(category => (
            <option key={category.id} value={category.id}>{category.name}</option>
          ))}
        </select>

        <label>Product Type</label>
        <select value={productType} onChange={e => setProductType(e.target.value)} style={styles.input}>
          <option value="ready_stock">Ready Stock</option>
          <option value="pre_order">Pre-order</option>
        </select>

        <label>Stock Quantity</label>
        <input type="number" min="0" value={stock} onChange={e => setStock(e.target.value)} style={styles.input} />

        <label>Product Image URL</label>
        <input type="url" value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="Paste image link here" style={styles.input} />

        {error && <p style={styles.error}>{error}</p>}

        <button disabled={saving} type="submit" style={styles.saveButton}>
          {saving ? "Saving..." : editingId ? "Update Product" : "Add Product"}
        </button>

        {editingId && (
          <button type="button" onClick={resetForm} style={styles.cancelButton}>
            Cancel Editing
          </button>
        )}
      </form>

      <h2>Your Products ({products.length})</h2>

      {products.length === 0 && <p>No products added yet.</p>}

      {products.map(product => (
        <div key={product.id} style={styles.product}>
          {product.image_url && (
            <img src={product.image_url} alt={product.name} style={styles.image} />
          )}
          <h3>{product.name}</h3>
          <p>GH₵ {Number(product.price).toFixed(2)}</p>
          <p>{product.product_type === "pre_order" ? "Pre-order" : "Ready Stock"}</p>
          <p>Stock: {product.stock_quantity}</p>
          <button onClick={() => editProduct(product)} style={styles.editButton}>Edit</button>
          <button onClick={() => deleteProduct(product.id)} style={styles.deleteButton}>Delete</button>
        </div>
      ))}
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
    borderBottom: "1px solid #444",
    paddingBottom: 18,
  },
  form: {
    background: "#191919",
    border: "1px solid #b89548",
    borderRadius: 12,
    padding: 20,
    marginTop: 25,
    marginBottom: 35,
    display: "grid",
    gap: 12,
  },
  input: {
    width: "100%",
    padding: 12,
    background: "#252525",
    color: "white",
    border: "1px solid #555",
    borderRadius: 7,
  },
  saveButton: {
    background: "#d6b15d",
    color: "#090909",
    padding: 14,
    border: 0,
    borderRadius: 8,
    fontWeight: "bold",
  },
  backButton: {
    color: "#d6b15d",
    textDecoration: "none",
  },
  product: {
    background: "#191919",
    border: "1px solid #444",
    borderRadius: 10,
    padding: 18,
    marginTop: 15,
  },
  image: {
    width: 110,
    height: 110,
    objectFit: "cover",
    borderRadius: 8,
  },
  editButton: {
    background: "#d6b15d",
    padding: "10px 16px",
    border: 0,
    borderRadius: 6,
    marginRight: 10,
  },
  deleteButton: {
    background: "#a83232",
    color: "white",
    padding: "10px 16px",
    border: 0,
    borderRadius: 6,
  },
  cancelButton: {
    padding: 12,
    background: "#444",
    color: "white",
    border: 0,
    borderRadius: 7,
  },
  error: {
    color: "#ff7777",
  },
};
