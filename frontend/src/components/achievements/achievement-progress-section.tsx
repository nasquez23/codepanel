import { UserAchievementProgress, Achievement } from "@/types/achievement";
import { AchievementProgressCard } from "./achievement-progress-card";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface AchievementProgressSectionProps {
  progress: UserAchievementProgress[];
  achievements: Achievement[];
  isLoading?: boolean;
}

export function AchievementProgressSection({
  progress,
  achievements,
  isLoading,
}: AchievementProgressSectionProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>📊 Your Progress</CardTitle>
          <CardDescription>Loading progress...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-32 bg-gray-100 animate-pulse rounded-lg"
              />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (progress.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>📊 Your Progress</CardTitle>
          <CardDescription>
            Start participating to see your progress!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-4">📈</div>
            <div className="text-lg font-medium mb-2">No progress yet</div>
            <div className="text-sm">
              Post problems, submit solutions, and engage with the community to
              start tracking your progress.
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>📊 Your Progress</CardTitle>
        <CardDescription>
          Track your journey towards earning achievements
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {progress.map((progressItem) => {
            // Find related achievements for this metric
            const relatedAchievements = achievements
              .filter((a) => a.metricType === progressItem.metricType)
              .map((a) => ({
                name: a.name,
                targetValue: a.targetValue,
                icon: a.icon,
              }))
              .sort((a, b) => a.targetValue - b.targetValue);

            return (
              <AchievementProgressCard
                key={progressItem.metricType}
                progress={progressItem}
                relatedAchievements={relatedAchievements}
              />
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
