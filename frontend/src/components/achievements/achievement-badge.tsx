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

  const getIconBackground = () => {
    if (!isEarned) return "bg-gray-100";

    switch (achievement.category) {
      case "MILESTONE":
        return "bg-blue-500";
      case "STREAK":
        return "bg-orange-500";
      default:
        return "bg-teal-500";
    }
  };

  const getProgressPercentage = () => {
    if (isEarned) return 100;
    if (!achievement.currentProgress) return 0;
    return Math.min(
      (achievement.currentProgress / achievement.targetValue) * 100,
      100
    );
  };

  const getProgressText = () => {
    if (isEarned) return null;
    if (!achievement.currentProgress) return `0/${achievement.targetValue}`;
    return `${achievement.currentProgress}/${achievement.targetValue}`;
  };

  const formatEarnedDate = (earnedAt: string) => {
    const date = new Date(earnedAt);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const progressPercentage = getProgressPercentage();
  const progressText = getProgressText();

  return (
    <Card
      className={cn(
        "transition-all hover:shadow-md relative overflow-hidden",
        isEarned
          ? "border-green-200 bg-gradient-to-br from-green-50 to-green-100"
          : "border-gray-200 bg-gray-50"
      )}
    >
      {/* Points Badge */}
      <div className="absolute top-3 right-3 flex items-center space-x-1">
        <span className="text-sm font-semibold text-gray-600">
          {achievement.pointsReward} pts
        </span>
        {isEarned && (
          <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
            <svg
              className="w-3 h-3 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        )}
      </div>

      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Icon */}
          <div className="flex justify-center">
            <div
              className={cn(
                "w-12 h-12 rounded-lg flex items-center justify-center text-white text-xl",
                getIconBackground(),
                !isEarned && "opacity-50"
              )}
            >
              {achievement.icon}
            </div>
          </div>

          {showDetails && (
            <>
              {/* Title and Description */}
              <div className="text-center space-y-2">
                <h3
                  className={cn(
                    "font-semibold text-lg",
                    isEarned ? "text-gray-900" : "text-gray-500"
                  )}
                >
                  {achievement.name}
                </h3>
                <p
                  className={cn(
                    "text-sm",
                    isEarned ? "text-gray-600" : "text-gray-400"
                  )}
                >
                  {achievement.description}
                </p>
              </div>

              {/* Progress or Earned Status */}
              <div className="space-y-2">
                {isEarned ? (
                  <div className="text-center">
                    <p className="text-sm font-medium text-green-600">
                      Earned{" "}
                      {achievement.earnedAt &&
                        formatEarnedDate(achievement.earnedAt)}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {progressText && (
                      <div className="flex justify-between items-center text-xs text-gray-500">
                        <span>Progress</span>
                        <span>{progressText}</span>
                      </div>
                    )}
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progressPercentage}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
