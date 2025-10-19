"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAssignment, useUpdateAssignment } from "@/hooks/use-assignments";
import { UpdateAssignmentRequest } from "@/types/assignment";
import {
  ProgrammingLanguage,
  ProgrammingLanguageDisplayNames,
} from "@/types/problem-post";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Save, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { DifficultyLevel } from "@/types/tags-categories";
import { useAuth } from "@/hooks";

export default function EditAssignmentView({
  assignmentId,
}: {
  assignmentId: string;
}) {
  const router = useRouter();
  const { data: assignment, isLoading: assignmentLoading } =
    useAssignment(assignmentId);
  const updateMutation = useUpdateAssignment();
  const { user } = useAuth();

  if (user?.id !== assignment?.instructor?.id) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-6">
        <div className="bg-red-50 border border-red-200 rounded-md p-6 text-center">
          <p className="text-red-600 mb-4">
            You are not authorized to edit this assignment.
          </p>
          <Link href="/assignments">
            <Button className="bg-blue-500 text-white hover:bg-blue-700">
              Back to Assignments
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const [formData, setFormData] = useState<UpdateAssignmentRequest>({
    title: "",
    description: "",
    language: ProgrammingLanguage.JAVASCRIPT,
    dueDate: "",
    isActive: true,
    difficultyLevel: DifficultyLevel.EASY,
  });

  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({
    title: "",
    description: "",
    language: "",
    dueDate: "",
    isActive: "",
  });

  useEffect(() => {
    if (assignment && !isInitialized) {
      setFormData({
        title: assignment.title,
        description: assignment.description,
        language: assignment.language,
        dueDate: assignment.dueDate
          ? new Date(assignment.dueDate).toISOString().slice(0, 16)
          : "",
        isActive: assignment.isActive,
        difficultyLevel: assignment.difficultyLevel,
      });
      setIsInitialized(true);
    }
  }, [assignment, isInitialized]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    } else if (formData.title.length > 200) {
      newErrors.title = "Title must be less than 200 characters";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.length > 5000) {
      newErrors.description = "Description must be less than 5000 characters";
    }

    if (!formData.language) {
      newErrors.language = "Programming language is required";
    }

    if (formData.dueDate) {
      const dueDate = new Date(formData.dueDate);
      const now = new Date();
      if (dueDate <= now) {
        newErrors.dueDate = "Due date must be in the future";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const assignmentData: UpdateAssignmentRequest = {
        ...formData,
        dueDate: formData.dueDate || undefined,
      };

      await updateMutation.mutateAsync({
        id: assignmentId,
        data: assignmentData,
      });
      router.push(`/assignments/${assignmentId}`);
    } catch (error) {
      console.error("Failed to update assignment:", error);
    }
  };

  if (assignmentLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
          <span className="text-gray-600">Loading assignment...</span>
        </div>
      </div>
    );
  }

  if (!assignment) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Assignment not found.</p>
          <Link href="/assignments">
            <Button>Back to Assignments</Button>
          </Link>
        </div>
      </div>
    );
  }

  const isSubmitting = updateMutation.isPending;

  return (
    <div className="max-w-4xl mx-auto py-8 px-6">
      <div className="mb-6">
        <Link href={`/assignments/${assignmentId}`}>
          <Button
            variant="ghost"
            size="sm"
            className="mb-4 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
          >
            <ArrowLeft className="size-4 mr-2" />
            Back to Assignment
          </Button>
        </Link>

        <h1 className="text-3xl font-bold text-gray-900">Edit Assignment</h1>
        <p className="text-gray-600 mt-2">
          Update the assignment details and requirements.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Assignment Title *
            </label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="Enter assignment title..."
              disabled={isSubmitting}
              className={errors.title ? "border-red-500" : ""}
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Description *
            </label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Describe the assignment requirements, objectives, and any specific instructions..."
              className={`min-h-[150px] resize-none ${
                errors.description ? "border-red-500" : ""
              }`}
              disabled={isSubmitting}
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="language"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Programming Language *
            </label>
            <Select
              value={formData.language}
              onValueChange={(value: ProgrammingLanguage) =>
                setFormData({ ...formData, language: value })
              }
              disabled={isSubmitting}
            >
              <SelectTrigger
                className={errors.language ? "border-red-500" : ""}
              >
                <SelectValue placeholder="Select programming language" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(ProgrammingLanguage).map((lang) => (
                  <SelectItem key={lang} value={lang}>
                    {ProgrammingLanguageDisplayNames[lang]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.language && (
              <p className="text-red-500 text-sm mt-1">{errors.language}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="dueDate"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Due Date (Optional)
            </label>
            <Input
              id="dueDate"
              type="datetime-local"
              value={formData.dueDate}
              onChange={(e) =>
                setFormData({ ...formData, dueDate: e.target.value })
              }
              disabled={isSubmitting}
              className={errors.dueDate ? "border-red-500" : ""}
            />
            {errors.dueDate && (
              <p className="text-red-500 text-sm mt-1">{errors.dueDate}</p>
            )}
            <p className="text-sm text-gray-500 mt-1">
              Students will not be able to submit after this date
            </p>
          </div>

          <div className="flex items-center gap-2">
            <input
              id="isActive"
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) =>
                setFormData({ ...formData, isActive: e.target.checked })
              }
              disabled={isSubmitting}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label
              htmlFor="isActive"
              className="text-sm font-medium text-gray-700"
            >
              Assignment is active (students can submit)
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-6">
            <Link href={`/assignments/${assignmentId}`}>
              <Button variant="ghost" disabled={isSubmitting}>
                Cancel
              </Button>
            </Link>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 bg-blue-500 text-white hover:bg-blue-700"
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {isSubmitting ? "Updating..." : "Update Assignment"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
