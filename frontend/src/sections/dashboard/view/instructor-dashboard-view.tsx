"use client";

import { useState } from "react";
import { useMyAssignments, usePendingReviews } from "@/hooks/use-assignments";
import { useAuth } from "@/hooks/use-auth";
import AssignmentCard from "@/components/assignments/assignment-card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatDistanceToNow } from "date-fns";
import {
  Plus,
  BookOpen,
  Clock,
  CheckCircle,
  AlertCircle,
  Users,
  FileText,
  Star,
  Eye,
  Loader2,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";

export default function InstructorDashboard() {
  const { user } = useAuth();
  const [assignmentsPage, setAssignmentsPage] = useState(0);
  const [reviewsPage, setReviewsPage] = useState(0);

  const {
    data: assignmentsData,
    isLoading: assignmentsLoading,
    isError: assignmentsError,
  } = useMyAssignments(assignmentsPage, 6);

  const {
    data: pendingReviewsData,
    isLoading: reviewsLoading,
    isError: reviewsError,
  } = usePendingReviews(reviewsPage, 10);

  if (!user || (user.role !== "INSTRUCTOR" && user.role !== "ADMIN")) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Access Denied
        </h3>
        <p className="text-gray-500">
          Only instructors and administrators can access this dashboard.
        </p>
      </div>
    );
  }

  const assignments = assignmentsData?.content || [];
  const pendingReviews = pendingReviewsData?.content || [];
  const hasMoreAssignments = assignmentsData && !assignmentsData.last;
  const hasMoreReviews = pendingReviewsData && !pendingReviewsData.last;

  // Calculate stats
  const totalAssignments = assignmentsData?.totalElements || 0;
  const activeAssignments = assignments.filter((a) => a.isActive).length;
  const totalSubmissions = assignments.reduce(
    (sum, a) => sum + a.submissionCount,
    0
  );
  const totalPendingReviews = pendingReviewsData?.totalElements || 0;

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">
          Instructor Dashboard
        </h1>
        <p className="text-gray-600 mt-2">
          Welcome back, {user.firstName}! Manage your assignments and review
          submissions.
        </p>

        <Link href="/assignments/create">
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create Assignment
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Assignments"
          value={totalAssignments}
          icon={<BookOpen className="h-6 w-6" />}
          color="blue"
        />
        <StatCard
          title="Active Assignments"
          value={activeAssignments}
          icon={<CheckCircle className="h-6 w-6" />}
          color="green"
        />
        <StatCard
          title="Total Submissions"
          value={totalSubmissions}
          icon={<FileText className="h-6 w-6" />}
          color="purple"
        />
        <StatCard
          title="Pending Reviews"
          value={totalPendingReviews}
          icon={<Clock className="h-6 w-6" />}
          color="orange"
        />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="assignments" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="assignments">My Assignments</TabsTrigger>
          <TabsTrigger value="reviews">
            Pending Reviews{" "}
            {totalPendingReviews > 0 && `(${totalPendingReviews})`}
          </TabsTrigger>
        </TabsList>

        {/* Assignments Tab */}
        <TabsContent value="assignments" className="space-y-6">
          {assignmentsLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
              <span className="ml-2 text-gray-600">Loading assignments...</span>
            </div>
          ) : assignmentsError ? (
            <div className="text-center py-12">
              <p className="text-red-600">
                Failed to load assignments. Please try again later.
              </p>
            </div>
          ) : assignments.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No assignments yet
              </h3>
              <p className="text-gray-500 mb-6">
                Create your first assignment to get started with CodePanel.
              </p>
              <Link href="/assignments/create">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Assignment
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {assignments.map((assignment) => (
                  <AssignmentCard
                    key={assignment.id}
                    assignment={assignment}
                    showActions={true}
                  />
                ))}
              </div>

              {hasMoreAssignments && (
                <div className="text-center">
                  <Button
                    variant="outline"
                    onClick={() => setAssignmentsPage(assignmentsPage + 1)}
                    className="flex items-center gap-2"
                  >
                    <ChevronDown className="h-4 w-4" />
                    Load More Assignments
                  </Button>
                </div>
              )}
            </div>
          )}
        </TabsContent>

        {/* Pending Reviews Tab */}
        <TabsContent value="reviews" className="space-y-6">
          {reviewsLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
              <span className="ml-2 text-gray-600">
                Loading pending reviews...
              </span>
            </div>
          ) : reviewsError ? (
            <div className="text-center py-12">
              <p className="text-red-600">
                Failed to load pending reviews. Please try again later.
              </p>
            </div>
          ) : pendingReviews.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                All caught up!
              </h3>
              <p className="text-gray-500">
                No submissions are waiting for your review right now.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingReviews.map((submission) => (
                <PendingReviewCard
                  key={submission.id}
                  submission={submission}
                />
              ))}

              {hasMoreReviews && (
                <div className="text-center pt-6">
                  <Button
                    variant="outline"
                    onClick={() => setReviewsPage(reviewsPage + 1)}
                    className="flex items-center gap-2"
                  >
                    <ChevronDown className="h-4 w-4" />
                    Load More Reviews
                  </Button>
                </div>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </>
  );
}

function StatCard({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: "blue" | "green" | "purple" | "orange";
}) {
  const colorClasses = {
    blue: "bg-blue-500 text-blue-600",
    green: "bg-green-500 text-green-600",
    purple: "bg-purple-500 text-purple-600",
    orange: "bg-orange-500 text-orange-600",
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div className="flex items-center">
        <div className={`p-3 rounded-lg bg-opacity-10 ${colorClasses[color]}`}>
          {icon}
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );
}

function PendingReviewCard({ submission }: { submission: any }) {
  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Student Info */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
              {submission.student.firstName[0]}
              {submission.student.lastName[0]}
            </div>
            <div>
              <h3 className="font-medium text-gray-900">
                {submission.student.firstName} {submission.student.lastName}
              </h3>
              <p className="text-sm text-gray-500">
                {submission.student.email}
              </p>
            </div>
          </div>

          {/* Assignment Info */}
          <div className="ml-6">
            <Link
              href={`/assignments/${submission.assignment.id}`}
              className="font-medium text-blue-600 hover:text-blue-800"
            >
              {submission.assignment.title}
            </Link>
            <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
              <Clock className="w-4 h-4" />
              <span>
                Submitted{" "}
                {formatDistanceToNow(new Date(submission.createdAt), {
                  addSuffix: true,
                })}
              </span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <Link href={`/submissions/${submission.id}`}>
          <Button className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            Review
          </Button>
        </Link>
      </div>
    </div>
  );
}
