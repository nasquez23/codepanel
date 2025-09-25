import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Achievement } from "@/types/achievement";

export function ProfileAchievements({
  achievements,
}: {
  achievements: Achievement[];
}) {
  return (
    <div className="grid gap-4">
      {achievements && achievements.length > 0 ? (
        achievements.map((achievement) => (
          <Card
            key={achievement.id}
            className={
              achievement.earnedAt
                ? "border-green-200 bg-green-50"
                : "border-gray-200 bg-gray-50"
            }
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div
                    className={`text-2xl ${
                      achievement.earnedAt ? "" : "grayscale"
                    }`}
                  >
                    {achievement.icon}
                  </div>
                  <div>
                    <h3
                      className={`font-semibold ${
                        achievement.earnedAt ? "text-gray-900" : "text-gray-500"
                      }`}
                    >
                      {achievement.name}
                    </h3>
                    <p
                      className={`text-sm ${
                        achievement.earnedAt ? "text-gray-600" : "text-gray-400"
                      }`}
                    >
                      {achievement.description}
                    </p>
                  </div>
                </div>
                {achievement.earnedAt ? (
                  <Badge className="bg-green-100 text-green-800">Earned</Badge>
                ) : (
                  <div className="text-right">
                    <div className="text-xs text-gray-500 mb-1">
                      Not yet earned
                    </div>
                    <Progress value={0} className="w-20" />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-gray-500">No achievements available yet.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
