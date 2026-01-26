package com._blog.service;

import com._blog.entity.Report;
import com._blog.entity.ReportStatus;
import com._blog.entity.User;
import java.util.List;
import java.util.Map;

public interface ReportService {
    Report createReport(Long reporterId, String postId, String reason);
    List<Map<String, Object>> getAllReports();
    void updateReportStatus(Long reportId, ReportStatus status);
}
