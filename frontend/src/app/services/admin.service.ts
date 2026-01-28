import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private apiUrl = 'http://localhost:8080/api/admin';

  constructor(private http: HttpClient) {}

  getOverview(): Observable<any> {
    return this.http.get(`${this.apiUrl}/overview`);
  }

  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/users`);
  }

  getPosts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/posts`);
  }

  banUser(userId: string, banned: boolean): Observable<any> {
    return this.http.put(`${this.apiUrl}/users/${userId}/ban`, { banned });
  }

  deleteUser(userId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/users/${userId}`);
  }

  deletePost(postId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/posts/${postId}`);
  }
}