import { Achievement } from "@/types/achievement";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface AchievementBadgeProps {
  achievement: Achievement;
  size?: "sm" | "md" | "lg";
  showDetails?: boolean;
}

export function AchievementBadge({
  achievement,
  size = "md",
  showDetails = true,
}: AchievementBadgeProps) {
  const isEarned = !!achievement.earnedAt;

  const sizeClasses = {
    sm: "w-16 h-16 text-2xl",
    md: "w-20 h-20 text-3xl",
    lg: "w-24 h-24 text-4xl",
  };

  return (
    <Card
      className={cn(
        "transition-all duration-200 hover:scale-105",
        isEarned
          ? "bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200 shadow-md"
          : "bg-gray-50 border-gray-200 opacity-60",
        !showDetails && "p-2"
      )}
    >
      <CardContent className={cn("p-3", !showDetails && "p-2")}>
        <div className="flex flex-col items-center space-y-2">
          <div
            className={cn(
              "flex items-center justify-center rounded-full border-2 transition-all",
              sizeClasses[size],
              isEarned
                ? "bg-gradient-to-br from-yellow-100 to-orange-100 border-yellow-300"
                : "bg-gray-100 border-gray-300"
            )}
          >
            <span className={cn("filter", !isEarned && "grayscale")}>
              {achievement.icon}
            </span>
          </div>

          {showDetails && (
            <>
              <h3
                className={cn(
                  "font-semibold text-center text-sm leading-tight",
                  isEarned ? "text-gray-900" : "text-gray-500"
                )}
              >
                {achievement.name}
              </h3>

              <p
                className={cn(
                  "text-xs text-center leading-tight",
                  isEarned ? "text-gray-600" : "text-gray-400"
                )}
              >
                {achievement.description}
              </p>

              <Badge
                variant={
                  achievement.category === "MILESTONE" ? "default" : "secondary"
                }
                className="text-xs"
              >
                {achievement.category === "MILESTONE"
                  ? "📈 Milestone"
                  : "🔥 Streak"}
              </Badge>

              <div
                className={cn(
                  "text-xs font-medium",
                  isEarned ? "text-orange-600" : "text-gray-400"
                )}
              >
                +{achievement.pointsReward} points
              </div>

              {isEarned && achievement.earnedAt && (
                <div className="text-xs text-green-600 font-medium">
                  ✓ Earned {new Date(achievement.earnedAt).toLocaleDateString()}
                </div>
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
