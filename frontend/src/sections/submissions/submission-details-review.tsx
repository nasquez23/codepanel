import { AssignmentSubmission } from "@/types/assignment";
import { formatDate } from "date-fns";

export default function SubmissionDetailsReview({
  submission,
}: {
  submission: AssignmentSubmission;
}) {
  return (
    <div className="space-y-4">
      <div>
        <span className="text-lg font-medium">Score</span>
        <p className="text-2xl font-bold text-green-600">
          {submission.review?.score}/100
        </p>
      </div>
      <div>
        <span className="text-lg font-medium">Feedback</span>
        <div className="mt-1 p-4 bg-gray-50 rounded-lg">
          <p className="whitespace-pre-wrap">{submission.review?.comment}</p>
        </div>
      </div>
      <div className="text-sm text-gray-500">
        Reviewed on{" "}
        {formatDate(submission.review?.createdAt ?? "", "MM/dd/yyyy")}
      </div>
    </div>
  );
}
