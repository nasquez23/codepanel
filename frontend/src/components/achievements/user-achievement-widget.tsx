import { Achievement } from "@/types/achievement";
import { AchievementBadge } from "./achievement-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface UserAchievementWidgetProps {
  achievements: Achievement[];
  isLoading?: boolean;
  showViewAll?: boolean;
}

export function UserAchievementWidget({
  achievements,
  isLoading,
  showViewAll = true,
}: UserAchievementWidgetProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">🏆 Recent Achievements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="w-16 h-16 bg-gray-100 animate-pulse rounded-lg"
              />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const earnedAchievements = achievements.filter((a) => a.earnedAt);
  const recentAchievements = earnedAchievements
    .sort(
      (a, b) =>
        new Date(b.earnedAt!).getTime() - new Date(a.earnedAt!).getTime()
    )
    .slice(0, 5);

  if (earnedAchievements.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">🏆 Achievements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4 text-gray-500">
            <div className="text-2xl mb-2">🎯</div>
            <div className="text-sm">No achievements yet</div>
            {showViewAll && (
              <Link href="/profile?tab=achievements">
                <Button variant="outline" size="sm" className="mt-2">
                  View All
                </Button>
              </Link>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-lg">🏆 Recent Achievements</CardTitle>
        {showViewAll && (
          <Link href="/profile?tab=achievements">
            <Button variant="ghost" size="sm">
              View All ({earnedAchievements.length})
            </Button>
          </Link>
        )}
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {recentAchievements.map((achievement) => (
            <div key={achievement.id} className="flex-shrink-0">
              <AchievementBadge
                achievement={achievement}
                size="sm"
                showDetails={false}
              />
            </div>
          ))}
          {recentAchievements.length === 0 && (
            <div className="text-sm text-gray-500 py-2">
              No recent achievements
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
