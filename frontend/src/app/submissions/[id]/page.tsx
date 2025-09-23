import { SubmissionDetailsView } from "@/sections/submissions/view";
import { Metadata } from "next";

interface SubmissionPageProps {
  params: {
    id: string;
  };
}

export default async function SubmissionPage({ params }: SubmissionPageProps) {
  const { id } = await params;

  return (
    <div className="min-h-screen bg-blue-200/20">
      <SubmissionDetailsView id={id} />
    </div>
  );
}

export function generateMetadata(): Metadata {
  return {
    title: "Submission Details | CodePanel",
    description: "View submission details and grading on CodePanel.",
  };
}
