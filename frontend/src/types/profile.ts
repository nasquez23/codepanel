import { Role } from "./auth";

export interface Profile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
  profilePictureUrl?: string;
  bio?: string;
  socialLinks?: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    website?: string;
  };
  skills?: string[];
  interests?: string[];
}

export interface UpdateProfileRequest {
  firstName: string;
  lastName: string;
  bio?: string;
  socialLinks?: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    website?: string;
  };
  skills?: string[];
  interests?: string[];
}

export interface ProfileResponse extends Profile {}
