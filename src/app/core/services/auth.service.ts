import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { 
  RegisterRequest, 
  LoginRequest, 
  AuthResponse, 
  User, 
  UpdateUserRequest 
} from '../models/auth.model';

const TOKEN_KEY = 'auth-token';
const USER_KEY = 'auth-user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  public isLoggedIn$ = this.isLoggedInSubject.asObservable();
  
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.checkAuthStatus();
  }

  private checkAuthStatus(): void {
    const token = this.getToken();
    const user = this.getUser();
    
    if (token && user) {
      this.currentUserSubject.next(user);
      this.isLoggedInSubject.next(true);
    }
  }

  register(data: RegisterRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/signup`, data);
  }

  login(data: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/signin`, data)
      .pipe(
        tap(response => {
          this.saveToken(response.accessToken);
          
          const user: User = {
            id: response.id,
            username: response.username,
            email: response.email,
            roles: response.roles
          };
          
          this.saveUser(user);
          this.currentUserSubject.next(user);
          this.isLoggedInSubject.next(true);
        })
      );
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this.currentUserSubject.next(null);
    this.isLoggedInSubject.next(false);
    this.router.navigate(['/login']);
  }

  updateUser(data: UpdateUserRequest): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/user`, data)
      .pipe(
        tap(updatedUser => {
          const currentUser = this.getUser();
          if (currentUser) {
            const user: User = {
              ...currentUser,
              username: updatedUser.username || currentUser.username,
              email: updatedUser.email || currentUser.email
            };
            this.saveUser(user);
            this.currentUserSubject.next(user);
          }
        })
      );
  }

  getUserDetails(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/user`);
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  getUser(): User | null {
    const user = localStorage.getItem(USER_KEY);
    if (user) {
      return JSON.parse(user);
    }
    return null;
  }

  private saveToken(token: string): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.setItem(TOKEN_KEY, token);
  }

  private saveUser(user: User): void {
    localStorage.removeItem(USER_KEY);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
}