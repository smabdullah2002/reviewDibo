"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { getProductDetail, createReview, updateReview, deleteReview } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import StarRating from "@/components/StarRating";
import ReviewCard from "@/components/ReviewCard";
import ReviewForm from "@/components/ReviewForm";

export default function ProductDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProduct = () => {
    getProductDetail(id)
      .then(setProduct)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(fetchProduct, [id]);

  const handleCreateReview = async (rating, comment) => {
    await createReview(Number(id), rating, comment);
    fetchProduct();
  };

  const handleUpdateReview = async (reviewId, rating, comment) => {
    await updateReview(reviewId, rating, comment);
    fetchProduct();
  };

  const handleDeleteReview = async (reviewId) => {
    await deleteReview(reviewId);
    fetchProduct();
  };

  if (loading) return <p className="text-gray-500">Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!product) return <p className="text-gray-500">Product not found.</p>;

  return (
    <div>
      <h1 className="text-xl sm:text-2xl font-bold mb-1 break-words">{product.title}</h1>
      {product.description && <p className="text-gray-600 mb-2 text-sm sm:text-base">{product.description}</p>}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <StarRating value={Math.round(product.average_rating)} />
        <span className="text-xs sm:text-sm text-gray-500">
          {product.average_rating.toFixed(1)} ({product.review_count} reviews)
        </span>
      </div>

      <h2 className="text-base sm:text-lg font-semibold mb-3">Reviews</h2>

      {user && (
        <ReviewForm onSubmit={handleCreateReview} />
      )}

      {!user && (
        <p className="text-xs sm:text-sm text-gray-500 mb-4">
          <a href="/login" className="text-blue-600">Log in</a> to leave a review.
        </p>
      )}

      {product.reviews.length === 0 ? (
        <p className="text-gray-500 text-xs sm:text-sm">No reviews yet.</p>
      ) : (
        product.reviews.map((review) => (
          <ReviewCard
            key={review.id}
            review={review}
            canEdit={user && (user.id === review.user_id || user.is_admin)}
            onUpdate={handleUpdateReview}
            onDelete={handleDeleteReview}
          />
        ))
      )}
    </div>
  );
}
