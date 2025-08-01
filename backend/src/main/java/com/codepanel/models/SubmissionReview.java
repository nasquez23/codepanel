package com.codepanel.models;

import com.codepanel.models.base.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "submission_reviews")
public class SubmissionReview extends BaseEntity {
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assignment_submission_id", nullable = false)
    private AssignmentSubmission assignmentSubmission;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reviewer_id", nullable = false)
    private User reviewer;

    private String comment;

    private Integer score;
}
