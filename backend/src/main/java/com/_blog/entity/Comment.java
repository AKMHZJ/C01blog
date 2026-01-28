package com._blog.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "comments")
public class Comment {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(columnDefinition = "TEXT")
    private String text;
    private LocalDateTime timestamp;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User author;

    @ManyToOne
    @JoinColumn(name = "post_id")
    @com.fasterxml.jackson.annotation.JsonIgnore // Prevent infinite recursion
    private Post post;

    public Comment() {}

    public Comment(String id, String text, LocalDateTime timestamp, User author) {
        this.id = id;
        this.text = text;
        this.timestamp = timestamp;
        this.author = author;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getText() { return text; }
    public void setText(String text) { this.text = text; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }

    public User getAuthor() { return author; }
    public void setAuthor(User author) { this.author = author; }

    public Post getPost() { return post; }
    public void setPost(Post post) { this.post = post; }
}