import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface UserSummary {
  id: string;
  username: string;
  name: string;
  bio?: string;
  avatar?: string;
  postCount?: number;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8080/api/users';

  constructor(private http: HttpClient) { }

  private authHeaders() {
    const token = (typeof window !== 'undefined' && window.localStorage) ? localStorage.getItem('token') : null;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    });
    return { headers };
  }

  getUsers(): Observable<UserSummary[]> {
    return this.http.get<UserSummary[]>(this.apiUrl, this.authHeaders());
  }

  follow(userId: string) {
    return this.http.post<any>(`${this.apiUrl}/${userId}/follow`, {}, this.authHeaders());
  }

  getMe(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/me`, this.authHeaders());
  }

  updateProfile(data: { displayName: string; bio: string; avatar: string }): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/me`, data, this.authHeaders());
  }

  getMyFollowing(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/me/following`, this.authHeaders());
  }
}