import ProblemPostDetails from "../problem-post-details";

export default function ProblemsDetailsView({ id }: { id: string }) {
  return (
    <div className="min-h-screen bg-blue-200/20">
      <main className="py-8">
        <ProblemPostDetails id={id} />
      </main>
    </div>
  );
}
