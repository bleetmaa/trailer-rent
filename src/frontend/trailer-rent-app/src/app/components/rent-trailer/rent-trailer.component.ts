import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatRadioModule } from '@angular/material/radio';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { TrailerService } from '../../services/trailer.service';
import { RentalService } from '../../services/rental.service';
import { AuthService } from '../../services/auth.service';
import { Trailer, CreateRentalRequest } from '../../models/models';

@Component({
  selector: 'app-rent-trailer',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatRadioModule,
    MatSnackBarModule
  ],
  template: `
    <div class="rent-container">
      <!-- Loading State -->
      <div class="loading-container" *ngIf="isLoading">
        <mat-spinner diameter="50"></mat-spinner>
        <p class="loading-text">Loading rental form...</p>
      </div>

      <!-- Rental Form -->
      <div class="content-container" *ngIf="!isLoading && trailer">
        <!-- Hero Section -->
        <div class="hero-section">
          <div class="hero-content">
            <button mat-icon-button class="back-btn" (click)="goBack()">
              <mat-icon>arrow_back</mat-icon>
            </button>
            <h1 class="hero-title">Rent {{ trailer.name }}</h1>
            <p class="hero-subtitle">Complete your rental booking</p>
          </div>
        </div>

        <div class="main-content">
          <form [formGroup]="rentalForm" (ngSubmit)="submitRental()">
            <div class="form-grid">
              <!-- Trailer Summary -->
              <mat-card class="trailer-summary-card" appearance="outlined">
                <mat-card-header>
                  <mat-card-title>
                    <mat-icon>rv_hookup</mat-icon>
                    Trailer Details
                  </mat-card-title>
                </mat-card-header>
                <mat-card-content>
                  <div class="trailer-summary">
                    <div class="trailer-image">
                      <img [src]="getPrimaryImage(trailer)" [alt]="trailer.name">
                    </div>
                    <div class="trailer-info">
                      <h3>{{ trailer.name }}</h3>
                      <p class="trailer-description">{{ trailer.description || 'Professional trailer rental' }}</p>
                      <div class="trailer-specs">
                        <div class="spec">
                          <mat-icon>fitness_center</mat-icon>
                          <span>{{ trailer.maxWeight }} kg max</span>
                        </div>
                        <div class="spec">
                          <mat-icon>category</mat-icon>
                          <span>{{ trailer.type }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </mat-card-content>
              </mat-card>

              <!-- Rental Form -->
              <mat-card class="rental-form-card" appearance="outlined">
                <mat-card-header>
                  <mat-card-title>
                    <mat-icon>event</mat-icon>
                    Rental Information
                  </mat-card-title>
                </mat-card-header>
                <mat-card-content>
                  <!-- Rental Type Selection -->
                  <div class="form-section">
                    <h4>Rental Duration Type</h4>
                    <mat-radio-group formControlName="rentalType" class="rental-type-group">
                      <mat-radio-button value="daily">
                        <div class="radio-option">
                          <div class="option-header">
                            <span class="option-title">Daily Rental</span>
                            <span class="option-price">{{ trailer.pricePerDay | currency:'SEK':'symbol':'1.0-0' }}/day</span>
                          </div>
                          <p class="option-description">Perfect for multi-day projects and extended use</p>
                        </div>
                      </mat-radio-button>
                      
                      <mat-radio-button value="hourly" *ngIf="trailer.pricePerHour">
                        <div class="radio-option">
                          <div class="option-header">
                            <span class="option-title">Hourly Rental</span>
                            <span class="option-price">{{ trailer.pricePerHour | currency:'SEK':'symbol':'1.0-0' }}/hour</span>
                          </div>
                          <p class="option-description">Great for quick tasks and short-term needs</p>
                        </div>
                      </mat-radio-button>
                    </mat-radio-group>
                  </div>

                  <mat-divider class="section-divider"></mat-divider>

                  <!-- Date and Time Selection -->
                  <div class="form-section">
                    <h4>Rental Period</h4>
                    <div class="date-time-fields">
                      <!-- Start Date -->
                      <mat-form-field appearance="outline" class="date-field">
                        <mat-label>Start Date</mat-label>
                        <input matInput 
                               [matDatepicker]="startPicker" 
                               formControlName="startDate"
                               [min]="today">
                        <mat-datepicker-toggle matIconSuffix [for]="startPicker">
                          <mat-icon matDatepickerToggleIcon>event</mat-icon>
                        </mat-datepicker-toggle>
                        <mat-datepicker #startPicker></mat-datepicker>
                        <mat-error *ngIf="rentalForm.get('startDate')?.hasError('required')">
                          Start date is required
                        </mat-error>
                      </mat-form-field>

                      <!-- Start Time -->
                      <mat-form-field appearance="outline" class="time-field">
                        <mat-label>Pickup Time</mat-label>
                        <mat-select formControlName="startTime">
                          <mat-option *ngFor="let time of timeSlots" [value]="time">{{ time }}</mat-option>
                        </mat-select>
                        <mat-error *ngIf="rentalForm.get('startTime')?.hasError('required')">
                          Pickup time is required
                        </mat-error>
                      </mat-form-field>

                      <!-- End Date -->
                      <mat-form-field appearance="outline" class="date-field">
                        <mat-label>End Date</mat-label>
                        <input matInput 
                               [matDatepicker]="endPicker" 
                               formControlName="endDate"
                               [min]="rentalForm.get('startDate')?.value || today">
                        <mat-datepicker-toggle matIconSuffix [for]="endPicker">
                          <mat-icon matDatepickerToggleIcon>event</mat-icon>
                        </mat-datepicker-toggle>
                        <mat-datepicker #endPicker></mat-datepicker>
                        <mat-error *ngIf="rentalForm.get('endDate')?.hasError('required')">
                          End date is required
                        </mat-error>
                      </mat-form-field>

                      <!-- Return Time -->
                      <mat-form-field appearance="outline" class="time-field">
                        <mat-label>Return Time</mat-label>
                        <mat-select formControlName="endTime">
                          <mat-option *ngFor="let time of timeSlots" [value]="time">{{ time }}</mat-option>
                        </mat-select>
                        <mat-error *ngIf="rentalForm.get('endTime')?.hasError('required')">
                          Return time is required
                        </mat-error>
                      </mat-form-field>

                      <!-- Duration (for hourly) -->
                      <mat-form-field appearance="outline" class="duration-field" *ngIf="isHourlyRental">
                        <mat-label>Duration (hours)</mat-label>
                        <mat-select formControlName="duration">
                          <mat-option *ngFor="let hour of hourOptions" [value]="hour">{{ hour }} hour{{ hour !== 1 ? 's' : '' }}</mat-option>
                        </mat-select>
                        <mat-error *ngIf="rentalForm.get('duration')?.hasError('required')">
                          Duration is required
                        </mat-error>
                      </mat-form-field>
                    </div>
                  </div>

                  <mat-divider class="section-divider"></mat-divider>

                  <!-- Additional Notes -->
                  <div class="form-section">
                    <mat-form-field appearance="outline" class="full-width">
                      <mat-label>Additional Notes (Optional)</mat-label>
                      <textarea matInput 
                                formControlName="notes"
                                rows="3"
                                placeholder="Any special requirements or notes for your rental..."></textarea>
                    </mat-form-field>
                  </div>
                </mat-card-content>
              </mat-card>

              <!-- Price Summary -->
              <mat-card class="price-summary-card" appearance="outlined">
                <mat-card-header>
                  <mat-card-title>
                    <mat-icon>receipt</mat-icon>
                    Price Summary
                  </mat-card-title>
                </mat-card-header>
                <mat-card-content>
                  <div class="price-breakdown" *ngIf="totalPrice > 0">
                    <div class="price-line">
                      <span class="price-label">{{ isHourlyRental ? 'Hourly' : 'Daily' }} Rate:</span>
                      <span class="price-value">{{ (isHourlyRental ? trailer.pricePerHour : trailer.pricePerDay) | currency:'SEK':'symbol':'1.0-0' }}</span>
                    </div>
                    <div class="price-line" *ngIf="rentalDuration > 0">
                      <span class="price-label">Duration:</span>
                      <span class="price-value">{{ rentalDuration }} {{ isHourlyRental ? 'hour' : 'day' }}{{ rentalDuration !== 1 ? 's' : '' }}</span>
                    </div>
                    <div class="price-line" *ngIf="rentalForm.get('startTime')?.value && rentalForm.get('endTime')?.value">
                      <span class="price-label">{{ isHourlyRental ? 'Time:' : 'Pickup/Return:' }}</span>
                      <span class="price-value">{{ rentalForm.get('startTime')?.value }} - {{ rentalForm.get('endTime')?.value }}</span>
                    </div>
                    <mat-divider class="price-divider"></mat-divider>
                    <div class="price-line total-line">
                      <span class="price-label">Total:</span>
                      <span class="price-value total-price">{{ totalPrice | currency:'SEK':'symbol':'1.0-0' }}</span>
                    </div>
                  </div>
                  
                  <div class="price-placeholder" *ngIf="totalPrice === 0">
                    <mat-icon>calculate</mat-icon>
                    <p>Select rental dates to see pricing</p>
                  </div>
                </mat-card-content>
                
                <mat-card-actions class="price-actions">
                  <button mat-raised-button 
                          color="primary" 
                          type="submit"
                          class="book-btn"
                          [disabled]="!rentalForm.valid || isSubmitting || totalPrice === 0">
                    <mat-icon *ngIf="!isSubmitting">check</mat-icon>
                    <mat-spinner diameter="20" *ngIf="isSubmitting"></mat-spinner>
                    {{ isSubmitting ? 'Booking...' : 'Book Rental' }}
                  </button>
                </mat-card-actions>
              </mat-card>
            </div>
          </form>
        </div>
      </div>

      <!-- Error State -->
      <div class="error-container" *ngIf="!isLoading && !trailer">
        <mat-card class="error-card" appearance="outlined">
          <mat-card-content>
            <div class="error-content">
              <mat-icon class="error-icon">error_outline</mat-icon>
              <h3>Trailer not found</h3>
              <p>We couldn't find the trailer you're trying to rent.</p>
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
    .rent-container {
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

    /* Form Grid */
    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr 400px;
      gap: 24px;
    }

    /* Cards */
    .trailer-summary-card,
    .rental-form-card,
    .price-summary-card {
      border-radius: 16px !important;
      box-shadow: 0 4px 20px rgba(0,0,0,0.08) !important;
      background: white !important;
    }

    .trailer-summary-card mat-card-title,
    .rental-form-card mat-card-title,
    .price-summary-card mat-card-title {
      display: flex;
      align-items: center;
      gap: 12px;
      color: #333;
    }

    /* Trailer Summary */
    .trailer-summary {
      display: flex;
      gap: 20px;
    }

    .trailer-image {
      width: 120px;
      height: 80px;
      border-radius: 8px;
      overflow: hidden;
      flex-shrink: 0;
    }

    .trailer-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .trailer-info h3 {
      margin: 0 0 8px 0;
      color: #333;
      font-weight: 500;
    }

    .trailer-description {
      margin: 0 0 16px 0;
      color: #666;
      font-size: 0.9rem;
    }

    .trailer-specs {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .spec {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #666;
      font-size: 0.9rem;
    }

    .spec mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
    }

    /* Form Sections */
    .form-section {
      margin-bottom: 24px;
    }

    .form-section h4 {
      margin: 0 0 16px 0;
      color: #333;
      font-weight: 500;
    }

    .section-divider {
      margin: 24px 0;
    }

    /* Rental Type Selection */
    .rental-type-group {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .radio-option {
      margin-left: 32px;
      padding: 16px 0;
    }

    .option-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }

    .option-title {
      font-weight: 500;
      color: #333;
    }

    .option-price {
      background: linear-gradient(45deg, #667eea, #764ba2);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      font-weight: 600;
    }

    .option-description {
      margin: 0;
      color: #666;
      font-size: 0.9rem;
    }

    /* Date and Time Fields */
    .date-time-fields {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr 1fr;
      gap: 16px;
    }

    .duration-field {
      grid-column: 1 / -1;
    }

    .full-width {
      width: 100%;
    }

    /* Price Summary */
    .price-breakdown {
      padding: 16px 0;
    }

    .price-line {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 0;
    }

    .price-label {
      color: #666;
    }

    .price-value {
      font-weight: 500;
      color: #333;
    }

    .price-divider {
      margin: 16px 0;
    }

    .total-line {
      padding: 16px 0;
    }

    .total-line .price-label {
      font-weight: 600;
      color: #333;
      font-size: 1.1rem;
    }

    .total-price {
      font-size: 1.5rem;
      font-weight: 600;
      background: linear-gradient(45deg, #667eea, #764ba2);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .price-placeholder {
      text-align: center;
      padding: 40px 20px;
      color: #999;
    }

    .price-placeholder mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      margin-bottom: 16px;
      opacity: 0.5;
    }

    .price-placeholder p {
      margin: 0;
    }

    /* Actions */
    .price-actions {
      padding: 16px 24px 24px !important;
    }

    .book-btn {
      background: linear-gradient(45deg, #667eea, #764ba2) !important;
      color: white !important;
      border-radius: 8px !important;
      padding: 0 32px !important;
      height: 48px !important;
      font-weight: 500 !important;
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3) !important;
      transition: all 0.3s ease !important;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }

    .book-btn:hover:not([disabled]) {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4) !important;
    }

    .book-btn[disabled] {
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
    @media (max-width: 1024px) {
      .form-grid {
        grid-template-columns: 1fr;
      }

      .price-summary-card {
        order: -1;
      }
    }

    @media (max-width: 768px) {
      .hero-title {
        font-size: 2rem;
      }

      .date-time-fields {
        grid-template-columns: 1fr 1fr;
      }

      .trailer-summary {
        flex-direction: column;
        align-items: center;
        text-align: center;
      }

      .trailer-image {
        width: 200px;
        height: 130px;
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
      
      .date-time-fields {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class RentTrailerComponent implements OnInit {
  trailer: Trailer | null = null;
  isLoading = true;
  isSubmitting = false;
  rentalForm: FormGroup;
  today = new Date();
  
  timeSlots = [
    '06:00', '06:30', '07:00', '07:30', '08:00', '08:30', '09:00', '09:30',
    '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
    '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30'
  ];
  
  hourOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private trailerService: TrailerService,
    private rentalService: RentalService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {
    this.rentalForm = this.fb.group({
      rentalType: ['daily', Validators.required],
      startDate: [null, Validators.required],
      startTime: ['09:00', Validators.required],
      endDate: [null, Validators.required],
      endTime: ['18:00', Validators.required],
      duration: [4],
      notes: ['']
    });

    // Watch for rental type changes
    this.rentalForm.get('rentalType')?.valueChanges.subscribe(value => {
      this.updateValidators();
      this.calculatePrice();
    });

    // Watch for date/time changes
    this.rentalForm.valueChanges.subscribe(() => {
      this.calculatePrice();
    });
  }

  ngOnInit(): void {
    // Check if user is authenticated
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login'], { 
        queryParams: { returnUrl: this.router.url } 
      });
      return;
    }

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadTrailer(parseInt(id, 10));
    } else {
      this.isLoading = false;
    }
  }

  get isHourlyRental(): boolean {
    return this.rentalForm.get('rentalType')?.value === 'hourly';
  }

  get rentalDuration(): number {
    if (this.isHourlyRental) {
      return this.rentalForm.get('duration')?.value || 0;
    } else {
      const startDate = this.rentalForm.get('startDate')?.value;
      const endDate = this.rentalForm.get('endDate')?.value;
      if (startDate && endDate) {
        const timeDiff = endDate.getTime() - startDate.getTime();
        return Math.ceil(timeDiff / (1000 * 3600 * 24));
      }
    }
    return 0;
  }

  get totalPrice(): number {
    if (!this.trailer || this.rentalDuration <= 0) return 0;
    
    if (this.isHourlyRental) {
      return (this.trailer.pricePerHour || 0) * this.rentalDuration;
    } else {
      return this.trailer.pricePerDay * this.rentalDuration;
    }
  }

  updateValidators(): void {
    const duration = this.rentalForm.get('duration');

    if (this.isHourlyRental) {
      duration?.setValidators([Validators.required, Validators.min(1)]);
    } else {
      duration?.clearValidators();
    }

    duration?.updateValueAndValidity();
  }

  calculatePrice(): void {
    // Price calculation is handled by getters
    // This method can be extended for more complex calculations
  }

  loadTrailer(id: number): void {
    this.trailerService.getById(id).subscribe({
      next: (trailer) => {
        this.trailer = trailer;
        this.isLoading = false;
        
        // If trailer doesn't support hourly rental, default to daily
        if (!trailer.pricePerHour) {
          this.rentalForm.patchValue({ rentalType: 'daily' });
        }
      },
      error: (error) => {
        console.error('Error loading trailer:', error);
        this.isLoading = false;
      }
    });
  }

  submitRental(): void {
    if (!this.rentalForm.valid || !this.trailer) return;

    this.isSubmitting = true;
    const formValue = this.rentalForm.value;
    
    let startDate = new Date(formValue.startDate);
    let endDate = new Date(formValue.endDate);

    // Always set specific times for both daily and hourly rentals
    const [startHour, startMinute] = formValue.startTime.split(':');
    startDate.setHours(parseInt(startHour), parseInt(startMinute), 0, 0);

    if (this.isHourlyRental) {
      // For hourly rentals, calculate end time based on duration
      endDate = new Date(startDate);
      endDate.setHours(endDate.getHours() + formValue.duration);
    } else {
      // For daily rentals, set the specific return time on the end date
      const [endHour, endMinute] = formValue.endTime.split(':');
      endDate.setHours(parseInt(endHour), parseInt(endMinute), 0, 0);
    }

    const rentalRequest: CreateRentalRequest = {
      trailerId: this.trailer.id,
      startDate,
      endDate,
      isHourlyRental: this.isHourlyRental,
      notes: formValue.notes || undefined
    };

    this.rentalService.create(rentalRequest).subscribe({
      next: (rental) => {
        this.snackBar.open('Rental booked successfully!', 'Close', {
          duration: 5000,
          panelClass: ['success-snackbar']
        });
        this.router.navigate(['/my-rentals']);
      },
      error: (error) => {
        console.error('Error creating rental:', error);
        this.snackBar.open('Failed to book rental. Please try again.', 'Close', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
        this.isSubmitting = false;
      }
    });
  }

  getPrimaryImage(trailer: Trailer): string {
    const primaryImage = trailer.images?.find(img => img.isPrimary);
    return primaryImage?.imageUrl || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQwIiBoZWlnaHQ9IjE2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==';
  }

  goBack(): void {
    this.router.navigate(['/trailers', this.trailer?.id || '']);
  }
}
