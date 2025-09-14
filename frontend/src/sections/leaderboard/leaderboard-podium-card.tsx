import { getRankIcon } from "@/lib/get-rank-icon";
import { Card, CardContent } from "../../components/ui/card";
import ProfilePicture from "../../components/profile-picture";
import { PodiumEntry } from "@/types/leaderboard";

export default function LeaderboardPodiumCard({
  entry,
}: {
  entry: PodiumEntry;
}) {
  const getCardStyle = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-white shadow-lg rounded-xl ring-2 ring-yellow-200";
      case 2:
        return "bg-white shadow-lg rounded-xl";
      case 3:
        return "bg-white shadow-lg rounded-xl";
      default:
        return "bg-white shadow-lg rounded-xl";
    }
  };

  return (
    <Card key={`podium-${entry.rank}`} className={getCardStyle(entry.rank)}>
      <CardContent className="p-6 text-center">
        <div
          className={`rounded-full flex items-center justify-center mx-auto mb-3 size-16`}
        >
          <ProfilePicture
            profilePictureUrl={entry.user.profilePictureUrl}
            firstName={entry.user.firstName}
            lastName={entry.user.lastName}
            className="size-16"
          />
        </div>
        <div className="flex mb-2 justify-center">
          {getRankIcon(entry.rank)}
        </div>
        <h3 className="font-semibold text-gray-900 mb-2">
          {entry.user.firstName} {entry.user.lastName}
        </h3>
        <div className="text-2xl font-bold text-blue-600 mb-1">
          {entry.points.toLocaleString()}
        </div>
        <div className="text-sm text-gray-500 mb-4">points</div>
      </CardContent>
    </Card>
  );
}
