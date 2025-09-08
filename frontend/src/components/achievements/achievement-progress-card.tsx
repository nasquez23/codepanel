import { UserAchievementProgress } from "@/types/achievement";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface AchievementProgressCardProps {
  progress: UserAchievementProgress;
  relatedAchievements?: { name: string; targetValue: number; icon: string }[];
}

export function AchievementProgressCard({
  progress,
  relatedAchievements = [],
}: AchievementProgressCardProps) {
  const nextTarget = relatedAchievements
    .filter((a) => a.targetValue > progress.currentValue)
    .sort((a, b) => a.targetValue - b.targetValue)[0];

  const progressPercentage = nextTarget
    ? Math.min((progress.currentValue / nextTarget.targetValue) * 100, 100)
    : 100;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-gray-700">
          {progress.displayName}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-gray-900">
              {progress.currentValue.toLocaleString()}
            </span>
            {nextTarget && (
              <span className="text-sm text-gray-500">
                / {nextTarget.targetValue.toLocaleString()}
              </span>
            )}
          </div>

          {nextTarget && (
            <div className="space-y-2">
              <Progress value={progressPercentage} className="h-2" />
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">
                  {nextTarget.targetValue - progress.currentValue} to go
                </span>
                <span className="text-gray-600 flex items-center gap-1">
                  {nextTarget.icon} {nextTarget.name}
                </span>
              </div>
            </div>
          )}

          <div className="text-xs text-gray-400">
            Last updated: {new Date(progress.lastUpdated).toLocaleDateString()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
