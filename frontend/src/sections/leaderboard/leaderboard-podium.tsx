import { PodiumEntry } from "@/types/leaderboard";
import { Card, CardContent } from "../../components/ui/card";
import LeaderboardPodiumCard from "./leaderboard-podium-card";

interface LeaderboardPodiumProps {
  data: PodiumEntry[];
  isLoading?: boolean;
}

export default function LeaderboardPodium({
  data,
  isLoading,
}: LeaderboardPodiumProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="bg-white shadow-lg rounded-xl">
            <CardContent className="p-6 text-center animate-pulse">
              <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-3"></div>
              <div className="h-4 bg-gray-300 rounded w-4 mx-auto mb-2"></div>
              <div className="h-5 bg-gray-300 rounded w-32 mx-auto mb-2"></div>
              <div className="h-8 bg-gray-300 rounded w-20 mx-auto mb-1"></div>
              <div className="h-4 bg-gray-300 rounded w-12 mx-auto mb-4"></div>
              <div className="h-3 bg-gray-300 rounded w-16 mx-auto"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        No leaderboard data available
      </div>
    );
  }

  const sortedData = [...data].sort((a, b) => a.rank - b.rank);
  const top3 = sortedData.slice(0, 3);

  const podiumOrder = [
    top3.find((entry) => entry.rank === 2),
    top3.find((entry) => entry.rank === 1),
    top3.find((entry) => entry.rank === 3),
  ].filter(Boolean) as PodiumEntry[];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {podiumOrder.map((entry) => (
        <LeaderboardPodiumCard key={entry.rank} entry={entry} />
      ))}
    </div>
  );
}
