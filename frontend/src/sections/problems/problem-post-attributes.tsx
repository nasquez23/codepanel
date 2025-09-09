import { CategoryBadge } from "@/components/ui/category-badge";
import { DifficultyBadge } from "@/components/ui/difficulty-badge";
import { ProgrammingLanguageBadge } from "@/components/ui/programming-language-badge";
import { TagBadge } from "@/components/ui/tag-badge";
import { ProblemPost } from "@/types/problem-post";

interface ProblemPostAttributesProps {
  problemPost: ProblemPost;
  includeTags?: boolean;
  includeCategory?: boolean;
  includeDifficulty?: boolean;
  includeLanguage?: boolean;
}

export default function ProblemPostAttributes({
  problemPost,
  includeTags = true,
  includeCategory = true,
  includeDifficulty = true,
  includeLanguage = true,
}: ProblemPostAttributesProps) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {includeDifficulty && (
        <DifficultyBadge difficulty={problemPost.difficultyLevel} size="sm" />
      )}
      {includeLanguage && (
        <ProgrammingLanguageBadge language={problemPost.language} />
      )}
      {includeCategory && problemPost.category && (
        <CategoryBadge
          category={problemPost.category}
          size="sm"
          variant="secondary"
        />
      )}
      {includeTags && problemPost.tags && problemPost.tags.length > 0 && (
        <>
          {problemPost.tags.slice(0, 3).map((tag) => (
            <TagBadge key={tag.id} tag={tag} size="sm" variant="secondary" />
          ))}
          {problemPost.tags.length > 3 && (
            <span className="text-xs text-gray-500">
              +{problemPost.tags.length - 3} more
            </span>
          )}
        </>
      )}
    </div>
  );
}
