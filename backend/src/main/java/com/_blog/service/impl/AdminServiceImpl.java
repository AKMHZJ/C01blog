package com._blog.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com._blog.entity.Post;
import com._blog.entity.Role;
import com._blog.entity.User;
import com._blog.repository.CommentRepository;
import com._blog.repository.FollowRepository;
import com._blog.repository.PostRepository;
import com._blog.repository.UserRepository;

import com._blog.service.AdminService;

import com._blog.repository.ReportRepository;



@Service

public class AdminServiceImpl implements AdminService {



    private final UserRepository userRepository;

    private final PostRepository postRepository;

    private final CommentRepository commentRepository;

    private final FollowRepository followRepository;

    private final ReportRepository reportRepository;



    public AdminServiceImpl(UserRepository userRepository, PostRepository postRepository, 

                           CommentRepository commentRepository, FollowRepository followRepository,

                           ReportRepository reportRepository) {

        this.userRepository = userRepository;

        this.postRepository = postRepository;

        this.commentRepository = commentRepository;

        this.followRepository = followRepository;

        this.reportRepository = reportRepository;

    }



    @Override

    public Map<String, Object> overview() {

        Map<String, Object> out = new HashMap<>();

        out.put("users", userRepository.count());

        out.put("admins", userRepository.countByRole(Role.ADMIN));

        out.put("posts", postRepository.count());

        out.put("comments", commentRepository.count());

        out.put("follows", followRepository.count());

        return out;

    }



    @Override

    public List<Map<String, Object>> listUsers() {

        List<User> users = userRepository.findAll();

        List<Map<String, Object>> result = new ArrayList<>();



        for (User u : users) {

            Map<String, Object> entry = new HashMap<>();

            entry.put("id", String.valueOf(u.getId()));

            entry.put("username", u.getUsername());

            entry.put("email", u.getEmail());

            entry.put("displayName", u.getDisplayName() != null ? u.getDisplayName() : u.getUsername());

            entry.put("bio", u.getBio());

            entry.put("avatar", u.getAvatar());

            entry.put("role", u.getRole() != null ? u.getRole().name() : "USER");

            entry.put("banned", u.isBanned());



            entry.put("postCount", postRepository.countByAuthorId(u.getId()));

            entry.put("followers", followRepository.findByFolloweeId(u.getId()).size());

            entry.put("following", followRepository.findByFollowerId(u.getId()).size());



            result.add(entry);

        }

        return result;

    }



    @Override

    @Transactional

    public User updateRole(Long userId, Role role) {

        User u = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));

        u.setRole(role);

        return userRepository.save(u);

    }



    @Override

    @Transactional

    public void deleteUser(Long userId) {

        // Also need to handle reports if user is deleted?

        // Ideally yes, but let's stick to the immediate fix for deletePost first. 

        // For user deletion, existing code deletes posts, which will now trigger report deletion if we fix deletePost?

        // No, deleteByAuthorId in Repo won't use this service method.

        // We might need to fix deleteUser too later, but let's focus on deletePost first.

        

        // Actually, if we delete a user, we delete their posts. If we delete posts via repo.deleteByAuthorId, 

        // it might bypass service logic.

        // But let's fix deletePost specifically as requested.

        

        postRepository.deleteByAuthorId(userId);

        commentRepository.deleteByAuthorId(userId);

        followRepository.deleteByFollowerId(userId);

        followRepository.deleteByFolloweeId(userId);

        userRepository.deleteById(userId);

    }



    @Override

    @Transactional

    public User banUser(Long userId, boolean banned) {

        User u = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));

        u.setBanned(banned);

        return userRepository.save(u);

    }



    @Override

    public List<Map<String, Object>> listPosts() {

        List<Post> posts = postRepository.findAllByOrderByDateDesc();

        List<Map<String, Object>> result = new ArrayList<>();

        for (Post p : posts) {

            Map<String, Object> entry = new HashMap<>();

            entry.put("id", p.getId());

            entry.put("title", p.getTitle());

            entry.put("author", p.getAuthor() != null ? p.getAuthor().getUsername() : "Unknown");

            entry.put("date", p.getDate());

            entry.put("category", p.getCategory());

            result.add(entry);

        }

        return result;

    }



    @Override

    @Transactional

    public void deletePost(String postId) {

        // Delete reports associated with this post first

        reportRepository.deleteByReportedPostId(postId);

        postRepository.deleteById(postId);

    }

}
