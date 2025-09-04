import { useAllTimeLeaderboard } from "@/hooks/use-leaderboard";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { getRankIcon } from "@/lib/get-rank-icon";

export default function AllTimeLeaderboard() {
  const {
    data: leaderboard,
    isLoading,
    error,
  } = useAllTimeLeaderboard({ limit: 10 });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="flex items-center space-x-4 p-4 bg-gray-100 rounded-lg">
              <div className="h-10 w-10 bg-gray-300 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                <div className="h-3 bg-gray-300 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600">
        Failed to load all-time leaderboard
      </div>
    );
  }

  if (!leaderboard?.length) {
    return <div className="text-center text-gray-500">No data available</div>;
  }

  return (
    <div className="space-y-4">
      {leaderboard.map((entry) => (
        <Card
          key={`alltime-${entry.user.id}`}
          className={`transition-all duration-200 hover:shadow-md ${
            entry.rank <= 3 ? "ring-2 ring-blue-100" : ""
          }`}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center justify-center">
                  {getRankIcon(entry.rank)}
                </div>
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {entry.user.firstName[0]}
                    {entry.user.lastName[0]}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {entry.user.firstName} {entry.user.lastName}
                    </p>
                    <p className="text-sm text-gray-500">{entry.user.email}</p>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <Badge
                  variant={entry.rank <= 3 ? "default" : "secondary"}
                  className="text-lg px-3 py-1"
                >
                  {entry.points} pts
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
