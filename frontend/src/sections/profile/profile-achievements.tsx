import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks";
import { useMyAchievementsWithProgress } from "@/hooks/use-achievements";

export function ProfileAchievements() {
  const { user } = useAuth();
  const { data: achievements, isLoading } = useMyAchievementsWithProgress(
    !!user
  );

  const formatEarnedDate = (earnedAt: string) => {
    const date = new Date(earnedAt);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getIconBackground = (category: string, isEarned: boolean) => {
    if (!isEarned) return "bg-gray-100";

    switch (category) {
      case "MILESTONE":
        return "bg-blue-500";
      case "STREAK":
        return "bg-orange-500";
      default:
        return "bg-teal-500";
    }
  };

  const getBorderColor = (isEarned: boolean) => {
    return isEarned ? "border-green-300" : "border-gray-200";
  };

  const getCardBackground = (isEarned: boolean) => {
    return isEarned
      ? "bg-gradient-to-br from-green-50 to-green-100"
      : "bg-gray-50";
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="border-gray-200 bg-gray-50">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="w-14 h-14 bg-gray-200 rounded-xl animate-pulse mx-auto"></div>
                <div className="space-y-2">
                  <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {achievements && achievements.length > 0 ? (
        achievements.map((achievement) => {
          const isEarned = !!achievement.earnedAt;

          return (
            <Card
              key={achievement.id}
              className={`${getBorderColor(isEarned)} ${getCardBackground(
                isEarned
              )} transition-all hover:shadow-md relative overflow-hidden`}
            >
              <div className="absolute top-3 right-3 flex items-center space-x-2">
                <span className="text-sm font-semibold text-gray-600">
                  {achievement.pointsReward} pts
                </span>
                {isEarned && (
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-white"
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
                  <div className="flex justify-center">
                    <div
                      className={`w-14 h-14 rounded-xl flex items-center justify-center text-white text-xl font-bold ${getIconBackground(
                        achievement.category,
                        isEarned
                      )} ${!isEarned ? "opacity-50" : ""}`}
                    >
                      {achievement.icon}
                    </div>
                  </div>

                  <div className="text-center space-y-2">
                    <h3
                      className={`font-bold text-lg ${
                        isEarned ? "text-gray-900" : "text-gray-500"
                      }`}
                    >
                      {achievement.name}
                    </h3>
                    <p
                      className={`text-sm ${
                        isEarned ? "text-gray-600" : "text-gray-400"
                      }`}
                    >
                      {achievement.description}
                    </p>
                  </div>

                  {isEarned && achievement.earnedAt && (
                    <div className="text-center">
                      <p className="text-sm font-medium text-green-600">
                        Earned {formatEarnedDate(achievement.earnedAt)}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })
      ) : (
        <div className="col-span-full">
          <Card>
            <CardContent className="p-8 text-center">
              <div className="space-y-4">
                <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 text-lg">
                    No achievements yet
                  </h3>
                  <p className="text-gray-500 text-sm mt-2">
                    Start solving problems and participating to earn your first
                    achievements!
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
