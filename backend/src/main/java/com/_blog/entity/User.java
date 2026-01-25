package com._blog.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(nullable = false)
    private String password;

    private String displayName;
    
    @Column(columnDefinition = "TEXT")
    private String bio = "";
    
    private String avatar = "";

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role = Role.USER;

    public User() {}

    public User(Long id, String email, String username, String password, String displayName, String bio, String avatar, Role role) {
        this.id = id;
        this.email = email;
        this.username = username;
        this.password = password;
        this.displayName = displayName;
        this.bio = bio != null ? bio : "";
        this.avatar = avatar != null ? avatar : "";
        this.role = role != null ? role : Role.USER;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getDisplayName() { return displayName; }
    public void setDisplayName(String displayName) { this.displayName = displayName; }

    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }

    public String getAvatar() { return avatar; }
    public void setAvatar(String avatar) { this.avatar = avatar; }

    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }
}