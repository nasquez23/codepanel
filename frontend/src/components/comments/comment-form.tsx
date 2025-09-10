"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useCreateComment } from "@/hooks/use-comments";
import { CreateCommentRequest } from "@/types/comment";
import { Loader2, Send } from "lucide-react";
import CodeBlock from "@/components/code-block";
import { ProgrammingLanguage } from "@/types/problem-post";
import CodeEditor from "../code-editor";

interface CommentFormProps {
  problemPostId: string;
  onSuccess?: () => void;
  placeholder?: string;
  buttonText?: string;
}

export default function CommentForm({
  problemPostId,
  onSuccess,
  placeholder = "Add your response...",
  buttonText = "Post Response",
}: CommentFormProps) {
  const [formData, setFormData] = useState<CreateCommentRequest>({
    comment: "",
    code: "",
  });
  const [showCodeInput, setShowCodeInput] = useState(false);

  const createMutation = useCreateComment();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.comment.trim()) return;

    try {
      await createMutation.mutateAsync({
        problemPostId,
        data: {
          comment: formData.comment,
          code: formData.code || undefined,
        },
      });

      setFormData({ comment: "", code: "" });
      setShowCodeInput(false);
      onSuccess?.();
    } catch (error) {
      console.error("Failed to create comment:", error);
    }
  };

  const isSubmitting = createMutation.isPending;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Textarea
          value={formData.comment}
          onChange={(e) =>
            setFormData({ ...formData, comment: e.target.value })
          }
          placeholder={placeholder}
          className="min-h-[100px] resize-none"
          disabled={isSubmitting}
        />
      </div>

      {showCodeInput && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Code (Optional)
          </label>
          <CodeEditor
            code={formData.code || ""}
            language={ProgrammingLanguage.JAVASCRIPT}
            onChange={(value) =>
              setFormData({ ...formData, code: value || "" })
            }
          />

          {formData.code && (
            <div className="mt-2">
              <p className="text-sm text-gray-600 mb-2">Preview:</p>
              <CodeBlock
                code={formData.code}
                language={ProgrammingLanguage.JAVASCRIPT}
                showCopyButton={false}
                maxHeight="200px"
              />
            </div>
          )}
        </div>
      )}

      <div className="flex items-center justify-between">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setShowCodeInput(!showCodeInput)}
          disabled={isSubmitting}
        >
          {showCodeInput ? "Hide Code" : "Add Code"}
        </Button>

        <Button
          type="submit"
          disabled={!formData.comment.trim() || isSubmitting}
          className="flex items-center gap-2 bg-blue-500 text-white hover:bg-blue-700"
        >
          {isSubmitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
          {isSubmitting ? "Posting..." : buttonText}
        </Button>
      </div>
    </form>
  );
}
