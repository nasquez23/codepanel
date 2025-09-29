"use client";

import ProfilePicture from "@/components/profile-picture";
import { Button } from "@/components/ui/button";
import { useAuth, useProfile } from "@/hooks";

interface ProfileHeaderProps {
  onEditClick: () => void;
}

export function ProfileHeader({ onEditClick }: ProfileHeaderProps) {
  const { user } = useAuth();
  const { data: profile, isLoading } = useProfile(user?.id || "", !!user);

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex items-center space-x-6">
          <div className="w-24 h-24 bg-gray-200 rounded-full animate-pulse"></div>
          <div className="flex-1">
            <div className="h-8 bg-gray-200 rounded animate-pulse mb-2"></div>
            <div className="h-5 bg-gray-200 rounded animate-pulse mb-4 w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
          </div>
          <div className="h-10 w-32 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <div className="relative">
            <ProfilePicture
              profilePictureUrl={profile.profilePictureUrl}
              firstName={profile.firstName}
              lastName={profile.lastName}
              className="size-24"
            />
          </div>

          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {profile.firstName} {profile.lastName}
            </h1>

            {profile.bio && (
              <p className="text-gray-600 mt-4 max-w-2xl">{profile.bio}</p>
            )}
          </div>
        </div>

        <Button onClick={onEditClick} className="bg-blue-600 hover:bg-blue-700">
          Edit Profile
        </Button>
      </div>
    </div>
  );
}
