import { Metadata } from "next";
import Header from "@/components/header";
import Footer from "@/components/footer";
import ProblemPostDetails from "@/sections/problems/problem-post-details";
import { ProblemsDetailsView } from "@/sections/problems/view";

interface ProblemPostPageProps {
  params: { id: string };
}

export default function ProblemPostPage({ params }: ProblemPostPageProps) {
  return <ProblemsDetailsView id={params.id} />;
}

export function generateMetadata(): Metadata {
  return {
    title: "Problem Details - CodePanel",
    description: "View problem details and community solutions on CodePanel.",
  };
}
