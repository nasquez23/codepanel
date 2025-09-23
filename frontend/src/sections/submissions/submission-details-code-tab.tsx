import CodeBlock from "@/components/code-block";
import { AssignmentSubmission } from "@/types/assignment";

export default function SubmissionDetailsCodeTab({
  submission,
}: {
  submission: AssignmentSubmission;
}) {
  return (
    <div className="p-3 mt-2">
      <h1 className="text-xl font-medium mb-8">Student's Code</h1>
      <CodeBlock
        code={submission.code}
        language={submission.assignment.language}
      />
    </div>
  );
}
