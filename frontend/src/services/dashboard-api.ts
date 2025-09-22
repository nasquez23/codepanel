import { StudentStatsResponse, InstructorStatsResponse } from "@/types/dashboard";
import { axiosInstance } from "./api";

export const getMyStudentStats = async (): Promise<StudentStatsResponse> => {
  const { data } = await axiosInstance.get<StudentStatsResponse>(
    "/api/dashboard/me/student"
  );
  return data;
};

export const getMyInstructorStats = async (): Promise<InstructorStatsResponse> => {
  const { data } = await axiosInstance.get<InstructorStatsResponse>(
    "/api/dashboard/me/instructor"
  );
  return data;
};
