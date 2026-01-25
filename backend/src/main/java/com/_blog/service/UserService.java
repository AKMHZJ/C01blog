package com._blog.service;

import org.springframework.security.core.userdetails.UserDetails;

import com._blog.entity.User;

import java.util.List;
import java.util.Map;

public interface UserService {
    Map<String, Object> toggleFollow(Long targetId, UserDetails userDetails);

    List<String> getMyFollowing(UserDetails userDetails);

    Map<String, Object> getCurrentUser(UserDetails userDetails);

    Map<String, Object> updateProfile(com._blog.controller.UserController.ProfileUpdateRequest request, UserDetails userDetails);

    List<Map<String, Object>> getAllUsers();
}
