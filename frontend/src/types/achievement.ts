export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: "MILESTONE" | "STREAK";
  metricType: string;
  targetValue: number;
  pointsReward: number;
  earnedAt?: string;
}

export interface UserAchievementProgress {
  metricType: string;
  currentValue: number;
  lastUpdated: string;
  displayName: string;
}

export interface AchievementStats {
  totalAchievements: number;
  earnedAchievements: number;
  totalPoints: number;
  recentAchievements: Achievement[];
}
