import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface RatingInputProps {
  value: number;
  onChange: (rating: number) => void;
  maxRating?: number;
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  className?: string;
}

export function RatingInput({
  value,
  onChange,
  maxRating = 5,
  size = "md",
  disabled = false,
  className,
}: RatingInputProps) {
  const [hoverValue, setHoverValue] = useState<number | null>(null);

  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-10 h-10",
  };

  const handleClick = (rating: number) => {
    if (!disabled) {
      onChange(rating);
    }
  };

  const handleMouseEnter = (rating: number) => {
    if (!disabled) {
      setHoverValue(rating);
    }
  };

  const handleMouseLeave = () => {
    setHoverValue(null);
  };

  return (
    <div className={cn("flex items-center gap-1", className)}>
      {[...Array(maxRating)].map((_, index) => {
        const starValue = index + 1;
        const filled = hoverValue !== null ? starValue <= hoverValue : starValue <= value;

        return (
          <button
            key={index}
            type="button"
            onClick={() => handleClick(starValue)}
            onMouseEnter={() => handleMouseEnter(starValue)}
            onMouseLeave={handleMouseLeave}
            disabled={disabled}
            className={cn(
              "transition-all",
              !disabled && "hover:scale-110 cursor-pointer",
              disabled && "cursor-not-allowed opacity-50"
            )}
          >
            <Star
              className={cn(
                sizeClasses[size],
                filled
                  ? "text-yellow-500 fill-yellow-500"
                  : "text-gray-300 fill-gray-300"
              )}
            />
          </button>
        );
      })}
      {value > 0 && (
        <span className="ml-2 font-semibold text-sm">
          {value} de {maxRating}
        </span>
      )}
    </div>
  );
}

