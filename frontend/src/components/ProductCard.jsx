import Link from "next/link";
import Image from "next/image";
import StarRating from "./StarRating";

export default function ProductCard({ product }) {
  return (
    <div className="border border-gray-200 rounded bg-white overflow-hidden flex flex-col">
      {product.image_url && (
        <Image
          src={product.image_url}
          alt={product.title}
          width={400}
          height={300}
          className="w-full h-40 sm:h-48 object-cover"
        />
      )}
      <div className="p-3 sm:p-4 flex flex-col flex-1">
        <h2 className="text-base sm:text-lg font-semibold mb-1 truncate">{product.title}</h2>
        <div className="flex flex-wrap items-center gap-1">
          <StarRating value={Math.round(product.average_rating)} />
          <span className="text-xs sm:text-sm text-gray-500">
            {product.average_rating.toFixed(1)} ({product.review_count} reviews)
          </span>
        </div>
        <div className="mt-auto pt-3">
          <Link
            href={`/products/${product.id}`}
            className="text-xs sm:text-sm text-blue-600 border border-blue-600 rounded px-2 sm:px-3 py-1 inline-block no-underline"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}
