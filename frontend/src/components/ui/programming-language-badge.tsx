import { cn } from "@/lib/utils";
import {
  ProgrammingLanguage,
  ProgrammingLanguageDisplayNames,
} from "@/types/problem-post";
import { CodeXml } from "lucide-react";

export function ProgrammingLanguageBadge({
  language,
  className,
}: {
  language: ProgrammingLanguage;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex gap-1 bg-blue-100 px-2 py-1 rounded-2xl shrink",
        className
      )}
    >
      <CodeXml className="w-4 h-4 text-blue-800" />
      <span className="text-blue-800 rounded-lg text-xs font-medium">
        {ProgrammingLanguageDisplayNames[language]}
      </span>
    </div>
  );
}
