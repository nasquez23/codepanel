import AssignmentDetails from "@/components/assignments/assignment-details";

interface AssignmentPageProps {
  params: {
    id: string;
  };
}

export default async function AssignmentPage({ params }: AssignmentPageProps) {
  const { id } = await params;

  return (
    <div className="min-h-screen bg-gray-50">
      <AssignmentDetails id={id} />
    </div>
  );
}
