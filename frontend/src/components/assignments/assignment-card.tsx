"use client";

import { useState } from "react";
import { Assignment } from "@/types/assignment";
import { Button } from "@/components/ui/button";
import { ProgrammingLanguageDisplayNames } from "@/types/problem-post";
import { formatDistanceToNow } from "date-fns";
import {
  User,
  Clock,
  Code,
  Users,
  CheckCircle,
  AlertCircle,
  Edit,
  Trash2,
  MoreHorizontal,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useDeleteAssignment } from "@/hooks/use-assignments";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import DeleteConfirmationDialog from "@/components/delete-confirmation-dialog";

interface AssignmentCardProps {
  assignment: Assignment;
  showActions?: boolean;
}

export default function AssignmentCard({ assignment, showActions = false }: AssignmentCardProps) {
  const { user } = useAuth();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const deleteMutation = useDeleteAssignment();

  const isOwner = user?.id === assignment.instructor.id;
  const canEdit = user && (user.role === "ADMIN" || isOwner);
  const canDelete = user && (user.role === "ADMIN" || isOwner);

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

  const isDueSoon = assignment.dueDate && new Date(assignment.dueDate) <= new Date(Date.now() + 24 * 60 * 60 * 1000);
  const isOverdue = assignment.dueDate && new Date(assignment.dueDate) < new Date();

  const handleDelete = () => {
    deleteMutation.mutate(assignment.id, {
      onSuccess: () => {
        setShowDeleteDialog(false);
      },
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-200">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <Link href={`/assignments/${assignment.id}`}>
            <h3 className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors cursor-pointer">
              {assignment.title}
            </h3>
          </Link>
          
          <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <User className="w-4 h-4" />
              <span>{assignment.instructor.firstName} {assignment.instructor.lastName}</span>
            </div>
            
            <div className="flex items-center gap-1">
              <Code className="w-4 h-4" />
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                {ProgrammingLanguageDisplayNames[assignment.language]}
              </span>
            </div>
            
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{assignment.submissionCount} submissions</span>
            </div>
          </div>
        </div>

        {showActions && (canEdit || canDelete) && (
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
        )}
      </div>

      <p className="text-gray-700 mb-4 line-clamp-3">{assignment.description}</p>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 text-sm">
          {assignment.dueDate && (
            <div className={`flex items-center gap-1 ${
              isOverdue ? "text-red-600" : isDueSoon ? "text-orange-600" : "text-gray-600"
            }`}>
              <Clock className="w-4 h-4" />
              <span>
                Due {formatDistanceToNow(new Date(assignment.dueDate), { addSuffix: true })}
              </span>
            </div>
          )}
          
          <div className="text-xs text-gray-500">
            Created {formatDistanceToNow(new Date(assignment.createdAt), { addSuffix: true })}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {user && assignment.hasSubmitted && (
            <div className="flex items-center gap-1 text-green-600 text-sm">
              <CheckCircle className="w-4 h-4" />
              <span>Submitted</span>
            </div>
          )}
          
          {user && !assignment.hasSubmitted && assignment.dueDate && isOverdue && (
            <div className="flex items-center gap-1 text-red-600 text-sm">
              <AlertCircle className="size-4" />
              <span>Overdue</span>
            </div>
          )}
          
          <Link href={`/assignments/${assignment.id}`}>
            <Button variant="outline" size="sm">
              View Details
            </Button>
          </Link>
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
