import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { TrailerService } from '../../services/trailer.service';
import { Trailer } from '../../models/models';

@Component({
  selector: 'app-trailer-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatDividerModule
  ],
  template: `
    <div class="trailer-detail-container">
      <!-- Loading State -->
      <div class="loading-container" *ngIf="isLoading">
        <mat-spinner diameter="50"></mat-spinner>
        <p class="loading-text">Loading trailer details...</p>
      </div>

      <!-- Trailer Details -->
      <div class="content-container" *ngIf="!isLoading && trailer">
        <!-- Hero Section -->
        <div class="hero-section">
          <div class="hero-content">
            <button mat-icon-button class="back-btn" (click)="goBack()">
              <mat-icon>arrow_back</mat-icon>
            </button>
            <h1 class="hero-title">{{ trailer.name }}</h1>
            <p class="hero-subtitle">{{ trailer.description || 'Professional trailer rental' }}</p>
          </div>
        </div>

        <!-- Main Content -->
        <div class="main-content">
          <!-- Image Gallery -->
          <mat-card class="image-card" appearance="outlined">
            <div class="image-gallery">
              <div class="main-image">
                <img [src]="getPrimaryImage(trailer)" 
                     [alt]="trailer.name"
                     onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImciIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiNmNWY1ZjUiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiNlZWVlZWUiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2cpIi8+PGNpcmNsZSBjeD0iMzAwIiBjeT0iMjAwIiByPSI4MCIgZmlsbD0iI2RkZCIvPjx0ZXh0IHg9IjUwJSIgeT0iNjAlIiBmb250LWZhbWlseT0iUm9ib3RvLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjI0IiBmaWxsPSIjOTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5UcmFpbGVyIEltYWdlPC90ZXh0Pjwvc3ZnPg=='">
                <div class="image-overlay">
                  <mat-chip class="type-chip">{{ trailer.type }}</mat-chip>
                </div>
              </div>
            </div>
          </mat-card>

          <!-- Details Grid -->
          <div class="details-grid">
            <!-- Specifications -->
            <mat-card class="specs-card" appearance="outlined">
              <mat-card-header>
                <mat-card-title>
                  <mat-icon>build</mat-icon>
                  Specifications
                </mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <div class="spec-list">
                  <div class="spec-item">
                    <mat-icon color="primary">fitness_center</mat-icon>
                    <span class="spec-label">Maximum Weight</span>
                    <span class="spec-value">{{ trailer.maxWeight }} kg</span>
                  </div>
                  
                  <mat-divider></mat-divider>
                  
                  <div class="spec-item">
                    <mat-icon color="primary">category</mat-icon>
                    <span class="spec-label">Trailer Type</span>
                    <span class="spec-value">{{ trailer.type }}</span>
                  </div>
                  
                  <mat-divider *ngIf="trailer.licensePlate"></mat-divider>
                  
                  <div class="spec-item" *ngIf="trailer.licensePlate">
                    <mat-icon color="primary">confirmation_number</mat-icon>
                    <span class="spec-label">License Plate</span>
                    <span class="spec-value">{{ trailer.licensePlate }}</span>
                  </div>
                  
                  <mat-divider></mat-divider>
                  
                  <div class="spec-item">
                    <mat-icon color="primary">check_circle</mat-icon>
                    <span class="spec-label">Availability</span>
                    <mat-chip [highlighted]="trailer.isAvailable" 
                             [color]="trailer.isAvailable ? 'accent' : 'warn'">
                      {{ trailer.isAvailable ? 'Available' : 'Not Available' }}
                    </mat-chip>
                  </div>
                </div>
              </mat-card-content>
            </mat-card>

            <!-- Pricing -->
            <mat-card class="pricing-card" appearance="outlined">
              <mat-card-header>
                <mat-card-title>
                  <mat-icon>attach_money</mat-icon>
                  Pricing
                </mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <div class="pricing-options">
                  <div class="price-option">
                    <div class="price-main">
                      <span class="price-amount">{{ trailer.pricePerDay | currency:'SEK':'symbol':'1.0-0' }}</span>
                      <span class="price-period">per day</span>
                    </div>
                    <p class="price-description">Perfect for multi-day projects</p>
                  </div>
                  
                  <mat-divider *ngIf="trailer.pricePerHour"></mat-divider>
                  
                  <div class="price-option" *ngIf="trailer.pricePerHour">
                    <div class="price-main">
                      <span class="price-amount">{{ trailer.pricePerHour | currency:'SEK':'symbol':'1.0-0' }}</span>
                      <span class="price-period">per hour</span>
                    </div>
                    <p class="price-description">Great for quick tasks</p>
                  </div>
                </div>
              </mat-card-content>
            </mat-card>
          </div>

          <!-- Action Card -->
          <mat-card class="action-card" appearance="outlined">
            <mat-card-content>
              <div class="action-content">
                <div class="action-text">
                  <h3>Ready to rent this trailer?</h3>
                  <p>Book now to secure your rental dates</p>
                </div>
                <div class="action-buttons">
                  <button mat-raised-button 
                          color="primary" 
                          class="rent-btn"
                          [disabled]="!trailer.isAvailable"
                          [routerLink]="['/rent', trailer.id]">
                    <mat-icon>event</mat-icon>
                    Rent This Trailer
                  </button>
                </div>
              </div>
            </mat-card-content>
          </mat-card>
        </div>
      </div>

      <!-- Error State -->
      <div class="error-container" *ngIf="!isLoading && !trailer">
        <mat-card class="error-card" appearance="outlined">
          <mat-card-content>
            <div class="error-content">
              <mat-icon class="error-icon">error_outline</mat-icon>
              <h3>Trailer not found</h3>
              <p>We couldn't find the trailer you're looking for.</p>
              <button mat-raised-button color="primary" (click)="goBack()">
                <mat-icon>arrow_back</mat-icon>
                Go Back
              </button>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .trailer-detail-container {
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    /* Loading State */
    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      color: white;
    }

    .loading-text {
      margin-top: 24px;
      font-size: 1.1rem;
    }

    /* Hero Section */
    .hero-section {
      padding: 40px 24px;
      color: white;
      position: relative;
    }

    .hero-content {
      max-width: 1200px;
      margin: 0 auto;
      position: relative;
    }

    .back-btn {
      position: absolute;
      left: -12px;
      top: -8px;
      background: rgba(255,255,255,0.1) !important;
      color: white !important;
      backdrop-filter: blur(10px);
    }

    .hero-title {
      font-size: 2.5rem;
      font-weight: 300;
      margin: 0 0 16px 0;
      letter-spacing: -0.5px;
    }

    .hero-subtitle {
      font-size: 1.2rem;
      opacity: 0.9;
      margin: 0;
      font-weight: 400;
    }

    /* Main Content */
    .main-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 24px 40px;
    }

    .content-container {
      padding-bottom: 40px;
    }

    /* Image Card */
    .image-card {
      margin-bottom: 32px;
      border-radius: 16px !important;
      overflow: hidden !important;
      box-shadow: 0 8px 32px rgba(0,0,0,0.12) !important;
    }

    .image-gallery {
      position: relative;
    }

    .main-image {
      position: relative;
      height: 400px;
      overflow: hidden;
    }

    .main-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .image-overlay {
      position: absolute;
      top: 20px;
      right: 20px;
    }

    .type-chip {
      background: rgba(255,255,255,0.9) !important;
      color: #333 !important;
      font-weight: 500 !important;
      backdrop-filter: blur(10px);
      font-size: 0.9rem !important;
    }

    /* Details Grid */
    .details-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
      margin-bottom: 32px;
    }

    .specs-card,
    .pricing-card {
      border-radius: 16px !important;
      box-shadow: 0 4px 20px rgba(0,0,0,0.08) !important;
    }

    .specs-card mat-card-title,
    .pricing-card mat-card-title {
      display: flex;
      align-items: center;
      gap: 12px;
      color: #333;
    }

    /* Specifications */
    .spec-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .spec-item {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 8px 0;
    }

    .spec-item mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    .spec-label {
      flex: 1;
      color: #666;
      font-weight: 500;
    }

    .spec-value {
      font-weight: 600;
      color: #333;
    }

    /* Pricing */
    .pricing-options {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .price-option {
      text-align: center;
      padding: 16px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 12px;
      color: white;
    }

    .price-main {
      display: flex;
      align-items: baseline;
      justify-content: center;
      gap: 8px;
      margin-bottom: 8px;
    }

    .price-amount {
      font-size: 2rem;
      font-weight: 600;
    }

    .price-period {
      font-size: 1rem;
      opacity: 0.8;
    }

    .price-description {
      margin: 0;
      font-size: 0.9rem;
      opacity: 0.8;
    }

    /* Action Card */
    .action-card {
      border-radius: 16px !important;
      box-shadow: 0 4px 20px rgba(0,0,0,0.08) !important;
    }

    .action-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 0;
    }

    .action-text h3 {
      margin: 0 0 8px 0;
      color: #333;
      font-weight: 500;
    }

    .action-text p {
      margin: 0;
      color: #666;
    }

    .rent-btn {
      background: linear-gradient(45deg, #667eea, #764ba2) !important;
      color: white !important;
      border-radius: 8px !important;
      padding: 0 32px !important;
      height: 48px !important;
      font-weight: 500 !important;
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3) !important;
      transition: all 0.3s ease !important;
    }

    .rent-btn:hover:not([disabled]) {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4) !important;
    }

    .rent-btn[disabled] {
      opacity: 0.6 !important;
      transform: none !important;
    }

    /* Error State */
    .error-container {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      padding: 24px;
    }

    .error-card {
      border-radius: 16px !important;
      box-shadow: 0 8px 32px rgba(0,0,0,0.12) !important;
      background: white !important;
    }

    .error-content {
      text-align: center;
      padding: 40px;
    }

    .error-icon {
      font-size: 80px !important;
      width: 80px !important;
      height: 80px !important;
      color: #ff6b6b;
      margin-bottom: 24px;
    }

    .error-content h3 {
      font-size: 1.5rem;
      color: #333;
      margin-bottom: 16px;
      font-weight: 400;
    }

    .error-content p {
      color: #666;
      margin-bottom: 32px;
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .hero-title {
        font-size: 2rem;
      }

      .details-grid {
        grid-template-columns: 1fr;
      }

      .action-content {
        flex-direction: column;
        align-items: stretch;
        gap: 24px;
      }

      .action-text {
        text-align: center;
      }

      .main-image {
        height: 250px;
      }
    }

    @media (max-width: 480px) {
      .hero-section {
        padding: 32px 16px;
      }

      .main-content {
        padding: 0 16px 32px;
      }

      .hero-title {
        font-size: 1.8rem;
      }

      .hero-subtitle {
        font-size: 1rem;
      }
    }
  `]
})
export class TrailerDetailComponent implements OnInit {
  trailer: Trailer | null = null;
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private trailerService: TrailerService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadTrailer(parseInt(id, 10));
    } else {
      this.isLoading = false;
    }
  }

  loadTrailer(id: number): void {
    this.trailerService.getById(id).subscribe({
      next: (trailer) => {
        this.trailer = trailer;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading trailer:', error);
        this.isLoading = false;
      }
    });
  }

  getPrimaryImage(trailer: Trailer): string {
    const primaryImage = trailer.images?.find(img => img.isPrimary);
    return primaryImage?.imageUrl || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==';
  }

  goBack(): void {
    this.router.navigate(['/trailers']);
  }
}
