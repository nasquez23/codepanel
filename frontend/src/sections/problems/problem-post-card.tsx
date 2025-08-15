"use client";

import Link from "next/link";
import { ProblemPost, ProgrammingLanguageDisplayNames } from "@/types/problem-post";
import { Button } from "@/components/ui/button";
import { User, Clock, Code, Trash2 } from "lucide-react";
import { useDeleteProblemPost } from "@/hooks/use-problem-posts";
import { useAuth } from "@/hooks/use-auth";

interface ProblemPostCardProps {
  problemPost: ProblemPost;
}

export default function ProblemPostCard({ problemPost }: ProblemPostCardProps) {
  const { user } = useAuth();
  const deleteMutation = useDeleteProblemPost();

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this problem post?")) {
      return;
    }

    deleteMutation.mutate(problemPost.id, {
      onError: (error) => {
        console.error("Error deleting problem post:", error);
        alert("Failed to delete problem post. Please try again.");
      }
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

  const canDelete = user && (
    user.id === problemPost.author.id || 
    user.role === "ADMIN" || 
    user.role === "INSTRUCTOR"
  );

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
              <span>{problemPost.author.firstName} {problemPost.author.lastName}</span>
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
          </div>
        </div>

        {canDelete && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        )}
      </div>

      <p className="text-gray-700 mb-4 line-clamp-3">
        {problemPost.description}
      </p>

      {problemPost.code && (
        <div className="bg-gray-100 rounded-md p-4 mb-4">
          <pre className="text-sm text-gray-800 overflow-x-auto whitespace-pre-wrap">
            <code className="line-clamp-4">
              {problemPost.code}
            </code>
          </pre>
        </div>
      )}

      <div className="flex justify-between items-center">
        <Link href={`/problems/${problemPost.id}`}>
          <Button variant="outline" size="sm">
            View Details & Comments
          </Button>
        </Link>
      </div>
    </div>
  );
}
