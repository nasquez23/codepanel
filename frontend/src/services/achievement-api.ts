import { fetcher } from "./api";
import {
  Achievement,
  AchievementWithProgress,
  UserAchievementProgress,
} from "@/types/achievement";

export const achievementApi = {
  async getAllAchievements(): Promise<Achievement[]> {
    return fetcher("/api/achievements");
  },

  async getUserAchievements(userId: string): Promise<Achievement[]> {
    return fetcher(`/api/achievements/user/${userId}`);
  },

  async getMyAchievements(): Promise<Achievement[]> {
    return fetcher("/api/achievements/me");
  },

  async getUserProgress(userId: string): Promise<UserAchievementProgress[]> {
    return fetcher(`/api/achievements/progress/${userId}`);
  },

  async getMyProgress(): Promise<UserAchievementProgress[]> {
    return fetcher("/api/achievements/progress/me");
  },

  async getMyAchievementsWithProgress(): Promise<AchievementWithProgress[]> {
    return fetcher("/api/achievements/with-progress/me");
  },
};
