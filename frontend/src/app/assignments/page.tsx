import AssignmentsList from "@/components/assignments/assignments-list";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { Metadata } from "next";

function AssignmentsContent() {
  return (
    <div className="min-h-screen bg-blue-200/30">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <AssignmentsList showCreateButton={true} />
      </div>
    </div>
  );
}

export default function AssignmentsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="flex items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            <span className="text-gray-600">Loading assignments...</span>
          </div>
        </div>
      }
    >
      <AssignmentsContent />
    </Suspense>
  );
}

export function generateMetadata(): Metadata {
  return {
    title: "Assignments | CodePanel",
    description:
      "Browse and share assignments with the CodePanel community. Get help from peers and instructors.",
  };
}
