import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DifficultyBadge } from "@/components/ui/difficulty-badge";
import { Assignment } from "@/types/assignment";
import Link from "next/link";
import { format } from "date-fns";
import { ProgrammingLanguageBadge } from "@/components/ui/programming-language-badge";

export default function DashboardAssignmentCard({
  assignment,
}: {
  assignment: Assignment;
}) {
  const due = assignment.dueDate
    ? format(new Date(assignment.dueDate), "MMM d, yyyy")
    : "—";

  return (
    <Card className="bg-gray-50 gap-4">
      <CardHeader className="flex items-center justify-between">
        <Link href={`/assignments/${assignment.id}`}>
          <CardTitle className="hover:text-blue-600">
            {assignment.title}
          </CardTitle>
        </Link>
        <DifficultyBadge difficulty={assignment.difficultyLevel} size="sm" />
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <ProgrammingLanguageBadge language={assignment.language} />
          <span>Due Date: {due}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>{assignment.submissionCount} submissions</span>
          {/* {assignment.category && <span>• {assignment.category.name}</span>} */}
        </div>
      </CardContent>
    </Card>
  );
}
