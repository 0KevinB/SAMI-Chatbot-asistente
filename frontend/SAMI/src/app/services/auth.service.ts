import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api';
  private tokenKey = 'authToken';

  constructor(private http: HttpClient) {}

  login(credentials: { cedula: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, credentials);
  }
  saveToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }
  getDecodedToken(): any | null {
    const token = this.getToken();
    if (token) {
      return jwtDecode(token);
    }
    return null;
  }
  logout(): void {
    localStorage.removeItem(this.tokenKey);
  }
}
