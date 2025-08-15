import { ProblemsListView } from "@/sections/problems/view";
import { Metadata } from "next";

export default function ProblemsPage() {
  return <ProblemsListView />;
}

export function generateMetadata(): Metadata {
  return {
    title: "Problem Posts - CodePanel",
    description:
      "Browse and share coding problems with the CodePanel community. Get help from peers and instructors.",
  };
}
