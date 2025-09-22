import { Button } from "@/components/ui/button";
import { AssignmentSubmission } from "@/types/assignment";
import { useState } from "react";
import { useEffect, useMemo } from "react";
import { usePendingReviews } from "@/hooks/use-assignments";
import DashboardInstructorPendingReviewCard from "./dashboard-instructor-pending-review-card";

export default function DashboardInstructorPendingReviews() {
  const [page, setPage] = useState<number>(0);
  const [items, setItems] = useState<AssignmentSubmission[]>([]);
  const {
    data,
    isLoading: reviewsLoading,
    isFetching,
  } = usePendingReviews(page, 5);

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
          {items.map((submission) => (
            <DashboardInstructorPendingReviewCard
              key={submission.id}
              submission={submission}
            />
          ))}
          {hasMore && (
            <div className="flex justify-center pt-2">
              <Button
                variant="outline"
                onClick={() => setPage((p) => p + 1)}
                className="bg-blue-600 text-white hover:bg-blue-700 hover:text-white"
                disabled={isFetching}
              >
                {isFetching ? "Loading..." : "Load more"}
              </Button>
            </div>
          )}
        </>
      ) : reviewsLoading ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-4">Loading...</p>
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-4">No reviews yet.</p>
        </div>
      )}
    </div>
  );
}
