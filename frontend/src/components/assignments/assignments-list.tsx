"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useAssignments, useSearchAssignments } from "@/hooks/use-assignments";
import { useAuth } from "@/hooks/use-auth";
import AssignmentCard from "./assignment-card";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, BookOpen, ChevronDown } from "lucide-react";
import Link from "next/link";
import SearchInput from "@/components/search/search-input";
import SearchFilters from "@/components/search/search-filters";
import { Category, DifficultyLevel, Tag } from "@/types/tags-categories";

interface AssignmentsListProps {
  showCreateButton?: boolean;
}

export default function AssignmentsList({
  showCreateButton = false,
}: AssignmentsListProps) {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const initialLanguage = searchParams.get("language") || undefined;

  const { user, isLoading: authLoading } = useAuth();
  const [page, setPage] = useState(0);
  const [query, setQuery] = useState(initialQuery);
  const [difficulty, setDifficulty] = useState<DifficultyLevel | undefined>(
    undefined
  );
  const [category, setCategory] = useState<Category | null>(null);
  const [tags, setTags] = useState<Tag[]>([]);
  const [language, setLanguage] = useState<string | undefined>(initialLanguage);
  const [sortBy, setSortBy] = useState("dueDate");
  const [sortDir, setSortDir] = useState("asc");
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
      setPage(0);
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    setPage(0);
  }, [language, difficulty, category, tags, sortBy, sortDir]);

  const hasActiveSearch = !!(
    debouncedQuery.trim() ||
    language ||
    difficulty ||
    category ||
    tags.length > 0
  );

  // Use search hook when there's a search query or language filter, otherwise use regular fetch
  const searchResults = useSearchAssignments(
    debouncedQuery,
    language,
    difficulty,
    category,
    tags,
    page,
    10,
    sortBy,
    sortDir,
    hasActiveSearch
  );

  const regularResults = useAssignments(
    page,
    10,
    sortBy,
    sortDir,
    !authLoading
  );

  // Use search results if searching, otherwise use regular results
  const {
    data: assignmentsData,
    isLoading,
    isError,
    error,
  } = hasActiveSearch ? searchResults : regularResults;

  const handleSortChange = (value: string) => {
    const [newSortBy, newSortDir] = value.split("-");
    setSortBy(newSortBy);
    setSortDir(newSortDir);
    setPage(0);
  };

  const handleClearSearch = () => {
    setQuery("");
    setLanguage(undefined);
    setDifficulty(undefined);
    setCategory(null);
    setTags([]);
    setSortBy("dueDate");
    setSortDir("asc");
    setPage(0);
  };

  const sortOptions = [
    { value: "dueDate", label: "Due Date" },
    { value: "createdAt", label: "Created Date" },
    { value: "title", label: "Title" },
  ];

  if (authLoading || isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        <span className="ml-2 text-gray-600">
          {authLoading ? "Initializing..." : "Loading assignments..."}
        </span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">
          Failed to load assignments. Please try again later.
        </p>
        {error && (
          <p className="text-sm text-gray-500">
            {error instanceof Error ? error.message : "Unknown error"}
          </p>
        )}
      </div>
    );
  }

  const assignments = assignmentsData?.content || [];
  const hasNextPage = assignmentsData && !assignmentsData.last;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <BookOpen className="h-6 w-6 text-blue-600" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Assignments</h2>
            <p className="text-gray-600 text-sm">
              Complete assignments to improve your skills and get feedback from
              your instructors.
            </p>
          </div>
        </div>

        {showCreateButton &&
          user &&
          (user.role === "INSTRUCTOR" || user.role === "ADMIN") && (
            <Link href="/assignments/create">
              <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                <Plus className="w-4 h-4 mr-2" />
                Create Assignment
              </Button>
            </Link>
          )}
      </div>

      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        <div className="flex-1">
          <SearchInput
            placeholder="Search by title, description, or instructor..."
            value={query}
            onChange={setQuery}
            onClear={handleClearSearch}
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
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
      </div>

      {assignments.length === 0 ? (
        <div className="text-center py-12">
          <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          {hasActiveSearch ? (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No assignments found
              </h3>
              <p className="text-gray-500 mb-6">
                No assignments match your search criteria.
              </p>
              <Button variant="outline" onClick={handleClearSearch}>
                Clear search
              </Button>
            </div>
          ) : (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No assignments available
              </h3>
              <p className="text-gray-500 mb-6">
                {user && (user.role === "INSTRUCTOR" || user.role === "ADMIN")
                  ? "Create your first assignment to get started."
                  : "Check back later for new assignments from your instructors."}
              </p>
              {showCreateButton &&
                user &&
                (user.role === "INSTRUCTOR" || user.role === "ADMIN") && (
                  <Link href="/assignments/create">
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Assignment
                    </Button>
                  </Link>
                )}
            </div>
          )}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {assignments.map((assignment) => (
            <AssignmentCard
              key={assignment.id}
              assignment={assignment}
              showActions={showCreateButton}
            />
          ))}
        </div>
      )}

      {hasNextPage && (
        <div className="text-center">
          <Button
            variant="outline"
            onClick={() => setPage(page + 1)}
            className="flex items-center gap-2"
          >
            <ChevronDown className="h-4 w-4" />
            Load More Assignments
          </Button>
        </div>
      )}
    </div>
  );
}
