"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCreateAssignment } from "@/hooks/use-assignments";
import { CreateAssignmentRequest } from "@/types/assignment";
import { ProgrammingLanguage, ProgrammingLanguageDisplayNames } from "@/types/problem-post";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Save, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function CreateAssignmentForm() {
  const router = useRouter();
  const createMutation = useCreateAssignment();
  
  const [formData, setFormData] = useState<CreateAssignmentRequest>({
    title: "",
    description: "",
    language: ProgrammingLanguage.JAVASCRIPT,
    dueDate: "",
    isActive: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

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
      const assignmentData: CreateAssignmentRequest = {
        ...formData,
        dueDate: formData.dueDate || undefined,
      };

      const newAssignment = await createMutation.mutateAsync(assignmentData);
      router.push(`/assignments/${newAssignment.id}`);
    } catch (error) {
      console.error("Failed to create assignment:", error);
    }
  };

  const isSubmitting = createMutation.isPending;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-6">
        <Link href="/assignments">
          <Button variant="outline" size="sm" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Assignments
          </Button>
        </Link>
        
        <h1 className="text-3xl font-bold text-gray-900">Create New Assignment</h1>
        <p className="text-gray-600 mt-2">
          Create a programming assignment for your students.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Assignment Title *
          </label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Enter assignment title..."
            disabled={isSubmitting}
            className={errors.title ? "border-red-500" : ""}
          />
          {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Description *
          </label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Describe the assignment requirements, objectives, and any specific instructions..."
            className={`min-h-[150px] resize-none ${errors.description ? "border-red-500" : ""}`}
            disabled={isSubmitting}
          />
          {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
        </div>

        <div>
          <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-2">
            Programming Language *
          </label>
          <Select
            value={formData.language}
            onValueChange={(value: ProgrammingLanguage) => 
              setFormData({ ...formData, language: value })
            }
            disabled={isSubmitting}
          >
            <SelectTrigger className={errors.language ? "border-red-500" : ""}>
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
          {errors.language && <p className="text-red-500 text-sm mt-1">{errors.language}</p>}
        </div>

        <div>
          <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-2">
            Due Date (Optional)
          </label>
          <Input
            id="dueDate"
            type="datetime-local"
            value={formData.dueDate}
            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
            disabled={isSubmitting}
            className={errors.dueDate ? "border-red-500" : ""}
          />
          {errors.dueDate && <p className="text-red-500 text-sm mt-1">{errors.dueDate}</p>}
          <p className="text-sm text-gray-500 mt-1">
            Students will not be able to submit after this date
          </p>
        </div>

        <div className="flex items-center gap-2">
          <input
            id="isActive"
            type="checkbox"
            checked={formData.isActive}
            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
            disabled={isSubmitting}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
            Make assignment active immediately
          </label>
        </div>

        <div className="flex gap-3 pt-6">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 flex-1"
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {isSubmitting ? "Creating..." : "Create Assignment"}
          </Button>
          
          <Link href="/assignments">
            <Button variant="outline" disabled={isSubmitting}>
              Cancel
            </Button>
          </Link>
        </div>
      </form>
    </div>
  );
}

