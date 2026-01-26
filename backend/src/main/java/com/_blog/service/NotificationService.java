package com._blog.service;

import com._blog.entity.Notification;
import com._blog.entity.User;
import java.util.List;

public interface NotificationService {
    Notification createNotification(User recipient, User actor, String type, String message, String relatedId);
    List<Notification> getMyNotifications();
    Notification markAsRead(Long notificationId);
    void markAllAsRead();
    void notifyFollowers(User author, String type, String message, String relatedId);
}
