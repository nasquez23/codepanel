import { Award, Crown, Medal } from "lucide-react";

export function getRankIcon(rank: number) {
  switch (rank) {
    case 1:
      return <Crown className="h-5 w-5 text-yellow-500" />;
    case 2:
      return <Medal className="h-5 w-5 text-gray-400" />;
    case 3:
      return <Award className="h-5 w-5 text-amber-600" />;
    default:
      return (
        <span className="h-5 w-5 flex items-center justify-center text-sm font-semibold text-gray-500">
          #{rank}
        </span>
      );
  }
}
