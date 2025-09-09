"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  useProblemPosts,
  useSearchProblemPosts,
} from "@/hooks/use-problem-posts";
import { DifficultyLevel, Tag, Category } from "@/types/tags-categories";
import ProblemPostCard from "./problem-post-card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import SearchInput from "@/components/search/search-input";
import SearchFilters from "@/components/search/search-filters";

export default function ProblemsList() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const initialLanguage = searchParams.get("language") || undefined;

  const [currentPage, setCurrentPage] = useState(0);
  const [query, setQuery] = useState(initialQuery);
  const [language, setLanguage] = useState<string | undefined>(initialLanguage);
  const [difficulty, setDifficulty] = useState<DifficultyLevel | undefined>(
    undefined
  );
  const [category, setCategory] = useState<Category | null>(null);
  const [tags, setTags] = useState<Tag[]>([]);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortDir, setSortDir] = useState("desc");
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  const { isAuthenticated } = useAuth();

  const pageSize = 10;

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
      setCurrentPage(0);
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    setCurrentPage(0);
  }, [language, difficulty, category, tags, sortBy, sortDir]);

  const hasActiveSearch = !!(
    debouncedQuery.trim() ||
    language ||
    difficulty ||
    category ||
    tags.length > 0
  );

  // Use search hook when there's a search query or language filter, otherwise use regular fetch
  const searchResults = useSearchProblemPosts(
    debouncedQuery,
    language,
    difficulty,
    category,
    tags,
    currentPage,
    pageSize,
    sortBy,
    sortDir,
    hasActiveSearch
  );

  const regularResults = useProblemPosts(
    currentPage,
    pageSize,
    sortBy,
    sortDir
  );

  // Use search results if searching, otherwise use regular results
  const {
    data: response,
    isLoading,
    isError,
    error,
    refetch,
  } = hasActiveSearch ? searchResults : regularResults;

  const problemPosts = response?.content || [];
  const totalPages = response?.totalPages || 0;
  const totalElements = response?.totalElements || 0;

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleClearSearch = () => {
    setQuery("");
    setLanguage(undefined);
    setDifficulty(undefined);
    setCategory(null);
    setTags([]);
    setSortBy("createdAt");
    setSortDir("desc");
    setCurrentPage(0);
  };

  const sortOptions = [
    { value: "createdAt", label: "Created Date" },
    { value: "updatedAt", label: "Updated Date" },
    { value: "title", label: "Title" },
  ];

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
        <Button onClick={() => refetch()}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-8 py-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Problem Posts</h1>
          <p className="text-gray-600 mt-2">
            Get help with your coding challenges from the community
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

      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="flex-1">
          <SearchInput
            placeholder="Search by title, description, or author..."
            value={query}
            onChange={setQuery}
            onClear={handleClearSearch}
          />
        </div>

        <SearchFilters
          language={language}
          onLanguageChange={setLanguage}
          difficulty={difficulty}
          onDifficultyChange={setDifficulty}
          category={category}
          onCategoryChange={setCategory}
          tags={tags}
          onTagsChange={setTags}
          sortBy={sortBy}
          onSortByChange={setSortBy}
          sortDir={sortDir}
          onSortDirChange={setSortDir}
          sortOptions={sortOptions}
        />
      </div>

      {problemPosts.length > 0 ? (
        <div className="space-y-6">
          {problemPosts.map((problemPost) => (
            <ProblemPostCard key={problemPost.id} problemPost={problemPost} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          {hasActiveSearch ? (
            <div>
              <p className="text-gray-500 text-lg mb-4">
                No problem posts match your search criteria.
              </p>
              <Button variant="outline" onClick={handleClearSearch}>
                Clear search
              </Button>
            </div>
          ) : (
            <div>
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
        </div>
      )}

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
