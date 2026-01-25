package com._blog.controller;

import com._blog.entity.Post;
import com._blog.entity.Comment;
import com._blog.service.PostService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/posts")
@CrossOrigin(origins = "http://localhost:4200") 
public class PostController {

    private final PostService postService;

    public PostController(PostService postService) {
        this.postService = postService;
    }

    @GetMapping
    public List<Post> getAllPosts() {
        return postService.getAllPosts();
    }

    @GetMapping("/feed")
    public List<Post> getFeed(@AuthenticationPrincipal UserDetails userDetails) {
        return postService.getFeed(userDetails);
    }

    @GetMapping("/{id}")
    public Post getPost(@PathVariable String id) {
        return postService.getPost(id);
    }

    @GetMapping("/user/{userId}")
    public List<Post> getUserPosts(@PathVariable Long userId) {
        return postService.getUserPosts(userId);
    }

    @PostMapping
    public Post createPost(@RequestBody PostRequest request, @AuthenticationPrincipal UserDetails userDetails) {
        return postService.createPost(request, userDetails);
    }

    @PostMapping("/{id}/like")
    public Post toggleLike(@PathVariable String id, @AuthenticationPrincipal UserDetails userDetails) {
        return postService.toggleLike(id, userDetails);
    }

    @PostMapping("/{id}/comments")
    public Comment addComment(@PathVariable String id, @RequestBody CommentRequest request, @AuthenticationPrincipal UserDetails userDetails) {
        return postService.addComment(id, request, userDetails);
    }
    
    @DeleteMapping("/{id}")
    public void deletePost(@PathVariable String id, @AuthenticationPrincipal UserDetails userDetails) {
        postService.deletePost(id, userDetails);
    }

    @DeleteMapping("/{postId}/comments/{commentId}")
    public void deleteComment(@PathVariable String postId, @PathVariable String commentId,
                              @AuthenticationPrincipal UserDetails userDetails) {
        postService.deleteComment(postId, commentId, userDetails);
    }

    @PutMapping("/{postId}/comments/{commentId}")
    public Comment updateComment(@PathVariable String postId, @PathVariable String commentId,
                                @RequestBody CommentRequest request,
                                @AuthenticationPrincipal UserDetails userDetails) {
        return postService.updateComment(postId, commentId, request, userDetails);
    }

    @PutMapping("/{id}")
    public Post updatePost(@PathVariable String id, @RequestBody PostRequest request, @AuthenticationPrincipal UserDetails userDetails) {
        return postService.updatePost(id, request, userDetails);
    }

    public record PostRequest(String title, String excerpt, String category, String image, List<String> content) {}
    public record CommentRequest(String text) {}
}