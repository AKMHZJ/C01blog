package com._blog.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com._blog.entity.Comment;

public interface CommentRepository extends JpaRepository<Comment, String> {
    long countByAuthorId(Long authorId);
    void deleteByAuthorId(Long authorId);
}
