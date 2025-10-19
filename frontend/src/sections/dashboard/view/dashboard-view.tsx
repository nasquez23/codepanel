"use client";

import { useAuth } from "@/hooks/use-auth";
import {
  InstructorDashboardView,
  StudentDashboardView,
} from "@/sections/dashboard/view";
import { Role } from "@/types/auth";
import { ProtectedRoute } from "@/components/protected-route";

export default function DashboardView() {
  const { user } = useAuth();

  return (
    <ProtectedRoute>
      <div className="bg-blue-200/20 min-h-screen">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          {user?.role === Role.INSTRUCTOR || user?.role === Role.ADMIN ? (
            <InstructorDashboardView />
          ) : (
            <StudentDashboardView />
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
