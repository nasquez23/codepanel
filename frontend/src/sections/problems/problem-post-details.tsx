"use client";

import { useState } from "react";
import { useProblemPostDetails } from "@/hooks/use-problem-post-details";
import { useDeleteProblemPost } from "@/hooks/use-problem-posts";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { ProgrammingLanguageDisplayNames } from "@/types/problem-post";
import { User, Clock, Code, Trash2, ArrowLeft, Edit } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import EditProblemPostDialog from "./edit-problem-post-dialog";
import DeleteConfirmationDialog from "@/components/delete-confirmation-dialog";
import CodeBlock from "@/components/code-block";
import CommentsList from "@/components/comments/comments-list";

interface ProblemPostDetailsProps {
  id: string;
}

export default function ProblemPostDetails({ id }: ProblemPostDetailsProps) {
  const { problemPost, isLoading, isError, error } = useProblemPostDetails(id);
  const { user } = useAuth();
  const deleteMutation = useDeleteProblemPost();
  const router = useRouter();
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleDelete = () => {
    deleteMutation.mutate(id, {
      onSuccess: () => {
        setShowDeleteDialog(false);
        router.push("/problems");
      },
      onError: (error) => {
        console.error("Error deleting problem post:", error);
      },
    });
  };

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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading problem post...</span>
      </div>
    );
  }

  if (isError || !problemPost) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-md p-6 text-center">
          <p className="text-red-600 mb-4">
            {error?.message || "Problem post not found."}
          </p>
          <Link href="/problems">
            <Button>Back to Problems</Button>
          </Link>
        </div>
      </div>
    );
  }

  const canEdit = user && user.id === problemPost.author.id;
  const canDelete =
    user &&
    (user.id === problemPost.author.id ||
      user.role === "ADMIN" ||
      user.role === "INSTRUCTOR");

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <Link href="/problems">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Problems
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="flex justify-between items-start mb-6">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {problemPost.title}
            </h1>

            <div className="flex items-center gap-6 text-gray-600">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5" />
                <span className="font-medium">
                  {problemPost.author.firstName} {problemPost.author.lastName}
                </span>
                <span className="text-sm">({problemPost.author.email})</span>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span>{formatDate(problemPost.createdAt)}</span>
              </div>

              <div className="flex items-center gap-2">
                <Code className="w-5 h-5" />
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  {ProgrammingLanguageDisplayNames[problemPost.language]}
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            {canEdit && (
              <Button
                variant="outline"
                onClick={() => setShowEditDialog(true)}
                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
            )}

            {canDelete && (
              <Button
                variant="outline"
                onClick={() => setShowDeleteDialog(true)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            )}
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            Problem Description
          </h2>
          <div className="prose max-w-none">
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {problemPost.description}
            </p>
          </div>
        </div>

        {problemPost.code && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Code</h2>
            <CodeBlock
              code={problemPost.code}
              language={problemPost.language}
              showCopyButton={true}
            />
          </div>
        )}

        <div className="border-t pt-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              {problemPost.createdAt !== problemPost.updatedAt && (
                <span>Last updated: {formatDate(problemPost.updatedAt)}</span>
              )}
            </div>

            <div className="flex gap-3">
              <Button variant="outline">Share Problem</Button>
              <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                Help with Solution
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-white rounded-lg shadow-lg p-8">
        <CommentsList problemPostId={id} />
      </div>

      {canEdit && problemPost && (
        <EditProblemPostDialog
          problemPost={problemPost}
          open={showEditDialog}
          onOpenChange={setShowEditDialog}
        />
      )}

      {canDelete && problemPost && (
        <DeleteConfirmationDialog
          open={showDeleteDialog}
          onOpenChange={setShowDeleteDialog}
          onConfirm={handleDelete}
          isLoading={deleteMutation.isPending}
          description={`Are you sure you want to delete "${problemPost.title}"? This action cannot be undone.`}
        />
      )}
    </div>
  );
}
