import DashboardProblemPostCard from "./dashboard-problem-post-card";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useMySubmissions } from "@/hooks/use-assignments";
import { useMyProblemPosts } from "@/hooks/use-problem-posts";
import DashboardSubmissionCard from "./dashboard-submission-card";
import { useAuth } from "@/hooks";

export default function DashboardStudentOverview({
  onViewAllSubmissions,
  onViewAllProblems,
}: {
  onViewAllSubmissions?: () => void;
  onViewAllProblems?: () => void;
}) {
  const { isAuthenticated } = useAuth();
  const { data: recentSubmissions } = useMySubmissions(0, 3);
  const { data: recentProblems } = useMyProblemPosts(
    0,
    3,
    true,
    isAuthenticated
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="border-none shadow-none">
        <CardHeader className="flex items-center justify-between pb-3 max-md:px-2 px-4">
          <CardTitle className="text-lg">Recent Submissions</CardTitle>
          <Button
            variant="ghost"
            className="cursor-pointer text-blue-500 hover:text-blue-500 hover:bg-blue-50"
            onClick={onViewAllSubmissions}
          >
            View All
          </Button>
        </CardHeader>
        <CardContent className="space-y-4 max-md:px-0 px-3">
          {(recentSubmissions?.content || []).slice(0, 3).map((s) => (
            <DashboardSubmissionCard key={s.id} submission={s} />
          ))}
          {(recentSubmissions?.content?.length || 0) === 0 && (
            <div className="text-sm text-gray-500">No submissions yet.</div>
          )}
        </CardContent>
      </Card>

      <Card className="border-none shadow-none">
        <CardHeader className="flex items-center justify-between max-md:px-2 px-4">
          <CardTitle className="text-lg">Recent Problems</CardTitle>
          <Button
            variant="ghost"
            className="cursor-pointer text-blue-500 hover:text-blue-500 hover:bg-blue-50"
            onClick={onViewAllProblems}
          >
            View All
          </Button>
        </CardHeader>
        <CardContent className="space-y-4 max-md:px-0 px-3">
          {(recentProblems?.content || []).slice(0, 3).map((p) => (
            <DashboardProblemPostCard key={p.id} problemPost={p} />
          ))}
          {(recentProblems?.content?.length || 0) === 0 && (
            <div className="text-sm text-gray-500">No problems posted yet.</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
