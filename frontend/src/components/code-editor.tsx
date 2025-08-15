import { languageMap } from "@/lib/utils";
import { ProgrammingLanguage } from "@/types/problem-post";
import { Editor } from "@monaco-editor/react";

interface CodeEditorProps {
  code: string;
  language: ProgrammingLanguage;
  onChange: (value: string | undefined) => void;
}

export default function CodeEditor({
  code,
  language,
  onChange,
}: CodeEditorProps) {
  return (
    <Editor
      height="250px"
      language={languageMap[language]}
      value={code}
      theme="vs-dark"
      onChange={onChange}
    />
  );
}
