import { Metadata } from "next";
import { ProblemsCreateView } from "@/sections/problems/view";
import { ProtectedRoute } from "@/components/protected-route";

export default function CreateProblemPage() {
  return (
    <ProtectedRoute>
      <ProblemsCreateView />
    </ProtectedRoute>
  );
}

export function generateMetadata(): Metadata {
  return {
    title: "Post a Problem - CodePanel",
    description:
      "Share your coding challenge with the CodePanel community and get help from peers and instructors.",
  };
}
