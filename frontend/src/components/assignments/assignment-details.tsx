"use client";

import { useState } from "react";
import { useAssignment, useSubmitAssignment } from "@/hooks/use-assignments";
import { useAuth } from "@/hooks/use-auth";
import { CreateSubmissionRequest } from "@/types/assignment";
import { ProgrammingLanguageDisplayNames } from "@/types/problem-post";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { formatDistanceToNow } from "date-fns";
import {
  User,
  Clock,
  Code,
  Users,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Send,
  FileText,
  Calendar,
  Edit,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import CodeBlock from "@/components/code-block";
import CodeEditor from "@/components/code-editor";

interface AssignmentDetailsProps {
  id: string;
}

export default function AssignmentDetails({ id }: AssignmentDetailsProps) {
  const { user } = useAuth();
  const { data: assignment, isLoading, isError, error } = useAssignment(id);
  const submitMutation = useSubmitAssignment();
  
  const [showSubmissionForm, setShowSubmissionForm] = useState(false);
  const [submissionCode, setSubmissionCode] = useState("");
  const [submissionError, setSubmissionError] = useState("");

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmissionError("");

    if (!submissionCode.trim()) {
      setSubmissionError("Code is required");
      return;
    }

    try {
      const submissionData: CreateSubmissionRequest = {
        code: submissionCode,
      };

      await submitMutation.mutateAsync({
        assignmentId: id,
        data: submissionData,
      });

      setSubmissionCode("");
      setShowSubmissionForm(false);
    } catch (error: any) {
      setSubmissionError(error.response?.data?.message || "Failed to submit assignment");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading assignment...</span>
      </div>
    );
  }

  if (isError || !assignment) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-md p-6 text-center">
          <p className="text-red-600 mb-4">
            {error?.message || "Assignment not found."}
          </p>
          <Link href="/assignments">
            <Button>Back to Assignments</Button>
          </Link>
        </div>
      </div>
    );
  }

  const isOwner = user?.id === assignment.instructor.id;
  const canEdit = user && (user.role === "ADMIN" || isOwner);
  const canSubmit = user && user.role === "STUDENT" && !assignment.hasSubmitted && assignment.isActive;
  const isOverdue = assignment.dueDate && new Date(assignment.dueDate) < new Date();
  const isDueSoon = assignment.dueDate && new Date(assignment.dueDate) <= new Date(Date.now() + 24 * 60 * 60 * 1000);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <Link href="/assignments">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Assignments
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-8">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {assignment.title}
            </h1>

            <div className="flex items-center gap-6 text-gray-600 mb-4">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5" />
                <span className="font-medium">
                  {assignment.instructor.firstName} {assignment.instructor.lastName}
                </span>
                <span className="text-sm">({assignment.instructor.email})</span>
              </div>

              <div className="flex items-center gap-2">
                <Code className="w-5 h-5" />
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  {ProgrammingLanguageDisplayNames[assignment.language]}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                <span>{assignment.submissionCount} submissions</span>
              </div>
            </div>

            {/* Status and Due Date */}
            <div className="flex items-center gap-4 mb-6">
              {assignment.dueDate && (
                <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
                  isOverdue ? "bg-red-100 text-red-800" : 
                  isDueSoon ? "bg-orange-100 text-orange-800" : "bg-green-100 text-green-800"
                }`}>
                  <Calendar className="w-4 h-4" />
                  <span>
                    Due {formatDistanceToNow(new Date(assignment.dueDate), { addSuffix: true })}
                  </span>
                </div>
              )}

              {user && assignment.hasSubmitted && (
                <div className="flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                  <CheckCircle className="w-4 h-4" />
                  <span>Submitted</span>
                </div>
              )}

              {!assignment.isActive && (
                <div className="flex items-center gap-2 bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>Inactive</span>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            {canEdit && (
              <Link href={`/assignments/${assignment.id}/edit`}>
                <Button variant="outline" className="text-blue-600 hover:text-blue-700">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              </Link>
            )}

            {isOwner && (
              <Link href={`/assignments/${assignment.id}/submissions`}>
                <Button variant="outline">
                  <FileText className="w-4 h-4 mr-2" />
                  View Submissions ({assignment.submissionCount})
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            Assignment Description
          </h2>
          <div className="prose max-w-none">
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {assignment.description}
            </p>
          </div>
        </div>

        {/* My Submission */}
        {assignment.mySubmission && (
          <div className="mb-8 border-t pt-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">My Submission</h2>
            
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    assignment.mySubmission.status === "REVIEWED" 
                      ? "bg-green-100 text-green-800" 
                      : "bg-yellow-100 text-yellow-800"
                  }`}>
                    {assignment.mySubmission.status === "REVIEWED" ? "Reviewed" : "Pending Review"}
                  </span>
                  
                  {assignment.mySubmission.grade !== null && (
                    <span className="text-lg font-semibold text-gray-900">
                      Score: {assignment.mySubmission.grade}/100
                    </span>
                  )}
                </div>
                
                <div className="text-sm text-gray-500">
                  Submitted {formatDistanceToNow(new Date(assignment.mySubmission.createdAt), { addSuffix: true })}
                </div>
              </div>

              {assignment.mySubmission.review && (
                <div className="mb-4 p-4 bg-white rounded border">
                  <h4 className="font-medium text-gray-900 mb-2">Instructor Feedback</h4>
                  <p className="text-gray-700 mb-2">{assignment.mySubmission.review.comment}</p>
                  <div className="text-sm text-gray-500">
                    Reviewed by {assignment.mySubmission.review.reviewer.firstName} {assignment.mySubmission.review.reviewer.lastName}
                  </div>
                </div>
              )}

              <CodeBlock
                code={assignment.mySubmission.code}
                language={assignment.language}
                showCopyButton={true}
              />
            </div>
          </div>
        )}

        {/* Submission Form */}
        {canSubmit && !isOverdue && (
          <div className="border-t pt-8">
            {!showSubmissionForm ? (
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Ready to submit your solution?
                </h3>
                <p className="text-gray-600 mb-4">
                  Upload your code solution for this assignment.
                </p>
                <Button onClick={() => setShowSubmissionForm(true)}>
                  <Send className="w-4 h-4 mr-2" />
                  Submit Assignment
                </Button>
              </div>
            ) : (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Submit Your Solution
                </h3>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Code Solution
                    </label>
                    <CodeEditor
                      code={submissionCode}
                      language={assignment.language}
                      onChange={(value) => setSubmissionCode(value || "")}
                    />
                  </div>

                  {submissionError && (
                    <div className="text-red-600 text-sm">{submissionError}</div>
                  )}

                  <div className="flex gap-3">
                    <Button
                      type="submit"
                      disabled={submitMutation.isPending}
                      className="flex items-center gap-2"
                    >
                      {submitMutation.isPending ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Submit
                        </>
                      )}
                    </Button>
                    
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowSubmissionForm(false);
                        setSubmissionCode("");
                        setSubmissionError("");
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}

        {/* Overdue message */}
        {canSubmit && isOverdue && (
          <div className="border-t pt-8">
            <div className="text-center p-6 bg-red-50 rounded-lg">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-red-900 mb-2">Assignment Overdue</h3>
              <p className="text-red-700">
                The deadline for this assignment has passed. Submissions are no longer accepted.
              </p>
            </div>
          </div>
        )}

        {/* Assignment Info */}
        <div className="border-t pt-6 mt-8">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div>
              Created {formatDistanceToNow(new Date(assignment.createdAt), { addSuffix: true })}
              {assignment.createdAt !== assignment.updatedAt && (
                <span className="ml-4">
                  Last updated {formatDistanceToNow(new Date(assignment.updatedAt), { addSuffix: true })}
                </span>
              )}
            </div>
            
            {assignment.dueDate && (
              <div>
                Due: {formatDate(assignment.dueDate)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

