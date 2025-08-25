import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getProfile,
  updateProfile,
  uploadProfilePicture,
  removeProfilePicture,
} from "../services/profile-api";
import { UpdateProfileRequest } from "../types/profile";
import { toast } from "sonner";

export const profileKeys = {
  all: ["profile"] as const,
  profile: () => [...profileKeys.all] as const,
};

export const useProfile = () => {
  return useQuery({
    queryKey: profileKeys.profile(),
    queryFn: getProfile,
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateProfileRequest) => updateProfile(data),
    onSuccess: (updatedProfile) => {
      queryClient.setQueryData(profileKeys.profile(), updatedProfile);
      toast.success("Profile updated successfully!");
    },
    onError: (error: any) => {
      console.error("Failed to update profile:", error);
      toast.error("Failed to update profile");
    },
  });
};

export const useUploadProfilePicture = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => uploadProfilePicture(file),
    onSuccess: (updatedProfile) => {
      queryClient.setQueryData(profileKeys.profile(), updatedProfile);
      toast.success("Profile picture uploaded successfully!");
    },
    onError: (error: any) => {
      console.error("Failed to upload profile picture:", error);
      toast.error("Failed to upload profile picture");
    },
  });
};

export const useRemoveProfilePicture = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeProfilePicture,
    onSuccess: (updatedProfile) => {
      queryClient.setQueryData(profileKeys.profile(), updatedProfile);
      toast.success("Profile picture removed successfully!");
    },
    onError: (error: any) => {
      console.error("Failed to remove profile picture:", error);
      toast.error("Failed to remove profile picture");
    },
  });
};
