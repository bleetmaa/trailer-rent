import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { TrailerService } from '../../services/trailer.service';
import { RentalService } from '../../services/rental.service';
import { Trailer, Rental } from '../../models/models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <div class="dashboard-container">
      <h1>Welcome to TrailerRent Dashboard</h1>
      
      <div class="stats-grid">
        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-content">
              <mat-icon color="primary">rv_hookup</mat-icon>
              <div>
                <h3>{{ totalTrailers }}</h3>
                <p>Available Trailers</p>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
        
        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-content">
              <mat-icon color="accent">event</mat-icon>
              <div>
                <h3>{{ myRentals.length }}</h3>
                <p>My Rentals</p>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
        
        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-content">
              <mat-icon color="warn">pending</mat-icon>
              <div>
                <h3>{{ pendingRentals }}</h3>
                <p>Pending Rentals</p>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
      
      <div class="action-grid">
        <mat-card class="action-card">
          <mat-card-header>
            <mat-card-title>Browse Trailers</mat-card-title>
            <mat-card-subtitle>Find the perfect trailer for your needs</mat-card-subtitle>
          </mat-card-header>
          <mat-card-actions>
            <button mat-raised-button color="primary" routerLink="/trailers">
              <mat-icon>search</mat-icon>
              Browse Now
            </button>
          </mat-card-actions>
        </mat-card>
        
        <mat-card class="action-card">
          <mat-card-header>
            <mat-card-title>My Rentals</mat-card-title>
            <mat-card-subtitle>View and manage your rental history</mat-card-subtitle>
          </mat-card-header>
          <mat-card-actions>
            <button mat-raised-button color="accent" routerLink="/my-rentals">
              <mat-icon>list</mat-icon>
              View Rentals
            </button>
          </mat-card-actions>
        </mat-card>
      </div>
      
      <div class="recent-section" *ngIf="recentRentals.length > 0">
        <h2>Recent Rentals</h2>
        <div class="recent-rentals">
          <mat-card *ngFor="let rental of recentRentals" class="rental-card">
            <mat-card-header>
              <mat-card-title>{{ rental.trailer.name }}</mat-card-title>
              <mat-card-subtitle>
                {{ rental.startDate | date }} - {{ rental.endDate | date }}
              </mat-card-subtitle>
            </mat-card-header>
            <mat-card-content>
              <p><strong>Status:</strong> 
                <span [class]="'status-' + rental.status.toLowerCase()">
                  {{ rental.status }}
                </span>
              </p>
              <p><strong>Total:</strong> {{ rental.totalPrice | currency:'SEK':'symbol':'1.0-0' }}</p>
            </mat-card-content>
          </mat-card>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 24px;
      max-width: 1200px;
      margin: 0 auto;
    }
    
    h1 {
      margin-bottom: 32px;
      color: #333;
    }
    
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
      margin-bottom: 32px;
    }
    
    .stat-card {
      .stat-content {
        display: flex;
        align-items: center;
        gap: 16px;
        
        mat-icon {
          font-size: 32px;
          width: 32px;
          height: 32px;
        }
        
        h3 {
          margin: 0;
          font-size: 2em;
          font-weight: 500;
        }
        
        p {
          margin: 0;
          color: #666;
        }
      }
    }
    
    .action-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 16px;
      margin-bottom: 32px;
    }
    
    .action-card {
      mat-card-actions {
        padding: 16px;
      }
      
      button {
        mat-icon {
          margin-right: 8px;
        }
      }
    }
    
    .recent-section {
      h2 {
        margin-bottom: 16px;
        color: #333;
      }
    }
    
    .recent-rentals {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 16px;
    }
    
    .rental-card {
      .status-pending { color: #ff9800; }
      .status-confirmed { color: #2196f3; }
      .status-active { color: #4caf50; }
      .status-completed { color: #9e9e9e; }
      .status-cancelled { color: #f44336; }
    }
  `]
})
export class DashboardComponent implements OnInit {
  totalTrailers = 0;
  myRentals: Rental[] = [];
  recentRentals: Rental[] = [];
  pendingRentals = 0;

  constructor(
    private trailerService: TrailerService,
    private rentalService: RentalService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  private loadDashboardData(): void {
    // Load available trailers count
    this.trailerService.getAvailable().subscribe({
      next: (trailers) => {
        this.totalTrailers = trailers.length;
      },
      error: (error) => console.error('Error loading trailers:', error)
    });

    // Load user's rentals
    this.rentalService.getMyRentals().subscribe({
      next: (rentals) => {
        this.myRentals = rentals;
        this.recentRentals = rentals
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 3);
        this.pendingRentals = rentals.filter(r => r.status === 'Pending').length;
      },
      error: (error) => console.error('Error loading rentals:', error)
    });
  }
}
