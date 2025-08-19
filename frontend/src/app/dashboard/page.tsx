"use client";

import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function DashboardPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      switch (user.role) {
        case "INSTRUCTOR":
        case "ADMIN":
          router.replace("/dashboard/instructor");
          break;
        case "STUDENT":
          router.replace("/dashboard/student");
          break;
        default:
          router.replace("/assignments");
      }
    } else if (!isLoading && !user) {
      router.replace("/login");
    }
  }, [user, isLoading, router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="flex items-center gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="text-gray-600">Loading dashboard...</span>
      </div>
    </div>
  );
}
