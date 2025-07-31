import { HomeView } from "@/sections/home/view";
import { Metadata } from "next";

export default function Home() {
  return <HomeView />;
}

export function generateMetadata(): Metadata {
  return {
    title: "CodePanel",
    description:
      "CodePanel is a platform for students to review code and share knowledge in a collaborative environment designed for learning.",
  };
}
