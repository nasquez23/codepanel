import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useMyAssignments, usePendingReviews } from "@/hooks/use-assignments";
import DashboardAssignmentCard from "./dashboard-assignment-card";
import DashboardInstructorPendingReviewCard from "./dashboard-instructor-pending-review-card";

export default function DashboardInstructorOverview({
  onViewAllAssignments,
  onViewAllReviews,
}: {
  onViewAllAssignments?: () => void;
  onViewAllReviews?: () => void;
}) {
  const { data: recentAssignments } = useMyAssignments(0, 3);
  const { data: recentPendingReviews } = usePendingReviews(0, 3);

  const assignments = recentAssignments?.content || [];
  const pendingReviews = recentPendingReviews?.content || [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="border-none shadow-none">
        <CardHeader className="flex items-center justify-between pb-3 max-md:px-2 px-4">
          <CardTitle className="text-lg">Recent Assignments</CardTitle>
          <Button
            variant="ghost"
            className="cursor-pointer text-blue-500 hover:text-blue-500 hover:bg-blue-50"
            onClick={onViewAllAssignments}
          >
            View All
          </Button>
        </CardHeader>
        <CardContent className="space-y-4 max-md:px-0 px-3">
          {assignments.slice(0, 3).map((a) => (
            <DashboardAssignmentCard key={a.id} assignment={a} />
          ))}
          {assignments.length === 0 && (
            <div className="text-sm text-gray-500">No assignments yet.</div>
          )}
        </CardContent>
      </Card>

      <Card className="border-none shadow-none">
        <CardHeader className="flex items-center justify-between pb-3 max-md:px-2 px-4">
          <CardTitle className="text-lg">Recent Pending Reviews</CardTitle>
          <Button
            variant="ghost"
            className="cursor-pointer text-blue-500 hover:text-blue-500 hover:bg-blue-50"
            onClick={onViewAllReviews}
          >
            View All
          </Button>
        </CardHeader>
        <CardContent className="space-y-3 max-md:px-0 px-3">
          {pendingReviews.slice(0, 3).map((s) => (
            <DashboardInstructorPendingReviewCard key={s.id} submission={s} />
          ))}
          {pendingReviews.length === 0 && (
            <div className="text-sm text-gray-500">
              No submissions waiting for review.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
