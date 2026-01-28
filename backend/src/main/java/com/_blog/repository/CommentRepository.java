package com._blog.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com._blog.entity.Comment;
import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, String> {
    List<Comment> findByPostIdOrderByTimestampDesc(String postId);
    long countByAuthorId(Long authorId);
    void deleteByAuthorId(Long authorId);
}
