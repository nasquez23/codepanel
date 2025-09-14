"use client";

import { FormEvent, useState } from "react";
import { useAssignment, useSubmitAssignment } from "@/hooks/use-assignments";
import { useAuth } from "@/hooks/use-auth";
import { CreateSubmissionRequest } from "@/types/assignment";
import { ProgrammingLanguageDisplayNames } from "@/types/problem-post";
import { Button } from "@/components/ui/button";
import { formatDate, formatDistanceToNow } from "date-fns";
import { ArrowLeft, Send, FileText, Edit } from "lucide-react";
import Link from "next/link";
import CodeEditor from "@/components/code-editor";
import { Card } from "../ui/card";
import { DifficultyBadge } from "../ui/difficulty-badge";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";
import ProfilePicture from "../profile-picture";
import { CategoryBadge } from "../ui/category-badge";
import { TagBadge } from "../ui/tag-badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

interface AssignmentDetailsProps {
  id: string;
}

export default function AssignmentDetails({ id }: AssignmentDetailsProps) {
  const { user } = useAuth();
  const { data: assignment, isLoading, isError, error } = useAssignment(id);
  const submitMutation = useSubmitAssignment();

  const [isSubmitOpen, setIsSubmitOpen] = useState<boolean>(false);
  const [submissionCode, setSubmissionCode] = useState<string>("");
  const [submissionError, setSubmissionError] = useState<string>("");
  const [isSubmissionOpen, setIsSubmissionOpen] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmissionError("");

    if (!submissionCode.trim()) {
      setSubmissionError("Code is required");
      return;
    }

    try {
      const submissionData: CreateSubmissionRequest = {
        code: submissionCode,
      };

      await submitMutation.mutateAsync({
        assignmentId: id,
        data: submissionData,
      });

      setSubmissionCode("");
      setIsSubmitOpen(false);
    } catch (error: any) {
      setSubmissionError(
        error.response?.data?.message || "Failed to submit assignment"
      );
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading assignment...</span>
      </div>
    );
  }

  if (isError || !assignment) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-md p-6 text-center">
          <p className="text-red-600 mb-4">
            {error?.message || "Assignment not found."}
          </p>
          <Link href="/assignments">
            <Button>Back to Assignments</Button>
          </Link>
        </div>
      </div>
    );
  }

  const isOwner = user?.id === assignment.instructor.id;
  const canEdit = user && (user.role === "ADMIN" || isOwner);
  const canSubmit =
    user &&
    user.role === "STUDENT" &&
    !assignment.hasSubmitted &&
    assignment.isActive;
  const isOverdue =
    assignment.dueDate && new Date(assignment.dueDate) < new Date();
  const isDueSoon =
    !isOverdue &&
    assignment.dueDate &&
    new Date(assignment.dueDate) <= new Date(Date.now() + 24 * 60 * 60 * 1000);

  return (
    <div className="max-w-7xl mx-auto p-6">
      <Link href="/assignments">
        <Button
          variant="ghost"
          size="sm"
          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Assignments
        </Button>
      </Link>

      <Card className="bg-white rounded-lg shadow-lg p-8 mt-5">
        <div className="flex items-center gap-3 mb-0">
          <DifficultyBadge difficulty={assignment.difficultyLevel} size="lg" />
          <Badge
            className={cn(
              "rounded-lg px-4 py-2 font-medium text-base",
              assignment.isActive
                ? "bg-blue-100 text-blue-500"
                : "bg-red-100 text-red-500"
            )}
          >
            {assignment.isActive ? "Active" : "Inactive"}
          </Badge>
        </div>
        <div className="flex justify-between items-start">
          <h1 className="text-3xl font-bold text-gray-900">
            {assignment.title}
          </h1>

          <div className="flex gap-2">
            {canEdit && (
              <Link href={`/assignments/${assignment.id}/edit`}>
                <Button
                  variant="outline"
                  className="text-blue-600 hover:text-blue-700"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              </Link>
            )}

            {isOwner && (
              <Link href={`/assignments/${assignment.id}/submissions`}>
                <Button variant="outline">
                  <FileText className="w-4 h-4 mr-2" />
                  View Submissions ({assignment.submissionCount})
                </Button>
              </Link>
            )}
          </div>
        </div>

        <div className="flex gap-5">
          <div className="w-2/3">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Description
            </h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {assignment.description}
            </p>
          </div>
          <div className="flex flex-col w-1/3 bg-gray-100 px-5 py-3 rounded-lg gap-y-3">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Assignment Details
            </h2>
            <div className="flex flex-col gap-1">
              <span className="text-gray-500">Due Date</span>
              <span
                className={cn(
                  "font-medium",
                  isOverdue && "text-red-600",
                  isDueSoon && "text-orange-600"
                )}
              >
                {assignment.dueDate
                  ? formatDate(new Date(assignment.dueDate), "MMM d, yyyy")
                  : "No due date"}{" "}
                {isOverdue && " (Overdue)"}
                {isDueSoon && " (Due Soon)"}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-gray-500">Language</span>
              <span className="font-medium">
                {ProgrammingLanguageDisplayNames[assignment.language]}
              </span>
            </div>
            {(assignment.category ||
              (assignment.tags && assignment.tags.length > 0)) && (
              <div>
                <span className="text-gray-500">Related Topics</span>
                <div className="flex items-center gap-2 my-3 flex-wrap">
                  {assignment.category && (
                    <CategoryBadge
                      category={assignment.category}
                      size="sm"
                      variant="secondary"
                    />
                  )}
                  {assignment.tags && assignment.tags.length > 0 && (
                    <>
                      {assignment.tags.slice(0, 3).map((tag) => (
                        <TagBadge
                          key={tag.id}
                          tag={tag}
                          size="sm"
                          variant="secondary"
                        />
                      ))}
                      {assignment.tags.length > 3 && (
                        <span className="text-xs text-gray-500">
                          +{assignment.tags.length - 3} more
                        </span>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}
            <div className="flex flex-col gap-1">
              <span className="text-gray-500">Submissions</span>
              <span className="font-medium">
                {assignment.submissionCount} Students
              </span>
            </div>
            <div className="flex flex-col gap-1 mt-5">
              <h2 className="text-gray-900 font-medium text-lg mb-2">
                Instructor
              </h2>
              <div className="flex items-center gap-2">
                <ProfilePicture
                  profilePictureUrl={assignment.instructor.profilePictureUrl}
                  firstName={assignment.instructor.firstName}
                  lastName={assignment.instructor.lastName}
                  className="size-10"
                />
                <span className="font-medium">
                  {assignment.instructor.firstName}{" "}
                  {assignment.instructor.lastName}
                </span>
              </div>
              <span className="text-blue-500 mt-1">
                {assignment.instructor.email}
              </span>
            </div>
            {assignment.hasSubmitted && assignment.mySubmission && (
              <Button
                className="w-full mt-5 bg-blue-500 text-white hover:bg-blue-700"
                onClick={() => setIsSubmissionOpen(true)}
              >
                View Submission
              </Button>
            )}
            {canSubmit && !isOverdue && (
              <Button
                className="w-full mt-5 bg-blue-500 text-white hover:bg-blue-700"
                onClick={() => setIsSubmitOpen(true)}
              >
                Submit Assignment
              </Button>
            )}
          </div>
        </div>

        {assignment.mySubmission && (
          <Dialog open={isSubmissionOpen} onOpenChange={setIsSubmissionOpen}>
            <DialogContent className="w-[800px]">
              <DialogHeader>
                <DialogTitle>Submission Details</DialogTitle>
                <DialogDescription>
                  View your submission details for this assignment.
                </DialogDescription>
              </DialogHeader>
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        assignment.mySubmission.status === "REVIEWED"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {assignment.mySubmission.status === "REVIEWED"
                        ? "Reviewed"
                        : "Pending Review"}
                    </span>

                    {assignment.mySubmission.grade !== null && (
                      <span className="text-lg font-semibold text-gray-900">
                        Score: {assignment.mySubmission.grade}/100
                      </span>
                    )}
                  </div>

                  <div className="text-sm text-gray-500">
                    Submitted{" "}
                    {formatDistanceToNow(
                      new Date(assignment.mySubmission.createdAt),
                      { addSuffix: true }
                    )}
                  </div>
                </div>

                {assignment.mySubmission.review && (
                  <div className="mb-4 p-4 bg-white rounded border">
                    <h4 className="font-medium text-gray-900 mb-2">
                      Instructor Feedback
                    </h4>
                    <p className="text-gray-700 mb-2">
                      {assignment.mySubmission.review.comment}
                    </p>
                    <div className="text-sm text-gray-500">
                      Reviewed by{" "}
                      {assignment.mySubmission.review.reviewer.firstName}{" "}
                      {assignment.mySubmission.review.reviewer.lastName}
                    </div>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        )}

        {/* {assignment.mySubmission && (
          <div className="mb-8 border-t pt-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              My Submission
            </h2>

            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      assignment.mySubmission.status === "REVIEWED"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {assignment.mySubmission.status === "REVIEWED"
                      ? "Reviewed"
                      : "Pending Review"}
                  </span>

                  {assignment.mySubmission.grade !== null && (
                    <span className="text-lg font-semibold text-gray-900">
                      Score: {assignment.mySubmission.grade}/100
                    </span>
                  )}
                </div>

                <div className="text-sm text-gray-500">
                  Submitted{" "}
                  {formatDistanceToNow(
                    new Date(assignment.mySubmission.createdAt),
                    { addSuffix: true }
                  )}
                </div>
              </div>

              {assignment.mySubmission.review && (
                <div className="mb-4 p-4 bg-white rounded border">
                  <h4 className="font-medium text-gray-900 mb-2">
                    Instructor Feedback
                  </h4>
                  <p className="text-gray-700 mb-2">
                    {assignment.mySubmission.review.comment}
                  </p>
                  <div className="text-sm text-gray-500">
                    Reviewed by{" "}
                    {assignment.mySubmission.review.reviewer.firstName}{" "}
                    {assignment.mySubmission.review.reviewer.lastName}
                  </div>
                </div>
              )} */}
      </Card>

      <Dialog open={isSubmitOpen} onOpenChange={setIsSubmitOpen}>
        <DialogContent className="w-[800px]">
          <DialogHeader>
            <DialogTitle>Submit Your Solution</DialogTitle>
            <DialogDescription>
              Paste or write your code and submit it for review.
            </DialogDescription>
          </DialogHeader>

          <form
            onSubmit={handleSubmit}
            className="space-y-4"
            onChange={() => submissionError && setSubmissionError("")}
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Code Solution
              </label>
              <CodeEditor
                code={submissionCode}
                language={assignment.language}
                onChange={(value) => setSubmissionCode(value || "")}
              />
            </div>

            {submissionError && (
              <div className="text-red-600 text-sm">{submissionError}</div>
            )}

            <DialogFooter>
              <div className="flex gap-3 sm:justify-end w-full">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setIsSubmitOpen(false);
                    setSubmissionCode("");
                    setSubmissionError("");
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={submitMutation.isPending}
                  className="flex items-center gap-2 bg-blue-500 text-white hover:bg-blue-700"
                >
                  {submitMutation.isPending ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Submit
                    </>
                  )}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
