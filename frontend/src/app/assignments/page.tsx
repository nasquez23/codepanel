import AssignmentsList from "@/components/assignments/assignments-list";

export default function AssignmentsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <AssignmentsList showCreateButton={true} />
      </div>
    </div>
  );
}