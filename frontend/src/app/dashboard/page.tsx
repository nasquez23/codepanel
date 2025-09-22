import { DashboardView } from "@/sections/dashboard/view";
import { Metadata } from "next";

export default function DashboardPage() {
  return <DashboardView />;
}

export function generateMetadata(): Metadata {
  return {
    title: "Dashboard | CodePanel",
    description: "Dashboard for CodePanel",
  };
}
