import { Metadata } from "next";
import { ProblemsDetailsView } from "@/sections/problems/view";

interface ProblemPostPageProps {
  params: { id: string };
}

export default async function ProblemPostPage({
  params,
}: ProblemPostPageProps) {
  const { id } = await params;
  return <ProblemsDetailsView id={id} />;
}

export function generateMetadata(): Metadata {
  return {
    title: "Problem Details - CodePanel",
    description: "View problem details and community solutions on CodePanel.",
  };
}
