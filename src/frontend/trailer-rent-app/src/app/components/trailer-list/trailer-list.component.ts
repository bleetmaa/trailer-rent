import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TrailerService } from '../../services/trailer.service';
import { Trailer, TrailerType } from '../../models/models';

@Component({
  selector: 'app-trailer-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="trailer-list-container">
      <!-- Hero Section -->
      <div class="hero-section">
        <div class="hero-content">
          <h1 class="hero-title">Find Your Perfect Trailer</h1>
          <p class="hero-subtitle">Rent quality trailers for all your transportation needs</p>
        </div>
      </div>

      <!-- Search Card -->
      <mat-card class="search-card" appearance="outlined">
        <mat-card-header>
          <mat-card-title>
            <mat-icon>search</mat-icon>
            Search Available Trailers
          </mat-card-title>
          <mat-card-subtitle>Find trailers for your specific dates</mat-card-subtitle>
        </mat-card-header>
        
        <mat-card-content>
          <div class="search-form">
            <mat-form-field appearance="outline" class="date-field">
              <mat-label>Start Date</mat-label>
              <input matInput 
                     [matDatepicker]="startPicker" 
                     [(ngModel)]="startDate"
                     [min]="today"
                     (dateChange)="onDateChange()">
              <mat-datepicker-toggle matIconSuffix [for]="startPicker">
                <mat-icon matDatepickerToggleIcon>event</mat-icon>
              </mat-datepicker-toggle>
              <mat-datepicker #startPicker></mat-datepicker>
            </mat-form-field>
            
            <mat-form-field appearance="outline" class="date-field">
              <mat-label>End Date</mat-label>
              <input matInput 
                     [matDatepicker]="endPicker" 
                     [(ngModel)]="endDate"
                     [min]="startDate || today"
                     (dateChange)="onDateChange()">
              <mat-datepicker-toggle matIconSuffix [for]="endPicker">
                <mat-icon matDatepickerToggleIcon>event</mat-icon>
              </mat-datepicker-toggle>
              <mat-datepicker #endPicker></mat-datepicker>
            </mat-form-field>
            
            <div class="search-actions">
              <button mat-raised-button color="primary" class="search-btn" (click)="searchByDates()" [disabled]="!startDate || !endDate">
                <mat-icon>search</mat-icon>
                Search Trailers
              </button>
              
              <button mat-stroked-button color="accent" (click)="clearFilters()">
                <mat-icon>clear</mat-icon>
                Clear
              </button>
            </div>
          </div>
        </mat-card-content>
      </mat-card>

      <!-- Loading State -->
      <div class="loading-container" *ngIf="isLoading">
        <mat-spinner diameter="50"></mat-spinner>
        <p class="loading-text">Finding available trailers...</p>
      </div>

      <!-- Results Section -->
      <div class="results-section" *ngIf="!isLoading">
        <div class="results-header" *ngIf="trailers.length > 0">
          <h2>Available Trailers</h2>
          <mat-chip-set>
            <mat-chip highlighted>{{ trailers.length }} trailer{{ trailers.length !== 1 ? 's' : '' }} found</mat-chip>
          </mat-chip-set>
        </div>

        <!-- Trailer Grid -->
        <div class="trailer-grid" *ngIf="trailers.length > 0; else noTrailers">
          <mat-card *ngFor="let trailer of trailers" class="trailer-card" appearance="outlined">
            <div class="trailer-image">
              <img [src]="getPrimaryImage(trailer)" 
                   [alt]="trailer.name"
                   onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImciIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiNmNWY1ZjUiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiNlZWVlZWUiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2cpIi8+PGNpcmNsZSBjeD0iMTUwIiBjeT0iMTAwIiByPSI0MCIgZmlsbD0iI2RkZCIvPjx0ZXh0IHg9IjUwJSIgeT0iNjAlIiBmb250LWZhbWlseT0iUm9ib3RvLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0IiBmaWxsPSIjOTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5UcmFpbGVyIEltYWdlPC90ZXh0Pjwvc3ZnPg=='">
              <div class="image-overlay">
                <mat-chip class="type-chip">{{ trailer.type }}</mat-chip>
              </div>
            </div>
            
            <mat-card-header>
              <mat-card-title>{{ trailer.name }}</mat-card-title>
              <mat-card-subtitle>{{ trailer.description || 'Professional trailer rental' }}</mat-card-subtitle>
            </mat-card-header>
            
            <mat-card-content>
              <div class="specs-container">
                <div class="spec-item">
                  <mat-icon color="primary">fitness_center</mat-icon>
                  <span class="spec-label">Max Weight</span>
                  <span class="spec-value">{{ trailer.maxWeight }} kg</span>
                </div>
                
                <div class="spec-item" *ngIf="trailer.licensePlate">
                  <mat-icon color="primary">confirmation_number</mat-icon>
                  <span class="spec-label">License</span>
                  <span class="spec-value">{{ trailer.licensePlate }}</span>
                </div>
              </div>
              
              <div class="price-container">
                <div class="price-main">
                  <span class="price-amount">{{ trailer.pricePerDay | currency:'SEK':'symbol':'1.0-0' }}</span>
                  <span class="price-period">per day</span>
                </div>
                <mat-chip class="availability-chip" highlighted>Available</mat-chip>
              </div>
            </mat-card-content>
            
            <mat-card-actions class="card-actions">
              <button mat-button color="primary" [routerLink]="['/trailers', trailer.id]" class="action-btn">
                <mat-icon>visibility</mat-icon>
                View Details
              </button>
              
              <button mat-raised-button color="accent" [routerLink]="['/rent', trailer.id]" class="action-btn primary-action">
                <mat-icon>event</mat-icon>
                Rent Now
              </button>
            </mat-card-actions>
          </mat-card>
        </div>
      </div>

      <!-- No Results -->
      <ng-template #noTrailers>
        <mat-card class="no-results-card" appearance="outlined">
          <mat-card-content>
            <div class="no-results">
              <mat-icon class="no-results-icon">rv_hookup</mat-icon>
              <h3>No trailers available</h3>
              <p>We couldn't find any trailers matching your criteria. Try adjusting your search dates or check back later.</p>
              <button mat-raised-button color="primary" (click)="clearFilters()">
                <mat-icon>refresh</mat-icon>
                Show All Trailers
              </button>
            </div>
          </mat-card-content>
        </mat-card>
      </ng-template>
    </div>
  `,
  styles: [`
    .trailer-list-container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 0;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
    }

    /* Hero Section */
    .hero-section {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 80px 24px 40px;
      text-align: center;
      position: relative;
      overflow: hidden;
    }

    .hero-section::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="0.5" fill="white" opacity="0.1"/><circle cx="75" cy="75" r="0.3" fill="white" opacity="0.05"/><circle cx="45" cy="65" r="0.4" fill="white" opacity="0.08"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
      pointer-events: none;
    }

    .hero-content {
      position: relative;
      z-index: 2;
    }

    .hero-title {
      font-size: 3.5rem;
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

    /* Search Card */
    .search-card {
      margin: -20px 24px 32px;
      background: white;
      border-radius: 16px !important;
      box-shadow: 0 8px 32px rgba(0,0,0,0.12) !important;
      position: relative;
      z-index: 3;
    }

    .search-card mat-card-header {
      padding-bottom: 16px;
    }

    .search-card mat-card-title {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 1.5rem;
      color: #333;
    }

    .search-card mat-card-subtitle {
      color: #666;
      margin-top: 8px;
    }

    .search-form {
      display: flex;
      flex-wrap: wrap;
      gap: 24px;
      align-items: flex-end;
    }

    .date-field {
      flex: 1;
      min-width: 200px;
    }

    .search-actions {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
    }

    .search-btn {
      background: linear-gradient(45deg, #667eea, #764ba2) !important;
      color: white !important;
      border-radius: 8px !important;
      padding: 0 24px !important;
      height: 48px !important;
      font-weight: 500 !important;
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3) !important;
      transition: all 0.3s ease !important;
    }

    .search-btn:hover:not([disabled]) {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4) !important;
    }

    .search-btn[disabled] {
      opacity: 0.6 !important;
      transform: none !important;
    }

    /* Loading */
    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 64px 24px;
      background: white;
      margin: 0 24px;
      border-radius: 16px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.08);
    }

    .loading-text {
      margin-top: 24px;
      color: #666;
      font-size: 1.1rem;
    }

    /* Results Section */
    .results-section {
      padding: 0 24px 40px;
    }

    .results-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 32px;
      padding: 24px 0;
    }

    .results-header h2 {
      color: white;
      font-size: 2rem;
      font-weight: 300;
      margin: 0;
    }

    /* Trailer Grid */
    .trailer-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
      gap: 24px;
    }

    .trailer-card {
      border-radius: 16px !important;
      overflow: hidden !important;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
      background: white !important;
      box-shadow: 0 4px 20px rgba(0,0,0,0.08) !important;
      height: fit-content;
    }

    .trailer-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 12px 40px rgba(0,0,0,0.15) !important;
    }

    /* Trailer Image */
    .trailer-image {
      position: relative;
      height: 240px;
      overflow: hidden;
      background: linear-gradient(45deg, #f5f5f5, #eeeeee);
    }

    .trailer-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;
    }

    .trailer-card:hover .trailer-image img {
      transform: scale(1.05);
    }

    .image-overlay {
      position: absolute;
      top: 16px;
      right: 16px;
    }

    .type-chip {
      background: rgba(255,255,255,0.9) !important;
      color: #333 !important;
      font-weight: 500 !important;
      backdrop-filter: blur(10px);
    }

    /* Card Content */
    .trailer-card mat-card-header {
      padding: 24px 24px 16px !important;
    }

    .trailer-card mat-card-title {
      font-size: 1.4rem !important;
      font-weight: 500 !important;
      color: #333 !important;
      margin-bottom: 8px !important;
    }

    .trailer-card mat-card-subtitle {
      color: #666 !important;
      font-size: 0.95rem !important;
    }

    .trailer-card mat-card-content {
      padding: 0 24px 16px !important;
    }

    /* Specs */
    .specs-container {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin-bottom: 24px;
    }

    .spec-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px;
      background: #f8f9fa;
      border-radius: 8px;
    }

    .spec-item mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    .spec-label {
      color: #666;
      font-size: 0.9rem;
      flex: 1;
    }

    .spec-value {
      font-weight: 500;
      color: #333;
    }

    /* Price */
    .price-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 12px;
      color: white;
      margin-bottom: 8px;
    }

    .price-main {
      display: flex;
      align-items: baseline;
      gap: 8px;
    }

    .price-amount {
      font-size: 1.8rem;
      font-weight: 600;
    }

    .price-period {
      font-size: 0.9rem;
      opacity: 0.8;
    }

    .availability-chip {
      background: rgba(255,255,255,0.2) !important;
      color: white !important;
      border: 1px solid rgba(255,255,255,0.3) !important;
    }

    /* Actions */
    .card-actions {
      padding: 16px 24px 24px !important;
      display: flex;
      gap: 12px;
    }

    .action-btn {
      flex: 1;
      height: 44px !important;
      border-radius: 8px !important;
      font-weight: 500 !important;
      transition: all 0.3s ease !important;
    }

    .primary-action {
      background: linear-gradient(45deg, #667eea, #764ba2) !important;
      color: white !important;
      box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3) !important;
    }

    .primary-action:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4) !important;
    }

    /* No Results */
    .no-results-card {
      margin: 0 24px;
      border-radius: 16px !important;
      background: white !important;
      box-shadow: 0 4px 20px rgba(0,0,0,0.08) !important;
    }

    .no-results {
      text-align: center;
      padding: 64px 32px;
    }

    .no-results-icon {
      font-size: 80px !important;
      width: 80px !important;
      height: 80px !important;
      color: #ddd;
      margin-bottom: 24px;
    }

    .no-results h3 {
      font-size: 1.5rem;
      color: #333;
      margin-bottom: 16px;
      font-weight: 400;
    }

    .no-results p {
      color: #666;
      margin-bottom: 32px;
      max-width: 400px;
      margin-left: auto;
      margin-right: auto;
      line-height: 1.6;
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .hero-title {
        font-size: 2.5rem;
      }

      .hero-subtitle {
        font-size: 1rem;
      }

      .search-form {
        flex-direction: column;
        align-items: stretch;
      }

      .date-field {
        min-width: auto;
      }

      .search-actions {
        justify-content: stretch;
      }

      .search-actions button {
        flex: 1;
      }

      .trailer-grid {
        grid-template-columns: 1fr;
      }

      .results-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 16px;
      }

      .card-actions {
        flex-direction: column;
      }
    }

    @media (max-width: 480px) {
      .hero-section {
        padding: 60px 16px 32px;
      }

      .search-card {
        margin: -16px 16px 24px;
      }

      .results-section {
        padding: 0 16px 32px;
      }
    }
  `]
})
export class TrailerListComponent implements OnInit {
  trailers: Trailer[] = [];
  startDate: Date | null = null;
  endDate: Date | null = null;
  isLoading = false;
  today = new Date();

  constructor(private trailerService: TrailerService) {}

  ngOnInit(): void {
    this.loadTrailers();
  }

  loadTrailers(): void {
    this.isLoading = true;
    this.trailerService.getAvailable().subscribe({
      next: (trailers) => {
        this.trailers = trailers;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading trailers:', error);
        this.isLoading = false;
      }
    });
  }

  searchByDates(): void {
    if (this.startDate && this.endDate) {
      this.isLoading = true;
      console.log('Searching for trailers between:', this.startDate, 'and', this.endDate);
      
      this.trailerService.getAvailableForDates(this.startDate, this.endDate).subscribe({
        next: (trailers) => {
          console.log('Successfully received trailers:', trailers);
          this.trailers = trailers;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error searching trailers:', error);
          console.log('Falling back to all available trailers');
          // Fallback to showing all available trailers
          this.trailerService.getAvailable().subscribe({
            next: (trailers) => {
              this.trailers = trailers;
              this.isLoading = false;
            },
            error: (fallbackError) => {
              console.error('Error loading fallback trailers:', fallbackError);
              this.isLoading = false;
            }
          });
        }
      });
    }
  }

  clearFilters(): void {
    this.startDate = null;
    this.endDate = null;
    this.loadTrailers();
  }

  onDateChange(): void {
    // Auto-search when both dates are selected
    if (this.startDate && this.endDate) {
      this.searchByDates();
    }
  }

  getPrimaryImage(trailer: Trailer): string {
    const primaryImage = trailer.images?.find(img => img.isPrimary);
    return primaryImage?.imageUrl || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==';
  }
}
