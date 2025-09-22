import { StudentStatsResponse } from "@/types/dashboard";
import { axiosInstance } from "./api";

export const getMyStudentStats = async (): Promise<StudentStatsResponse> => {
  const { data } = await axiosInstance.get<StudentStatsResponse>(
    "/api/dashboard/me/student"
  );
  return data;
};
