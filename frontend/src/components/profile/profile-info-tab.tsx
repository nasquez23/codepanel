"use client";

import { useEffect, useState } from "react";
import { Edit, Save, X, User, Mail, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import AvatarUpload from "@/components/avatar-upload";
import { useProfile, useUpdateProfile } from "@/hooks";
import { UpdateProfileRequest } from "@/types/profile";

export function ProfileInfoTab() {
  const { data: profile, isLoading, error } = useProfile();
  const updateMutation = useUpdateProfile();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (profile && !isEditing) {
      setFormData({
        firstName: profile.firstName,
        lastName: profile.lastName,
      });
    }
  }, [profile, isEditing]);

  const handleInputChange = (
    field: keyof UpdateProfileRequest,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    } else if (
      formData.firstName.length < 1 ||
      formData.firstName.length > 50
    ) {
      newErrors.firstName = "First name must be between 1 and 50 characters";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    } else if (formData.lastName.length < 1 || formData.lastName.length > 50) {
      newErrors.lastName = "Last name must be between 1 and 50 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      await updateMutation.mutateAsync(formData);
      setIsEditing(false);
      setErrors({});
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setFormData({
        firstName: profile.firstName,
        lastName: profile.lastName,
      });
    }
    setIsEditing(false);
    setErrors({});
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "bg-red-100 text-red-800";
      case "INSTRUCTOR":
        return "bg-blue-100 text-blue-800";
      case "STUDENT":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return (
      <div className="grid md:grid-cols-2 gap-6">
        <div className="h-96 bg-gray-200 animate-pulse rounded"></div>
        <div className="space-y-4">
          <div className="h-6 bg-gray-200 animate-pulse rounded"></div>
          <div className="h-6 bg-gray-200 animate-pulse rounded"></div>
          <div className="h-6 bg-gray-200 animate-pulse rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200">
        <CardContent className="pt-6">
          <div className="text-center text-red-600">
            <p>Failed to load profile</p>
            <p className="text-sm mt-2">Please try refreshing the page</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!profile) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">
          Profile Information
        </h2>
        {!isEditing && (
          <Button
            onClick={() => setIsEditing(true)}
            className="flex items-center space-x-2"
          >
            <Edit className="w-4 h-4" />
            <span>Edit Profile</span>
          </Button>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Profile Picture */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="w-5 h-5" />
              <span>Profile Picture</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <AvatarUpload currentImageUrl={profile.profilePictureUrl} />
          </CardContent>
        </Card>

        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name
              </label>
              {isEditing ? (
                <div>
                  <Input
                    value={formData.firstName}
                    onChange={(e) =>
                      handleInputChange("firstName", e.target.value)
                    }
                    className={errors.firstName ? "border-red-500" : ""}
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.firstName}
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-gray-900">{profile.firstName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Name
              </label>
              {isEditing ? (
                <div>
                  <Input
                    value={formData.lastName}
                    onChange={(e) =>
                      handleInputChange("lastName", e.target.value)
                    }
                    className={errors.lastName ? "border-red-500" : ""}
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.lastName}
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-gray-900">{profile.lastName}</p>
              )}
            </div>

            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-1">
                <Mail className="w-4 h-4" />
                <span>Email</span>
              </label>
              <p className="text-gray-900">{profile.email}</p>
              <p className="text-sm text-gray-500 mt-1">
                Email cannot be changed
              </p>
            </div>

            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-1">
                <Shield className="w-4 h-4" />
                <span>Role</span>
              </label>
              <Badge className={getRoleColor(profile.role)}>
                {profile.role}
              </Badge>
            </div>

            {isEditing && (
              <div className="flex space-x-2 pt-4">
                <Button
                  onClick={handleSave}
                  disabled={updateMutation.isPending}
                  className="flex items-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>
                    {updateMutation.isPending ? "Saving..." : "Save Changes"}
                  </span>
                </Button>
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  className="flex items-center space-x-2"
                >
                  <X className="w-4 h-4" />
                  <span>Cancel</span>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
