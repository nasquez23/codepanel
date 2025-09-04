import { ISODate, YearMonth } from "@/types/shared";
import { fetcher } from "./api";

export interface LeaderboardEntry {
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    profilePictureUrl?: string;
  };
  points: number;
  rank: number;
}

export interface WeeklyLeaderboardEntry {
  id: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    profilePictureUrl?: string;
  };
  weekStart: string;
  points: number;
}

export interface WeeklyLeaderboardResponse {
  content: WeeklyLeaderboardEntry[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export const leaderboardApi = {
  getWeeklyLeaderboard: async (params?: {
    weekStart?: ISODate;
    page?: number;
    size?: number;
  }): Promise<WeeklyLeaderboardResponse> => {
    const searchParams = new URLSearchParams();
    if (params?.weekStart) {
      searchParams.set("weekStart", params.weekStart);
    }

    if (params?.page) {
      searchParams.set("page", params.page.toString());
    }

    if (params?.size) {
      searchParams.set("size", params.size.toString());
    }

    return await fetcher<WeeklyLeaderboardResponse>(
      `/api/leaderboard/weekly?${searchParams.toString()}`
    );
  },

  getMonthlyLeaderboard: async (params?: {
    month?: YearMonth;
    limit?: number;
  }): Promise<LeaderboardEntry[]> => {
    const searchParams = new URLSearchParams();
    if (params?.month) {
      searchParams.set("month", params.month);
    }
    if (params?.limit) {
      searchParams.set("limit", params.limit.toString());
    }

    return await fetcher<LeaderboardEntry[]>(
      `/api/leaderboard/monthly?${searchParams.toString()}`
    );
  },

  getAllTimeLeaderboard: async (params?: {
    limit?: number;
  }): Promise<LeaderboardEntry[]> => {
    const searchParams = new URLSearchParams();
    if (params?.limit) {
      searchParams.set("limit", params.limit.toString());
    }

    return await fetcher<LeaderboardEntry[]>(
      `/api/leaderboard/all-time?${searchParams.toString()}`
    );
  },
};
