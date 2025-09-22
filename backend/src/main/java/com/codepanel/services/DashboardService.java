package com.codepanel.services;

import org.springframework.stereotype.Service;

import com.codepanel.models.User;
import com.codepanel.models.dto.StudentStatsResponse;
import com.codepanel.repositories.ProblemPostRepository;
import com.codepanel.repositories.AssignmentSubmissionRepository;
import com.codepanel.repositories.UserScoreRepository;

@Service
public class DashboardService {

    private final ProblemPostRepository problemPostRepository;
    private final AssignmentSubmissionRepository submissionRepository;
    private final UserScoreRepository userScoreRepository;

    public DashboardService(ProblemPostRepository problemPostRepository, AssignmentSubmissionRepository submissionRepository, UserScoreRepository userScoreRepository) {
        this.problemPostRepository = problemPostRepository;
        this.submissionRepository = submissionRepository;
        this.userScoreRepository = userScoreRepository;
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
}
