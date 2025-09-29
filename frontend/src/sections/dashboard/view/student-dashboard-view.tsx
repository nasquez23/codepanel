"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useMySubmissions } from "@/hooks/use-assignments";
import { useMyStudentStats } from "@/hooks";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, FileText, Trophy, Star, Shapes, Pin } from "lucide-react";
import ProfilePicture from "@/components/profile-picture";
import DashboardStatCard from "../dashboard-stat-card";
import DashboardStudentOverview from "../dashboard-student-overview";
import DashboardStudentProblems from "../dashboard-student-problems";
import DashboardStudentSubmissions from "../dashboard-student-submissions";

export default function StudentDashboardView() {
  const { user } = useAuth();

  if (!user || user.role !== "STUDENT") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Access denied. Students only.</p>
        </div>
      </div>
    );
  }

  const { data: submissionsData } = useMySubmissions(0, 5);
  const { data: stats } = useMyStudentStats(user.id, !!user);

  const [activeTab, setActiveTab] = useState<
    "overview" | "submissions" | "my-problems"
  >("overview");

  return (
    <>
      <Card className="mb-8">
        <CardHeader className="flex flex-row items-center gap-4">
          <ProfilePicture
            profilePictureUrl={user.profilePictureUrl}
            firstName={user.firstName}
            lastName={user.lastName}
            className="size-12"
          />
          <CardTitle className="text-2xl font-bold text-gray-900">
            Welcome back, {user.firstName + " " + user.lastName}!
          </CardTitle>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <DashboardStatCard
          title="Problems Posted"
          value={stats?.problemsPosted ?? 0}
          icon={
            <Pin className="size-14 text-green-600 bg-green-100 p-4 rounded-lg" />
          }
          valueColor="text-green-600"
        />

        <DashboardStatCard
          title="Total Submissions"
          value={
            stats?.totalSubmissions ?? (submissionsData?.totalElements || 0)
          }
          icon={
            <FileText className="size-14 text-yellow-600 bg-yellow-100 p-4 rounded-lg" />
          }
          valueColor="text-yellow-600"
        />

        <DashboardStatCard
          title="Average Grade"
          value={
            stats?.averageGrade ? `${stats.averageGrade.toFixed(1)}%` : "—"
          }
          icon={
            <Star className="size-14 text-blue-600 bg-blue-100 p-4 rounded-lg" />
          }
          valueColor="text-blue-600"
        />

        <DashboardStatCard
          title="Total Points"
          value={stats?.totalPoints ?? 0}
          icon={
            <Trophy className="size-14 text-purple-600 bg-purple-100 p-4 rounded-lg" />
          }
          valueColor="text-purple-600"
        />
      </div>

      <Card className="px-3 py-4">
        <Tabs
          value={activeTab}
          onValueChange={(value) =>
            setActiveTab(value as "overview" | "submissions" | "my-problems")
          }
          className="w-full px-0 sm:px-3"
        >
          <TabsList className="grid w-full grid-cols-3 md:grid-cols-6 px-0">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Shapes className="size-4" /> Overview
            </TabsTrigger>
            <TabsTrigger
              value="submissions"
              className="flex items-center gap-2"
            >
              <BookOpen className="size-4" /> Submissions
            </TabsTrigger>
            <TabsTrigger
              value="my-problems"
              className="flex items-center gap-2"
            >
              <FileText className="size-4" /> My Problems
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="px-0">
            <DashboardStudentOverview
              onViewAllSubmissions={() => setActiveTab("submissions")}
              onViewAllProblems={() => setActiveTab("my-problems")}
            />
          </TabsContent>

          <TabsContent value="submissions">
            <DashboardStudentSubmissions />
          </TabsContent>

          <TabsContent value="my-problems">
            <DashboardStudentProblems />
          </TabsContent>
        </Tabs>
      </Card>
    </>
  );
}
