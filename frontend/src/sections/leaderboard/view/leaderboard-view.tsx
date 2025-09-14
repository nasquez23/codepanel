"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import LeaderboardPodium from "../leaderboard-podium";
import LeaderboardTable from "../leaderboard-table";
import {
  useAllTimeLeaderboard,
  useWeeklyLeaderboard,
  useMonthlyLeaderboard,
} from "@/hooks/use-leaderboard";
import { useState } from "react";

export default function LeaderboardView() {
  const [timePeriod, setTimePeriod] = useState("all-time");

  const allTimeQuery = useAllTimeLeaderboard({ limit: 25 });
  const weeklyQuery = useWeeklyLeaderboard({ size: 25 });
  const monthlyQuery = useMonthlyLeaderboard({
    month: new Date().toISOString().slice(0, 7) as any,
    limit: 25,
  });

  const getCurrentData = () => {
    switch (timePeriod) {
      case "weekly":
        return {
          data: weeklyQuery.data?.content || [],
          isLoading: weeklyQuery.isLoading,
          error: weeklyQuery.error?.message,
        };
      case "monthly":
        return {
          data: monthlyQuery.data || [],
          isLoading: monthlyQuery.isLoading,
          error: monthlyQuery.error?.message,
        };
      case "all-time":
      default:
        return {
          data: allTimeQuery.data || [],
          isLoading: allTimeQuery.isLoading,
          error: allTimeQuery.error?.message,
        };
    }
  };

  const { data: leaderboardData, isLoading, error } = getCurrentData();

  const podiumData = leaderboardData.slice(0, 3).map((entry, index) => ({
    rank: "rank" in entry ? entry.rank : index + 1,
    user: entry.user,
    points: entry.points,
    problems: Math.floor(Math.random() * 100) + 100,
    streak: Math.floor(Math.random() * 30) + 1,
  }));

  const tableData = leaderboardData.map((entry, index) => ({
    rank: "rank" in entry ? entry.rank : index + 1,
    user: entry.user,
    points: entry.points,
    streak: Math.floor(Math.random() * 30) + 1,
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Leaderboard</h1>
          <p className="text-gray-600 text-lg">
            Compete with your peers and track your progress
          </p>
        </div>

        <div className="flex items-center space-x-3 mb-8">
          <label className="text-sm font-medium text-gray-700">
            Time Period
          </label>
          <Select value={timePeriod} onValueChange={setTimePeriod}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="weekly">This Week</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="all-time">All Time</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="mb-8">
          <LeaderboardPodium data={podiumData} isLoading={isLoading} />
        </div>

        <Card className="bg-white shadow-lg rounded-xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-semibold text-gray-900">
              Full Rankings
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <LeaderboardTable
              data={tableData}
              isLoading={isLoading}
              error={error}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
