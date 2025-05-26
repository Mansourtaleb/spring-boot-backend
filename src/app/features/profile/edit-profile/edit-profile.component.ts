import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { UpdateUserRequest, User } from '../../../core/models/auth.model';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="edit-profile-container slide-up">
      <div class="edit-profile-header">
        <h2>Edit Profile</h2>
        <button class="btn btn-secondary" (click)="goBack()">Back to Profile</button>
      </div>
      
      <div class="edit-profile-card card">
        <div *ngIf="errorMessage" class="alert alert-error">
          {{ errorMessage }}
        </div>
        <div *ngIf="successMessage" class="alert alert-success">
          {{ successMessage }}
        </div>
        
        <form (ngSubmit)="onSubmit()" #editForm="ngForm">
          <div class="form-group">
            <label for="username">Username</label>
            <input 
              type="text" 
              id="username" 
              name="username" 
              [(ngModel)]="updateData.username" 
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
            <label for="email">Email</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              [(ngModel)]="updateData.email" 
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
          
          <div class="password-change-toggle">
            <label>
              <input 
                type="checkbox" 
                [(ngModel)]="changePassword" 
                name="changePasswordToggle"
              >
              Change Password
            </label>
          </div>
          
          <div *ngIf="changePassword" class="password-fields slide-up">
            <div class="form-group">
              <label for="currentPassword">Current Password</label>
              <input 
                type="password" 
                id="currentPassword" 
                name="currentPassword" 
                [(ngModel)]="updateData.currentPassword" 
                required 
                #currentPassword="ngModel"
                [class.input-error]="currentPassword.invalid && (currentPassword.dirty || currentPassword.touched)"
              >
              <div *ngIf="currentPassword.invalid && (currentPassword.dirty || currentPassword.touched)" class="form-error">
                <div *ngIf="currentPassword.errors?.['required']">Current password is required.</div>
              </div>
            </div>
            
            <div class="form-group">
              <label for="newPassword">New Password</label>
              <input 
                type="password" 
                id="newPassword" 
                name="newPassword" 
                [(ngModel)]="updateData.password" 
                required 
                minlength="6"
                #newPassword="ngModel"
                [class.input-error]="newPassword.invalid && (newPassword.dirty || newPassword.touched)"
              >
              <div *ngIf="newPassword.invalid && (newPassword.dirty || newPassword.touched)" class="form-error">
                <div *ngIf="newPassword.errors?.['required']">New password is required.</div>
                <div *ngIf="newPassword.errors?.['minlength']">New password must be at least 6 characters long.</div>
              </div>
            </div>
            
            <div class="form-group">
              <label for="confirmPassword">Confirm New Password</label>
              <input 
                type="password" 
                id="confirmPassword" 
                name="confirmPassword" 
                [(ngModel)]="confirmPassword" 
                required
                #confirm="ngModel"
                [class.input-error]="confirm.dirty && updateData.password !== confirmPassword"
              >
              <div *ngIf="confirm.dirty && updateData.password !== confirmPassword" class="form-error">
                Passwords do not match.
              </div>
            </div>
          </div>
          
          <div class="form-actions">
            <button 
              type="submit" 
              class="btn btn-primary btn-block" 
              [disabled]="!isFormValid() || isLoading"
            >
              {{ isLoading ? 'Saving Changes...' : 'Save Changes' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .edit-profile-container {
      padding: var(--space-4) 0;
      max-width: 600px;
      margin: 0 auto;
    }
    
    .edit-profile-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--space-3);
    }
    
    .edit-profile-header h2 {
      margin: 0;
    }
    
    .edit-profile-card {
      padding: var(--space-4);
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
    
    .password-change-toggle {
      margin: var(--space-3) 0;
    }
    
    .password-change-toggle label {
      display: flex;
      align-items: center;
      gap: var(--space-1);
      cursor: pointer;
    }
    
    .password-change-toggle input {
      width: auto;
    }
    
    .password-fields {
      margin-top: var(--space-2);
      padding-top: var(--space-2);
      border-top: 1px solid var(--neutral-300);
    }
    
    .form-actions {
      margin-top: var(--space-3);
    }
    
    @media (max-width: 768px) {
      .edit-profile-header {
        flex-direction: column;
        align-items: flex-start;
        gap: var(--space-2);
      }
      
      .edit-profile-header button {
        width: 100%;
      }
    }
  `]
})
export class EditProfileComponent implements OnInit {
  updateData: UpdateUserRequest = {
    username: '',
    email: '',
    password: '',
    currentPassword: ''
  };
  
  confirmPassword = '';
  changePassword = false;
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}
  
  ngOnInit(): void {
    const user = this.authService.getUser();
    if (user) {
      this.updateData.username = user.username;
      this.updateData.email = user.email;
    }
  }
  
  isFormValid(): boolean {
    // Basic form validation
    if (!this.updateData.username || !this.updateData.email) {
      return false;
    }
    
    // Password validation if changing password
    if (this.changePassword) {
      if (!this.updateData.currentPassword || !this.updateData.password || this.updateData.password !== this.confirmPassword) {
        return false;
      }
    }
    
    return true;
  }
  
  onSubmit(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';
    
    // If not changing password, remove password fields
    const dataToSubmit: UpdateUserRequest = { ...this.updateData };
    if (!this.changePassword) {
      delete dataToSubmit.password;
      delete dataToSubmit.currentPassword;
    }
    
    this.authService.updateUser(dataToSubmit).subscribe({
      next: () => {
        this.isLoading = false;
        this.successMessage = 'Profile updated successfully!';
        
        // Reset password fields if they were used
        if (this.changePassword) {
          this.updateData.password = '';
          this.updateData.currentPassword = '';
          this.confirmPassword = '';
          this.changePassword = false;
        }
        
        // Navigate back to profile after a short delay
        setTimeout(() => {
          this.router.navigate(['/profile']);
        }, 1500);
      },
      error: err => {
        this.isLoading = false;
        this.errorMessage = err?.error?.message || 'Failed to update profile. Please try again.';
      }
    });
  }
  
  goBack(): void {
    this.router.navigate(['/profile']);
  }
}