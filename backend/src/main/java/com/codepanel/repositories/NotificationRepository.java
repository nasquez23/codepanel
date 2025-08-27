package com.codepanel.repositories;

import com.codepanel.models.Notification;
import com.codepanel.models.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, UUID> {

    @Query("SELECT n FROM Notification n WHERE n.recipient = :recipient ORDER BY n.createdAt DESC")
    Page<Notification> findByRecipientOrderByCreatedAtDesc(@Param("recipient") User recipient, Pageable pageable);

    @Query("SELECT COUNT(n) FROM Notification n WHERE n.recipient = :recipient AND n.isRead = false")
    Long countUnreadByRecipient(@Param("recipient") User recipient);

    @Query("SELECT n FROM Notification n WHERE n.recipient = :recipient AND n.isRead = false ORDER BY n.createdAt DESC")
    Page<Notification> findUnreadByRecipientOrderByCreatedAtDesc(@Param("recipient") User recipient, Pageable pageable);

    @Modifying
    @Query("UPDATE Notification n SET n.isRead = true, n.readAt = CURRENT_TIMESTAMP WHERE n.recipient = :recipient AND n.isRead = false")
    int markAllAsReadByRecipient(@Param("recipient") User recipient);

    @Modifying
    @Query("UPDATE Notification n SET n.isRead = true, n.readAt = CURRENT_TIMESTAMP WHERE n.id = :id AND n.recipient = :recipient")
    int markAsReadById(@Param("id") UUID id, @Param("recipient") User recipient);
}
