package com._blog.config;

import java.util.Optional;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import com._blog.entity.Role;
import com._blog.entity.User;
import com._blog.repository.UserRepository;

@Configuration
public class DataInitializer {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder encoder;

    public DataInitializer(UserRepository userRepository, BCryptPasswordEncoder encoder) {
        this.userRepository = userRepository;
        this.encoder = encoder;
    }

    @Bean
    public CommandLineRunner seedDefaultAdmin() {
        return args -> {
            final String email = "admin@gmail.com";
            final String username = "admin";
            final String rawPassword = "admin123";

            Optional<User> existing = userRepository.findByUsername(username);
            if (existing.isEmpty()) {
                existing = userRepository.findByEmail(email);
            }

            User admin;
            if (existing.isPresent()) {
                admin = existing.get();
            } else {
                admin = new User();
            }

            admin.setEmail(email);
            admin.setUsername(username);
            if (admin.getDisplayName() == null || admin.getDisplayName().trim().isEmpty()) {
                admin.setDisplayName("Admin");
            }
            admin.setRole(Role.ADMIN);
            admin.setPassword(encoder.encode(rawPassword));

            userRepository.save(admin);
        };
    }
}
