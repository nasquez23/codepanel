"use client";

import { useState } from "react";
import {
  useAssignment,
  useSubmissionsForAssignment,
} from "@/hooks/use-assignments";
import { AssignmentSubmission } from "@/types/assignment";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatDistanceToNow, format } from "date-fns";
import {
  Clock,
  CheckCircle,
  Eye,
  Loader2,
  ChevronDown,
  FileText,
  ArrowLeft,
  Calendar,
} from "lucide-react";
import Link from "next/link";
import ProfilePicture from "@/components/profile-picture";

interface SubmissionsListProps {
  assignmentId: string;
}

export default function SubmissionsList({
  assignmentId,
}: SubmissionsListProps) {
  const [page, setPage] = useState(0);
  const { data: assignment } = useAssignment(assignmentId);

  const {
    data: submissionsData,
    isLoading,
    isError,
    error,
  } = useSubmissionsForAssignment(assignmentId, page, 10);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        <span className="ml-2 text-gray-600">Loading submissions...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">
          Failed to load submissions. Please try again later.
        </p>
        {error && (
          <p className="text-sm text-gray-500">
            {error instanceof Error ? error.message : "Unknown error"}
          </p>
        )}
      </div>
    );
  }

  const submissions = submissionsData?.content || [];
  const hasNextPage = submissionsData && !submissionsData.last;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <Link href={`/assignments/${assignmentId}`}>
          <Button
            variant="ghost"
            size="sm"
            className="mb-6 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Assignment
          </Button>
        </Link>

        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Student Submissions
            </h1>
            <p className="text-lg text-gray-600">{assignment?.title}</p>
            {assignment?.dueDate && (
              <div className="flex items-center gap-2 mt-3">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">
                  Due: {format(new Date(assignment.dueDate), "PPP")}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {submissions.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No submissions yet
              </h3>
              <p className="text-gray-500">
                Students haven't submitted their solutions for this assignment
                yet.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {submissions.map((submission) => (
            <SubmissionCard key={submission.id} submission={submission} />
          ))}

          {hasNextPage && (
            <div className="text-center pt-6">
              <Button
                variant="outline"
                onClick={() => setPage(page + 1)}
                className="flex items-center gap-2"
              >
                <ChevronDown className="h-4 w-4" />
                Load More Submissions
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function SubmissionCard({ submission }: { submission: AssignmentSubmission }) {
  const isReviewed = submission.status === "REVIEWED";
  const isLate =
    submission.submittedAt &&
    submission.assignment?.dueDate &&
    new Date(submission.submittedAt) > new Date(submission.assignment.dueDate);

  const getGradeColor = (grade: number) => {
    if (grade >= 90) return "text-green-600";
    if (grade >= 80) return "text-blue-600";
    if (grade >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  const getGradeBadgeColor = (grade: number) => {
    if (grade >= 90) return "bg-green-100 text-green-800 border-green-200";
    if (grade >= 80) return "bg-blue-100 text-blue-800 border-blue-200";
    if (grade >= 70) return "bg-yellow-100 text-yellow-800 border-yellow-200";
    return "bg-red-100 text-red-800 border-red-200";
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-blue-500">
      <CardContent className="px-6 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <ProfilePicture
              profilePictureUrl={submission.student.profilePictureUrl}
              firstName={submission.student.firstName}
              lastName={submission.student.lastName}
              className="w-12 h-12"
            />
            <div>
              <h3 className="font-semibold text-lg text-gray-900">
                {submission.student.firstName} {submission.student.lastName}
              </h3>
              <p className="text-sm text-gray-600">
                {submission.student.email}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <Clock className="w-3 h-3 text-gray-400" />
                <span className="text-xs text-gray-500">
                  Submitted{" "}
                  {formatDistanceToNow(new Date(submission.createdAt), {
                    addSuffix: true,
                  })}
                </span>
                {isLate && (
                  <Badge
                    variant="outline"
                    className="bg-red-50 text-red-700 border-red-200 text-xs"
                  >
                    Late
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-1">
            <Badge
              variant="outline"
              className={`${
                isReviewed
                  ? "bg-green-50 text-green-700 border-green-200"
                  : "bg-yellow-50 text-yellow-700 border-yellow-200"
              } mb-2`}
            >
              {isReviewed ? (
                <>
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Reviewed
                </>
              ) : (
                <>
                  <Clock className="w-3 h-3 mr-1" />
                  Pending Review
                </>
              )}
            </Badge>
            {submission.grade && (
              <div className="flex items-center justify-end gap-1">
                <span className="font-medium text-gray-600">Score: </span>
                <span className="text-lg font-bold text-green-600">
                  {submission.grade}
                </span>
                <span className="text-sm text-gray-500">/100</span>
              </div>
            )}
            <Link href={`/submissions/${submission.id}`}>
              <Button
                variant="outline"
                size="sm"
                className={`flex items-center gap-2 ${
                  isReviewed
                    ? "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 hover:text-blue-800"
                    : "bg-green-50 text-green-700 border-green-200 hover:bg-green-100 hover:text-green-800"
                }`}
              >
                <Eye className="w-4 h-4" />
                {isReviewed ? "View Review" : "Review Now"}
              </Button>
            </Link>
          </div>
        </div>

        {submission.review && (
          <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-green-50 rounded-lg border border-green-200">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-green-800">
                    Review Complete
                  </span>
                </div>
                <p className="text-sm text-gray-700 line-clamp-2">
                  {submission.review.comment ||
                    "No additional comments provided."}
                </p>
              </div>
              <div className="text-right ml-4">
                <p className="text-xs text-gray-500 mb-1">Reviewed</p>
                <p className="text-xs text-gray-500">
                  {formatDistanceToNow(new Date(submission.review.createdAt), {
                    addSuffix: true,
                  })}
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
