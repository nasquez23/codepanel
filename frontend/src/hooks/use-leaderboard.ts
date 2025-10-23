import { useQuery } from "@tanstack/react-query";
import { leaderboardApi } from "@/services/leaderboard-api";
import { ISODate, YearMonth } from "@/types/shared";

export function useWeeklyLeaderboard(params?: {
  weekStart?: ISODate;
  page?: number;
  size?: number;
}) {
  return useQuery({
    queryKey: ["leaderboard", "weekly", params],
    queryFn: () => leaderboardApi.getWeeklyLeaderboard(params),
  });
}

export function useMonthlyLeaderboard(params?: {
  month?: YearMonth;
  limit?: number;
}) {
  return useQuery({
    queryKey: ["leaderboard", "monthly", params],
    queryFn: () => leaderboardApi.getMonthlyLeaderboard(params),
  });
}

export function useAllTimeLeaderboard(params?: { limit?: number }) {
  return useQuery({
    queryKey: ["leaderboard", "all-time", params],
    queryFn: () => leaderboardApi.getAllTimeLeaderboard(params),
    refetchOnWindowFocus: true
  });
}
