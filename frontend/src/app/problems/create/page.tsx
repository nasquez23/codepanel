import { Metadata } from "next";
import { ProblemsCreateView } from "@/sections/problems/view";

export default function CreateProblemPage() {
  return <ProblemsCreateView />;
}

export function generateMetadata(): Metadata {
  return {
    title: "Post a Problem - CodePanel",
    description:
      "Share your coding challenge with the CodePanel community and get help from peers and instructors.",
  };
}
