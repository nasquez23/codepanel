"use client";

import MySubmissions from "@/components/assignments/my-submissions";
import AssignmentsList from "@/components/assignments/assignments-list";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";
import { BookOpen, FileText } from "lucide-react";

export default function StudentDashboardPage() {
  const { user } = useAuth();

  if (!user || user.role !== "STUDENT") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Access denied. Students only.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Student Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Welcome back, {user.firstName}! Track your assignments and submissions.
          </p>
        </div>

        <Tabs defaultValue="assignments" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="assignments" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Available Assignments
            </TabsTrigger>
            <TabsTrigger value="submissions" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              My Submissions
            </TabsTrigger>
          </TabsList>

          <TabsContent value="assignments" className="space-y-6">
            <AssignmentsList showCreateButton={false} />
          </TabsContent>

          <TabsContent value="submissions" className="space-y-6">
            <MySubmissions />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

