package com._blog.repository;

import com._blog.entity.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PostRepository extends JpaRepository<Post, String> {
    // Custom query to find posts by a specific user (for "My Blog" page)
    List<Post> findByAuthorIdOrderByDateDesc(Long userId);

    List<Post> findByAuthorIdAndHiddenFalseOrderByDateDesc(Long userId);
    
    // Find posts authored by any of the given author ids
    Page<Post> findByAuthorIdIn(List<Long> userIds, Pageable pageable);
    
    Page<Post> findByAuthorIdInAndHiddenFalse(List<Long> userIds, Pageable pageable);

    long countByAuthorId(Long userId);

    void deleteByAuthorId(Long userId);
    
    // Helper to sort by newest first
    Page<Post> findAllByOrderByDateDesc(Pageable pageable);
    
    Page<Post> findAllByHiddenFalseOrderByDateDesc(Pageable pageable);
    
    List<Post> findAllByOrderByDateDesc();
}