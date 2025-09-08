"use client";

import {
  useMyAchievements,
  useMyProgress,
  useAllAchievements,
} from "@/hooks/use-achievements";
import {
  AchievementsGallery,
  AchievementProgressSection,
} from "@/components/achievements";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function ProfileAchievementsTab() {
  const { data: myAchievements, isLoading: achievementsLoading } =
    useMyAchievements();
  const { data: myProgress, isLoading: progressLoading } = useMyProgress();
  const { data: allAchievements, isLoading: allAchievementsLoading } =
    useAllAchievements();

  const isLoading =
    achievementsLoading || progressLoading || allAchievementsLoading;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          🏆 Your Achievements
        </h2>
        <p className="text-gray-600">
          Track your progress and earn badges by participating in the community.
          Post problems, solve challenges, help others, and unlock achievements!
        </p>
      </div>

      {myProgress && allAchievements && (
        <AchievementProgressSection
          progress={myProgress}
          achievements={allAchievements}
          isLoading={progressLoading || allAchievementsLoading}
        />
      )}

      {myAchievements && (
        <AchievementsGallery
          achievements={myAchievements}
          isLoading={achievementsLoading}
        />
      )}

      <Card>
        <CardHeader>
          <CardTitle>💡 How to Earn Achievements</CardTitle>
          <CardDescription>
            Different ways to unlock badges and earn points
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                📈 Milestone Achievements
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-blue-500">•</span>
                  Post coding problems to help others practice
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500">•</span>
                  Provide helpful comments and solutions
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500">•</span>
                  Complete assignments and submit solutions
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500">•</span>
                  Earn points through quality contributions
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500">•</span>
                  Get your answers accepted by problem authors
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                🔥 Streak Achievements
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-orange-500">•</span>
                  Visit the platform daily to maintain login streaks
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-500">•</span>
                  Post problems on consecutive days
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-500">•</span>
                  Complete assignments regularly without gaps
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-500">•</span>
                  Stay active with any platform activity daily
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-500">•</span>
                  Build momentum with consistent participation
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
