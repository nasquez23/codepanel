"use client";

import SubmissionsList from "@/components/assignments/submissions-list";
import { useAssignment } from "@/hooks/use-assignments";

interface SubmissionsPageProps {
  params: {
    id: string;
  };
}

export default function SubmissionsPage({ params }: SubmissionsPageProps) {
  const { id } = params;
  const { data: assignment } = useAssignment(id);

  return (
    <div className="min-h-screen bg-gray-50">
      <SubmissionsList
        assignmentId={id}
        assignmentTitle={assignment?.title || "Assignment"}
      />
    </div>
  );
}
