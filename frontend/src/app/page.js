"use client";

import { useState, useEffect } from "react";
import { getProducts } from "@/lib/api";
import ProductCard from "@/components/ProductCard";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [minRating, setMinRating] = useState("");

  useEffect(() => {
    getProducts()
      .then(setProducts)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = products.filter((p) => {
    if (search && !p.title.toLowerCase().includes(search.toLowerCase())) return false;
    if (minRating && p.average_rating < parseFloat(minRating)) return false;
    return true;
  });

  return (
    <div>
      <h1 className="text-xl sm:text-2xl font-bold mb-4">Products</h1>

      <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mb-6">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded px-3 py-1.5 text-sm flex-1"
        />
        <select
          value={minRating}
          onChange={(e) => setMinRating(e.target.value)}
          className="border border-gray-300 rounded px-3 py-1.5 text-sm w-full sm:w-auto"
        >
          <option value="">All ratings</option>
          <option value="4">4+ stars</option>
          <option value="3">3+ stars</option>
          <option value="2">2+ stars</option>
        </select>
      </div>

      {loading && <p className="text-gray-500 text-sm sm:text-base">Loading...</p>}
      {error && <p className="text-red-500 text-sm sm:text-base">{error}</p>}

      {!loading && !error && filtered.length === 0 && (
        <p className="text-gray-500 text-sm sm:text-base">No products found.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {filtered.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}
