"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useSubmission } from "@/hooks/use-assignments";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import ProfilePicture from "@/components/profile-picture";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SubmissionDetailsCodeTab from "../submission-details-code-tab";
import SubmissionDetailsGrading from "../submission-details-grading";
import Link from "next/link";

interface SubmissionDetailsViewProps {
  id: string;
}

export default function SubmissionDetailsView({
  id,
}: SubmissionDetailsViewProps) {
  const router = useRouter();
  const { user } = useAuth();
  const { data: submission, isLoading, error } = useSubmission(id);

  const [isDescriptionExpanded, setIsDescriptionExpanded] =
    useState<boolean>(false);

  const isSubmissionInstructor =
    user?.id === submission?.assignment.instructor.id;
  const isSubmissionOwner = user?.id === submission?.student.id;

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !submission) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-red-600 mb-4">
                {error ? "Failed to load submission" : "Submission not found"}
              </p>
              <Button onClick={() => router.back()}>Go Back</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isSubmissionOwner && !isSubmissionInstructor) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-6">
        <div className="bg-red-50 border border-red-200 rounded-md p-6 text-center">
          <p className="text-red-600 mb-4">
            You are not authorized to view this submission.
          </p>
          <Link href="/assignments">
            <Button className="bg-blue-500 text-white hover:bg-blue-700">
              Back to Assignments
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING_REVIEW":
        return "bg-yellow-100 text-yellow-800";
      case "REVIEWED":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "PENDING_REVIEW":
        return "Pending Review";
      case "REVIEWED":
        return "Reviewed";
      default:
        return status;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-5">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
        >
          ← Back
        </Button>
      </div>

      <div className="space-y-6">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Badge
                  className={cn(
                    getStatusColor(submission.status),
                    "text-base px-5 py-2 rounded-full font-medium"
                  )}
                >
                  {getStatusText(submission.status)}
                </Badge>
              </div>
              <h1 className="text-3xl font-bold mt-2">Submission Details</h1>
              <h3 className="text-xl font-medium text-gray-600">
                {submission.assignment.title}
              </h3>
            </CardTitle>
            <CardDescription
              className={cn(
                isDescriptionExpanded &&
                  submission.assignment.description.length > 100
                  ? "line-clamp-none"
                  : "line-clamp-2",
                submission.assignment.description.length > 100 &&
                  "cursor-pointer hover:text-gray-400"
              )}
              onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
            >
              {submission.assignment.description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center bg-gray-50 rounded-xl p-4">
              <div className="flex items-center gap-2">
                <ProfilePicture
                  profilePictureUrl={submission.student.profilePictureUrl}
                  firstName={submission.student.firstName}
                  lastName={submission.student.lastName}
                  className="size-14"
                />
                <span className="font-medium text-lg">
                  {submission.student.firstName} {submission.student.lastName}
                </span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-gray-500">Submitted</span>
                <span className="font-medium">
                  {formatDate(submission.createdAt.toString())}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <Tabs className="w-full px-5" defaultValue="code">
            <TabsList className="w-full grid grid-cols-7 px-0">
              <TabsTrigger value="code">Code</TabsTrigger>
              <TabsTrigger value="grading">Grading</TabsTrigger>
            </TabsList>
            <TabsContent value="code">
              <SubmissionDetailsCodeTab submission={submission} />
            </TabsContent>
            <TabsContent value="grading">
              <SubmissionDetailsGrading submission={submission} />
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}
