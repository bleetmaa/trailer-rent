import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { CommonModule } from '@angular/common';
import { User } from '../../models/models';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule
  ],
  template: `
    <mat-toolbar color="primary">
      <a routerLink="/" class="logo">
        <mat-icon>rv_hookup</mat-icon>
        <span>TrailerRent</span>
      </a>
      
      <span class="spacer"></span>
      
      <div class="nav-links">
        <a mat-button routerLink="/trailers" routerLinkActive="active">Browse Trailers</a>
        
        <ng-container *ngIf="currentUser$ | async as user; else notLoggedIn">
          <a mat-button routerLink="/dashboard" routerLinkActive="active">Dashboard</a>
          <a mat-button routerLink="/my-rentals" routerLinkActive="active">My Rentals</a>
          
          <button mat-button [matMenuTriggerFor]="userMenu">
            <mat-icon>account_circle</mat-icon>
            {{ user.firstName }}
          </button>
          <mat-menu #userMenu="matMenu">
            <button mat-menu-item (click)="logout()">
              <mat-icon>logout</mat-icon>
              Logout
            </button>
          </mat-menu>
        </ng-container>
        
        <ng-template #notLoggedIn>
          <a mat-button routerLink="/login" routerLinkActive="active">Login</a>
          <a mat-raised-button color="accent" routerLink="/register" routerLinkActive="active">Register</a>
        </ng-template>
      </div>
    </mat-toolbar>
  `,
  styles: [`
    .logo {
      display: flex;
      align-items: center;
      text-decoration: none;
      color: inherit;
      font-size: 1.2em;
      font-weight: 500;
    }
    
    .logo mat-icon {
      margin-right: 8px;
    }
    
    .spacer {
      flex: 1 1 auto;
    }
    
    .nav-links {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .nav-links a.active {
      background-color: rgba(255, 255, 255, 0.1);
    }
    
    @media (max-width: 768px) {
      .nav-links {
        gap: 4px;
      }
      
      .nav-links a span {
        display: none;
      }
    }
  `]
})
export class NavbarComponent implements OnInit {
  currentUser$;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.currentUser$ = this.authService.currentUser$;
  }

  ngOnInit(): void {}

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
