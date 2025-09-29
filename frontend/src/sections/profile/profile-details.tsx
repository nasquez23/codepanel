"use client";

import { Badge } from "@/components/ui/badge";
import { useProfile, useMyStudentStats, useAuth } from "@/hooks";
import { Github, Linkedin } from "lucide-react";
import { roleNameDisplay } from "@/lib/utils";

export function ProfileDetails() {
  const { user } = useAuth();
  const { data: profile } = useProfile(user?.id || "", !!user);
  const { data: stats } = useMyStudentStats(profile?.id || "", !!user);

  if (!profile) return null;

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <h1 className="text-2xl font-medium">Personal Information</h1>

        <div>
          <label className="text-sm font-medium text-gray-500">Email</label>
          <p className="text-gray-900">{profile.email}</p>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-500">Role</label>
          <p className="text-gray-900">{roleNameDisplay[profile.role]}</p>
        </div>

        {profile.bio && (
          <div>
            <label className="text-sm font-medium text-gray-500">Bio</label>
            <p className="text-gray-900">{profile.bio}</p>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <h1 className="text-2xl font-medium">Academic Progress</h1>
        <div className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center">
                  <span className="text-blue-600 text-sm">📝</span>
                </div>
                <span className="text-sm font-medium text-gray-700">
                  Assignments Completed
                </span>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">
                  {stats?.totalSubmissions || 0}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-green-100 rounded flex items-center justify-center">
                  <span className="text-green-600 text-sm">🏆</span>
                </div>
                <span className="text-sm font-medium text-gray-700">
                  Average Grade
                </span>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-600">
                  {stats?.averageGrade
                    ? `${stats.averageGrade.toFixed(1)}%`
                    : "N/A"}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-purple-100 rounded flex items-center justify-center">
                  <span className="text-purple-600 text-sm">📊</span>
                </div>
                <span className="text-sm font-medium text-gray-700">
                  Problems Posted
                </span>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-purple-600">
                  {stats?.problemsPosted || 0}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-orange-100 rounded flex items-center justify-center">
                  <span className="text-orange-600 text-sm">🎯</span>
                </div>
                <span className="text-sm font-medium text-gray-700">
                  Total Points
                </span>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-orange-600">
                  {stats?.totalPoints?.toLocaleString() || 0}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h1 className="text-2xl font-medium">Skills</h1>

        <div className="flex flex-wrap gap-2">
          <div className="flex flex-wrap gap-2">
            {profile.skills && profile.skills.length > 0 ? (
              profile.skills.map((skill) => (
                <Badge
                  key={skill}
                  variant="outline"
                  className="bg-blue-50 text-blue-700 border-blue-200"
                >
                  {skill}
                </Badge>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No skills added yet</p>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h1 className="text-2xl font-medium">Interests</h1>

        <div className="flex flex-wrap gap-2">
          <div className="flex flex-wrap gap-2">
            {profile.interests && profile.interests.length > 0 ? (
              profile.interests.map((interest) => (
                <Badge
                  key={interest}
                  variant="outline"
                  className="bg-purple-50 text-purple-700 border-purple-200"
                >
                  {interest}
                </Badge>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No interests added yet</p>
            )}
          </div>
        </div>
      </div>

      <div className="md:col-span-2 space-y-4">
        <h1 className="text-2xl font-medium">Social Links</h1>

        <div className="flex flex-wrap gap-6">
          <div className="flex flex-wrap gap-6">
            {profile.socialLinks?.github && (
              <a
                href={profile.socialLinks.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <Github className="w-5 h-5" />
                <span>GitHub</span>
              </a>
            )}
            {profile.socialLinks?.linkedin && (
              <a
                href={profile.socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <Linkedin className="w-5 h-5" />
                <span>LinkedIn</span>
              </a>
            )}
            {profile.socialLinks?.website && (
              <a
                href={profile.socialLinks.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <span>🌐</span>
                <span>Website</span>
              </a>
            )}
            {profile.socialLinks?.twitter && (
              <a
                href={profile.socialLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <span>🐦</span>
                <span>Twitter</span>
              </a>
            )}
            {(!profile.socialLinks ||
              Object.keys(profile.socialLinks).length === 0) && (
              <p className="text-gray-500 text-sm">No social links added yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
