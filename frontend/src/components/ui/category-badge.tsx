import { Category } from "@/types/tags-categories";
import { cn } from "@/lib/utils";

interface CategoryBadgeProps {
  category: Category | undefined;
  className?: string;
  variant?: "default" | "outline" | "secondary";
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
}

export function CategoryBadge({
  category,
  className,
  variant = "default",
  size = "md",
  onClick,
}: CategoryBadgeProps) {
  if (!category) {
    return null;
  }

  const sizeClasses = {
    sm: "px-2 py-1 text-xs",
    md: "px-2.5 py-1.5 text-sm",
    lg: "px-3 py-2 text-base",
  };

  const variantClasses = {
    default: "text-white border-transparent",
    outline: "border-2 bg-transparent",
    secondary: "bg-opacity-20 border-transparent",
  };

  const baseClasses =
    "inline-flex items-center rounded-lg font-medium transition-colors";

  return (
    <span
      className={cn(
        baseClasses,
        sizeClasses[size],
        variantClasses[variant],
        onClick && "cursor-pointer hover:opacity-80",
        "bg-gray-200 font-medium text-gray-800",
        className
      )}
      onClick={onClick}
      title={category.description}
    >
      {category.name}
    </span>
  );
}
