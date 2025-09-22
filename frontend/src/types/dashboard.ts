export interface StudentStatsResponse {
  problemsPosted: number;
  totalSubmissions: number;
  averageGrade: number | null;
  totalPoints: number;
}

export interface InstructorStatsResponse {
  totalAssignments: number;
  activeAssignments: number;
  totalSubmissions: number;
  pendingReviews: number;
}
