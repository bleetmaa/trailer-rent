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
    MatNativeDateModule
  ],
  template: `
    <div class="trailer-list-container">
      <div class="header">
        <h1>Available Trailers</h1>
        
        <div class="filters">
          <mat-form-field appearance="outline">
            <mat-label>Start Date</mat-label>
            <input matInput 
                   [matDatepicker]="startPicker" 
                   [(ngModel)]="startDate"
                   [min]="today"
                   (dateChange)="onDateChange()">
            <mat-datepicker-toggle matSuffix [for]="startPicker"></mat-datepicker-toggle>
            <mat-datepicker #startPicker></mat-datepicker>
          </mat-form-field>
          
          <mat-form-field appearance="outline">
            <mat-label>End Date</mat-label>
            <input matInput 
                   [matDatepicker]="endPicker" 
                   [(ngModel)]="endDate"
                   [min]="startDate || today"
                   (dateChange)="onDateChange()">
            <mat-datepicker-toggle matSuffix [for]="endPicker"></mat-datepicker-toggle>
            <mat-datepicker #endPicker></mat-datepicker>
          </mat-form-field>
          
          <button mat-raised-button color="primary" (click)="searchByDates()">
            <mat-icon>search</mat-icon>
            Search
          </button>
          
          <button mat-button (click)="clearFilters()">
            <mat-icon>clear</mat-icon>
            Clear
          </button>
        </div>
      </div>
      
      <div class="trailer-grid" *ngIf="trailers.length > 0; else noTrailers">
        <mat-card *ngFor="let trailer of trailers" class="trailer-card">
          <div class="trailer-image">
            <img [src]="getPrimaryImage(trailer)" 
                 [alt]="trailer.name"
                 onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg=='">
          </div>
          
          <mat-card-header>
            <mat-card-title>{{ trailer.name }}</mat-card-title>
            <mat-card-subtitle>{{ trailer.type }}</mat-card-subtitle>
          </mat-card-header>
          
          <mat-card-content>
            <p *ngIf="trailer.description">{{ trailer.description }}</p>
            
            <div class="trailer-details">
              <div class="detail-item">
                <mat-icon>fitness_center</mat-icon>
                <span>Max Weight: {{ trailer.maxWeight }} kg</span>
              </div>
              
              <div class="detail-item" *ngIf="trailer.licensePlate">
                <mat-icon>confirmation_number</mat-icon>
                <span>{{ trailer.licensePlate }}</span>
              </div>
            </div>
            
            <div class="price">
              <span class="price-amount">{{ trailer.pricePerDay | currency:'SEK':'symbol':'1.0-0' }}</span>
              <span class="price-period">/ day</span>
            </div>
          </mat-card-content>
          
          <mat-card-actions>
            <button mat-raised-button color="primary" [routerLink]="['/trailers', trailer.id]">
              <mat-icon>visibility</mat-icon>
              View Details
            </button>
            
            <button mat-button color="accent" [routerLink]="['/rent', trailer.id]">
              <mat-icon>event</mat-icon>
              Rent Now
            </button>
          </mat-card-actions>
        </mat-card>
      </div>
      
      <ng-template #noTrailers>
        <div class="no-trailers">
          <mat-icon>rv_hookup</mat-icon>
          <h3>No trailers available</h3>
          <p>Try adjusting your search criteria or check back later.</p>
        </div>
      </ng-template>
      
      <div class="loading" *ngIf="isLoading">
        <p>Loading trailers...</p>
      </div>
    </div>
  `,
  styles: [`
    .trailer-list-container {
      padding: 24px;
      max-width: 1200px;
      margin: 0 auto;
    }
    
    .header {
      margin-bottom: 32px;
      
      h1 {
        margin-bottom: 24px;
      }
    }
    
    .filters {
      display: flex;
      gap: 16px;
      align-items: center;
      flex-wrap: wrap;
      
      mat-form-field {
        min-width: 150px;
      }
    }
    
    .trailer-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 24px;
    }
    
    .trailer-card {
      display: flex;
      flex-direction: column;
      
      .trailer-image {
        height: 200px;
        overflow: hidden;
        
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
      
      mat-card-content {
        flex: 1;
      }
      
      .trailer-details {
        margin: 16px 0;
        
        .detail-item {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
          
          mat-icon {
            font-size: 18px;
            width: 18px;
            height: 18px;
            color: #666;
          }
          
          span {
            font-size: 14px;
            color: #666;
          }
        }
      }
      
      .price {
        display: flex;
        align-items: baseline;
        gap: 4px;
        margin-top: 16px;
        
        .price-amount {
          font-size: 1.5em;
          font-weight: 500;
          color: #2196f3;
        }
        
        .price-period {
          color: #666;
        }
      }
      
      mat-card-actions {
        display: flex;
        gap: 8px;
        padding: 16px;
        
        button {
          flex: 1;
          
          mat-icon {
            margin-right: 8px;
          }
        }
      }
    }
    
    .no-trailers {
      text-align: center;
      padding: 64px 32px;
      color: #666;
      
      mat-icon {
        font-size: 64px;
        width: 64px;
        height: 64px;
        margin-bottom: 16px;
      }
      
      h3 {
        margin-bottom: 8px;
      }
    }
    
    .loading {
      text-align: center;
      padding: 32px;
      color: #666;
    }
    
    @media (max-width: 768px) {
      .filters {
        flex-direction: column;
        align-items: stretch;
        
        mat-form-field {
          min-width: auto;
        }
      }
      
      .trailer-grid {
        grid-template-columns: 1fr;
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
