export interface Profile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "STUDENT" | "INSTRUCTOR" | "ADMIN";
  profilePictureUrl?: string;
}

export interface UpdateProfileRequest {
  firstName: string;
  lastName: string;
}

export interface ProfileResponse extends Profile {}
