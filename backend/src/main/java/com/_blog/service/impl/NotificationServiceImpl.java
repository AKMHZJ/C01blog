package com._blog.service.impl;

import com._blog.entity.Follow;
import com._blog.entity.Notification;
import com._blog.entity.User;
import com._blog.repository.FollowRepository;
import com._blog.repository.NotificationRepository;
import com._blog.repository.UserRepository;
import com._blog.service.AuthService;
import com._blog.service.NotificationService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final FollowRepository followRepository;
    private final UserRepository userRepository;
    private final AuthService authService;

    public NotificationServiceImpl(NotificationRepository notificationRepository,
                                   FollowRepository followRepository,
                                   UserRepository userRepository,
                                   AuthService authService) {
        this.notificationRepository = notificationRepository;
        this.followRepository = followRepository;
        this.userRepository = userRepository;
        this.authService = authService;
    }

    @Override
    @Transactional
    public Notification createNotification(User recipient, User actor, String type, String message, String relatedId) {
        Notification notification = new Notification(recipient, actor, type, message, relatedId);
        return notificationRepository.save(notification);
    }

    @Override
    public List<Notification> getMyNotifications() {
        User currentUser = authService.getCurrentUser();
        return notificationRepository.findByRecipientOrderByCreatedAtDesc(currentUser);
    }

    @Override
    @Transactional
    public Notification markAsRead(Long notificationId) {
        User currentUser = authService.getCurrentUser();
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));

        if (!notification.getRecipient().getId().equals(currentUser.getId())) {
            throw new RuntimeException("Unauthorized");
        }

        notification.setRead(true);
        return notificationRepository.save(notification);
    }

    @Override
    @Transactional
    public void markAllAsRead() {
        User currentUser = authService.getCurrentUser();
        List<Notification> notifications = notificationRepository.findByRecipientOrderByCreatedAtDesc(currentUser);
        for (Notification n : notifications) {
            if (!n.isRead()) {
                n.setRead(true);
            }
        }
        notificationRepository.saveAll(notifications);
    }

    @Override
    @Transactional
    public void notifyFollowers(User author, String type, String message, String relatedId) {
        List<Follow> follows = followRepository.findByFolloweeId(author.getId());
        
        for (Follow follow : follows) {
            Long followerId = follow.getFollowerId();
            Optional<User> followerOpt = userRepository.findById(followerId);
            
            if (followerOpt.isPresent()) {
                User follower = followerOpt.get();
                // Don't notify self (edge case if someone could follow themselves)
                if (!follower.getId().equals(author.getId())) {
                    createNotification(follower, author, type, message, relatedId);
                }
            }
        }
    }
}
