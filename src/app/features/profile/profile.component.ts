import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { User } from '../../core/models/auth.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="profile-container slide-up">
      <div class="profile-header">
        <h2>My Profile</h2>
        <a routerLink="/profile/edit" class="btn btn-primary">Edit Profile</a>
      </div>
      
      <div class="profile-card card">
        <div class="profile-avatar">
          <div class="avatar-circle">
            <span class="avatar-text">{{ getInitials() }}</span>
          </div>
        </div>
        
        <div class="profile-details">
          <div class="profile-item">
            <span class="profile-label">Username</span>
            <span class="profile-value">{{ user?.username }}</span>
          </div>
          
          <div class="profile-item">
            <span class="profile-label">Email</span>
            <span class="profile-value">{{ user?.email }}</span>
          </div>
          
          <div class="profile-item">
            <span class="profile-label">Roles</span>
            <span class="profile-value">
              <span class="role-badge" *ngFor="let role of user?.roles">{{ role }}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .profile-container {
      padding: var(--space-4) 0;
      max-width: 600px;
      margin: 0 auto;
    }
    
    .profile-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--space-3);
    }
    
    .profile-header h2 {
      margin: 0;
    }
    
    .profile-card {
      display: flex;
      flex-direction: column;
      padding: var(--space-4);
    }
    
    .profile-avatar {
      display: flex;
      justify-content: center;
      margin-bottom: var(--space-3);
    }
    
    .avatar-circle {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      background-color: var(--primary);
      display: flex;
      justify-content: center;
      align-items: center;
      color: white;
      font-size: 2.5rem;
      font-weight: 600;
    }
    
    .profile-details {
      display: flex;
      flex-direction: column;
      gap: var(--space-3);
    }
    
    .profile-item {
      display: flex;
      flex-direction: column;
      padding-bottom: var(--space-2);
      border-bottom: 1px solid var(--neutral-300);
    }
    
    .profile-label {
      color: var(--neutral-600);
      font-size: 0.875rem;
      margin-bottom: var(--space-1);
    }
    
    .profile-value {
      font-size: 1.125rem;
      font-weight: 500;
      color: var(--neutral-900);
    }
    
    .role-badge {
      display: inline-block;
      padding: 4px 8px;
      background-color: var(--primary-light);
      color: var(--primary-dark);
      border-radius: 4px;
      font-size: 0.75rem;
      font-weight: 600;
      margin-right: 4px;
      text-transform: uppercase;
    }
    
    @media (max-width: 768px) {
      .profile-header {
        flex-direction: column;
        align-items: flex-start;
        gap: var(--space-2);
      }
      
      .avatar-circle {
        width: 80px;
        height: 80px;
        font-size: 2rem;
      }
    }
  `]
})
export class ProfileComponent implements OnInit {
  user: User | null = null;
  
  constructor(private authService: AuthService) {}
  
  ngOnInit(): void {
    this.user = this.authService.getUser();
    
    // Refresh user details from API
    this.authService.getUserDetails().subscribe({
      next: (userData) => {
        this.user = userData;
        // Update stored user
        const token = this.authService.getToken();
        if (token) {
          localStorage.setItem('auth-user', JSON.stringify(userData));
        }
      },
      error: (err) => {
        console.error('Failed to fetch user details', err);
      }
    });
  }
  
  getInitials(): string {
    if (!this.user?.username) return '?';
    return this.user.username.charAt(0).toUpperCase();
  }
}