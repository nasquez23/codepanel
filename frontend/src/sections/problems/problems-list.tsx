"use client";

import { useState } from "react";
import { useProblemPosts } from "@/hooks/use-problem-posts";
import ProblemPostCard from "./problem-post-card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";

export default function ProblemsList() {
  const [currentPage, setCurrentPage] = useState(0);
  const { isAuthenticated } = useAuth();

  const pageSize = 10;
  
  const {
    data: response,
    isLoading,
    isError,
    error,
    refetch
  } = useProblemPosts(currentPage, pageSize);

  const problemPosts = response?.content || [];
  const totalPages = response?.totalPages || 0;
  const totalElements = response?.totalElements || 0;

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading problem posts...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-6 text-center">
        <p className="text-red-600 mb-4">
          {error?.message || "Failed to load problem posts. Please try again."}
        </p>
        <Button onClick={() => refetch()}>
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Problem Posts
          </h1>
          <p className="text-gray-600 mt-2">
            {totalElements > 0 
              ? `${totalElements} problem${totalElements === 1 ? '' : 's'} from the community`
              : "No problems posted yet"
            }
          </p>
        </div>
        
        {isAuthenticated && (
          <Link href="/problems/create">
            <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
              <Plus className="w-4 h-4 mr-2" />
              Post a Problem
            </Button>
          </Link>
        )}
      </div>

      {/* Problem Posts */}
      {problemPosts.length > 0 ? (
        <div className="space-y-6">
          {problemPosts.map((problemPost) => (
            <ProblemPostCard
              key={problemPost.id}
              problemPost={problemPost}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-4">
            No problem posts yet.
          </p>
          {isAuthenticated ? (
            <div>
              <p className="text-gray-600 mb-6">
                Be the first to share a coding challenge with the community!
              </p>
              <Link href="/problems/create">
                <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Post Your First Problem
                </Button>
              </Link>
            </div>
          ) : (
            <div>
              <p className="text-gray-600 mb-6">
                Sign in to post your first coding problem.
              </p>
              <Link href="/login">
                <Button>Sign In</Button>
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-12">
          <Button
            variant="outline"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 0}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>
          
          <div className="flex items-center gap-2">
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              let page;
              if (totalPages <= 5) {
                page = i;
              } else if (currentPage < 3) {
                page = i;
              } else if (currentPage >= totalPages - 2) {
                page = totalPages - 5 + i;
              } else {
                page = currentPage - 2 + i;
              }

              return (
                <Button
                  key={page}
                  variant={page === currentPage ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePageChange(page)}
                  className="w-10"
                >
                  {page + 1}
                </Button>
              );
            })}
          </div>
          
          <Button
            variant="outline"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages - 1}
          >
            Next
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      )}
    </div>
  );
}
