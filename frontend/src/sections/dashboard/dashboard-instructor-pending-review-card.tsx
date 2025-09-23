import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AssignmentSubmission } from "@/types/assignment";
import { Clock, FileText } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import ProfilePicture from "@/components/profile-picture";

export default function DashboardInstructorPendingReviewCard({
  submission,
}: {
  submission: AssignmentSubmission;
}) {
  return (
    <Card className="bg-gray-50 hover:shadow-md transition-shadow">
      <CardContent className="px-4 pt-1">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <ProfilePicture
              profilePictureUrl={submission.student.profilePictureUrl}
              firstName={submission.student.firstName}
              lastName={submission.student.lastName}
              className="size-10"
            />
            <div className="min-w-0">
              <div className="text-sm text-gray-700 truncate">
                <span className="font-medium">
                  {submission.student.firstName} {submission.student.lastName}
                </span>
              </div>
            </div>
          </div>

          <Button
            asChild
            className="shrink-0 bg-blue-600 text-white hover:bg-blue-700"
          >
            <Link
              href={`/submissions/${submission.id}`}
              className="flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              Review
            </Link>
          </Button>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <Link
            href={`/assignments/${submission.assignment.id}`}
            className="font-medium text-xl text-blue-600 hover:text-blue-800 truncate"
          >
            {submission.assignment.title}
          </Link>
          <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
            <Clock className="w-3.5 h-3.5" />
            <span>
              Submitted{" "}
              {formatDistanceToNow(new Date(submission.createdAt), {
                addSuffix: true,
              })}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
