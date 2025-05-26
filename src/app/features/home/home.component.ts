import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="home-container">
      <section class="hero">
        <h1 class="title">ISO/IEC 27000 Compliance Platform</h1>
        <p class="subtitle">Evaluate, track, and certify your organization's information security maturity.</p>

        <div class="hero-actions">
          <ng-container *ngIf="!isLoggedIn">
            <a routerLink="/login" class="btn btn-primary">Login</a>
            <a routerLink="/register" class="btn btn-outline">Register</a>
          </ng-container>
          <ng-container *ngIf="isLoggedIn">
            <a routerLink="/dashboard" class="btn btn-primary">Go to Dashboard</a>
          </ng-container>
        </div>
      </section>

      <section class="features">
        <h2 class="section-title">Why Choose Our Platform?</h2>
        <div class="feature-grid">
          <div class="feature-card">
            <div class="icon">🛡️</div>
            <h3>Security Audits</h3>
            <p>Automated tools to assess your compliance with ISO/IEC 27001 standards.</p>
          </div>
          <div class="feature-card">
            <div class="icon">📊</div>
            <h3>Progress Tracking</h3>
            <p>Visual dashboards to monitor your compliance status in real time.</p>
          </div>
          <div class="feature-card">
            <div class="icon">🧠</div>
            <h3>AI Recommendations</h3>
            <p>Get tailored improvement suggestions based on your maturity level.</p>
          </div>
          <div class="feature-card">
            <div class="icon">🎓</div>
            <h3>Certification Path</h3>
            <p>Follow a step-by-step path to prepare for ISO/IEC 27001 certification.</p>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .home-container {
      padding: 3rem 2rem;
      font-family: 'Segoe UI', sans-serif;
      background: linear-gradient(to right, #f5f7fa, #c3cfe2);
      min-height: 100vh;
    }

    .hero {
      text-align: center;
      margin-bottom: 4rem;
    }

    .title {
      font-size: 2.75rem;
      color: #2c3e50;
      margin-bottom: 1rem;
    }

    .subtitle {
      font-size: 1.25rem;
      color: #34495e;
      margin-bottom: 2rem;
      max-width: 700px;
      margin-left: auto;
      margin-right: auto;
    }

    .hero-actions {
      display: flex;
      justify-content: center;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .btn {
      padding: 0.75rem 1.5rem;
      font-size: 1rem;
      border-radius: 8px;
      text-decoration: none;
      transition: all 0.3s ease;
    }

    .btn-primary {
      background-color: #2c3e50;
      color: white;
    }

    .btn-primary:hover {
      background-color: #1a252f;
    }

    .btn-outline {
      border: 2px solid #2c3e50;
      color: #2c3e50;
    }

    .btn-outline:hover {
      background-color: #2c3e50;
      color: white;
    }

    .section-title {
      text-align: center;
      font-size: 2rem;
      margin-bottom: 2rem;
      color: #2c3e50;
    }

    .feature-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 2rem;
      padding: 0 1rem;
    }

    .feature-card {
      background: white;
      padding: 2rem;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
      text-align: center;
      transition: transform 0.3s;
    }

    .feature-card:hover {
      transform: translateY(-5px);
    }

    .icon {
      font-size: 2.5rem;
      margin-bottom: 1rem;
    }

    .feature-card h3 {
      color: #2c3e50;
      margin-bottom: 0.5rem;
    }

    .feature-card p {
      color: #7f8c8d;
      font-size: 0.95rem;
    }

    @media (max-width: 600px) {
      .title {
        font-size: 2rem;
      }

      .subtitle {
        font-size: 1rem;
      }
    }
  `]
})
export class HomeComponent {
  isLoggedIn = false;

  constructor(private authService: AuthService) {
    this.authService.isLoggedIn$.subscribe(
        isLoggedIn => this.isLoggedIn = isLoggedIn
    );
  }
}
