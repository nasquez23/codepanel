"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ProblemPost,
  ProgrammingLanguageDisplayNames,
} from "@/types/problem-post";
import { Button } from "@/components/ui/button";
import { TagBadge } from "@/components/ui/tag-badge";
import { CategoryBadge } from "@/components/ui/category-badge";
import { DifficultyBadge } from "@/components/ui/difficulty-badge";
import { User, Clock, Code, Trash2, Edit } from "lucide-react";
import { useDeleteProblemPost } from "@/hooks/use-problem-posts";
import { useAuth } from "@/hooks/use-auth";
import EditProblemPostDialog from "./edit-problem-post-dialog";
import DeleteConfirmationDialog from "@/components/delete-confirmation-dialog";
import CodeBlock from "@/components/code-block";

interface ProblemPostCardProps {
  problemPost: ProblemPost;
}

export default function ProblemPostCard({ problemPost }: ProblemPostCardProps) {
  const { user } = useAuth();
  const deleteMutation = useDeleteProblemPost();
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleDelete = () => {
    deleteMutation.mutate(problemPost.id, {
      onSuccess: () => {
        setShowDeleteDialog(false);
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
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const canEdit = user && user.id === problemPost.author.id;
  const canDelete =
    user &&
    (user.id === problemPost.author.id ||
      user.role === "ADMIN" ||
      user.role === "INSTRUCTOR");

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <Link href={`/problems/${problemPost.id}`}>
            <h3 className="text-xl font-semibold text-gray-900 hover:text-blue-600 transition-colors cursor-pointer">
              {problemPost.title}
            </h3>
          </Link>

          <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <User className="w-4 h-4" />
              <span>
                {problemPost.author.firstName} {problemPost.author.lastName}
              </span>
            </div>

            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{formatDate(problemPost.createdAt)}</span>
            </div>

            <div className="flex items-center gap-1">
              <Code className="w-4 h-4" />
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                {ProgrammingLanguageDisplayNames[problemPost.language]}
              </span>
            </div>

            <DifficultyBadge
              difficulty={problemPost.difficultyLevel}
              size="sm"
            />
          </div>

          <div className="flex items-center gap-2 mt-3 flex-wrap">
            {problemPost.category && (
              <CategoryBadge
                category={problemPost.category}
                size="sm"
                variant="secondary"
              />
            )}
            {problemPost.tags && problemPost.tags.length > 0 && (
              <>
                {problemPost.tags.slice(0, 3).map((tag) => (
                  <TagBadge
                    key={tag.id}
                    tag={tag}
                    size="sm"
                    variant="secondary"
                  />
                ))}
                {problemPost.tags.length > 3 && (
                  <span className="text-xs text-gray-500">
                    +{problemPost.tags.length - 3} more
                  </span>
                )}
              </>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          {canEdit && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowEditDialog(true)}
              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
            >
              <Edit className="w-4 h-4" />
            </Button>
          )}

          {canDelete && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDeleteDialog(true)}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      <p className="text-gray-700 mb-4 line-clamp-3">
        {problemPost.description}
      </p>

      {problemPost.code && (
        <div className="mb-4">
          <CodeBlock
            code={problemPost.code}
            language={problemPost.language}
            maxHeight="200px"
            showCopyButton={false}
          />
        </div>
      )}

      <div className="flex justify-between items-center">
        <Link href={`/problems/${problemPost.id}`}>
          <Button variant="outline" size="sm">
            View Details & Comments
          </Button>
        </Link>
      </div>

      {canEdit && (
        <EditProblemPostDialog
          problemPost={problemPost}
          open={showEditDialog}
          onOpenChange={setShowEditDialog}
        />
      )}

      {canDelete && (
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
