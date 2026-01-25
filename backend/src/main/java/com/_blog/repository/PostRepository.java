package com._blog.repository;

import com._blog.entity.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PostRepository extends JpaRepository<Post, String> {
    // Custom query to find posts by a specific user (for "My Blog" page)
    List<Post> findByAuthorId(Long userId);
    
    // Find posts authored by any of the given author ids
    List<Post> findByAuthorIdIn(List<Long> userIds);

    long countByAuthorId(Long userId);

    void deleteByAuthorId(Long userId);
    
    // Helper to sort by newest first
    List<Post> findAllByOrderByDateDesc();
}