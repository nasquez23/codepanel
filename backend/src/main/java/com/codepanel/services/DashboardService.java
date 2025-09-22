package com.codepanel.services;

import org.springframework.stereotype.Service;

import com.codepanel.models.User;
import com.codepanel.models.dto.StudentStatsResponse;
import com.codepanel.models.dto.InstructorStatsResponse;
import com.codepanel.repositories.ProblemPostRepository;
import com.codepanel.repositories.AssignmentSubmissionRepository;
import com.codepanel.repositories.UserScoreRepository;
import com.codepanel.repositories.AssignmentRepository;
import com.codepanel.models.User;
import com.codepanel.models.enums.SubmissionStatus;

@Service
public class DashboardService {

    private final ProblemPostRepository problemPostRepository;
    private final AssignmentSubmissionRepository submissionRepository;
    private final UserScoreRepository userScoreRepository;
    private final AssignmentRepository assignmentRepository;

    public DashboardService(ProblemPostRepository problemPostRepository, AssignmentSubmissionRepository submissionRepository, UserScoreRepository userScoreRepository, AssignmentRepository assignmentRepository) {
        this.problemPostRepository = problemPostRepository;
        this.submissionRepository = submissionRepository;
        this.userScoreRepository = userScoreRepository;
        this.assignmentRepository = assignmentRepository;
    }

    public StudentStatsResponse getStudentStats(User currentUser) {
        try {
            long problemsPosted = problemPostRepository.countByUser(currentUser);

            long totalSubmissions = submissionRepository.countByStudent(currentUser);
            Double averageGrade = submissionRepository.findAverageReviewedGradeByStudent(currentUser);

            Integer totalPointsInt = userScoreRepository.sumPointsByUserId(currentUser.getId());
            long totalPoints = totalPointsInt != null ? totalPointsInt.longValue() : 0L;

            StudentStatsResponse resp = new StudentStatsResponse(
                    problemsPosted,
                    totalSubmissions,
                    averageGrade,
                    totalPoints);

            return resp;
        } catch (Exception e) {
            System.out.println("Error getting student stats: " + e.getMessage());
            return null;
        }
    }

    public InstructorStatsResponse getInstructorStats(User currentUser) {
        try {
            long totalAssignments = assignmentRepository.findByInstructorOrderByCreatedAtDesc(currentUser, org.springframework.data.domain.PageRequest.of(0, 1)).getTotalElements();
            long activeAssignments = assignmentRepository.findByInstructorAndIsActiveOrderByCreatedAtDesc(currentUser, true, org.springframework.data.domain.PageRequest.of(0, 1)).getTotalElements();
            long totalSubmissions = submissionRepository.findByInstructorId(currentUser.getId(), org.springframework.data.domain.PageRequest.of(0, 1)).getTotalElements();
            long pendingReviews = submissionRepository.countByInstructorIdAndStatus(currentUser.getId(), SubmissionStatus.PENDING_REVIEW);

            return new InstructorStatsResponse(
                totalAssignments,
                activeAssignments,
                totalSubmissions,
                pendingReviews
            );
        } catch (Exception e) {
            System.out.println("Error getting instructor stats: " + e.getMessage());
            return null;
        }
    }
}
