package com._blog.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import com._blog.entity.Role;
import com._blog.entity.User;
import com._blog.repository.UserRepository;
import com._blog.service.AdminService;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:4200")
public class AdminController {

    private final AdminService adminService;
    private final UserRepository userRepository;

    public AdminController(AdminService adminService, UserRepository userRepository) {
        this.adminService = adminService;
        this.userRepository = userRepository;
    }

    @GetMapping("/overview")
    public Map<String, Object> overview() {
        return adminService.overview();
    }

    @GetMapping("/users")
    public List<Map<String, Object>> users() {
        return adminService.listUsers();
    }

    public record RoleUpdateRequest(String role) {}

    @PutMapping("/users/{id}/role")
    public ResponseEntity<?> updateRole(
            @PathVariable("id") Long userId,
            @RequestBody RoleUpdateRequest req,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        if (userDetails != null) {
            User current = userRepository.findByUsername(userDetails.getUsername()).orElse(null);
            if (current != null && current.getId().equals(userId)) {
                return ResponseEntity.badRequest().body("You cannot change your own role");
            }
        }

        Role role;
        try {
            role = Role.valueOf(req.role() == null ? "" : req.role().trim().toUpperCase());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Invalid role");
        }

        User updated = adminService.updateRole(userId, role);
        return ResponseEntity.ok(Map.of(
                "id", String.valueOf(updated.getId()),
                "role", updated.getRole().name()
        ));
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(
            @PathVariable("id") Long userId,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        if (userDetails != null) {
            User current = userRepository.findByUsername(userDetails.getUsername()).orElse(null);
            if (current != null && current.getId().equals(userId)) {
                return ResponseEntity.badRequest().body("You cannot delete your own account");
            }
        }
        adminService.deleteUser(userId);
        return ResponseEntity.ok(Map.of("deleted", true));
    }
}