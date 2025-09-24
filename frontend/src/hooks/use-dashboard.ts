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

export const useMyStudentStats = (userId: string) => {
  return useQuery<StudentStatsResponse>({
    queryKey: dashboardKeys.meStudent(userId),
    queryFn: getMyStudentStats,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
};

export const useMyInstructorStats = (userId: string) => {
  return useQuery<InstructorStatsResponse>({
    queryKey: dashboardKeys.meInstructor(userId),
    queryFn: getMyInstructorStats,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
};
