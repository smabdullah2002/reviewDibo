import { useState } from "react";
import StarRating from "./StarRating";

export default function ReviewForm({ initialRating = 5, initialComment = "", onSubmit, onCancel }) {
  const [rating, setRating] = useState(initialRating);
  const [comment, setComment] = useState(initialComment);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit(rating, comment);
      if (!initialRating) {
        setRating(5);
        setComment("");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border border-gray-200 rounded bg-white p-3 sm:p-4 mb-4">
      <div className="mb-3">
        <label className="block text-xs sm:text-sm font-medium mb-1">Rating</label>
        <StarRating value={rating} onChange={setRating} />
      </div>
      <div className="mb-3">
        <label className="block text-xs sm:text-sm font-medium mb-1">Comment</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={3}
          className="w-full border border-gray-300 rounded px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm"
        />
      </div>
      <div className="flex flex-wrap gap-2">
        <button
          type="submit"
          disabled={submitting}
          className="bg-blue-600 text-white rounded px-3 sm:px-4 py-1 sm:py-1.5 text-xs sm:text-sm cursor-pointer disabled:opacity-50"
        >
          {submitting ? "Submitting..." : "Submit"}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="border border-gray-300 rounded px-3 sm:px-4 py-1 sm:py-1.5 text-xs sm:text-sm cursor-pointer bg-white"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
