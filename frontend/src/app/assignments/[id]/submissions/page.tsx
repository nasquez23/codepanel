import SubmissionsList from "@/components/assignments/submissions-list";
import { ProtectedRoute } from "@/components/protected-route";
import { Metadata } from "next";

interface SubmissionsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function SubmissionsPage({
  params,
}: SubmissionsPageProps) {
  const { id } = await params;

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-blue-200/20">
        <SubmissionsList assignmentId={id} />
      </div>
    </ProtectedRoute>
  );
}

export function generateMetadata(): Metadata {
  return {
    title: "Assignment  Submissions | CodePanel",
    description: "View submissions for an assignment on CodePanel.",
  };
}
