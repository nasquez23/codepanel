import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useReviewSubmission } from "@/hooks";
import { useAuth } from "@/hooks/use-auth";
import { AssignmentSubmission, CreateReviewRequest } from "@/types/assignment";
import { formatDate } from "date-fns";
import { Star } from "lucide-react";
import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import SubmissionDetailsReview from "./submission-details-review";
import { Role } from "@/types/auth";

export default function SubmissionDetailsGrading({
  submission,
}: {
  submission: AssignmentSubmission;
}) {
  const { user } = useAuth();
  const createReviewMutation = useReviewSubmission();
  const router = useRouter();

  const [reviewForm, setReviewForm] = useState({
    comment: "",
    score: "",
  });

  const handleReviewSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (
      createReviewMutation.isPending ||
      !reviewForm.comment.trim() ||
      !reviewForm.score
    ) {
      return;
    }

    const reviewData: CreateReviewRequest = {
      comment: reviewForm.comment.trim(),
      score: parseInt(reviewForm.score),
    };

    createReviewMutation.mutate(
      { submissionId: submission.id, data: reviewData },
      {
        onSuccess: () => {
          setReviewForm({ comment: "", score: "" });
        },
      }
    );
  };

  const isInstructor = user?.role === Role.INSTRUCTOR || user?.role === Role.ADMIN;
  const isSubmissionOwner = user?.id === submission?.student.id;
  const canReview =
    isInstructor &&
    submission?.status === "PENDING_REVIEW" &&
    user?.id === submission?.assignment.instructor.id;

  return (
    <div className="p-3 mt-2">
      <h1 className="text-xl font-medium mb-8">Grade Submission</h1>
      {submission.review && <SubmissionDetailsReview submission={submission} />}

      {canReview ? (
        <div className="p-3 mt-2">
          <form onSubmit={handleReviewSubmit} className="space-y-4">
            <div className="flex items-center gap-2">
              <Label htmlFor="score" className="text-lg font-medium">
                Score:
              </Label>
              <Input
                id="score"
                type="number"
                min="0"
                max="100"
                className="w-24"
                value={reviewForm.score}
                onChange={(e) =>
                  setReviewForm((prev) => ({
                    ...prev,
                    score: e.target.value,
                  }))
                }
                placeholder="0"
                required
              />
              <span className="text-lg font-medium">/ 100</span>
            </div>
            <div>
              <Label htmlFor="comment" className="text-lg font-medium mb-2">
                Feedback
              </Label>
              <Textarea
                id="comment"
                className="text-base"
                value={reviewForm.comment}
                onChange={(e) =>
                  setReviewForm((prev) => ({
                    ...prev,
                    comment: e.target.value,
                  }))
                }
                placeholder="Provide detailed feedback on student's work, highlighting strengths and areas for improvement."
                rows={6}
                required
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => router.back()}
                className="text-[17px] p-6"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-blue-500 text-white text-[17px] hover:bg-blue-700 p-6"
                disabled={
                  createReviewMutation.isPending ||
                  !reviewForm.comment.trim() ||
                  !reviewForm.score
                }
              >
                {createReviewMutation.isPending
                  ? "Submitting..."
                  : "Submit Grade"}
              </Button>
            </div>
          </form>
        </div>
      ) : (
        <div className="p-3 mt-2">
          <p className="text-lg font-medium">
            Not graded yet, please wait for the instructor to grade your
            submission.
          </p>
        </div>
      )}
    </div>
  );
}
