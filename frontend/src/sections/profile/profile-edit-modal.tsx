"use client";

import { useEffect, useState } from "react";
import { Edit, Save, User, Mail, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import AvatarUpload from "@/components/avatar-upload";
import { useProfile, useUpdateProfile } from "@/hooks";
import { UpdateProfileRequest } from "@/types/profile";

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProfileEditModal({ isOpen, onClose }: ProfileEditModalProps) {
  const { data: profile, isLoading, error } = useProfile();
  const updateMutation = useUpdateProfile();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    bio: "",
    socialLinks: {
      github: "",
      linkedin: "",
      twitter: "",
      website: "",
    },
    skills: [] as string[],
    interests: [] as string[],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (profile && isOpen) {
      setFormData({
        firstName: profile.firstName,
        lastName: profile.lastName,
        bio: profile.bio || "",
        socialLinks: {
          github: profile.socialLinks?.github || "",
          linkedin: profile.socialLinks?.linkedin || "",
          twitter: profile.socialLinks?.twitter || "",
          website: profile.socialLinks?.website || "",
        },
        skills: profile.skills || [],
        interests: profile.interests || [],
      });
    }
  }, [profile, isOpen]);

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
      setErrors({});
      onClose();
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setFormData({
        firstName: profile.firstName,
        lastName: profile.lastName,
        bio: profile.bio || "",
        socialLinks: {
          github: profile.socialLinks?.github || "",
          linkedin: profile.socialLinks?.linkedin || "",
          twitter: profile.socialLinks?.twitter || "",
          website: profile.socialLinks?.website || "",
        },
        skills: profile.skills || [],
        interests: profile.interests || [],
      });
    }
    setErrors({});
    onClose();
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

  if (!profile) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900">
            Edit Profile
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          {/* <Card>
            <CardHeader> */}
          {/* <CardTitle className="flex items-center space-x-2"> */}
          <div className="flex items-center space-x-2">
            <User className="w-5 h-5" />
            <span>Profile Picture</span>
          </div>
          {/* </CardTitle>
            </CardHeader>
            <CardContent> */}
          <AvatarUpload currentImageUrl={profile.profilePictureUrl} />
          {/* </CardContent>
          </Card> */}

          {/* <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4"> */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name
              </label>
              <Input
                value={formData.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                className={errors.firstName ? "border-red-500" : ""}
              />
              {errors.firstName && (
                <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Name
              </label>
              <Input
                value={formData.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                className={errors.lastName ? "border-red-500" : ""}
              />
              {errors.lastName && (
                <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
              )}
            </div>
          </div>

          {/* <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bio
                </label>
                <Textarea
                  value={formData.bio}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, bio: e.target.value }))
                  }
                  placeholder="Tell us about yourself..."
                  rows={3}
                />
              </div> */}

          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-1">
              <Mail className="w-4 h-4" />
              <span>Email</span>
            </label>
            <p className="text-gray-900 bg-gray-50 p-2 rounded">
              {profile.email}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Email cannot be changed
            </p>
          </div>

          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-1">
              <Shield className="w-4 h-4" />
              <span>Role</span>
            </label>
            <Badge className={getRoleColor(profile.role)}>{profile.role}</Badge>
          </div>
          {/* </CardContent>
          </Card> */}

          {/* <Card>
            <CardHeader>
              <CardTitle>Social Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    GitHub
                  </label>
                  <Input
                    value={formData.socialLinks.github}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        socialLinks: {
                          ...prev.socialLinks,
                          github: e.target.value,
                        },
                      }))
                    }
                    placeholder="https://github.com/username"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    LinkedIn
                  </label>
                  <Input
                    value={formData.socialLinks.linkedin}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        socialLinks: {
                          ...prev.socialLinks,
                          linkedin: e.target.value,
                        },
                      }))
                    }
                    placeholder="https://linkedin.com/in/username"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Twitter
                  </label>
                  <Input
                    value={formData.socialLinks.twitter}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        socialLinks: {
                          ...prev.socialLinks,
                          twitter: e.target.value,
                        },
                      }))
                    }
                    placeholder="https://twitter.com/username"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Website
                  </label>
                  <Input
                    value={formData.socialLinks.website}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        socialLinks: {
                          ...prev.socialLinks,
                          website: e.target.value,
                        },
                      }))
                    }
                    placeholder="https://yourwebsite.com"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Skills</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Input
                    placeholder="Add a skill and press Enter"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && e.currentTarget.value.trim()) {
                        const skill = e.currentTarget.value.trim();
                        if (!formData.skills.includes(skill)) {
                          setFormData((prev) => ({
                            ...prev,
                            skills: [...prev.skills, skill],
                          }));
                        }
                        e.currentTarget.value = "";
                      }
                    }}
                  />
                  <div className="flex flex-wrap gap-2">
                    {formData.skills.map((skill, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="bg-blue-50 text-blue-700 border-blue-200"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              skills: prev.skills.filter((_, i) => i !== index),
                            }))
                          }
                          className="ml-1 text-blue-500 hover:text-blue-700"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Interests</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Input
                    placeholder="Add an interest and press Enter"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && e.currentTarget.value.trim()) {
                        const interest = e.currentTarget.value.trim();
                        if (!formData.interests.includes(interest)) {
                          setFormData((prev) => ({
                            ...prev,
                            interests: [...prev.interests, interest],
                          }));
                        }
                        e.currentTarget.value = "";
                      }
                    }}
                  />
                  <div className="flex flex-wrap gap-2">
                    {formData.interests.map((interest, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="bg-purple-50 text-purple-700 border-purple-200"
                      >
                        {interest}
                        <button
                          type="button"
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              interests: prev.interests.filter(
                                (_, i) => i !== index
                              ),
                            }))
                          }
                          className="ml-1 text-purple-500 hover:text-purple-700"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div> */}
        </div>

        <div className="flex justify-end space-x-3 mt-6 pt-6 border-t">
          <Button
            variant="ghost"
            onClick={handleCancel}
            className="flex items-center space-x-2"
          >
            <span>Cancel</span>
          </Button>
          <Button
            onClick={handleSave}
            disabled={updateMutation.isPending}
            className="flex items-center space-x-2 bg-blue-500 text-white hover:bg-blue-700"
          >
            <Save className="w-4 h-4" />
            <span>
              {updateMutation.isPending ? "Saving..." : "Save Changes"}
            </span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
