import { Tag } from "@/types/tags-categories";
import { cn } from "@/lib/utils";

interface TagBadgeProps {
  tag: Tag;
  className?: string;
  variant?: "default" | "outline" | "secondary";
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
}

export function TagBadge({
  tag,
  className,
  variant = "default",
  size = "md",
  onClick,
}: TagBadgeProps) {
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
    "inline-flex items-center rounded-full font-medium transition-colors";

  const style =
    variant === "default"
      ? { backgroundColor: tag.color }
      : variant === "outline"
      ? { borderColor: tag.color, color: tag.color }
      : { backgroundColor: `${tag.color}33`, color: tag.color };

  return (
    <span
      className={cn(
        baseClasses,
        sizeClasses[size],
        variantClasses[variant],
        onClick && "cursor-pointer hover:opacity-80",
        className
      )}
      style={style}
      onClick={onClick}
      title={tag.description}
    >
      {tag.name}
    </span>
  );
}
