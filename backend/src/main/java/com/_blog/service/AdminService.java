package com._blog.service;

import java.util.List;
import java.util.Map;

import com._blog.entity.Role;
import com._blog.entity.User;

public interface AdminService {

    Map<String, Object> overview();

    List<Map<String, Object>> listUsers();

    User updateRole(Long userId, Role role);

    void deleteUser(Long userId);

    User banUser(Long userId, boolean banned);

    List<Map<String, Object>> listPosts();

    void deletePost(String postId);
}