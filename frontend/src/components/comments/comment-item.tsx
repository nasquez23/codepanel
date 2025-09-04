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
  CheckCircle,
  XCircle,
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
import { acceptAnswer, unacceptAnswer } from "@/services/problem-post-api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface CommentItemProps {
  comment: Comment;
  problemPostId: string;
  problemPostAuthorId?: string;
}

export default function CommentItem({
  comment,
  problemPostId,
  problemPostAuthorId,
}: CommentItemProps) {
  const { user } = useAuth();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const queryClient = useQueryClient();

  const likeMutation = useLikeComment();
  const dislikeMutation = useDislikeComment();
  const deleteMutation = useDeleteComment();

  const acceptMutation = useMutation({
    mutationFn: ({ postId, commentId }: { postId: string; commentId: string }) =>
      acceptAnswer(postId, commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["problem-post", problemPostId] });
      queryClient.invalidateQueries({ queryKey: ["comments", problemPostId] });
      toast.success("Answer accepted!");
    },
    onError: (error) => {
      toast.error("Failed to accept answer");
      console.error("Error accepting answer:", error);
    },
  });

  const unacceptMutation = useMutation({
    mutationFn: (postId: string) => unacceptAnswer(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["problem-post", problemPostId] });
      queryClient.invalidateQueries({ queryKey: ["comments", problemPostId] });
      toast.success("Answer unaccepted!");
    },
    onError: (error) => {
      toast.error("Failed to unaccept answer");
      console.error("Error unaccepting answer:", error);
    },
  });

  const isOwner = user?.id === comment.author.id;
  const canAcceptAnswer = user?.id === problemPostAuthorId;

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

  const handleAcceptAnswer = () => {
    acceptMutation.mutate({ postId: problemPostId, commentId: comment.id });
  };

  const handleUnacceptAnswer = () => {
    unacceptMutation.mutate(problemPostId);
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
    <div className={`border rounded-lg p-4 hover:bg-gray-50 transition-colors ${
      comment.isAccepted ? "border-green-500 bg-green-50" : ""
    }`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
            {comment.author.firstName[0]}
            {comment.author.lastName[0]}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="font-medium text-gray-900">
                {comment.author.firstName} {comment.author.lastName}
              </p>
              {comment.isAccepted && (
                <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                  <CheckCircle className="h-3 w-3" />
                  Accepted Solution
                </span>
              )}
            </div>
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

      <div className="mb-4">
        <p className="text-gray-800 whitespace-pre-wrap">{comment.comment}</p>
      </div>

      {comment.code && (
        <div className="mb-4">
          <CodeBlock
            code={comment.code}
            language={ProgrammingLanguage.JAVASCRIPT}
            maxHeight="300px"
            className="border"
          />
        </div>
      )}

      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLike}
          disabled={likeMutation.isPending}
          className={`flex items-center gap-1 transition-colors ${
            comment.userReaction === "LIKE"
              ? "text-green-600 bg-green-50"
              : "text-gray-600 hover:text-green-600"
          }`}
        >
          <ThumbsUp
            className={`h-4 w-4 ${
              comment.userReaction === "LIKE" ? "fill-current" : ""
            }`}
          />
          <span>{comment.likes}</span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleDislike}
          disabled={dislikeMutation.isPending}
          className={`flex items-center gap-1 transition-colors ${
            comment.userReaction === "DISLIKE"
              ? "text-red-600 bg-red-50"
              : "text-gray-600 hover:text-red-600"
          }`}
        >
          <ThumbsDown
            className={`h-4 w-4 ${
              comment.userReaction === "DISLIKE" ? "fill-current" : ""
            }`}
          />
          <span>{comment.dislikes}</span>
        </Button>

        {canAcceptAnswer && !comment.isAccepted && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleAcceptAnswer}
            disabled={acceptMutation.isPending}
            className="flex items-center gap-1 text-green-600 border-green-200 hover:bg-green-50"
          >
            <CheckCircle className="h-4 w-4" />
            Accept Solution
          </Button>
        )}

        {canAcceptAnswer && comment.isAccepted && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleUnacceptAnswer}
            disabled={unacceptMutation.isPending}
            className="flex items-center gap-1 text-red-600 border-red-200 hover:bg-red-50"
          >
            <XCircle className="h-4 w-4" />
            Unaccept
          </Button>
        )}

        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-1 text-gray-600 hover:text-blue-600"
        >
          <Reply className="h-4 w-4" />
          Reply
        </Button>
      </div>

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
