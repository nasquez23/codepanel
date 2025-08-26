import { ProblemsListView } from "@/sections/problems/view";
import { Metadata } from "next";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

function ProblemsContent() {
  return <ProblemsListView />;
}

export default function ProblemsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          <span className="ml-2 text-gray-600">Loading problems...</span>
        </div>
      }
    >
      <ProblemsContent />
    </Suspense>
  );
}

export function generateMetadata(): Metadata {
  return {
    title: "Problem Posts - CodePanel",
    description:
      "Browse and share coding problems with the CodePanel community. Get help from peers and instructors.",
  };
}
