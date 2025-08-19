"use client";

import { useState } from "react";
import { useAssignments } from "@/hooks/use-assignments";
import { useAuth } from "@/hooks/use-auth";
import AssignmentCard from "./assignment-card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Plus, BookOpen, ChevronDown } from "lucide-react";
import Link from "next/link";

interface AssignmentsListProps {
  showCreateButton?: boolean;
}

export default function AssignmentsList({ showCreateButton = false }: AssignmentsListProps) {
  const { user, isLoading: authLoading } = useAuth();
  const [page, setPage] = useState(0);
  const [sortBy, setSortBy] = useState("dueDate");
  const [sortDir, setSortDir] = useState("asc");

  const {
    data: assignmentsData,
    isLoading,
    isError,
    error,
  } = useAssignments(page, 10, sortBy, sortDir, !authLoading);

  const handleSortChange = (value: string) => {
    const [newSortBy, newSortDir] = value.split("-");
    setSortBy(newSortBy);
    setSortDir(newSortDir);
    setPage(0);
  };

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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BookOpen className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">
            Assignments ({assignmentsData?.totalElements || 0})
          </h2>
        </div>

        <div className="flex items-center gap-3">
          {/* Sort Options */}
          <Select value={`${sortBy}-${sortDir}`} onValueChange={handleSortChange}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Sort by..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dueDate-asc">Due Date (Earliest)</SelectItem>
              <SelectItem value="dueDate-desc">Due Date (Latest)</SelectItem>
              <SelectItem value="createdAt-desc">Recently Created</SelectItem>
              <SelectItem value="createdAt-asc">Oldest First</SelectItem>
              <SelectItem value="title-asc">Title (A-Z)</SelectItem>
              <SelectItem value="title-desc">Title (Z-A)</SelectItem>
            </SelectContent>
          </Select>

          {/* Create Button */}
          {showCreateButton && user && (user.role === "INSTRUCTOR" || user.role === "ADMIN") && (
            <Link href="/assignments/create">
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Create Assignment
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Assignments Grid */}
      {assignments.length === 0 ? (
        <div className="text-center py-12">
          <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No assignments available</h3>
          <p className="text-gray-500 mb-6">
            {user && (user.role === "INSTRUCTOR" || user.role === "ADMIN")
              ? "Create your first assignment to get started."
              : "Check back later for new assignments from your instructors."}
          </p>
          {showCreateButton && user && (user.role === "INSTRUCTOR" || user.role === "ADMIN") && (
            <Link href="/assignments/create">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Assignment
              </Button>
            </Link>
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

      {/* Load More Button */}
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

