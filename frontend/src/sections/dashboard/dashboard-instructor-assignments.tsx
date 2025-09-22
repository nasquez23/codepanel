import { Button } from "@/components/ui/button";
import DashboardAssignmentCard from "./dashboard-assignment-card";
import { useMyAssignments } from "@/hooks/use-assignments";
import { useEffect, useMemo, useState } from "react";
import { Assignment } from "@/types/assignment";

export default function DashboardInstructorAssignments() {
  const [items, setItems] = useState<Assignment[]>([]);
  const [page, setPage] = useState<number>(0);
  const {
    data,
    isLoading: assignmentsLoading,
    isFetching,
  } = useMyAssignments(page, 5);

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
          {items.map((assignment) => (
            <DashboardAssignmentCard
              key={assignment.id}
              assignment={assignment}
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
      ) : assignmentsLoading ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-4">Loading...</p>
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-4">No assignments yet.</p>
        </div>
      )}
    </div>
  );
}
