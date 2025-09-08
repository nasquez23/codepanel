import { Achievement } from "@/types/achievement";
import { AchievementBadge } from "./achievement-badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface AchievementsGalleryProps {
  achievements: Achievement[];
  isLoading?: boolean;
}

export function AchievementsGallery({
  achievements,
  isLoading,
}: AchievementsGalleryProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Achievements</CardTitle>
          <CardDescription>Loading achievements...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="h-48 bg-gray-100 animate-pulse rounded-lg"
              />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const milestoneAchievements = achievements.filter(
    (a) => a.category === "MILESTONE"
  );
  const streakAchievements = achievements.filter(
    (a) => a.category === "STREAK"
  );
  const earnedAchievements = achievements.filter((a) => a.earnedAt);

  const stats = {
    total: achievements.length,
    earned: earnedAchievements.length,
    totalPoints: earnedAchievements.reduce((sum, a) => sum + a.pointsReward, 0),
    completionRate:
      achievements.length > 0
        ? (earnedAchievements.length / achievements.length) * 100
        : 0,
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">
              {stats.earned}
            </div>
            <div className="text-sm text-gray-600">Earned</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">
              {stats.total}
            </div>
            <div className="text-sm text-gray-600">Total</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">
              {stats.totalPoints}
            </div>
            <div className="text-sm text-gray-600">Points</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">
              {stats.completionRate.toFixed(0)}%
            </div>
            <div className="text-sm text-gray-600">Complete</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>🏆 Achievement Gallery</CardTitle>
          <CardDescription>
            Earn badges by participating in the community and completing
            challenges
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All ({achievements.length})</TabsTrigger>
              <TabsTrigger value="earned">
                Earned ({earnedAchievements.length})
              </TabsTrigger>
              <TabsTrigger value="milestone">
                📈 Milestone ({milestoneAchievements.length})
              </TabsTrigger>
              <TabsTrigger value="streak">
                🔥 Streak ({streakAchievements.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-6">
              <AchievementGrid achievements={achievements} />
            </TabsContent>

            <TabsContent value="earned" className="mt-6">
              {earnedAchievements.length > 0 ? (
                <AchievementGrid achievements={earnedAchievements} />
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <div className="text-4xl mb-4">🏆</div>
                  <div className="text-lg font-medium mb-2">
                    No achievements yet
                  </div>
                  <div className="text-sm">
                    Start participating to earn your first badge!
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="milestone" className="mt-6">
              <AchievementGrid achievements={milestoneAchievements} />
            </TabsContent>

            <TabsContent value="streak" className="mt-6">
              <AchievementGrid achievements={streakAchievements} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

function AchievementGrid({ achievements }: { achievements: Achievement[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {achievements.map((achievement) => (
        <AchievementBadge
          key={achievement.id}
          achievement={achievement}
          size="md"
          showDetails={true}
        />
      ))}
    </div>
  );
}
