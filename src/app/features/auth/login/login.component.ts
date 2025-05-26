import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { LoginRequest } from '../../../core/models/auth.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="auth-container slide-up">
      <div class="auth-card card">
        <h2 class="text-center">Login</h2>
        <div *ngIf="errorMessage" class="alert alert-error">
          {{ errorMessage }}
        </div>
        
        <form (ngSubmit)="onSubmit()" #loginForm="ngForm">
          <div class="form-group">
            <label for="username">Username</label>
            <input 
              type="text" 
              id="username" 
              name="username" 
              [(ngModel)]="loginData.username" 
              required 
              minlength="3"
              #username="ngModel"
              [class.input-error]="username.invalid && (username.dirty || username.touched)"
            >
            <div *ngIf="username.invalid && (username.dirty || username.touched)" class="form-error">
              <div *ngIf="username.errors?.['required']">Username is required.</div>
              <div *ngIf="username.errors?.['minlength']">Username must be at least 3 characters long.</div>
            </div>
          </div>
          
          <div class="form-group">
            <label for="password">Password</label>
            <input 
              type="password" 
              id="password" 
              name="password" 
              [(ngModel)]="loginData.password" 
              required 
              minlength="6"
              #password="ngModel"
              [class.input-error]="password.invalid && (password.dirty || password.touched)"
            >
            <div *ngIf="password.invalid && (password.dirty || password.touched)" class="form-error">
              <div *ngIf="password.errors?.['required']">Password is required.</div>
              <div *ngIf="password.errors?.['minlength']">Password must be at least 6 characters long.</div>
            </div>
          </div>
          
          <div class="form-actions">
            <button 
              type="submit" 
              class="btn btn-primary btn-block" 
              [disabled]="loginForm.invalid || isLoading"
            >
              {{ isLoading ? 'Logging in...' : 'Login' }}
            </button>
          </div>
        </form>
        
        <div class="auth-footer">
          <p>Don't have an account? <a routerLink="/register">Register</a></p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-container {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: var(--space-4) 0;
    }
    
    .auth-card {
      width: 100%;
      max-width: 400px;
    }
    
    .input-error {
      border-color: var(--error);
    }
    
    .alert {
      padding: var(--space-2);
      border-radius: 8px;
      margin-bottom: var(--space-3);
    }
    
    .alert-error {
      background-color: rgba(255, 69, 58, 0.1);
      color: var(--error);
      border: 1px solid rgba(255, 69, 58, 0.3);
    }
    
    .form-actions {
      margin-top: var(--space-3);
    }
    
    .auth-footer {
      margin-top: var(--space-3);
      text-align: center;
      color: var(--neutral-600);
    }
    
    .auth-footer a {
      color: var(--primary);
      text-decoration: none;
      font-weight: 500;
    }
    
    .auth-footer a:hover {
      text-decoration: underline;
    }
  `]
})
export class LoginComponent {
  loginData: LoginRequest = {
    username: '',
    password: ''
  };
  
  isLoading = false;
  errorMessage = '';
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}
  
  onSubmit(): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.authService.login(this.loginData).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/profile']);
      },
      error: err => {
        this.isLoading = false;
        this.errorMessage = err?.error?.message || 'Failed to login. Please try again.';
      }
    });
  }
}