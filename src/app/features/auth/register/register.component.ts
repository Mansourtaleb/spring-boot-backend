import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { RegisterRequest } from '../../../core/models/auth.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="auth-container slide-up">
      <div class="auth-card card">
        <h2 class="text-center">Create Account</h2>
        <div *ngIf="errorMessage" class="alert alert-error">
          {{ errorMessage }}
        </div>
        <div *ngIf="successMessage" class="alert alert-success">
          {{ successMessage }}
        </div>

        <form (ngSubmit)="onSubmit()" #registerForm="ngForm">
          <div class="form-group">
            <label for="username">Username</label>
            <input
                type="text"
                id="username"
                name="username"
                [(ngModel)]="registerData.username"
                required
                minlength="3"
                maxlength="20"
                pattern="^[a-zA-Z0-9._-]*$"
                #username="ngModel"
                [class.input-error]="username.invalid && (username.dirty || username.touched)"
            >
            <div *ngIf="username.invalid && (username.dirty || username.touched)" class="form-error">
              <div *ngIf="username.errors?.['required']">Username is required.</div>
              <div *ngIf="username.errors?.['minlength']">Username must be at least 3 characters long.</div>
              <div *ngIf="username.errors?.['maxlength']">Username cannot exceed 20 characters.</div>
              <div *ngIf="username.errors?.['pattern']">Username can only contain letters, numbers, periods, underscores, and hyphens.</div>
            </div>
          </div>

          <div class="form-group">
            <label for="email">Email</label>
            <input
                type="email"
                id="email"
                name="email"
                [(ngModel)]="registerData.email"
                required
                email
                #email="ngModel"
                [class.input-error]="email.invalid && (email.dirty || email.touched)"
            >
            <div *ngIf="email.invalid && (email.dirty || email.touched)" class="form-error">
              <div *ngIf="email.errors?.['required']">Email is required.</div>
              <div *ngIf="email.errors?.['email']">Please enter a valid email address.</div>
            </div>
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <input
                type="password"
                id="password"
                name="password"
                [(ngModel)]="registerData.password"
                required
                minlength="8"
                pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[\\W_]).+$"
                #password="ngModel"
                [class.input-error]="password.invalid && (password.dirty || password.touched)"
            >
            <div *ngIf="password.invalid && (password.dirty || password.touched)" class="form-error">
              <div *ngIf="password.errors?.['required']">Password is required.</div>
              <div *ngIf="password.errors?.['minlength']">Password must be at least 8 characters long.</div>
              <div *ngIf="password.errors?.['pattern']">
                Password must include an uppercase letter, a lowercase letter, a number, and a special character.
              </div>
            </div>
          </div>

          <div class="form-group">
            <label for="confirmPassword">Confirm Password</label>
            <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                [(ngModel)]="confirmPassword"
                required
                #confirm="ngModel"
                [class.input-error]="confirm.dirty && registerData.password !== confirmPassword"
            >
            <div *ngIf="confirm.dirty && registerData.password !== confirmPassword" class="form-error">
              Passwords do not match.
            </div>
          </div>

          <div class="form-actions">
            <button
                type="submit"
                class="btn btn-primary btn-block"
                [disabled]="registerForm.invalid || isLoading || registerData.password !== confirmPassword"
            >
              {{ isLoading ? 'Creating Account...' : 'Register' }}
            </button>
          </div>
        </form>

        <div class="auth-footer">
          <p>Already have an account? <a routerLink="/login">Login</a></p>
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

    .alert-success {
      background-color: rgba(48, 209, 88, 0.1);
      color: var(--accent-dark);
      border: 1px solid rgba(48, 209, 88, 0.3);
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
export class RegisterComponent {
  registerData: RegisterRequest = {
    username: '',
    email: '',
    password: ''
  };

  confirmPassword = '';
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
      private authService: AuthService,
      private router: Router
  ) {}

  onSubmit(): void {
    if (this.registerData.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.authService.register(this.registerData).subscribe({
      next: () => {
        this.isLoading = false;
        this.successMessage = 'Registration successful! You can now login.';

        // Reset form
        this.registerData = {
          username: '',
          email: '',
          password: ''
        };
        this.confirmPassword = '';

        // Redirect to login after a short delay
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: err => {
        this.isLoading = false;
        this.errorMessage = err?.error?.message || 'Failed to register. Please try again.';
      }
    });
  }
}
