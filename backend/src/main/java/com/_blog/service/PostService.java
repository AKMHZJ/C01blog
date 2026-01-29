package com._blog.service;

import com._blog.controller.PostController;
import com._blog.dto.PostRequest;
import com._blog.dto.CommentRequest;
import com._blog.entity.Comment;
import com._blog.entity.Post;
import org.springframework.data.domain.Page;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.List;

public interface PostService {
    Page<Post> getAllPosts(int page, int size);
    Page<Post> getFeed(UserDetails userDetails, int page, int size);
    Post getPost(String id, UserDetails userDetails);
    List<Post> getUserPosts(Long userId, UserDetails userDetails);
    
    Post createPost(PostRequest request, UserDetails userDetails);
    
    Post toggleLike(String id, UserDetails userDetails);
    
    Comment addComment(String id, CommentRequest request, UserDetails userDetails);
    
    void deletePost(String id, UserDetails userDetails);
    
    void deleteComment(String postId, String commentId, UserDetails userDetails);
    
    Comment updateComment(String postId, String commentId, CommentRequest request, UserDetails userDetails);
    
    Post updatePost(String id, PostRequest request, UserDetails userDetails);
    
    Post toggleHide(String id, UserDetails userDetails);
}
