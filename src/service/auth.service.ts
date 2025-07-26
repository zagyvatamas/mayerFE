import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {BehaviorSubject, map, Observable, tap, throwError } from 'rxjs';
import { RegisterData } from '../models/register';
import { Router } from '@angular/router';
import { UpdateProfileData } from '../models/updateProfileData';
import { Profile } from '../models/profile';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api'; 
  private tokenKey = 'token';
  private logoutTimer: any;
  private userSubject = new BehaviorSubject<any | null>(null);
  user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auth/login`, { email, password }).pipe(
      tap(response => localStorage.setItem(this.tokenKey, response.token))
    );
  }

  register(username: string,email:string, password: string, age:number,gender:string,phonenumber:string): Observable<RegisterData> {
    return this.http.post<RegisterData>(`${this.apiUrl}/auth/register`, {username, email, password, age, gender, phonenumber})
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    if (this.logoutTimer) {
      clearTimeout(this.logoutTimer); 
    }
    this.userSubject.next(null);
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

  updateProfile(data: UpdateProfileData): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.put(`${this.apiUrl}/auth/update`, data, {
      headers: {
       Authorization: `Bearer ${token}`
      }
    });
  }

  startTokenTimer() {
    const oneHour = 60 * 60 * 1000;

    if (this.logoutTimer) {
      clearTimeout(this.logoutTimer);
    }

    this.logoutTimer = setTimeout(() => {
      this.logout();
    }, oneHour);
  }
  isAdmin$ = this.user$.pipe(
    map(user => user?.role === 'Admin')
  );

  setUser(user: any) {
    this.userSubject.next(user);
  }
  
  initializeUserFromToken() {
  if (this.isAuthenticated()) {
    this.getProfile().subscribe({
      next: user => this.setUser(user),
      error: err => {
        console.error('Hiba a profil betöltésekor:', err);
        this.logout();
      }
     });
    }
  }
  getAllProfile():Observable<any> {
    return this.http.get<Profile>(`${this.apiUrl}/auth/all-user`);
  }
  deleteProfile(id: number): Observable<any> {
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.delete<any>(`${this.apiUrl}/auth/delete/${id}`, { headers });
  }
}
