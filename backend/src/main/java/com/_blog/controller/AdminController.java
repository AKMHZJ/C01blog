package com._blog.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import com._blog.entity.Role;
import com._blog.entity.ReportStatus;
import com._blog.entity.User;
import com._blog.repository.UserRepository;
import com._blog.service.AdminService;
import com._blog.service.ReportService;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:4200")
public class AdminController {

    private final AdminService adminService;
    private final ReportService reportService;
    private final UserRepository userRepository;

    public AdminController(AdminService adminService, ReportService reportService, UserRepository userRepository) {
        this.adminService = adminService;
        this.reportService = reportService;
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

    @GetMapping("/posts")
    public List<Map<String, Object>> posts() {
        return adminService.listPosts();
    }
    
    @GetMapping("/reports")
    public List<Map<String, Object>> reports() {
        return reportService.getAllReports();
    }

    @DeleteMapping("/posts/{id}")
    public ResponseEntity<?> deletePost(@PathVariable("id") String postId) {
        adminService.deletePost(postId);
        return ResponseEntity.ok(Map.of("deleted", true));
    }

    public record RoleUpdateRequest(String role) {}
    public record BanRequest(boolean banned) {}
    public record ReportStatusRequest(String status) {}

    @PutMapping("/reports/{id}/status")
    public ResponseEntity<?> updateReportStatus(
            @PathVariable("id") Long reportId,
            @RequestBody ReportStatusRequest req
    ) {
        try {
            ReportStatus status = ReportStatus.valueOf(req.status().toUpperCase());
            reportService.updateReportStatus(reportId, status);
            return ResponseEntity.ok(Map.of("updated", true));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Invalid status");
        }
    }

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

    @PutMapping("/users/{id}/ban")
    public ResponseEntity<?> banUser(
            @PathVariable("id") Long userId,
            @RequestBody BanRequest req,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        if (userDetails != null) {
            User current = userRepository.findByUsername(userDetails.getUsername()).orElse(null);
            if (current != null && current.getId().equals(userId)) {
                return ResponseEntity.badRequest().body("You cannot ban yourself");
            }
        }
        User updated = adminService.banUser(userId, req.banned());
        return ResponseEntity.ok(Map.of(
                "id", String.valueOf(updated.getId()),
                "banned", updated.isBanned()
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
