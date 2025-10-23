import {
  getMyStudentStats,
  getMyInstructorStats,
} from "@/services/dashboard-api";
import {
  StudentStatsResponse,
  InstructorStatsResponse,
} from "@/types/dashboard";
import { useQuery } from "@tanstack/react-query";

export const dashboardKeys = {
  all: ["stats"] as const,
  meStudent: (userId: string) =>
    [...dashboardKeys.all, "me-student", userId] as const,
  meInstructor: (userId: string) =>
    [...dashboardKeys.all, "me-instructor", userId] as const,
};

export const useMyStudentStats = (userId: string, enabled: boolean = false) => {
  return useQuery<StudentStatsResponse>({
    queryKey: dashboardKeys.meStudent(userId),
    queryFn: getMyStudentStats,
    refetchOnWindowFocus: true,
    enabled: enabled,
  });
};

export const useMyInstructorStats = (
  userId: string,
  enabled: boolean = false
) => {
  return useQuery<InstructorStatsResponse>({
    queryKey: dashboardKeys.meInstructor(userId),
    queryFn: getMyInstructorStats,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    enabled: enabled,
  });
};
