"use client";

import { useState } from "react";
import Link from "next/link";
import { ProblemPost } from "@/types/problem-post";
import { Button } from "@/components/ui/button";
import { TagBadge } from "@/components/ui/tag-badge";
import { CategoryBadge } from "@/components/ui/category-badge";
import { DifficultyBadge } from "@/components/ui/difficulty-badge";
import { Trash2, Edit, MessageSquare } from "lucide-react";
import { useDeleteProblemPost } from "@/hooks/use-problem-posts";
import { useAuth } from "@/hooks/use-auth";
import EditProblemPostDialog from "./edit-problem-post-dialog";
import DeleteConfirmationDialog from "@/components/delete-confirmation-dialog";
import ProfilePicture from "@/components/profile-picture";
import { formatDistanceToNow } from "date-fns";
import { ProgrammingLanguageBadge } from "@/components/ui/programming-language-badge";

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

  const canEdit = user && user.id === problemPost.author.id;
  const canDelete =
    user &&
    (user.id === problemPost.author.id ||
      user.role === "ADMIN" ||
      user.role === "INSTRUCTOR");

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 px-6 py-4 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3 mt-2 text-sm text-gray-600">
          <ProfilePicture
            profilePictureUrl={problemPost.author.profilePictureUrl}
            firstName={problemPost.author.firstName}
            lastName={problemPost.author.lastName}
            className="size-11"
          />
          <div className="flex flex-col">
            <span className="font-medium text-lg">
              {problemPost.author.firstName} {problemPost.author.lastName}
            </span>
            <span className="text-gray-500">
              {formatDistanceToNow(new Date(problemPost.createdAt), {
                addSuffix: true,
              })}
            </span>
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

      <Link href={`/problems/${problemPost.id}`}>
        <h3 className="text-xl font-semibold text-gray-900 hover:text-blue-600 transition-colors cursor-pointer">
          {problemPost.title}
        </h3>
      </Link>

      <p className="text-gray-700 mb-4 mt-2 line-clamp-2">
        {problemPost.description}
      </p>

      <div className="flex items-center gap-2 flex-wrap">
        <DifficultyBadge difficulty={problemPost.difficultyLevel} size="sm" />
        <ProgrammingLanguageBadge language={problemPost.language} />
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
              <TagBadge key={tag.id} tag={tag} size="sm" variant="secondary" />
            ))}
            {problemPost.tags.length > 3 && (
              <span className="text-xs text-gray-500">
                +{problemPost.tags.length - 3} more
              </span>
            )}
          </>
        )}
      </div>

      <div className="flex justify-between items-center mt-5 border-t pt-2">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-gray-500" />
          <span className="text-gray-500">
            {problemPost.commentCount || 0} responses
          </span>
        </div>
        <Link href={`/problems/${problemPost.id}`}>
          <Button
            variant="ghost"
            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
            size="sm"
          >
            View Details
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
