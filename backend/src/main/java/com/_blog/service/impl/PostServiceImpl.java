package com._blog.service.impl;

import com._blog.controller.PostController;
import com._blog.dto.PostRequest;
import com._blog.dto.CommentRequest;
import com._blog.entity.Comment;
import com._blog.entity.Follow;
import com._blog.entity.Post;
import com._blog.entity.User;
import com._blog.exception.BannedUserException;
import com._blog.exception.ForbiddenException;
import com._blog.exception.ResourceNotFoundException;
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

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;

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

    private User getUser(UserDetails userDetails) {
        User user = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        if (user.isBanned()) {
            throw new BannedUserException("Your account has been banned.");
        }
        return user;
    }

    @Override
    public org.springframework.data.domain.Page<Post> getAllPosts(int page, int size) {
        return postRepository.findAllByHiddenFalseOrderByDateDesc(PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "date")));
    }

    @Override
    public org.springframework.data.domain.Page<Post> getFeed(UserDetails userDetails, int page, int size) {
        if (userDetails == null) {
            return org.springframework.data.domain.Page.empty();
        }

        User currentUser = userRepository.findByUsername(userDetails.getUsername()).orElse(null);
        if (currentUser == null || currentUser.isBanned()) {
            return org.springframework.data.domain.Page.empty();
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

        return postRepository.findByAuthorIdInAndHiddenFalse(authorIds, PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "date")));
    }

    @Override
    public Post getPost(String id) {
        return postRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found"));
    }

    @Override
    public List<Post> getUserPosts(Long userId) {
        return postRepository.findByAuthorIdOrderByDateDesc(userId);
    }

    @Override
    @Transactional
    public Post createPost(PostRequest request, UserDetails userDetails) {
        User author = getUser(userDetails);

        Post post = new Post();
        post.setTitle(request.title());
        post.setExcerpt(request.excerpt());
        post.setCategory(request.category());
        post.setImage(request.image());
        post.setMediaUrls(request.mediaUrls() != null ? request.mediaUrls() : new ArrayList<>());
        post.setDate(LocalDateTime.now());
        post.setAuthor(author);
        post.setContentList(request.content());

        Post savedPost = postRepository.save(post);
        
        notificationService.notifyFollowers(author, "NEW_POST", "posted a new story: " + savedPost.getTitle(), savedPost.getId());
        
        return savedPost;
    }

    @Override
    @Transactional
    public Post toggleLike(String id, UserDetails userDetails) {
        Post post = postRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Post not found"));
        User currentUser = getUser(userDetails);

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
    public Comment addComment(String id, CommentRequest request, UserDetails userDetails) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found"));
        User author = getUser(userDetails);

        Comment comment = new Comment();
        comment.setText(request.text());
        comment.setTimestamp(LocalDateTime.now());
        comment.setAuthor(author);
        comment.setPost(post);
        
        return commentRepository.save(comment);
    }

    @Override
    @Transactional
    public void deletePost(String id, UserDetails userDetails) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found"));
        User currentUser = getUser(userDetails);

        boolean isAdmin = currentUser.getRole() != null && currentUser.getRole().name().equals("ADMIN");
        boolean isOwner = post.getAuthor() != null && post.getAuthor().getId().equals(currentUser.getId());

        if (!isAdmin && !isOwner) {
            throw new ForbiddenException("Not authorized to delete this post");
        }

        postRepository.deleteById(id);
    }

    @Override
    @Transactional
    public void deleteComment(String postId, String commentId, UserDetails userDetails) {
        Comment target = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found"));
        
        // Ensure comment belongs to the post
        if (target.getPost() == null || !target.getPost().getId().equals(postId)) {
             throw new ResourceNotFoundException("Comment not found on this post");
        }

        User currentUser = getUser(userDetails);
        Post post = target.getPost();

        boolean isAdmin = currentUser.getRole() != null && currentUser.getRole().name().equals("ADMIN");
        boolean isPostOwner = post.getAuthor() != null && post.getAuthor().getId().equals(currentUser.getId());
        boolean isCommentOwner = target.getAuthor() != null && target.getAuthor().getId().equals(currentUser.getId());

        if (!isAdmin && !isPostOwner && !isCommentOwner) {
            throw new ForbiddenException("Not authorized to delete this comment");
        }

        commentRepository.delete(target);
    }

    @Override
    @Transactional
    public Comment updateComment(String postId, String commentId, CommentRequest request, UserDetails userDetails) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found"));

        if (comment.getPost() == null || !comment.getPost().getId().equals(postId)) {
             throw new ResourceNotFoundException("Comment not found on this post");
        }

        User currentUser = getUser(userDetails);

        if (comment.getAuthor() == null || !comment.getAuthor().getId().equals(currentUser.getId())) {
            throw new ForbiddenException("Not authorized to update this comment");
        }

        comment.setText(request.text());
        return commentRepository.save(comment);
    }

    @Override
    @Transactional
    public Post updatePost(String id, PostRequest request, UserDetails userDetails) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found"));
        User currentUser = getUser(userDetails);

        boolean isAdmin = currentUser.getRole() != null && currentUser.getRole().name().equals("ADMIN");
        boolean isOwner = post.getAuthor() != null && post.getAuthor().getId().equals(currentUser.getId());
        if (!isAdmin && !isOwner) throw new ForbiddenException("Not authorized to edit this post");

        post.setTitle(request.title());
        post.setExcerpt(request.excerpt());
        post.setCategory(request.category());
        post.setImage(request.image());
        if (request.mediaUrls() != null) {
            post.setMediaUrls(request.mediaUrls());
        }
        post.setContentList(request.content());

        return postRepository.save(post);
    }

    @Override
    @Transactional
    public Post toggleHide(String id, UserDetails userDetails) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found"));
        User currentUser = getUser(userDetails);

        if (!currentUser.getRole().name().equals("ADMIN")) {
            throw new ForbiddenException("Not authorized to hide/unhide posts");
        }

        post.setHidden(!post.isHidden());
        return postRepository.save(post);
    }
}