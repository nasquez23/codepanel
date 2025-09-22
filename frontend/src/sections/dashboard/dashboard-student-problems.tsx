import { useEffect, useMemo, useState } from "react";
import { useAuth, useMyProblemPosts } from "@/hooks";
import DashboardProblemPostCard from "./dashboard-problem-post-card";
import { Button } from "@/components/ui/button";
import { ProblemPost } from "@/types/problem-post";

export default function DashboardStudentProblems() {
  const { isAuthenticated } = useAuth();
  const pageSize = 5;
  const [page, setPage] = useState<number>(0);
  const [items, setItems] = useState<ProblemPost[]>([]);

  const { data, isFetching, isLoading } = useMyProblemPosts(
    page,
    pageSize,
    true,
    isAuthenticated
  );

  const totalElements = data?.totalElements ?? items.length;
  const hasMore = useMemo(
    () => items.length < totalElements,
    [items.length, totalElements]
  );

  useEffect(() => {
    if (!data) return;
    const newItems = data.content || [];
    setItems((prev) => (page === 0 ? newItems : [...prev, ...newItems]));
  }, [data, page]);

  return (
    <div className="flex flex-col gap-4 mt-5">
      {items.length > 0 ? (
        <>
          {items.map((problem) => (
            <DashboardProblemPostCard key={problem.id} problemPost={problem} />
          ))}
          {hasMore && (
            <div className="flex justify-center pt-2">
              <Button
                variant="outline"
                onClick={() => setPage((p) => p + 1)}
                disabled={isFetching}
              >
                {isFetching ? "Loading..." : "Load more"}
              </Button>
            </div>
          )}
        </>
      ) : isLoading ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-4">Loading...</p>
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-4">No problems posted yet.</p>
        </div>
      )}
    </div>
  );
}
