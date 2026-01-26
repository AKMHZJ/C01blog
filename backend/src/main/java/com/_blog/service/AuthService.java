package com._blog.service;

import java.util.Map;

import com._blog.entity.User;

public interface AuthService {

    User registerUser(User user) throws Exception;

    Map<String, Object> login(String identifier, String rawPassword) throws Exception;

    User getCurrentUser();
}
