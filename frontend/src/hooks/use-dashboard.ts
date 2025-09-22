import { getMyStudentStats, getMyInstructorStats } from "@/services/dashboard-api";
import { StudentStatsResponse, InstructorStatsResponse } from "@/types/dashboard";
import { useQuery } from "@tanstack/react-query";

export const dashboardKeys = {
  all: ["stats"] as const,
  meStudent: () => [...dashboardKeys.all, "me-student"] as const,
  meInstructor: () => [...dashboardKeys.all, "me-instructor"] as const,
};

export const useMyStudentStats = () => {
  return useQuery<StudentStatsResponse>({
    queryKey: dashboardKeys.meStudent(),
    queryFn: getMyStudentStats,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
};

export const useMyInstructorStats = () => {
  return useQuery<InstructorStatsResponse>({
    queryKey: dashboardKeys.meInstructor(),
    queryFn: getMyInstructorStats,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
};
