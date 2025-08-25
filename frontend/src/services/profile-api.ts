import { Profile, UpdateProfileRequest } from "../types/profile";
import { fetcher, putter, poster, deleter } from "./api";

export const getProfile = async (): Promise<Profile> => {
  return fetcher<Profile>("/api/profile");
};

export const updateProfile = async (data: UpdateProfileRequest): Promise<Profile> => {
  const response = await putter<UpdateProfileRequest, Profile>("/api/profile", data);
  return response.data;
};

export const uploadProfilePicture = async (file: File): Promise<Profile> => {
  const formData = new FormData();
  formData.append("file", file);
  
  const response = await poster<FormData, Profile>("/api/profile/avatar", formData);
  return response.data;
};

export const removeProfilePicture = async (): Promise<Profile> => {
  const response = await deleter<any, Profile>("/api/profile/avatar");
  return response.data;
};
