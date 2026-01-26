import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/reports'; 

  createReport(postId: string, reason: string): Observable<any> {
    return this.http.post(this.apiUrl, { postId, reason });
  }

  getReports(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:8080/api/admin/reports');
  }

  updateStatus(reportId: string, status: string): Observable<any> {
    return this.http.put(`http://localhost:8080/api/admin/reports/${reportId}/status`, { status });
  }
}
