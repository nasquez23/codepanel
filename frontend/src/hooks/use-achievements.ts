import { useQuery } from "@tanstack/react-query";
import { achievementApi } from "@/services/achievement-api";
import {
  Achievement,
  AchievementWithProgress,
  UserAchievementProgress,
} from "@/types/achievement";

export const achievementKeys = {
  all: ["achievements"] as const,
  lists: () => [...achievementKeys.all, "list"] as const,
  list: () => [...achievementKeys.lists(), "all"] as const,
  user: () => [...achievementKeys.all, "user"] as const,
  userList: (userId: string) => [...achievementKeys.user(), userId] as const,
  my: () => [...achievementKeys.all, "me"] as const,
  userProgress: () => [...achievementKeys.all, "progress", "user"] as const,
  userProgressList: (userId: string) =>
    [...achievementKeys.userProgress(), userId] as const,
  myProgress: () => [...achievementKeys.all, "progress", "me"] as const,
  myWithProgress: () =>
    [...achievementKeys.all, "with-progress", "me"] as const,
};

export function useAllAchievements() {
  return useQuery<Achievement[]>({
    queryKey: achievementKeys.list(),
    queryFn: achievementApi.getAllAchievements,
  });
}

export function useUserAchievements(userId: string) {
  return useQuery<Achievement[]>({
    queryKey: achievementKeys.userList(userId),
    queryFn: () => achievementApi.getUserAchievements(userId),
    enabled: !!userId,
  });
}

export function useMyAchievements() {
  return useQuery<Achievement[]>({
    queryKey: achievementKeys.my(),
    queryFn: achievementApi.getMyAchievements,
  });
}

export function useUserProgress(userId: string) {
  return useQuery<UserAchievementProgress[]>({
    queryKey: achievementKeys.userProgressList(userId),
    queryFn: () => achievementApi.getUserProgress(userId),
    enabled: !!userId,
  });
}

export function useMyProgress() {
  return useQuery<UserAchievementProgress[]>({
    queryKey: achievementKeys.myProgress(),
    queryFn: achievementApi.getMyProgress,
  });
}

export function useMyAchievementsWithProgress(enabled: boolean = false) {
  return useQuery<AchievementWithProgress[]>({
    queryKey: achievementKeys.myWithProgress(),
    queryFn: achievementApi.getMyAchievementsWithProgress,
    enabled: enabled,
    staleTime: 30000,
  });
}
