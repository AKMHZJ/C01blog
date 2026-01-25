package com._blog.entity;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "posts")
public class Post {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    private String title;
    
    @Column(length = 1000)
    private String excerpt;
    
    @Column(columnDefinition = "TEXT")
    @JsonIgnore
    private String content;
    
    private String category;
    private String image;
    private LocalDateTime date;

    @ManyToOne
    @JoinColumn(name = "author_id")
    private User author;

    @ElementCollection
    private List<String> likes = new ArrayList<>();

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "post_id")
    private List<Comment> comments = new ArrayList<>();

    public Post() {}

    public Post(String id, String title, String excerpt, String content, String category, String image, LocalDateTime date, User author, List<String> likes, List<Comment> comments) {
        this.id = id;
        this.title = title;
        this.excerpt = excerpt;
        this.content = content;
        this.category = category;
        this.image = image;
        this.date = date;
        this.author = author;
        this.likes = likes != null ? likes : new ArrayList<>();
        this.comments = comments != null ? comments : new ArrayList<>();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getExcerpt() { return excerpt; }
    public void setExcerpt(String excerpt) { this.excerpt = excerpt; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }

    public LocalDateTime getDate() { return date; }
    public void setDate(LocalDateTime date) { this.date = date; }

    public User getAuthor() { return author; }
    public void setAuthor(User author) { this.author = author; }

    public List<String> getLikes() { return likes; }
    public void setLikes(List<String> likes) { this.likes = likes; }

    public List<Comment> getComments() { return comments; }
    public void setComments(List<Comment> comments) { this.comments = comments; }

    @JsonProperty("content")
    public List<String> getContentList() { 
        return content != null ? List.of(content.split("\n\n")) : new ArrayList<>(); 
    } 

    public void setContentList(List<String> paragraphs) {
        this.content = String.join("\n\n", paragraphs);
    }
}