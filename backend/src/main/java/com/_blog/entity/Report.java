package com._blog.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "reports")
public class Report {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "reporter_id")
    private User reporter;

    @ManyToOne
    @JoinColumn(name = "post_id")
    private Post reportedPost;

    @Column(columnDefinition = "TEXT")
    private String reason;

    @Enumerated(EnumType.STRING)
    private ReportStatus status = ReportStatus.PENDING;

    private LocalDateTime createdAt = LocalDateTime.now();

    public Report() {}

    public Report(User reporter, Post reportedPost, String reason) {
        this.reporter = reporter;
        this.reportedPost = reportedPost;
        this.reason = reason;
        this.createdAt = LocalDateTime.now();
        this.status = ReportStatus.PENDING;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getReporter() { return reporter; }
    public void setReporter(User reporter) { this.reporter = reporter; }

    public Post getReportedPost() { return reportedPost; }
    public void setReportedPost(Post reportedPost) { this.reportedPost = reportedPost; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }

    public ReportStatus getStatus() { return status; }
    public void setStatus(ReportStatus status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
