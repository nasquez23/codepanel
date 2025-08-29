"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { CalendarDays, Clock, User, FileText, Star } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useSubmission, useReviewSubmission } from "@/hooks/use-assignments";
import { CreateReviewRequest } from "@/types/assignment";
import CodeBlock from "@/components/code-block";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Badge } from "../ui/badge";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";

interface SubmissionDetailsProps {
  id: string;
}

export default function SubmissionDetails({ id }: SubmissionDetailsProps) {
  const router = useRouter();
  const { user } = useAuth();
  const { data: submission, isLoading, error } = useSubmission(id);
  const createReviewMutation = useReviewSubmission();

  const [reviewForm, setReviewForm] = useState({
    comment: "",
    score: "",
  });

  const isInstructor = user?.role === "INSTRUCTOR" || user?.role === "ADMIN";
  const isSubmissionOwner = user?.id === submission?.student.id;
  const canReview =
    isInstructor &&
    submission?.status === "PENDING_REVIEW" &&
    user?.id === submission?.assignment.instructor.id;

  const handleReviewSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!reviewForm.comment.trim() || !reviewForm.score) {
      return;
    }

    const reviewData: CreateReviewRequest = {
      comment: reviewForm.comment.trim(),
      score: parseInt(reviewForm.score),
    };

    createReviewMutation.mutate(
      { submissionId: id, data: reviewData },
      {
        onSuccess: () => {
          setReviewForm({ comment: "", score: "" });
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !submission) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-red-600 mb-4">
                {error ? "Failed to load submission" : "Submission not found"}
              </p>
              <Button onClick={() => router.back()}>Go Back</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isSubmissionOwner && !isInstructor) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-red-600 mb-4">
                You don't have permission to view this submission
              </p>
              <Button onClick={() => router.back()}>Go Back</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING_REVIEW":
        return "bg-yellow-100 text-yellow-800";
      case "REVIEWED":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "PENDING_REVIEW":
        return "Pending Review";
      case "REVIEWED":
        return "Reviewed";
      default:
        return status;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => router.back()} className="mb-4">
          ← Back
        </Button>
        <h1 className="text-3xl font-bold">Submission Details</h1>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="size-5" />
              {submission.assignment.title}
            </CardTitle>
            <CardDescription>
              {submission.assignment.description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <User className="size-4 text-gray-500" />
                <span>
                  Instructor: {submission.assignment?.instructor.firstName}{" "}
                  {submission.assignment?.instructor.lastName}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CalendarDays className="size-4 text-gray-500" />
                <span>
                  Due:{" "}
                  {submission.assignment?.dueDate
                    ? formatDate(submission.assignment?.dueDate)
                    : "No due date"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-500">Language:</span>
                <Badge variant="secondary">
                  {submission.assignment.language}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="size-5" />
              Submission by {submission.student.firstName}{" "}
              {submission.student.lastName}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-10 text-sm mb-4">
              <div className="flex items-center gap-2">
                <Clock className="size-4 text-gray-500" />
                <span>
                  Submitted: {formatDate(submission.createdAt.toString())}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-500">Status:</span>
                <Badge className={getStatusColor(submission.status)}>
                  {getStatusText(submission.status)}
                </Badge>
              </div>
              {submission.grade !== null && (
                <div className="flex items-center gap-2">
                  <Star className="size-4 text-gray-500" />
                  <span>Grade: {submission.grade}/100</span>
                </div>
              )}
            </div>

            <Separator className="my-4" />

            <div>
              <h3 className="text-lg font-semibold mb-3">Submitted Code</h3>
              <CodeBlock
                code={submission.code}
                language={submission.assignment.language.toLowerCase() as any}
              />
            </div>
          </CardContent>
        </Card>

        {submission.review && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="size-5" />
                Review
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">
                      Reviewer
                    </Label>
                    <p>
                      {submission.review.reviewer.firstName}{" "}
                      {submission.review.reviewer.lastName}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">
                      Score
                    </Label>
                    <p className="text-2xl font-bold text-green-600">
                      {submission.review.score}/100
                    </p>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">
                    Comments
                  </Label>
                  <div className="mt-1 p-4 bg-gray-50 rounded-lg">
                    <p className="whitespace-pre-wrap">
                      {submission.review.comment}
                    </p>
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  Reviewed on {formatDate(submission.review.createdAt)}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {canReview && (
          <Card>
            <CardHeader>
              <CardTitle>Add Review</CardTitle>
              <CardDescription>
                Provide feedback and a grade for this submission
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="score" className="mb-2">
                    Score (0-100)
                  </Label>
                  <Input
                    id="score"
                    type="number"
                    min="0"
                    max="100"
                    value={reviewForm.score}
                    onChange={(e) =>
                      setReviewForm((prev) => ({
                        ...prev,
                        score: e.target.value,
                      }))
                    }
                    placeholder="Enter score"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="comment" className="mb-2">
                    Comments
                  </Label>
                  <Textarea
                    id="comment"
                    value={reviewForm.comment}
                    onChange={(e) =>
                      setReviewForm((prev) => ({
                        ...prev,
                        comment: e.target.value,
                      }))
                    }
                    placeholder="Provide detailed feedback..."
                    rows={6}
                    required
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    type="submit"
                    disabled={
                      createReviewMutation.isPending ||
                      !reviewForm.comment.trim() ||
                      !reviewForm.score
                    }
                  >
                    {createReviewMutation.isPending
                      ? "Submitting..."
                      : "Submit Review"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
