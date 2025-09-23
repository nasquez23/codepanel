"use client";

import { useState } from "react";
import {
  useAssignment,
  useSubmissionsForAssignment,
} from "@/hooks/use-assignments";
import { AssignmentSubmission } from "@/types/assignment";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import {
  User,
  Clock,
  CheckCircle,
  AlertCircle,
  Eye,
  Star,
  Loader2,
  ChevronDown,
  FileText,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";

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
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <Link href={`/assignments/${assignmentId}`}>
          <Button variant="outline" size="sm" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Assignment
          </Button>
        </Link>

        <h1 className="text-3xl font-bold text-gray-900">Submissions</h1>
        <p className="text-gray-600 mt-2">
          {assignment?.title} • {submissionsData?.totalElements || 0}{" "}
          submissions
        </p>
      </div>

      {submissions.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No submissions yet
          </h3>
          <p className="text-gray-500">
            Students haven't submitted their solutions for this assignment yet.
          </p>
        </div>
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

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
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

          <div className="flex items-center gap-3">
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                isReviewed
                  ? "bg-green-100 text-green-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {isReviewed ? "Reviewed" : "Pending Review"}
            </span>

            {submission.grade !== null && (
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-500" />
                <span className="font-semibold text-gray-900">
                  {submission.grade}/100
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <Clock className="w-4 h-4" />
            <span>
              {formatDistanceToNow(new Date(submission.createdAt), {
                addSuffix: true,
              })}
            </span>
          </div>

          <Link href={`/submissions/${submission.id}`}>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Eye className="w-4 h-4" />
              {isReviewed ? "View Review" : "Review"}
            </Button>
          </Link>
        </div>
      </div>

      {submission.review && (
        <div className="mt-4 p-4 bg-gray-50 rounded border-l-4 border-green-500">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm text-gray-700 line-clamp-2">
                {submission.review.comment || "No comment provided"}
              </p>
            </div>
            <div className="text-sm text-gray-500 ml-4">
              Reviewed by {submission.review.reviewer.firstName}{" "}
              {submission.review.reviewer.lastName}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
