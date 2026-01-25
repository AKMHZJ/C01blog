package com._blog.service;

import com._blog.entity.Post;
import com._blog.entity.Comment;
import org.springframework.security.core.userdetails.UserDetails;
import java.util.List;

public interface PostService {
    List<Post> getAllPosts();
    List<Post> getFeed(UserDetails userDetails);
    Post getPost(String id);
    List<Post> getUserPosts(Long userId);
    Post createPost(com._blog.controller.PostController.PostRequest request, UserDetails userDetails);
    Post toggleLike(String id, UserDetails userDetails);
    Comment addComment(String id, com._blog.controller.PostController.CommentRequest request, UserDetails userDetails);
    void deletePost(String id, UserDetails userDetails);
        void deleteComment(String postId, String commentId, UserDetails userDetails);
    
        Comment updateComment(String postId, String commentId, com._blog.controller.PostController.CommentRequest request, UserDetails userDetails);
    
        Post updatePost(String id, com._blog.controller.PostController.PostRequest request, UserDetails userDetails);
}
