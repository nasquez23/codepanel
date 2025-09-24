"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useMyInstructorStats } from "@/hooks";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BookOpen,
  CheckCircle,
  Clock,
  FileText,
  AlertCircle,
  Shapes,
} from "lucide-react";
import DashboardStatCard from "../dashboard-stat-card";
import DashboardInstructorOverview from "../dashboard-instructor-overview";
import DashboardInstructorAssignments from "../dashboard-instructor-assignments";
import DashboardInstructorPendingReviews from "../dashboard-instructor-pending-reviews";

export default function InstructorDashboardView() {
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<
    "overview" | "assignments" | "reviews"
  >("overview");

  if (!user || (user.role !== "INSTRUCTOR" && user.role !== "ADMIN")) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-3" />
          <p className="text-red-600">Access denied. Instructors only.</p>
        </div>
      </div>
    );
  }

  const { data: stats } = useMyInstructorStats(user.id);

  const totalAssignments = stats?.totalAssignments ?? 0;
  const activeAssignments = stats?.activeAssignments ?? 0;
  const totalSubmissions = stats?.totalSubmissions ?? 0;
  const totalPendingReviews = stats?.pendingReviews ?? 0;

  return (
    <>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Welcome back, {user.firstName + " " + user.lastName}!
          </CardTitle>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <DashboardStatCard
          title="Total Assignments"
          value={totalAssignments}
          icon={
            <BookOpen className="size-14 text-blue-600 bg-blue-100 p-4 rounded-lg" />
          }
          valueColor="text-blue-600"
        />
        <DashboardStatCard
          title="Active Assignments"
          value={activeAssignments}
          icon={
            <CheckCircle className="size-14 text-green-600 bg-green-100 p-4 rounded-lg" />
          }
          valueColor="text-green-600"
        />
        <DashboardStatCard
          title="Total Submissions"
          value={totalSubmissions}
          icon={
            <FileText className="size-14 text-purple-600 bg-purple-100 p-4 rounded-lg" />
          }
          valueColor="text-purple-600"
        />
        <DashboardStatCard
          title="Pending Reviews"
          value={totalPendingReviews}
          icon={
            <Clock className="size-14 text-orange-600 bg-orange-100 p-4 rounded-lg" />
          }
          valueColor="text-orange-600"
        />
      </div>

      <Card className="px-3 py-4">
        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as any)}
          className="w-full px-0 sm:px-3"
        >
          <TabsList className="grid w-full grid-cols-3 md:grid-cols-6 px-0">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Shapes className="size-4" /> Overview
            </TabsTrigger>
            <TabsTrigger
              value="assignments"
              className="flex items-center gap-2"
            >
              <BookOpen className="size-4" /> My Assignments
            </TabsTrigger>
            <TabsTrigger value="reviews" className="flex items-center gap-2">
              <Clock className="size-4" /> Pending Reviews
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <DashboardInstructorOverview
              onViewAllAssignments={() => setActiveTab("assignments")}
              onViewAllReviews={() => setActiveTab("reviews")}
            />
          </TabsContent>

          <TabsContent value="assignments">
            <DashboardInstructorAssignments />
          </TabsContent>

          <TabsContent value="reviews" className="space-y-6">
            <DashboardInstructorPendingReviews />
          </TabsContent>
        </Tabs>
      </Card>
    </>
  );
}
