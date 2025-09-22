import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DifficultyBadge } from "@/components/ui/difficulty-badge";
import { ProblemPost } from "@/types/problem-post";
import { CheckCheck } from "lucide-react";
import Link from "next/link";
import ProblemPostAttributes from "../problems/problem-post-attributes";

interface DashboardProblemPostCardProps {
  problemPost: ProblemPost;
}

export default function DashboardProblemPostCard({
  problemPost,
}: DashboardProblemPostCardProps) {
  return (
    <Card className="bg-gray-50 gap-4">
      <CardHeader className="flex items-center justify-between">
        <Link href={`/problems/${problemPost.id}`}>
          <CardTitle className="hover:text-blue-600">
            {problemPost.title}
          </CardTitle>
        </Link>
        {problemPost.acceptedAnswer && (
          <CheckCheck className="size-4 text-green-600 bg-green-100 p-2 rounded-lg" />
        )}
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <DifficultyBadge difficulty={problemPost.difficultyLevel} size="sm" />
          <span>{problemPost.commentCount} responses</span>
        </div>
        <ProblemPostAttributes
          problemPost={problemPost}
          includeDifficulty={false}
        />
      </CardContent>
    </Card>
  );
}
