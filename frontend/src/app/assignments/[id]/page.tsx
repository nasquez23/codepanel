import AssignmentDetails from "@/components/assignments/assignment-details";
import { Metadata } from "next";

interface AssignmentPageProps {
  params: {
    id: string;
  };
}

export default async function AssignmentPage({ params }: AssignmentPageProps) {
  const { id } = await params;

  return (
    <div className="min-h-screen bg-blue-200/20">
      <AssignmentDetails id={id} />
    </div>
  );
}

export function generateMetadata(): Metadata {
  return {
    title: "Assignment Details | CodePanel",
    description: "View assignment details and submissions on CodePanel.",
  };
}
