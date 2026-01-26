package com._blog.controller;

import com._blog.entity.Report;
import com._blog.entity.User;
import com._blog.repository.UserRepository;
import com._blog.service.ReportService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = "http://localhost:4200")
public class ReportController {

    private final ReportService reportService;
    private final UserRepository userRepository;

    public ReportController(ReportService reportService, UserRepository userRepository) {
        this.reportService = reportService;
        this.userRepository = userRepository;
    }

    public record ReportRequest(String postId, String reason) {}

    @PostMapping
    public ResponseEntity<?> createReport(@RequestBody ReportRequest req, @AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
        User user = userRepository.findByUsername(userDetails.getUsername()).orElseThrow();
        Report report = reportService.createReport(user.getId(), req.postId(), req.reason());
        return ResponseEntity.ok(Map.of("id", report.getId(), "message", "Report submitted"));
    }
}
