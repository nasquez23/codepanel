"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
  ProgrammingLanguage,
  ProgrammingLanguageDisplayNames,
} from "@/types/problem-post";
import { DifficultyLevel, Tag, Category } from "@/types/tags-categories";
import { useCreateProblemPost } from "@/hooks/use-problem-posts";
import { useAuth } from "@/hooks/use-auth";
import { TagSelector } from "@/components/ui/tag-selector";
import { CategorySelector } from "@/components/ui/category-selector";
import { DifficultySelector } from "@/components/ui/difficulty-selector";
import CodeBlock from "@/components/code-block";
import CodeEditor from "@/components/code-editor";

export default function CreateProblemPostForm() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    code: "",
    language: "" as ProgrammingLanguage | "",
    difficultyLevel: "" as DifficultyLevel | "",
    category: null as Category | null,
    tags: [] as Tag[],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const createMutation = useCreateProblemPost();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

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

    if (!formData.difficultyLevel) {
      newErrors.difficultyLevel = "Difficulty level is required";
    }

    if (formData.code && formData.code.length > 10000) {
      newErrors.code = "Code must not exceed 10000 characters";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    createMutation.mutate(
      {
        title: formData.title.trim(),
        description: formData.description.trim(),
        code: formData.code.trim() || undefined,
        language: formData.language as ProgrammingLanguage,
        difficultyLevel: formData.difficultyLevel as DifficultyLevel,
        categoryId: formData.category?.id,
        tagIds: formData.tags.map((tag) => tag.id),
      },
      {
        onSuccess: () => {
          router.push("/problems");
        },
        onError: (error: any) => {
          console.error("Error creating problem post:", error);
          setErrors({
            submit:
              error.response?.data?.message ||
              "Failed to create problem post. Please try again.",
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
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Post a Coding Problem
        </h1>
        <p className="text-gray-600 mb-8">
          Share your coding challenge with the community and get help from peers
          and instructors.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Problem Title <span className="text-red-500">*</span>
            </label>
            <Input
              id="title"
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
              htmlFor="language"
              className="block text-sm font-medium text-gray-700 mb-2"
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
              htmlFor="difficulty"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Difficulty Level <span className="text-red-500">*</span>
            </label>
            <DifficultySelector
              selectedDifficulty={formData.difficultyLevel || null}
              onDifficultyChange={(difficulty) =>
                handleInputChange("difficultyLevel", difficulty || "")
              }
              required={true}
              className={errors.difficultyLevel ? "border-red-500" : ""}
            />
            {errors.difficultyLevel && (
              <p className="mt-1 text-sm text-red-600">
                {errors.difficultyLevel}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Category (Optional)
            </label>
            <CategorySelector
              selectedCategory={formData.category}
              onCategoryChange={(category) =>
                setFormData((prev) => ({ ...prev, category }))
              }
            />
          </div>

          <div>
            <label
              htmlFor="tags"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Tags (Optional)
            </label>
            <TagSelector
              selectedTags={formData.tags}
              onTagsChange={(tags) =>
                setFormData((prev) => ({ ...prev, tags }))
              }
              placeholder="Search and select tags..."
              maxTags={5}
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Problem Description <span className="text-red-500">*</span>
            </label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Describe your problem in detail. What are you trying to achieve? What issues are you facing? Include any error messages or specific requirements."
              className={`min-h-[120px] ${
                errors.description ? "border-red-500" : ""
              }`}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="code"
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
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-sm text-red-600">{errors.submit}</p>
            </div>
          )}

          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              disabled={createMutation.isPending}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            >
              {createMutation.isPending ? "Posting..." : "Post Problem"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={createMutation.isPending}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
