"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useUpdateComment } from "@/hooks/use-comments";
import { Comment, UpdateCommentRequest } from "@/types/comment";
import { Loader2, Save, X } from "lucide-react";
import CodeBlock from "@/components/code-block";
import { ProgrammingLanguage } from "@/types/problem-post";

interface EditCommentFormProps {
  comment: Comment;
  problemPostId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function EditCommentForm({
  comment,
  problemPostId,
  onSuccess,
  onCancel,
}: EditCommentFormProps) {
  const [formData, setFormData] = useState<UpdateCommentRequest>({
    comment: comment.comment,
    code: comment.code || "",
  });
  const [showCodeInput, setShowCodeInput] = useState(!!comment.code);

  const updateMutation = useUpdateComment();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.comment.trim()) return;

    try {
      await updateMutation.mutateAsync({
        commentId: comment.id,
        problemPostId,
        data: {
          comment: formData.comment,
          code: formData.code || undefined,
        },
      });
      
      onSuccess();
    } catch (error) {
      console.error("Failed to update comment:", error);
    }
  };

  const isSubmitting = updateMutation.isPending;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Textarea
          value={formData.comment}
          onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
          placeholder="Edit your comment..."
          className="min-h-[100px] resize-none"
          disabled={isSubmitting}
        />
      </div>

      {showCodeInput && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Code (Optional)
          </label>
          <Textarea
            value={formData.code || ""}
            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
            placeholder="Paste your code here..."
            className="font-mono text-sm min-h-[150px] resize-none"
            disabled={isSubmitting}
          />
          
          {formData.code && (
            <div className="mt-2">
              <p className="text-sm text-gray-600 mb-2">Preview:</p>
              <CodeBlock
                code={formData.code}
                language={ProgrammingLanguage.JAVASCRIPT} // Default to JS for preview
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

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
            className="flex items-center gap-2"
          >
            <X className="h-4 w-4" />
            Cancel
          </Button>
          
          <Button
            type="submit"
            disabled={!formData.comment.trim() || isSubmitting}
            className="flex items-center gap-2"
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </form>
  );
}

