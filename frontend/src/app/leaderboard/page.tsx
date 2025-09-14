import { LeaderboardView } from "@/sections/leaderboard/view";
import { Metadata } from "next";

export default function LeaderboardPage() {
  return <LeaderboardView />;
}

export function generateMetadata(): Metadata {
  return {
    title: "Leaderboard | CodePanel",
    description: "Compete with your peers and track your progress",
  };
}
