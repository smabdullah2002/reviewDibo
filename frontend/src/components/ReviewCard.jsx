import StarRating from "./StarRating";
import { useState } from "react";
import ReviewForm from "./ReviewForm";

export default function ReviewCard({ review, canEdit, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false);

  if (editing) {
    return (
      <div className="border border-gray-200 rounded bg-white p-3 sm:p-4 mb-2">
        <ReviewForm
          initialRating={review.rating}
          initialComment={review.comment}
          onSubmit={(rating, comment) =>
            onUpdate(review.id, rating, comment).then(() => setEditing(false))
          }
          onCancel={() => setEditing(false)}
        />
      </div>
    );
  }

  return (
    <div className="border border-gray-200 rounded bg-white p-3 sm:p-4 mb-2">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-1">
        <span className="font-medium text-xs sm:text-sm truncate">{review.user.name}</span>
        <div className="flex flex-wrap items-center gap-1 sm:gap-2">
          <StarRating value={review.rating} />
          {canEdit && (
            <div className="flex gap-1">
              <button
                onClick={() => setEditing(true)}
                className="text-xs text-gray-500 border border-gray-300 rounded px-1.5 sm:px-2 py-0.5 cursor-pointer bg-white"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(review.id)}
                className="text-xs text-red-500 border border-red-300 rounded px-1.5 sm:px-2 py-0.5 cursor-pointer bg-white"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
      {review.comment && <p className="text-xs sm:text-sm text-gray-700 mt-1 break-words">{review.comment}</p>}
    </div>
  );
}
