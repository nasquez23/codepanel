package com.codepanel.services;

import com.codepanel.models.Assignment;
import com.codepanel.models.AssignmentSubmission;
import com.codepanel.models.SubmissionReview;
import com.codepanel.models.User;
import com.codepanel.models.dto.AssignmentResponse;
import com.codepanel.models.dto.AssignmentSubmissionResponse;
import com.codepanel.models.dto.CreateAssignmentRequest;
import com.codepanel.models.dto.CreateReviewRequest;
import com.codepanel.models.dto.CreateSubmissionRequest;
import com.codepanel.models.dto.UpdateAssignmentRequest;
import com.codepanel.models.enums.Role;
import com.codepanel.models.enums.SubmissionStatus;
import com.codepanel.repositories.AssignmentRepository;
import com.codepanel.repositories.AssignmentSubmissionRepository;
import com.codepanel.repositories.SubmissionReviewRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
public class AssignmentService {

    private final AssignmentRepository assignmentRepository;
    private final AssignmentSubmissionRepository submissionRepository;
    private final SubmissionReviewRepository reviewRepository;

    public AssignmentService(AssignmentRepository assignmentRepository,
            AssignmentSubmissionRepository submissionRepository,
            SubmissionReviewRepository reviewRepository) {
        this.assignmentRepository = assignmentRepository;
        this.submissionRepository = submissionRepository;
        this.reviewRepository = reviewRepository;
    }

    public AssignmentResponse createAssignment(CreateAssignmentRequest request, User instructor) {
        if (instructor.getRole() != Role.INSTRUCTOR && instructor.getRole() != Role.ADMIN) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only instructors can create assignments");
        }

        Assignment assignment = new Assignment();
        assignment.setTitle(request.getTitle());
        assignment.setDescription(request.getDescription());
        assignment.setLanguage(request.getLanguage());
        assignment.setInstructor(instructor);
        assignment.setDueDate(request.getDueDate());
        assignment.setIsActive(request.getIsActive());

