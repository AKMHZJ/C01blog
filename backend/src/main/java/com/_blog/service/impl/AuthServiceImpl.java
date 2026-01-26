package com._blog.service.impl;

import com._blog.service.AuthService;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import com._blog.entity.Role;
import com._blog.entity.User;
import com._blog.repository.UserRepository;
import com._blog.utils.JwtTokenProvider;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder encoder;
    private final JwtTokenProvider tokenProvider;

    public AuthServiceImpl(UserRepository userRepository, BCryptPasswordEncoder encoder, JwtTokenProvider tokenProvider) {
        this.userRepository = userRepository;
        this.encoder = encoder;
        this.tokenProvider = tokenProvider;
    }

    @Override
    public User getCurrentUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String username;
        if (principal instanceof UserDetails) {
            username = ((UserDetails) principal).getUsername();
        } else {
            username = principal.toString();
        }
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Current user not found"));
    }

    @Override
    public User registerUser(User user) throws Exception {
        if (user == null) throw new Exception("Invalid signup request");
        if (user.getUsername() == null || user.getUsername().trim().isEmpty()) throw new Exception("Username is required");
        if (user.getEmail() == null || user.getEmail().trim().isEmpty()) throw new Exception("Email is required");
        if (user.getPassword() == null || user.getPassword().trim().isEmpty()) throw new Exception("Password is required");

        if (userRepository.existsByUsername(user.getUsername())) {
            throw new Exception("Username is already taken!");
        }
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new Exception("Email is already in use!");
        }

        user.setRole(Role.USER);
        if (user.getBio() == null) user.setBio("");
        if (user.getAvatar() == null) user.setAvatar("");
        if (user.getDisplayName() == null || user.getDisplayName().trim().isEmpty()) {
            user.setDisplayName(user.getUsername());
        }

        user.setPassword(encoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    @Override
    public Map<String, Object> login(String identifier, String rawPassword) throws Exception {
        if (identifier == null || identifier.trim().isEmpty()) throw new Exception("Username/email is required");
        if (rawPassword == null || rawPassword.trim().isEmpty()) throw new Exception("Password is required");

        Optional<User> userOpt = userRepository.findByUsername(identifier);
        if (userOpt.isEmpty()) {
            userOpt = userRepository.findByEmail(identifier);
        }
        User user = userOpt.orElseThrow(() -> new Exception("Invalid credentials"));

        if (user.isBanned()) {
            throw new Exception("Your account has been banned");
        }

        boolean match = encoder.matches(rawPassword, user.getPassword());
        if (!match) {
            throw new Exception("Invalid credentials");
        }

        String token = tokenProvider.generateToken(user);

        Map<String, Object> resp = new HashMap<>();
        resp.put("token", token);
        resp.put("id", String.valueOf(user.getId()));
        resp.put("username", user.getUsername());
        resp.put("email", user.getEmail());
        resp.put("displayName", user.getDisplayName());
        resp.put("bio", user.getBio());
        resp.put("avatar", user.getAvatar());
        resp.put("role", user.getRole() != null ? user.getRole().name() : "USER");
        return resp;
    }
}