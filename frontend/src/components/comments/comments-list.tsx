"use client";

import { useState } from "react";
import { useComments } from "@/hooks/use-comments";
import CommentItem from "./comment-item";
import CommentForm from "./comment-form";
import { Button } from "@/components/ui/button";
import { MessageSquare, Loader2, ChevronDown } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

interface CommentsListProps {
  problemPostId: string;
}

export default function CommentsList({ problemPostId }: CommentsListProps) {
  const { user } = useAuth();
  const [page, setPage] = useState(0);
  const [showCommentForm, setShowCommentForm] = useState(false);

  const {
    data: commentsData,
    isLoading,
    isError,
    error,
  } = useComments(problemPostId, page, 10);

  const handleCommentSuccess = () => {
    setShowCommentForm(false);
    setPage(0);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
        <span className="ml-2 text-gray-500">Loading comments...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">
          Failed to load comments. Please try again later.
        </p>
        {error && (
          <p className="text-sm text-gray-500 mt-1">
            {error instanceof Error ? error.message : "Unknown error"}
          </p>
        )}
      </div>
    );
  }

  const comments = commentsData?.content || [];
  const hasNextPage = commentsData && !commentsData.last;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            Responses ({commentsData?.totalElements || 0})
          </h3>
        </div>

        {user && (
          <Button
            onClick={() => setShowCommentForm(!showCommentForm)}
            variant={showCommentForm ? "outline" : "default"}
          >
            {showCommentForm ? "Cancel" : "Add Response"}
          </Button>
        )}
      </div>

      {showCommentForm && user && (
        <div className="border rounded-lg p-4 bg-gray-50">
          <CommentForm
            problemPostId={problemPostId}
            onSuccess={handleCommentSuccess}
          />
        </div>
      )}

      {!user && (
        <div className="text-center py-6 border rounded-lg bg-gray-50">
          <p className="text-gray-600">
            Please log in to add responses and participate in the discussion.
          </p>
        </div>
      )}

      {comments.length === 0 ? (
        <div className="text-center py-8">
          <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">
            No responses yet. Be the first to start the discussion!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              problemPostId={problemPostId}
            />
          ))}

          {hasNextPage && (
            <div className="text-center">
              <Button
                variant="outline"
                onClick={() => setPage(page + 1)}
                className="flex items-center gap-2"
              >
                <ChevronDown className="h-4 w-4" />
                Load More Comments
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
