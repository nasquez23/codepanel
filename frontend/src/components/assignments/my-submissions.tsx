"use client";

import { useState } from "react";
import { useMySubmissions } from "@/hooks/use-assignments";
import { AssignmentSubmission } from "@/types/assignment";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import {
  Clock,
  CheckCircle,
  AlertCircle,
  Eye,
  Star,
  Loader2,
  ChevronDown,
  FileText,
  BookOpen,
} from "lucide-react";
import Link from "next/link";

export default function MySubmissions() {
  const [page, setPage] = useState(0);

  const {
    data: submissionsData,
    isLoading,
    isError,
    error,
  } = useMySubmissions(page, 10);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        <span className="ml-2 text-gray-600">Loading your submissions...</span>
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <FileText className="h-6 w-6 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-900">
          My Submissions ({submissionsData?.totalElements || 0})
        </h2>
      </div>

      {submissions.length === 0 ? (
        <div className="text-center py-12">
          <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No submissions yet</h3>
          <p className="text-gray-500 mb-6">
            You haven't submitted any assignments yet. Check out the available assignments to get started.
          </p>
          <Link href="/assignments">
            <Button>Browse Assignments</Button>
          </Link>
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
        <div className="flex-1">
          {/* Assignment Title */}
          <Link 
            href={`/assignments/${submission.assignmentId}`}
            className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors"
          >
            {submission.assignmentTitle}
          </Link>

          {/* Status and Grade Row */}
          <div className="flex items-center gap-4 mt-2">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              isReviewed 
                ? "bg-green-100 text-green-800" 
                : "bg-yellow-100 text-yellow-800"
            }`}>
              {isReviewed ? "Reviewed" : "Pending Review"}
            </span>

            {submission.grade !== null && (
              <div className="flex items-center gap-1 bg-blue-50 text-blue-800 px-3 py-1 rounded-full text-sm">
                <Star className="w-4 h-4" />
                <span className="font-semibold">
                  {submission.grade}/100
                </span>
              </div>
            )}

            <div className="flex items-center gap-1 text-sm text-gray-500">
              <Clock className="w-4 h-4" />
              <span>
                Submitted {formatDistanceToNow(new Date(submission.createdAt), { addSuffix: true })}
              </span>
            </div>
          </div>

          {/* Review Preview */}
          {submission.review && submission.review.comment && (
            <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded">
              <p className="text-sm text-green-800 line-clamp-2">
                <span className="font-medium">Instructor feedback:</span> {submission.review.comment}
              </p>
            </div>
          )}
        </div>

        {/* Action Button */}
        <div className="ml-6">
          <Link href={`/submissions/${submission.id}`}>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              {isReviewed ? "View Review" : "View Submission"}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

