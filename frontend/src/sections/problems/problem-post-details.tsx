"use client";

import { useState } from "react";
import { useProblemPostDetails } from "@/hooks/use-problem-post-details";
import { useDeleteProblemPost } from "@/hooks/use-problem-posts";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Trash2, ArrowLeft, Edit } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import EditProblemPostDialog from "./edit-problem-post-dialog";
import DeleteConfirmationDialog from "@/components/delete-confirmation-dialog";
import CodeBlock from "@/components/code-block";
import CommentsList from "@/components/comments/comments-list";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import ProblemPostUserInfo from "./problem-post-user-info";
import ProblemPostAttributes from "./problem-post-attributes";
import { DifficultyBadge } from "@/components/ui/difficulty-badge";
import { ProgrammingLanguageBadge } from "@/components/ui/programming-language-badge";
import { Role } from "@/types/auth";

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
      user.role === Role.ADMIN ||
      user.role === Role.INSTRUCTOR);

  return (
    <div className="max-w-7xl mx-auto px-6">
      <Link href="/problems">
        <Button
          variant="ghost"
          size="sm"
          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Problems
        </Button>
      </Link>

      <div className="flex gap-5 mt-5">
        <div className="w-2/3">
          <Card className="bg-white rounded-lg shadow-lg p-8">
            <div className="flex justify-between items-center">
              <ProblemPostUserInfo problemPost={problemPost} />
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

            <h1 className="text-3xl font-bold text-gray-900">
              {problemPost.title}
            </h1>

            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {problemPost.description}
            </p>

            {problemPost.code && (
              <div className="mb-5 mt-2">
                <CodeBlock
                  code={problemPost.code}
                  language={problemPost.language}
                  showCopyButton={true}
                />
              </div>
            )}
          </Card>

          <Card className="mt-8 bg-white rounded-lg shadow-lg p-8">
            <CommentsList
              problemPostId={id}
              problemPostAuthorId={problemPost?.author.id}
            />
          </Card>

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

        <div className="w-1/3 h-full flex flex-col gap-5">
          <Card>
            <CardHeader className="font-medium text-lg">
              Problem Stats
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <span>Difficulty</span>
                <DifficultyBadge
                  difficulty={problemPost.difficultyLevel}
                  size="sm"
                />
              </div>
              <div className="flex justify-between items-center">
                <span>Language</span>
                <ProgrammingLanguageBadge language={problemPost.language} />
              </div>
              <div className="flex justify-between items-center">
                <span>Responses</span>
                <span>{problemPost.commentCount}</span>
              </div>
            </CardContent>
          </Card>

          {(problemPost.category ||
            (problemPost.tags && problemPost.tags.length > 0)) && (
            <Card>
              <CardHeader className="font-medium text-lg">
                Related Topics
              </CardHeader>
              <CardContent>
                <ProblemPostAttributes
                  problemPost={problemPost}
                  includeTags={true}
                  includeCategory={true}
                  includeDifficulty={false}
                  includeLanguage={false}
                />
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
