import React from "react";
import { Star, StarHalf } from "lucide-react";

interface RatingStarsProps {
  rating: number | string | null;
  count?: number;
  size?: "sm" | "md" | "lg";
}

export const RatingStars: React.FC<RatingStarsProps> = ({
  rating,
  count,
  size = "sm",
}) => {
  const numRating = rating ? parseFloat(rating.toString()) : 0;
  if (numRating <= 0) return null;

  const fullStars = Math.floor(numRating);
  const hasHalfStar = numRating - fullStars >= 0.25 && numRating - fullStars < 0.75;
  const roundedFullStars = numRating - fullStars >= 0.75 ? fullStars + 1 : fullStars;
  const emptyStars = Math.max(0, 5 - roundedFullStars - (hasHalfStar ? 1 : 0));

  const sizeClass =
    size === "sm" ? "w-3.5 h-3.5" : size === "md" ? "w-4.5 h-4.5" : "w-5 h-5";

  return (
    <div
      className="flex items-center gap-1"
      aria-label={`Rating: ${numRating.toFixed(1)} out of 5 stars`}
      role="img"
    >
      <div className="flex gap-0.5 text-yellow-400 fill-yellow-400">
        {Array.from({ length: roundedFullStars }).map((_, i) => (
          <Star key={`full-${i}`} className={`${sizeClass} fill-current`} />
        ))}
        {hasHalfStar && <StarHalf className={`${sizeClass} fill-current`} />}
        {Array.from({ length: emptyStars }).map((_, i) => (
          <Star key={`empty-${i}`} className={`${sizeClass} text-muted/30`} />
        ))}
      </div>
      {count !== undefined && (
        <span className="text-xs font-semibold text-muted-foreground ml-1">
          ({count.toLocaleString()})
        </span>
      )}
    </div>
  );
};
