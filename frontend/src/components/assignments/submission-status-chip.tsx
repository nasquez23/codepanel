import { SubmissionStatus } from "@/types/assignment";

export default function SubmissionStatusChip({
  status,
}: {
  status: SubmissionStatus;
}) {
  return (
    <span
      className={`px-3 py-1 rounded-full text-sm font-medium ${
        status === "REVIEWED"
          ? "bg-green-100 text-green-800"
          : "bg-yellow-100 text-yellow-800"
      }`}
    >
      {status === "REVIEWED" ? "Reviewed" : "Pending Review"}
    </span>
  );
}
