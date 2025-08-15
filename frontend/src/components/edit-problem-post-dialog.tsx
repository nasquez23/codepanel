"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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
import {
  ProblemPost,
  ProgrammingLanguage,
  ProgrammingLanguageDisplayNames,
  UpdateProblemPostRequest,
} from "@/types/problem-post";
import { useUpdateProblemPost } from "@/hooks/use-problem-posts";
import CodeEditor from "./code-editor";

interface EditProblemPostDialogProps {
  problemPost: ProblemPost;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function EditProblemPostDialog({
  problemPost,
  open,
  onOpenChange,
}: EditProblemPostDialogProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    code: "",
    language: "" as ProgrammingLanguage | "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateMutation = useUpdateProblemPost();

  useEffect(() => {
    if (problemPost) {
      setFormData({
        title: problemPost.title,
        description: problemPost.description,
        code: problemPost.code || "",
        language: problemPost.language,
      });
      setErrors({});
    }
  }, [problemPost, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    } else if (formData.title.length < 5) {
      newErrors.title = "Title must be at least 5 characters";
    } else if (formData.title.length > 200) {
      newErrors.title = "Title must not exceed 200 characters";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.length < 10) {
      newErrors.description = "Description must be at least 10 characters";
    } else if (formData.description.length > 5000) {
      newErrors.description = "Description must not exceed 5000 characters";
    }

    if (!formData.language) {
      newErrors.language = "Programming language is required";
    }

    if (formData.code && formData.code.length > 10000) {
      newErrors.code = "Code must not exceed 10000 characters";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    const updateData: UpdateProblemPostRequest = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      code: formData.code.trim() || undefined,
      language: formData.language as ProgrammingLanguage,
    };

    updateMutation.mutate(
      { id: problemPost.id, data: updateData },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
        onError: (error: any) => {
          console.error("Error updating problem post:", error);
          setErrors({
            submit:
              error.response?.data?.message ||
              "Failed to update problem post. Please try again.",
          });
        },
      }
    );
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Problem Post</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="edit-title"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Problem Title <span className="text-red-500">*</span>
            </label>
            <Input
              id="edit-title"
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder="e.g., Help with array sorting algorithm"
              className={errors.title ? "border-red-500" : ""}
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="edit-language"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Programming Language <span className="text-red-500">*</span>
            </label>
            <Select
              value={formData.language}
              onValueChange={(value) => handleInputChange("language", value)}
            >
              <SelectTrigger
                className={errors.language ? "border-red-500" : ""}
              >
                <SelectValue placeholder="Select a programming language" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(ProgrammingLanguageDisplayNames).map(
                  ([key, displayName]) => (
                    <SelectItem key={key} value={key}>
                      {displayName}
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
            {errors.language && (
              <p className="mt-1 text-sm text-red-600">{errors.language}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="edit-description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Problem Description <span className="text-red-500">*</span>
            </label>
            <Textarea
              id="edit-description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Describe your problem in detail..."
              className={`min-h-[100px] ${
                errors.description ? "border-red-500" : ""
              }`}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="edit-code"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Your Code (Optional)
            </label>

            {formData.language ? (
              <CodeEditor
                code={formData.code}
                language={formData.language as ProgrammingLanguage}
                onChange={(value) => handleInputChange("code", value || "")}
              />
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                <p className="text-gray-500 text-sm">
                  Please select a programming language first to enable the code
                  editor
                </p>
              </div>
            )}

            {errors.code && (
              <p className="mt-1 text-sm text-red-600">{errors.code}</p>
            )}
          </div>

          {errors.submit && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-sm text-red-600">{errors.submit}</p>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={updateMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={updateMutation.isPending}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            >
              {updateMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
