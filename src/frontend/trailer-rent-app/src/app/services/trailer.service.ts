import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Trailer, CreateTrailerRequest } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class TrailerService {
  private readonly API_URL = '/api/trailers';

  constructor(private http: HttpClient) {
    console.log('TrailerService initialized with API_URL:', this.API_URL);
    console.log('Current window.location:', window.location.href);
    
    // Test backend connectivity
    this.testBackendHealth();
  }

  private testBackendHealth(): void {
    const healthUrl = `${this.API_URL}/health`;
    console.log('Testing backend health at:', healthUrl);
    
    this.http.get(healthUrl, { responseType: 'text' }).subscribe({
      next: (response) => {
        console.log('✅ Backend health check successful:', response);
      },
      error: (error) => {
        console.error('❌ Backend health check failed:', error);
        console.log('Error details:', {
          status: error.status,
          statusText: error.statusText,
          url: error.url
        });
      }
    });
  }

  getAll(): Observable<Trailer[]> {
    console.log('Making API call to:', this.API_URL);
    return this.http.get<Trailer[]>(this.API_URL);
  }

  getById(id: number): Observable<Trailer> {
    const url = `${this.API_URL}/${id}`;
    console.log('Making API call to:', url);
    return this.http.get<Trailer>(url);
  }

  getAvailable(): Observable<Trailer[]> {
    const url = `${this.API_URL}/available`;
    console.log('Making API call to:', url);
    return this.http.get<Trailer[]>(url);
  }

  getAvailableForDates(startDate: Date, endDate: Date): Observable<Trailer[]> {
    // Format dates as YYYY-MM-DD to avoid URL encoding issues
    const startDateStr = startDate.toISOString().split('T')[0];
    const endDateStr = endDate.toISOString().split('T')[0];
    
    const params = new HttpParams()
      .set('startDate', startDateStr)
      .set('endDate', endDateStr);
    
    console.log('Calling API endpoint:', `${this.API_URL}/availabledates`);
    console.log('With params:', params.toString());
    
    return this.http.get<Trailer[]>(`${this.API_URL}/availabledates`, { params });
  }

  create(trailer: CreateTrailerRequest): Observable<Trailer> {
    return this.http.post<Trailer>(this.API_URL, trailer);
  }

  update(id: number, trailer: CreateTrailerRequest): Observable<Trailer> {
    return this.http.put<Trailer>(`${this.API_URL}/${id}`, trailer);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }
}
