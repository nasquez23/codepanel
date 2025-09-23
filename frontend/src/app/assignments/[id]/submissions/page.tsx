import SubmissionsList from "@/components/assignments/submissions-list";
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
    <div className="min-h-screen bg-gray-50">
      <SubmissionsList assignmentId={id} />
    </div>
  );
}

export function generateMetadata(): Metadata {
  return {
    title: "Assignment  Submissions | CodePanel",
    description: "View submissions for an assignment on CodePanel.",
  };
}
