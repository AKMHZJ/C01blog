package com._blog.service.impl;

import com._blog.controller.UserController;
import com._blog.entity.Follow;
import com._blog.entity.User;
import com._blog.repository.FollowRepository;
import com._blog.repository.PostRepository;
import com._blog.repository.UserRepository;
import com._blog.service.UserService;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PostRepository postRepository;
    private final FollowRepository followRepository;

    public UserServiceImpl(UserRepository userRepository, PostRepository postRepository,
            FollowRepository followRepository) {
        this.userRepository = userRepository;
        this.postRepository = postRepository;
        this.followRepository = followRepository;
    }

    @Override
    @Transactional
    public Map<String, Object> toggleFollow(Long targetId, UserDetails userDetails) {
        Map<String, Object> resp = new HashMap<>();
        if (userDetails == null) {
            resp.put("error", "Not authenticated");
            return resp;
        }

        User current = userRepository.findByUsername(userDetails.getUsername()).orElse(null);
        if (current == null) {
            resp.put("error", "User not found");
            return resp;
        }

        if (current.getId().equals(targetId)) {
            resp.put("error", "Cannot follow yourself");
            return resp;
        }

        var existing = followRepository.findByFollowerIdAndFolloweeId(current.getId(), targetId);
        boolean following;
        if (existing.isPresent()) {
            followRepository.delete(existing.get());
            following = false;
        } else {
            var f = new Follow(current.getId(), targetId);
            followRepository.save(f);
            following = true;
        }

        resp.put("following", following);
        resp.put("targetId", String.valueOf(targetId));
        return resp;
    }

    @Override
    public Map<String, Object> getCurrentUser(UserDetails userDetails) {
        if (userDetails == null) return null;
        User user = this.userRepository.findByUsername(userDetails.getUsername()).orElse(null);
        if (user == null) return null;
        return mapUserToResponse(user);
    }

    @Override
    @Transactional
    public Map<String, Object> updateProfile(UserController.ProfileUpdateRequest request, UserDetails userDetails) {
        if (userDetails == null) {
            throw new RuntimeException("User not authenticated");
        }
        User user = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (request.displayName() != null) user.setDisplayName(request.displayName());
        if (request.bio() != null) user.setBio(request.bio());
        if (request.avatar() != null) user.setAvatar(request.avatar());

        User saved = userRepository.save(user);
        return mapUserToResponse(saved);
    }

    @Override
    public List<String> getMyFollowing(UserDetails userDetails) {
        if (userDetails == null)
            return List.of();
        User current = userRepository.findByUsername(userDetails.getUsername()).orElse(null);
        if (current == null)
            return List.of();
        List<Follow> list = followRepository.findByFollowerId(current.getId());
        List<String> ids = new ArrayList<>();
        for (Follow f : list)
            ids.add(String.valueOf(f.getFolloweeId()));
        return ids;
    }

    @Override
    public List<Map<String, Object>> getAllUsers() {
        List<User> users = userRepository.findAll();
        List<Map<String, Object>> result = new ArrayList<>();

        for (User u : users) {
            result.add(mapUserToResponse(u));
        }

        return result;
    }

    private Map<String, Object> mapUserToResponse(User u) {
        Map<String, Object> entry = new HashMap<>();
        entry.put("id", String.valueOf(u.getId()));
        entry.put("username", u.getUsername());
        entry.put("name", u.getDisplayName() != null ? u.getDisplayName() : u.getUsername());
        entry.put("displayName", u.getDisplayName());
        entry.put("email", u.getEmail());
        entry.put("bio", u.getBio());
        entry.put("avatar", u.getAvatar());
        entry.put("role", u.getRole() != null ? u.getRole().name() : "USER");
        entry.put("postCount", postRepository.countByAuthorId(u.getId()));
        entry.put("followersCount", followRepository.findByFolloweeId(u.getId()).size());
        entry.put("followingCount", followRepository.findByFollowerId(u.getId()).size());
        return entry;
    }
}
