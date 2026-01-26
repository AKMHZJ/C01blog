package com._blog.service.impl;

import com._blog.controller.PostController;
import com._blog.entity.Comment;
import com._blog.entity.Follow;
import com._blog.entity.Post;
import com._blog.entity.User;
import com._blog.repository.CommentRepository;
import com._blog.repository.FollowRepository;
import com._blog.repository.PostRepository;
import com._blog.repository.UserRepository;
import com._blog.service.PostService;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class PostServiceImpl implements PostService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final FollowRepository followRepository;
    private final CommentRepository commentRepository;
    private final com._blog.service.NotificationService notificationService;

    public PostServiceImpl(PostRepository postRepository, UserRepository userRepository, 
                           FollowRepository followRepository, CommentRepository commentRepository,
                           com._blog.service.NotificationService notificationService) {
        this.postRepository = postRepository;
        this.userRepository = userRepository;
        this.followRepository = followRepository;
        this.commentRepository = commentRepository;
        this.notificationService = notificationService;
    }

    @Override
    public List<Post> getAllPosts() {
        return postRepository.findAllByOrderByDateDesc();
    }

    @Override
    public List<Post> getFeed(UserDetails userDetails) {
        if (userDetails == null) {
            return new ArrayList<>();
        }

        User currentUser = userRepository.findByUsername(userDetails.getUsername()).orElse(null);
        if (currentUser == null) {
            return new ArrayList<>();
        }

        List<Long> authorIds = new ArrayList<>();
        authorIds.add(currentUser.getId());

        try {
            List<Follow> followList = followRepository.findByFollowerId(currentUser.getId());
            if (followList != null) {
                for (Follow f : followList) {
                    authorIds.add(f.getFolloweeId());
                }
            }
        } catch (Exception ignored) {}

        return postRepository.findByAuthorIdIn(authorIds);
    }

    @Override
    public Post getPost(String id) {
        return postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found"));
    }

    @Override
    public List<Post> getUserPosts(Long userId) {
        return postRepository.findByAuthorId(userId);
    }

    @Override
    @Transactional
    public Post createPost(PostController.PostRequest request, UserDetails userDetails) {
        User author = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Post post = new Post();
        post.setTitle(request.title());
        post.setExcerpt(request.excerpt());
        post.setCategory(request.category());
        post.setImage(request.image());
        post.setDate(LocalDateTime.now());
        post.setContentList(request.content());

        Post savedPost = postRepository.save(post);
        
        notificationService.notifyFollowers(author, "NEW_POST", "posted a new story: " + savedPost.getTitle(), savedPost.getId());
        
        return savedPost;
    }

    @Override
    @Transactional
    public Post toggleLike(String id, UserDetails userDetails) {
        Post post = postRepository.findById(id).orElseThrow();
        User currentUser = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String currentUserId = String.valueOf(currentUser.getId());

        if (post.getLikes().contains(currentUserId)) {
            post.getLikes().remove(currentUserId);
        } else {
            post.getLikes().add(currentUserId);
        }

        return postRepository.save(post);
    }

    @Override
    @Transactional
    public Comment addComment(String id, PostController.CommentRequest request, UserDetails userDetails) {
        Post post = postRepository.findById(id).orElseThrow(() -> new RuntimeException("Post not found"));
        User author = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Comment comment = new Comment();
        comment.setText(request.text());
        comment.setTimestamp(LocalDateTime.now());
        comment.setAuthor(author);
        
        Comment savedComment = commentRepository.saveAndFlush(comment);
        
        post.getComments().add(savedComment);
        postRepository.save(post);
        
        return savedComment;
    }

    @Override
    @Transactional
    public void deletePost(String id, UserDetails userDetails) {
        Post post = postRepository.findById(id).orElseThrow(() -> new RuntimeException("Post not found"));
        User currentUser = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        boolean isAdmin = currentUser.getRole() != null && currentUser.getRole().name().equals("ADMIN");
        boolean isOwner = post.getAuthor() != null && post.getAuthor().getId().equals(currentUser.getId());

        if (!isAdmin && !isOwner) {
            throw new RuntimeException("Not authorized to delete this post");
        }

        postRepository.deleteById(id);
    }

    @Override
    @Transactional
    public void deleteComment(String postId, String commentId, UserDetails userDetails) {
        Post post = postRepository.findById(postId).orElseThrow(() -> new RuntimeException("Post not found"));
        User currentUser = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Comment target = post.getComments().stream()
                .filter(c -> c != null && commentId.equals(c.getId()))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Comment not found"));

        boolean isAdmin = currentUser.getRole() != null && currentUser.getRole().name().equals("ADMIN");
        boolean isPostOwner = post.getAuthor() != null && post.getAuthor().getId().equals(currentUser.getId());
        boolean isCommentOwner = target.getAuthor() != null && target.getAuthor().getId().equals(currentUser.getId());

        if (!isAdmin && !isPostOwner && !isCommentOwner) {
            throw new RuntimeException("Not authorized to delete this comment");
        }

        post.getComments().remove(target);
        postRepository.save(post);
    }

    @Override
    @Transactional
    public Comment updateComment(String postId, String commentId, PostController.CommentRequest request, UserDetails userDetails) {
        // Fetch post first to manage collection context
        Post post = postRepository.findById(postId).orElseThrow(() -> new RuntimeException("Post not found"));
        
        Comment comment = post.getComments().stream()
                .filter(c -> c != null && commentId.equals(c.getId()))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Comment not found"));

        User currentUser = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (comment.getAuthor() == null || !comment.getAuthor().getId().equals(currentUser.getId())) {
            throw new RuntimeException("Not authorized to update this comment");
        }

        comment.setText(request.text());
        // Save the post - this cascades to comments and handles orphaned management properly
        postRepository.save(post);
        return comment;
    }

    @Override
    @Transactional
    public Post updatePost(String id, PostController.PostRequest request, UserDetails userDetails) {
        Post post = postRepository.findById(id).orElseThrow(() -> new RuntimeException("Post not found"));
        User currentUser = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        boolean isAdmin = currentUser.getRole() != null && currentUser.getRole().name().equals("ADMIN");
        boolean isOwner = post.getAuthor() != null && post.getAuthor().getId().equals(currentUser.getId());
        if (!isAdmin && !isOwner) throw new RuntimeException("Not authorized to edit this post");

        post.setTitle(request.title());
        post.setExcerpt(request.excerpt());
        post.setCategory(request.category());
        post.setImage(request.image());
        post.setContentList(request.content());

        return postRepository.save(post);
    }
}