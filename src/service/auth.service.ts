import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap, throwError } from 'rxjs';
import { RegisterData } from '../models/register';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api'; 
  private tokenKey = 'token';

  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auth/login`, { email, password }).pipe(
      tap(response => localStorage.setItem(this.tokenKey, response.token))
    );
  }

  register(username: string,email:string, password: string, age:number,gender:string): Observable<RegisterData> {
    return this.http.post<RegisterData>(`${this.apiUrl}/auth/register`, {username, email, password, age, gender})
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.router.navigate(['landing'])
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem(this.tokenKey);
    return new HttpHeaders({
      Authorization: token ? `Bearer ${token}` : ''
    });
  }

  getProfile(): Observable<any> {
    const token = localStorage.getItem(this.tokenKey);
    if (!token) {
      return throwError(() => new Error('Token nem található!'));
    }
    const headers = this.getAuthHeaders();
    return this.http.get<any>(`${this.apiUrl}/auth/profile`, { headers });
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }
}
