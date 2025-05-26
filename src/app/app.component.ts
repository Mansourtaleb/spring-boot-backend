import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <header class="app-header">
      <div class="container">
        <div class="logo">
          <h1>AuthApp</h1>
        </div>
        <nav>
          <ul class="nav-links">
            <li routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">
              <a routerLink="/">Home</a>
            </li>
            <ng-container *ngIf="!isLoggedIn">
              <li routerLinkActive="active">
                <a routerLink="/login">Login</a>
              </li>
              <li routerLinkActive="active">
                <a routerLink="/register">Register</a>
              </li>
            </ng-container>
            <ng-container *ngIf="isLoggedIn">
              <li routerLinkActive="active">
                <a routerLink="/profile">Profile</a>
              </li>
              <li>
                <a (click)="logout()" class="logout-link">Logout</a>
              </li>
            </ng-container>
          </ul>
        </nav>
      </div>
    </header>
    
    <main class="container main-content">
      <router-outlet></router-outlet>
    </main>
    
    <footer class="app-footer">
      <div class="container">
        <p>&copy; 2025 AuthApp. All rights reserved.</p>
      </div>
    </footer>
  `,
  styles: [`
    .app-header {
      background-color: white;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      padding: var(--space-2) 0;
      position: sticky;
      top: 0;
      z-index: 100;
    }
    
    .app-header .container {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .logo h1 {
      margin: 0;
      color: var(--primary);
      font-size: 1.5rem;
    }
    
    .nav-links {
      display: flex;
      list-style: none;
      gap: var(--space-3);
    }
    
    .nav-links a {
      text-decoration: none;
      color: var(--neutral-700);
      font-weight: 500;
      transition: color 0.2s ease;
      position: relative;
    }
    
    .nav-links a:hover {
      color: var(--primary);
    }
    
    .nav-links li.active a {
      color: var(--primary);
    }
    
    .nav-links li.active a::after {
      content: '';
      position: absolute;
      bottom: -5px;
      left: 0;
      width: 100%;
      height: 2px;
      background-color: var(--primary);
      border-radius: 2px;
    }
    
    .logout-link {
      cursor: pointer;
    }
    
    .main-content {
      min-height: calc(100vh - 140px);
      padding: var(--space-4) 0;
    }
    
    .app-footer {
      background-color: var(--neutral-800);
      color: white;
      padding: var(--space-3) 0;
    }
    
    @media (max-width: 768px) {
      .app-header .container {
        flex-direction: column;
        gap: var(--space-2);
      }
      
      .nav-links {
        gap: var(--space-2);
      }
    }
  `]
})
export class AppComponent {
  isLoggedIn = false;
  
  constructor(private authService: AuthService) {
    this.authService.isLoggedIn$.subscribe(
      isLoggedIn => this.isLoggedIn = isLoggedIn
    );
  }
  
  logout(): void {
    this.authService.logout();
  }
}