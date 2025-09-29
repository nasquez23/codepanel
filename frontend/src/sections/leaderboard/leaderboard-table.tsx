import ProfilePicture from "@/components/profile-picture";
import { Badge } from "../../components/ui/badge";
import { Trophy, Medal, Award, Flame } from "lucide-react";

interface TableEntry {
  rank: number;
  user: {
    firstName: string;
    lastName: string;
    profilePictureUrl?: string;
  };
  points: number;
  streak: number;
}

interface LeaderboardTableProps {
  data: TableEntry[];
  isLoading?: boolean;
  error?: string;
}

export default function LeaderboardTable({
  data,
  isLoading,
  error,
}: LeaderboardTableProps) {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Medal className="h-5 w-5 text-orange-500" />;
      case 3:
        return <Award className="h-5 w-5 text-gray-500" />;
      default:
        return (
          <span className="h-5 w-5 flex items-center justify-center text-sm font-semibold text-gray-500">
            #{rank}
          </span>
        );
    }
  };

  const getAvatarColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-yellow-500";
      case 2:
        return "bg-orange-500";
      case 3:
        return "bg-gray-500";
      default:
        return "bg-purple-500";
    }
  };

  const getBadgeColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-yellow-100 text-yellow-800";
      case 2:
        return "bg-orange-100 text-orange-800";
      case 3:
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-0">
        <div className="grid grid-cols-5 gap-4 px-6 py-4 bg-gray-50 border-b text-xs font-semibold text-gray-600 uppercase tracking-wider">
          <div>RANK</div>
          <div className="col-span-3">STUDENT</div>
          <div className="text-right">POINTS</div>
          {/* <div className="text-right">STREAK</div>
          <div>BADGE</div> */}
        </div>

        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="grid grid-cols-5 gap-4 px-6 py-4 border-b">
              <div className="h-4 bg-gray-300 rounded w-8"></div>
              <div className="flex items-center space-x-3 col-span-3">
                <div className="h-8 w-8 bg-gray-300 rounded-full"></div>
                <div className="h-4 bg-gray-300 rounded w-24"></div>
              </div>
              <div className="h-4 bg-gray-300 rounded w-12 ml-auto"></div>
              {/* <div className="h-4 bg-gray-300 rounded w-8 ml-auto"></div>
              <div className="h-4 bg-gray-300 rounded w-16"></div> */}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-600 py-8">{error}</div>;
  }

  if (!data || data.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">No data available</div>
    );
  }

  return (
    <div className="space-y-0">
      <div className="grid grid-cols-5 gap-4 px-6 py-4 bg-gray-50 border-b text-xs font-semibold text-gray-600 uppercase tracking-wider">
        <div>RANK</div>
        <div className="col-span-3">STUDENT</div>
        <div className="text-right">POINTS</div>
        {/* <div className="text-right">STREAK</div>
        <div>BADGE</div> */}
      </div>

      {data.map((entry, index) => (
        <div
          key={`table-${entry.rank}`}
          className={`grid grid-cols-5 gap-4 px-6 py-4 border-b hover:bg-gray-50 transition-colors ${
            index === 0 ? "bg-yellow-50" : ""
          }`}
        >
          <div className="flex items-center">{getRankIcon(entry.rank)}</div>

          <div className="flex items-center space-x-3 col-span-3">
            <ProfilePicture
              profilePictureUrl={entry.user.profilePictureUrl}
              firstName={entry.user.firstName}
              lastName={entry.user.lastName}
              className="size-8"
            />
            <span className="font-medium text-gray-900">
              {entry.user.firstName} {entry.user.lastName}
            </span>
          </div>

          <div className="text-right font-semibold text-gray-900">
            {entry.points.toLocaleString()}
          </div>

          {/* <div className="text-right flex items-center justify-end space-x-1">
            <Flame className="h-4 w-4 text-orange-500" />
            <span className="text-gray-600">{entry.streak}</span>
          </div>

          <div>
            <Badge className={`text-xs px-2 py-1 ${getBadgeColor(entry.rank)}`}>
              {entry.rank === 1
                ? "Master Coder"
                : entry.rank === 2
                ? "Expert"
                : entry.rank === 3
                ? "Advanced"
                : "Intermediate"}
            </Badge>
          </div> */}
        </div>
      ))}
    </div>
  );
}
