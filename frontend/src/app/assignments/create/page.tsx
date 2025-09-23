import CreateAssignmentForm from "@/components/assignments/create-assignment-form";
import { Metadata } from "next";

export default function CreateAssignmentPage() {
  return (
    <div className="min-h-screen bg-blue-200/20 ">
      <CreateAssignmentForm />
    </div>
  );
}

export function generateMetadata(): Metadata {
  return {
    title: "Create Assignment | CodePanel",
    description: "Create a new assignment on CodePanel.",
  };
}
