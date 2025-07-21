import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { MatRadioModule } from '@angular/material/radio';

@Component({
  selector: 'app-test-rent-form',
  standalone: true,
  imports: [
    CommonModule,
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
    MatDividerModule,
    MatRadioModule
  ],
  template: `
    <div class="test-container">
      <div class="hero-section">
        <div class="hero-content">
          <h1 class="hero-title">Test: Time Selection for Trailer Rental</h1>
          <p class="hero-subtitle">This demonstrates the new pickup and return time selection feature</p>
        </div>
      </div>

      <div class="main-content">
        <form [formGroup]="rentalForm">
          <div class="form-grid">
            <!-- Rental Form -->
            <mat-card class="rental-form-card" appearance="outlined">
              <mat-card-header>
                <mat-card-title>
                  <mat-icon>event</mat-icon>
                  Rental Information with Time Selection
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
                          <span class="option-price">500 SEK/day</span>
                        </div>
                        <p class="option-description">Perfect for multi-day projects and extended use</p>
                      </div>
                    </mat-radio-button>
                    
                    <mat-radio-button value="hourly">
                      <div class="radio-option">
                        <div class="option-header">
                          <span class="option-title">Hourly Rental</span>
                          <span class="option-price">75 SEK/hour</span>
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

                    <!-- Pickup Time -->
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
                    <span class="price-value">{{ isHourlyRental ? 75 : 500 }} SEK</span>
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
                    <span class="price-value total-price">{{ totalPrice }} SEK</span>
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
                        class="book-btn"
                        [disabled]="!rentalForm.valid || totalPrice === 0">
                  <mat-icon>check</mat-icon>
                  Book Rental (Test)
                </button>
              </mat-card-actions>
            </mat-card>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .test-container {
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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

    /* Form Grid */
    .form-grid {
      display: grid;
      grid-template-columns: 1fr 400px;
      gap: 24px;
    }

    /* Cards */
    .rental-form-card,
    .price-summary-card {
      border-radius: 16px !important;
      box-shadow: 0 4px 20px rgba(0,0,0,0.08) !important;
      background: white !important;
    }

    .rental-form-card mat-card-title,
    .price-summary-card mat-card-title {
      display: flex;
      align-items: center;
      gap: 12px;
      color: #333;
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
export class TestRentFormComponent {
  rentalForm: FormGroup;
  today = new Date();
  
  timeSlots = [
    '06:00', '06:30', '07:00', '07:30', '08:00', '08:30', '09:00', '09:30',
    '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
    '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30'
  ];
  
  hourOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  constructor(private fb: FormBuilder) {
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
    });
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
    if (this.rentalDuration <= 0) return 0;
    
    if (this.isHourlyRental) {
      return 75 * this.rentalDuration;
    } else {
      return 500 * this.rentalDuration;
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
}