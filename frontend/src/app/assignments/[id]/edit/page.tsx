import EditAssignmentView from "@/sections/assignments/view/edit-assignment-view";
import { Metadata } from "next";

interface EditAssignmentPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditAssignmentPage({
  params,
}: EditAssignmentPageProps) {
  const { id } = await params;

  return (
    <div className="min-h-screen bg-blue-200/20">
      <EditAssignmentView assignmentId={id} />
    </div>
  );
}

export function generateMetadata(): Metadata {
  return {
    title: "Edit Assignment | CodePanel",
    description: "Edit an assignment on CodePanel.",
  };
}
