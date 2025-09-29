"use client";

import { useState } from "react";
import { Assignment } from "@/types/assignment";
import { TagBadge } from "@/components/ui/tag-badge";
import { CategoryBadge } from "@/components/ui/category-badge";
import { DifficultyBadge } from "@/components/ui/difficulty-badge";
import { formatDate } from "date-fns";
import { NotepadText } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useDeleteAssignment } from "@/hooks/use-assignments";
import Link from "next/link";
import DeleteConfirmationDialog from "@/components/delete-confirmation-dialog";
import ProfilePicture from "../profile-picture";
import { cn } from "@/lib/utils";
import { Role } from "@/types/auth";

interface AssignmentCardProps {
  assignment: Assignment;
  showActions?: boolean;
}

export default function AssignmentCard({
  assignment,
  showActions = false,
}: AssignmentCardProps) {
  const { user } = useAuth();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const deleteMutation = useDeleteAssignment();

  const isOwner = user?.id === assignment.instructor.id;
  const canEdit = user && (user.role === Role.ADMIN || isOwner);
  const canDelete = user && (user.role === Role.ADMIN || isOwner);

  const isOverdue =
    assignment.dueDate && new Date(assignment.dueDate) < new Date();
  const isDueSoon =
    assignment.dueDate &&
    !isOverdue &&
    new Date(assignment.dueDate) <= new Date(Date.now() + 24 * 60 * 60 * 1000);

  const handleDelete = () => {
    deleteMutation.mutate(assignment.id, {
      onSuccess: () => {
        setShowDeleteDialog(false);
      },
    });
  };

  const baseClasses =
    "bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-200";

  return (
    <div
      className={cn(
        baseClasses,
        user && assignment.hasSubmitted && "bg-green-100/70 shadow-green-200"
      )}
    >
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-3 text-sm text-gray-600">
          <ProfilePicture
            profilePictureUrl={assignment.instructor.profilePictureUrl}
            firstName={assignment.instructor.firstName}
            lastName={assignment.instructor.lastName}
            className="size-10"
          />
          <span className="font-medium text-base">
            {assignment.instructor.firstName} {assignment.instructor.lastName}
          </span>
        </div>
        <div className="flex flex-col gap-2">
          <DifficultyBadge difficulty={assignment.difficultyLevel} size="sm" />
          {assignment.isActive && (
            <span className="bg-blue-100 text-blue-500 rounded-full px-2 py-1 text-xs font-medium">
              Active
            </span>
          )}
        </div>
      </div>
      <div className="flex justify-between items-start mb-2">
        <Link href={`/assignments/${assignment.id}`}>
          <h3 className="text-2xl font-medium text-gray-900 hover:text-blue-600 transition-colors cursor-pointer">
            {assignment.title}
          </h3>
        </Link>
        {/* {showActions && (canEdit || canDelete) && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {canEdit && (
                <DropdownMenuItem asChild>
                  <Link href={`/assignments/${assignment.id}/edit`}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Link>
                </DropdownMenuItem>
              )}
              {canDelete && (
                <DropdownMenuItem
                  onClick={() => setShowDeleteDialog(true)}
                  className="text-red-600"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )} */}
      </div>

      <p className="text-gray-700 mb-4 line-clamp-3">
        {assignment.description}
      </p>

      {(assignment.category || (assignment.tags && assignment.tags.length > 0)) && (
        <div className="flex items-center gap-2 my-3 flex-wrap">
          {assignment.category && (
            <CategoryBadge
              category={assignment.category}
              size="sm"
              variant="secondary"
            />
          )}
          {assignment.tags && assignment.tags.length > 0 && (
            <>
              {assignment.tags.slice(0, 3).map((tag) => (
                <TagBadge
                  key={tag.id}
                  tag={tag}
                  size="sm"
                  variant="secondary"
                />
              ))}
              {assignment.tags.length > 3 && (
                <span className="text-xs text-gray-500">
                  +{assignment.tags.length - 3} more
                </span>
              )}
            </>
          )}
        </div>
      )}

      <div className="flex items-center justify-between border-t border-gray-300 pt-2">
        <div className="flex items-center gap-2">
          <NotepadText className="size-4" />
          <span className="text-sm font-medium">
            {assignment.submissionCount} submissions
          </span>
        </div>

        <div className="flex items-center gap-2">
          {assignment.dueDate && (
            <div className="flex flex-col gap-1 text-sm">
              <span>Due Date</span>
              <span
                className={cn(
                  "font-medium",
                  isOverdue && "text-red-600",
                  isDueSoon && "text-orange-600"
                )}
              >
                {formatDate(new Date(assignment.dueDate), "MMM d, yyyy")}{" "}
                {isOverdue && " (Overdue)"}
                {isDueSoon && " (Due Soon)"}
              </span>
            </div>
          )}
          {/* {user && assignment.hasSubmitted && (
            <div className="flex items-center gap-1 text-green-600 text-sm">
              <CheckCircle className="w-4 h-4" />
              <span>Submitted</span>
            </div>
          )} */}

          {/* {user &&
            !assignment.hasSubmitted &&
            assignment.dueDate &&
            isOverdue && (
              <div className="flex items-center gap-1 text-red-600 text-sm">
                <AlertCircle className="size-4" />
                <span>Overdue</span>
              </div>
            )} */}
        </div>
      </div>

      {canDelete && (
        <DeleteConfirmationDialog
          open={showDeleteDialog}
          onOpenChange={setShowDeleteDialog}
          onConfirm={handleDelete}
          title="Delete Assignment"
          description={`Are you sure you want to delete "${assignment.title}"? This action cannot be undone and will delete all submissions.`}
          isLoading={deleteMutation.isPending}
        />
      )}
    </div>
  );
}
