import { useEffect, useMemo, useState } from "react";
import { useMySubmissions } from "@/hooks/use-assignments";
import DashboardSubmissionCard from "./dashboard-submission-card";
import { Button } from "@/components/ui/button";
import { AssignmentSubmission } from "@/types/assignment";

export default function DashboardStudentSubmissions() {
  const pageSize = 5;
  const [page, setPage] = useState<number>(0);
  const [items, setItems] = useState<AssignmentSubmission[]>([]);

  const { data, isFetching, isLoading } = useMySubmissions(page, pageSize);

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
            <DashboardSubmissionCard
              key={submission.id}
              submission={submission}
            />
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
          <p className="text-gray-500 text-lg mb-4">No submissions yet.</p>
        </div>
      )}
    </div>
  );
}
