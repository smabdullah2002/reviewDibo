"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getProducts, createProduct, deleteProduct } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

export default function Admin() {
  const { user } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");

  useEffect(() => {
    if (user && !user.is_admin) {
      router.push("/");
      return;
    }
    if (user) {
      getProducts()
        .then(setProducts)
        .catch((e) => setError(e.message))
        .finally(() => setLoading(false));
    }
  }, [user, router]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setCreateError("");
    setCreating(true);
    try {
      await createProduct(title, description, imageUrl || null);
      setTitle("");
      setDescription("");
      setImageUrl("");
      const updated = await getProducts();
      setProducts(updated);
    } catch (err) {
      setCreateError(err.message);
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this product? Its reviews will also be deleted.")) return;
    try {
      await deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  if (!user) return <p className="text-gray-500">Loading...</p>;
  if (!user.is_admin) return null;

  return (
    <div>
      <h1 className="text-xl sm:text-2xl font-bold mb-4">Admin Panel</h1>

      <div className="border border-gray-200 rounded bg-white p-3 sm:p-4 mb-6">
        <h2 className="text-sm sm:text-base font-semibold mb-3">Create Product</h2>
        <form onSubmit={handleCreate}>
          <div className="mb-2">
            <label className="block text-xs sm:text-sm font-medium mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full border border-gray-300 rounded px-2 sm:px-3 py-1.5 text-xs sm:text-sm"
            />
          </div>
          <div className="mb-2">
            <label className="block text-xs sm:text-sm font-medium mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="w-full border border-gray-300 rounded px-2 sm:px-3 py-1.5 text-xs sm:text-sm"
            />
          </div>
          <div className="mb-2">
            <label className="block text-xs sm:text-sm font-medium mb-1">Image URL</label>
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full border border-gray-300 rounded px-2 sm:px-3 py-1.5 text-xs sm:text-sm"
            />
          </div>
          {createError && <p className="text-red-500 text-xs sm:text-sm mb-2">{createError}</p>}
          <button
            type="submit"
            disabled={creating}
            className="bg-blue-600 text-white rounded px-3 sm:px-4 py-1 sm:py-1.5 text-xs sm:text-sm cursor-pointer disabled:opacity-50"
          >
            {creating ? "Creating..." : "Create Product"}
          </button>
        </form>
      </div>

      <div className="border border-gray-200 rounded bg-white p-3 sm:p-4">
        <h2 className="text-sm sm:text-base font-semibold mb-3">All Products ({products.length})</h2>
        {loading && <p className="text-gray-500 text-sm">Loading...</p>}
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {!loading && products.length === 0 && <p className="text-gray-500 text-sm">No products.</p>}
        {products.map((p) => (
          <div key={p.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-2 border-b border-gray-100 last:border-0 gap-1 sm:gap-0">
            <div className="flex flex-col sm:flex-row sm:items-center gap-0 sm:gap-2">
              <a href={`/products/${p.id}`} className="text-blue-600 text-xs sm:text-sm font-medium no-underline break-words">
                {p.title}
              </a>
              <span className="text-xs text-gray-400">
                {p.average_rating.toFixed(1)} ★ ({p.review_count} reviews)
              </span>
            </div>
            <button
              onClick={() => handleDelete(p.id)}
              className="text-xs text-red-500 border border-red-300 rounded px-2 py-0.5 cursor-pointer bg-white self-start sm:self-auto"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
