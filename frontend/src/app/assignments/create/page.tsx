import CreateAssignmentForm from "@/components/assignments/create-assignment-form";
import { ProtectedRoute } from "@/components/protected-route";
import { Metadata } from "next";

export default function CreateAssignmentPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-blue-200/20 ">
        <CreateAssignmentForm />
      </div>
    </ProtectedRoute>
  );
}

export function generateMetadata(): Metadata {
  return {
    title: "Create Assignment | CodePanel",
    description: "Create a new assignment on CodePanel.",
  };
}
