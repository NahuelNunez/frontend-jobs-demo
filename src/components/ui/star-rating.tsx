import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: "sm" | "md" | "lg";
  showNumber?: boolean;
  totalRatings?: number;
  className?: string;
}

export function StarRating({
  rating,
  maxRating = 5,
  size = "md",
  showNumber = true,
  totalRatings,
  className,
}: StarRatingProps) {
  const sizeClasses = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  const textSizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  // Redondear rating a 1 decimal
  const roundedRating = Math.round(rating * 10) / 10;

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <div className="flex items-center">
        {[...Array(maxRating)].map((_, index) => {
          const starValue = index + 1;
          const filled = starValue <= Math.round(rating);

          return (
            <Star
              key={index}
              className={cn(
                sizeClasses[size],
                filled
                  ? "text-yellow-500 fill-yellow-500"
                  : "text-gray-300 fill-gray-300"
              )}
            />
          );
        })}
      </div>
      {showNumber && (
        <span className={cn("font-semibold", textSizeClasses[size])}>
          {roundedRating}
        </span>
      )}
      {totalRatings !== undefined && (
        <span className={cn("text-muted-foreground", textSizeClasses[size])}>
          ({totalRatings})
        </span>
      )}
    </div>
  );
}