        Assignment savedAssignment = assignmentRepository.save(assignment);
        return mapToAssignmentResponse(savedAssignment, null);
    }

    @Transactional(readOnly = true)
    public Page<AssignmentResponse> getAllAssignments(Pageable pageable, User currentUser) {
        Page<Assignment> assignments = assignmentRepository.findByIsActiveTrueOrderByDueDateAsc(pageable);
        return assignments.map(assignment -> mapToAssignmentResponse(assignment, currentUser));
    }

    @Transactional(readOnly = true)
    public Page<AssignmentResponse> getMyAssignments(User instructor, Pageable pageable) {
        if (instructor.getRole() != Role.INSTRUCTOR && instructor.getRole() != Role.ADMIN) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only instructors can view their assignments");
        }

        Page<Assignment> assignments = assignmentRepository.findByInstructorOrderByCreatedAtDesc(instructor, pageable);
        return assignments.map(assignment -> mapToAssignmentResponse(assignment, instructor));
    }

    @Transactional(readOnly = true)
    public AssignmentResponse getAssignmentById(UUID assignmentId, User currentUser) {
        Assignment assignment = assignmentRepository.findByIdWithInstructor(assignmentId);
        if (assignment == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Assignment not found");
        }
        return mapToAssignmentResponse(assignment, currentUser);
    }

    @Transactional
    public AssignmentResponse updateAssignment(UUID assignmentId, UpdateAssignmentRequest request, User currentUser) {
        Assignment assignment = assignmentRepository.findByIdWithInstructor(assignmentId);
        if (assignment == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Assignment not found");
        }

        if (!assignment.getInstructor().getId().equals(currentUser.getId()) && currentUser.getRole() != Role.ADMIN) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You can only update your own assignments");
        }

        assignment.setTitle(request.getTitle());
        assignment.setDescription(request.getDescription());
        assignment.setLanguage(request.getLanguage());
        assignment.setDueDate(request.getDueDate());
        assignment.setIsActive(request.getIsActive());

        Assignment updatedAssignment = assignmentRepository.save(assignment);
        return mapToAssignmentResponse(updatedAssignment, currentUser);
    }

    @Transactional
    public void deleteAssignment(UUID assignmentId, User currentUser) {
        Assignment assignment = assignmentRepository.findByIdWithInstructor(assignmentId);
        if (assignment == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Assignment not found");
        }

        if (!assignment.getInstructor().getId().equals(currentUser.getId()) && currentUser.getRole() != Role.ADMIN) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You can only delete your own assignments");
        }

        assignmentRepository.delete(assignment);
    }

    @Transactional
    public AssignmentSubmissionResponse submitAssignment(UUID assignmentId, CreateSubmissionRequest request,
            User student) {
        Assignment assignment = assignmentRepository.findByIdWithInstructor(assignmentId);
        if (assignment == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Assignment not found");
        }

        if (!assignment.getIsActive()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Assignment is not active");
        }

        if (assignment.getDueDate() != null && LocalDateTime.now().isAfter(assignment.getDueDate())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Assignment deadline has passed");
        }

        // Check if student has already submitted
        Optional<AssignmentSubmission> existingSubmission = submissionRepository.findByAssignmentAndStudent(assignment,
                student);
        if (existingSubmission.isPresent()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "You have already submitted this assignment");
        }

        AssignmentSubmission submission = new AssignmentSubmission();
        submission.setAssignment(assignment);
        submission.setStudent(student);
        submission.setCode(request.getCode());
        submission.setStatus(SubmissionStatus.PENDING_REVIEW);

        AssignmentSubmission savedSubmission = submissionRepository.save(submission);
        return mapToSubmissionResponse(savedSubmission);
    }

    @Transactional(readOnly = true)
    public Page<AssignmentSubmissionResponse> getSubmissionsForAssignment(UUID assignmentId, User instructor,
            Pageable pageable) {
        Assignment assignment = assignmentRepository.findByIdWithInstructor(assignmentId);
        if (assignment == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Assignment not found");
        }

        // Check if instructor has permission to view submissions
        if (!assignment.getInstructor().getId().equals(instructor.getId()) && instructor.getRole() != Role.ADMIN) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                    "You can only view submissions for your assignments");
        }

        Page<AssignmentSubmission> submissions = submissionRepository.findByAssignmentOrderByCreatedAtDesc(assignment,
                pageable);
        return submissions.map(this::mapToSubmissionResponse);
    }

    @Transactional(readOnly = true)
    public Page<AssignmentSubmissionResponse> getMySubmissions(User student, Pageable pageable) {
        Page<AssignmentSubmission> submissions = submissionRepository.findByStudentOrderByCreatedAtDesc(student,
                pageable);
        return submissions.map(this::mapToSubmissionResponse);
    }

    @Transactional(readOnly = true)
    public AssignmentSubmissionResponse getSubmissionById(UUID submissionId, User currentUser) {
        AssignmentSubmission submission = submissionRepository.findByIdWithDetails(submissionId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Submission not found"));

        // Check permissions: student can view their own, instructor can view
        boolean canView = submission.getStudent().getId().equals(currentUser.getId()) ||
                submission.getAssignment().getInstructor().getId().equals(currentUser.getId()) ||
                currentUser.getRole() == Role.ADMIN;

        if (!canView) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You cannot view this submission");
        }

        return mapToSubmissionResponse(submission);
    }

    @Transactional
    public AssignmentSubmissionResponse reviewSubmission(UUID submissionId, CreateReviewRequest request,
            User reviewer) {
        AssignmentSubmission submission = submissionRepository.findByIdWithDetails(submissionId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Submission not found"));

        // Check if reviewer has permission to review submissions
        if (!submission.getAssignment().getInstructor().getId().equals(reviewer.getId())
                && reviewer.getRole() != Role.ADMIN) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                    "You can only review submissions for your assignments");
        }

        // Check if already reviewed
        if (reviewRepository.existsByAssignmentSubmission(submission)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "This submission has already been reviewed");
        }

        SubmissionReview review = new SubmissionReview();
        review.setAssignmentSubmission(submission);
        review.setReviewer(reviewer);
        review.setComment(request.getComment());
        review.setScore(request.getScore());

        reviewRepository.save(review);

        submission.setStatus(SubmissionStatus.REVIEWED);
        submission.setGrade(request.getScore());
        submissionRepository.save(submission);

        return mapToSubmissionResponse(submission);
    }

    @Transactional(readOnly = true)
    public Page<AssignmentSubmissionResponse> getPendingReviews(User instructor, Pageable pageable) {
        if (instructor.getRole() != Role.INSTRUCTOR && instructor.getRole() != Role.ADMIN) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only instructors can view pending reviews");
        }

        Page<AssignmentSubmission> submissions = submissionRepository.findPendingReviewsByInstructorId(instructor.getId(), pageable);
        return submissions.map(this::mapToSubmissionResponse);
    }

    private AssignmentResponse mapToAssignmentResponse(Assignment assignment, User currentUser) {
        AssignmentResponse.UserInfo instructorInfo = new AssignmentResponse.UserInfo();
        instructorInfo.setId(assignment.getInstructor().getId());
        instructorInfo.setFirstName(assignment.getInstructor().getFirstName());
        instructorInfo.setLastName(assignment.getInstructor().getLastName());
        instructorInfo.setEmail(assignment.getInstructor().getEmail());

        Long submissionCount = assignmentRepository.countSubmissionsByAssignmentId(assignment.getId());
        Boolean hasSubmitted = currentUser != null
                ? assignmentRepository.hasUserSubmitted(assignment.getId(), currentUser.getId())
                : false;

        AssignmentSubmissionResponse mySubmission = null;
        if (currentUser != null && hasSubmitted) {
            Optional<AssignmentSubmission> submission = submissionRepository.findByAssignmentAndStudent(assignment,
                    currentUser);
            if (submission.isPresent()) {
                mySubmission = mapToSubmissionResponse(submission.get());
            }
        }

        AssignmentResponse response = new AssignmentResponse();
        response.setId(assignment.getId());
        response.setTitle(assignment.getTitle());
        response.setDescription(assignment.getDescription());
        response.setLanguage(assignment.getLanguage());
        response.setInstructor(instructorInfo);
        response.setDueDate(assignment.getDueDate());
        response.setIsActive(assignment.getIsActive());
        response.setCreatedAt(assignment.getCreatedAt());
        response.setUpdatedAt(assignment.getUpdatedAt());
        response.setSubmissionCount(submissionCount.intValue());
        response.setHasSubmitted(hasSubmitted);
        response.setMySubmission(mySubmission);

        return response;
    }

    private AssignmentSubmissionResponse mapToSubmissionResponse(AssignmentSubmission submission) {
        AssignmentSubmissionResponse.UserInfo studentInfo = new AssignmentSubmissionResponse.UserInfo();
        studentInfo.setId(submission.getStudent().getId());
        studentInfo.setFirstName(submission.getStudent().getFirstName());
        studentInfo.setLastName(submission.getStudent().getLastName());
        studentInfo.setEmail(submission.getStudent().getEmail());

        AssignmentSubmissionResponse.UserInfo instructorInfo = new AssignmentSubmissionResponse.UserInfo();
        instructorInfo.setId(submission.getAssignment().getInstructor().getId());
        instructorInfo.setFirstName(submission.getAssignment().getInstructor().getFirstName());
        instructorInfo.setLastName(submission.getAssignment().getInstructor().getLastName());
        instructorInfo.setEmail(submission.getAssignment().getInstructor().getEmail());

        AssignmentSubmissionResponse.AssignmentInfo assignmentInfo = new AssignmentSubmissionResponse.AssignmentInfo();
        assignmentInfo.setId(submission.getAssignment().getId());
        assignmentInfo.setTitle(submission.getAssignment().getTitle());
        assignmentInfo.setDescription(submission.getAssignment().getDescription());
        assignmentInfo.setLanguage(submission.getAssignment().getLanguage());
        assignmentInfo.setInstructor(instructorInfo);
        assignmentInfo.setDueDate(submission.getAssignment().getDueDate());
        assignmentInfo.setIsActive(submission.getAssignment().getIsActive());
        assignmentInfo.setCreatedAt(submission.getAssignment().getCreatedAt());
        assignmentInfo.setUpdatedAt(submission.getAssignment().getUpdatedAt());

        AssignmentSubmissionResponse.SubmissionReviewResponse reviewResponse = null;
        if (submission.getReview() != null) {
            SubmissionReview r = submission.getReview();
            AssignmentSubmissionResponse.UserInfo reviewerInfo = new AssignmentSubmissionResponse.UserInfo();
            reviewerInfo.setId(r.getReviewer().getId());
            reviewerInfo.setFirstName(r.getReviewer().getFirstName());
            reviewerInfo.setLastName(r.getReviewer().getLastName());
            reviewerInfo.setEmail(r.getReviewer().getEmail());

            reviewResponse = new AssignmentSubmissionResponse.SubmissionReviewResponse();
            reviewResponse.setId(r.getId());
            reviewResponse.setComment(r.getComment());
            reviewResponse.setScore(r.getScore());
            reviewResponse.setReviewer(reviewerInfo);
            reviewResponse.setCreatedAt(r.getCreatedAt());
            reviewResponse.setUpdatedAt(r.getUpdatedAt());
        }

        AssignmentSubmissionResponse response = new AssignmentSubmissionResponse();
        response.setId(submission.getId());
        response.setAssignment(assignmentInfo);
        response.setCode(submission.getCode());
        response.setStatus(submission.getStatus());
        response.setGrade(submission.getGrade());
        response.setStudent(studentInfo);
        response.setCreatedAt(submission.getCreatedAt());
        response.setUpdatedAt(submission.getUpdatedAt());
        response.setSubmittedAt(submission.getCreatedAt());
        response.setReview(reviewResponse);

        return response;
    }
}
