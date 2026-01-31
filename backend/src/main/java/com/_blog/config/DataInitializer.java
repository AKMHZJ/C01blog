package com._blog.config;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.Random;
import java.sql.Timestamp;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import com._blog.entity.Comment;
import com._blog.entity.Follow;
import com._blog.entity.Post;
import com._blog.entity.Role;
import com._blog.entity.User;
import com._blog.repository.CommentRepository;
import com._blog.repository.FollowRepository;
import com._blog.repository.PostRepository;
import com._blog.repository.UserRepository;

@Configuration
public class DataInitializer {

    private final UserRepository userRepository;
    private final PostRepository postRepository;
    private final CommentRepository commentRepository;
    private final FollowRepository followRepository;
    private final BCryptPasswordEncoder encoder;

    public DataInitializer(UserRepository userRepository, PostRepository postRepository, 
                           CommentRepository commentRepository, FollowRepository followRepository,
                           BCryptPasswordEncoder encoder) {
        this.userRepository = userRepository;
        this.postRepository = postRepository;
        this.commentRepository = commentRepository;
        this.followRepository = followRepository;
        this.encoder = encoder;
    }

    @Bean
    public CommandLineRunner seedData() {
        return args -> {
            // 1. Ensure Admin exists (Standard logic)
            seedDefaultAdmin();

            // 2. Seed Test Users & Content
            seedTestEnvironment();
        };
    }

    private void seedDefaultAdmin() {
        final String username = "admin";
        if (userRepository.existsByUsername(username)) return;

        User admin = new User();
        admin.setEmail("admin@gmail.com");
        admin.setUsername(username);
        admin.setDisplayName("System Admin");
        admin.setRole(Role.ADMIN);
        admin.setPassword(encoder.encode("admin123"));
        userRepository.save(admin);
    }

    private void seedTestEnvironment() {
        // Check if our specific test users exist to avoid duplicates
        if (userRepository.existsByUsername("blacky")) {
            System.out.println("Test environment already seeded.");
            return;
        }

        System.out.println("Seeding test users, posts, and interactions...");
        String commonPassword = encoder.encode("123456");
        List<User> testUsers = new ArrayList<>();

        // --- Create Users ---
        // 1. Blacky Chen
        User u1 = createUser("blacky", "blacky@test.com", "Blacky Chen", "Full-stack enthusiast.", commonPassword);
        testUsers.add(u1);

        // 2. Nigroo Thompson
        User u2 = createUser("nigroo", "nigroo@test.com", "Nigroo Thompson", "Design systems & UI architecture.", commonPassword);
        testUsers.add(u2);

        // 3. Sarah Jenkins
        User u3 = createUser("sarah", "sarah@test.com", "Sarah Jenkins", "Writing about tech life.", commonPassword);
        testUsers.add(u3);

        // 4. Mike Ross
        User u4 = createUser("mike", "mike@test.com", "Mike Ross", "Java & Spring Boot expert.", commonPassword);
        testUsers.add(u4);

        // --- Create Posts ---
        List<Post> allPosts = new ArrayList<>();

        allPosts.add(createPost(u1, "The State of Angular 2024", "Signals have changed the game forever.", "Technology", 
            "Angular's new reactivity model using Signals is a paradigm shift. It simplifies change detection, improves performance, and makes the code easier to reason about."));

        allPosts.add(createPost(u2, "Designing for Accessibility", "Why contrast ratios matter more than you think.", "Design", 
            "Accessibility isn't an afterthought; it's a requirement. We need to ensure our digital products are usable by everyone, regardless of their abilities."));

        allPosts.add(createPost(u3, "My Morning Routine", "How I stay productive as a remote developer.", "Lifestyle", 
            "Coffee first, always. Then 30 minutes of code reviews before the Slack notifications start pouring in. Routine is the bedrock of consistency."));

        allPosts.add(createPost(u4, "Spring Boot 3.2 Features", "Virtual Threads and Native Images explained.", "Tech", 
            "Project Loom is finally production ready. Virtual threads allow us to handle millions of concurrent connections with standard blocking I/O styles."));

        allPosts.add(createPost(u1, "Why I switched to Linux", "The developer experience is unmatched.", "Technology", 
            "After years on MacOS, I made the jump. The customization, the package management, and the raw power of the terminal have won me over."));

        // --- Generate Interactions (Comments & Likes) ---
        Random rand = new Random();

        for (Post p : allPosts) {
            // Add random likes from other users
            for (User u : testUsers) {
                if (!u.getId().equals(p.getAuthor().getId()) && rand.nextBoolean()) {
                    p.getLikes().add(String.valueOf(u.getId()));
                }
            }
            postRepository.save(p); // Save likes

            // Add comments
            for (User u : testUsers) {
                // 40% chance to comment if not the author
                if (!u.getId().equals(p.getAuthor().getId()) && rand.nextDouble() < 0.4) {
                    Comment c = new Comment();
                    c.setAuthor(u);
                    c.setPost(p);
                    c.setTimestamp(LocalDateTime.now().minusMinutes(rand.nextInt(1000)));
                    c.setText(getRandomComment());
                    commentRepository.save(c);
                }
            }
        }

        // --- Generate Follows (So feeds are populated) ---
        for (User follower : testUsers) {
            for (User followee : testUsers) {
                if (!follower.equals(followee)) {
                    // Everyone follows almost everyone else to ensure a lively feed
                    if (rand.nextDouble() > 0.2) { 
                        Follow f = new Follow();
                        f.setFollowerId(follower.getId());
                        f.setFolloweeId(followee.getId());
                        // f.setTimestamp(LocalDateTime.now()); // Follow entity doesn't have timestamp
                        followRepository.save(f);
                    }
                }
            }
        }

        System.out.println("Seeding complete: " + testUsers.size() + " users created with password '123456'.");
    }

    private User createUser(String username, String email, String displayName, String bio, String password) {
        User u = new User();
        u.setUsername(username);
        u.setEmail(email);
        u.setDisplayName(displayName);
        u.setBio(bio);
        u.setPassword(password);
        u.setRole(Role.USER);
        u.setAvatar("https://api.dicebear.com/7.x/avataaars/svg?seed=" + username);
        return userRepository.save(u);
    }

    private Post createPost(User author, String title, String excerpt, String category, String content) {
        Post p = new Post();
        p.setTitle(title);
        p.setExcerpt(excerpt);
        p.setCategory(category);
        p.setAuthor(author);
        p.setDate(LocalDateTime.now().minusHours((long)(Math.random() * 48)));
        // Simple placeholder image with title
        p.setImage("https://placehold.co/1200x600?text=" + title.replace(" ", "+"));
        
        // Split content into paragraphs for list format
        p.setContentList(Arrays.asList(content.split("\n"))); 
        
        return postRepository.save(p);
    }

    private String getRandomComment() {
        String[] comments = {
            "Great post! Thanks for sharing.",
            "I completely agree with this.",
            "Interesting perspective.",
            "Could you elaborate more on that?",
            "This was super helpful, thanks!",
            "I've been thinking about this too.",
            "Well written!",
            "Spot on."
        };
        return comments[new Random().nextInt(comments.length)];
    }
}
