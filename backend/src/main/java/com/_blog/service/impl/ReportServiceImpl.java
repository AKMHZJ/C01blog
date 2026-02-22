package com._blog.service.impl;

import com._blog.entity.*;
import com._blog.repository.PostRepository;
import com._blog.repository.ReportRepository;
import com._blog.repository.UserRepository;
import com._blog.service.ReportService;
import org.springframework.stereotype.Service;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ReportServiceImpl implements ReportService {

    private final ReportRepository reportRepository;
    private final UserRepository userRepository;
    private final PostRepository postRepository;

    public ReportServiceImpl(ReportRepository reportRepository, UserRepository userRepository, PostRepository postRepository) {
        this.reportRepository = reportRepository;
        this.userRepository = userRepository;
        this.postRepository = postRepository;
    }

    @Override
    public Report createReport(Long reporterId, String postId, String reason) {
        User reporter = userRepository.findById(reporterId).orElseThrow(() -> new com._blog.exception.ResourceNotFoundException("Reporter not found"));
        Post post = postRepository.findById(postId).orElseThrow(() -> new com._blog.exception.ResourceNotFoundException("Post not found"));

        if (post.getAuthor() != null) {
            if (post.getAuthor().getId().equals(reporterId)) {
                throw new com._blog.exception.BadRequestException("You cannot report your own post.");
            }
            if (post.getAuthor().getRole() == Role.ADMIN) {
                throw new com._blog.exception.BadRequestException("You cannot report an admin.");
            }
        }

        Report report = new Report(reporter, post, reason);
        return reportRepository.save(report);
    }

    @Override
    public List<Map<String, Object>> getAllReports() {
        return reportRepository.findAllByOrderByCreatedAtDesc().stream().map(r -> {
            Map<String, Object> map = new LinkedHashMap<>();
            map.put("id", r.getId());
            map.put("reason", r.getReason());
            map.put("status", r.getStatus());
            map.put("createdAt", r.getCreatedAt());

            if (r.getReporter() != null) {
                map.put("reporterId", r.getReporter().getId());
                map.put("reporterName", r.getReporter().getUsername());
            }

            if (r.getReportedPost() != null) {
                map.put("postId", r.getReportedPost().getId());
                map.put("postTitle", r.getReportedPost().getTitle());
                if (r.getReportedPost().getAuthor() != null) {
                    map.put("postAuthorId", r.getReportedPost().getAuthor().getId());
                    map.put("postAuthorName", r.getReportedPost().getAuthor().getUsername());
                }
            }

            return map;
        }).collect(Collectors.toList());
    }

    @Override
    public void updateReportStatus(Long reportId, ReportStatus status) {
        Report report = reportRepository.findById(reportId).orElseThrow(() -> new RuntimeException("Report not found"));
        report.setStatus(status);
        reportRepository.save(report);
    }
}
