import SubmissionDetails from "@/components/assignments/submission-details";

interface SubmissionPageProps {
  params: {
    id: string;
  };
}

export default async function SubmissionPage({ params }: SubmissionPageProps) {
  const { id } = await params;

  return (
    <div className="min-h-screen bg-gray-50">
      <SubmissionDetails id={id} />
    </div>
  );
}
