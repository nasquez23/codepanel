import SubmissionStatusChip from "@/components/assignments/submission-status-chip";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CategoryBadge } from "@/components/ui/category-badge";
import { DifficultyBadge } from "@/components/ui/difficulty-badge";
import { AssignmentSubmission } from "@/types/assignment";
import Link from "next/link";

export default function DashboardSubmissionCard({
  submission,
}: {
  submission: AssignmentSubmission;
}) {
  return (
    <Card className="bg-gray-50 gap-2">
      <CardHeader className="flex items-center justify-between">
        <Link href={`/submissions/${submission.id}`}>
          <CardTitle className="hover:text-blue-600">
            {submission.assignment.title}
          </CardTitle>
        </Link>
        <SubmissionStatusChip status={submission.status} />
      </CardHeader>
      <CardContent>
        <DifficultyBadge difficulty={submission.assignment.difficultyLevel} />
        <CategoryBadge category={submission.assignment.category} size="sm" />
        {submission.review && (
          <span className="">Score: {submission.review.score} / 100</span>
        )}
      </CardContent>
    </Card>
  );
}
