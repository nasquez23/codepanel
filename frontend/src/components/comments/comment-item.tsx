"use client";

import { useState } from "react";
import { Comment } from "@/types/comment";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import {
  ThumbsUp,
  ThumbsDown,
  Edit,
  Trash2,
  MoreHorizontal,
  Reply,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import {
  useLikeComment,
  useDislikeComment,
  useDeleteComment,
} from "@/hooks/use-comments";
import CodeBlock from "@/components/code-block";
import { ProgrammingLanguage } from "@/types/problem-post";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import DeleteConfirmationDialog from "../delete-confirmation-dialog";
import EditCommentForm from "./edit-comment-form";

interface CommentItemProps {
  comment: Comment;
  problemPostId: string;
}

export default function CommentItem({
  comment,
  problemPostId,
}: CommentItemProps) {
  const { user } = useAuth();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const likeMutation = useLikeComment();
  const dislikeMutation = useDislikeComment();
  const deleteMutation = useDeleteComment();

  const isOwner = user?.id === comment.author.id;

  const handleLike = () => {
    likeMutation.mutate({ commentId: comment.id, problemPostId });
  };

  const handleDislike = () => {
    dislikeMutation.mutate({ commentId: comment.id, problemPostId });
  };

  const handleDelete = () => {
    deleteMutation.mutate(
      { commentId: comment.id, problemPostId },
      {
        onSuccess: () => {
          setShowDeleteDialog(false);
        },
      }
    );
  };

  const handleEditSuccess = () => {
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="border rounded-lg p-4 bg-gray-50">
        <EditCommentForm
          comment={comment}
          problemPostId={problemPostId}
          onSuccess={handleEditSuccess}
          onCancel={() => setIsEditing(false)}
        />
      </div>
    );
  }

  return (
    <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
            {comment.author.firstName[0]}
            {comment.author.lastName[0]}
          </div>
          <div>
            <p className="font-medium text-gray-900">
              {comment.author.firstName} {comment.author.lastName}
            </p>
            <p className="text-sm text-gray-500">
              {formatDistanceToNow(new Date(comment.createdAt), {
                addSuffix: true,
              })}
              {comment.updatedAt !== comment.createdAt && " (edited)"}
            </p>
          </div>
        </div>

        {isOwner && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setIsEditing(true)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setShowDeleteDialog(true)}
                className="text-red-600"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {/* Content */}
      <div className="mb-4">
        <p className="text-gray-800 whitespace-pre-wrap">{comment.comment}</p>
      </div>

      {/* Code */}
      {comment.code && (
        <div className="mb-4">
          <CodeBlock
            code={comment.code}
            language={ProgrammingLanguage.JAVASCRIPT} // Default to JS, you might want to store language per comment
            maxHeight="300px"
            className="border"
          />
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLike}
          disabled={likeMutation.isPending}
          className="flex items-center gap-1 text-gray-600 hover:text-green-600"
        >
          <ThumbsUp className="h-4 w-4" />
          <span>{comment.likes}</span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleDislike}
          disabled={dislikeMutation.isPending}
          className="flex items-center gap-1 text-gray-600 hover:text-red-600"
        >
          <ThumbsDown className="h-4 w-4" />
          <span>{comment.dislikes}</span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-1 text-gray-600 hover:text-blue-600"
        >
          <Reply className="h-4 w-4" />
          Reply
        </Button>
      </div>

      {/* Delete Dialog */}
      <DeleteConfirmationDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDelete}
        title="Delete Comment"
        description="Are you sure you want to delete this comment? This action cannot be undone."
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
