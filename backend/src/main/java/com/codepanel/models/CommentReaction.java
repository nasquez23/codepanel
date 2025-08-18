package com.codepanel.models;

import com.codepanel.models.base.BaseEntity;
import com.codepanel.models.enums.ReactionType;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Table(name = "comment_reactions", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"comment_id", "user_id"})
})
@Entity
public class CommentReaction extends BaseEntity {
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "comment_id", nullable = false)
    private ProblemPostComment comment;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private ReactionType reactionType;
}
