import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Trailer, CreateTrailerRequest } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class TrailerService {
  private readonly API_URL = 'http://localhost:5000/api/trailers';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Trailer[]> {
    return this.http.get<Trailer[]>(this.API_URL);
  }

  getById(id: number): Observable<Trailer> {
    return this.http.get<Trailer>(`${this.API_URL}/${id}`);
  }

  getAvailable(): Observable<Trailer[]> {
    return this.http.get<Trailer[]>(`${this.API_URL}/available`);
  }

  getAvailableForDates(startDate: Date, endDate: Date): Observable<Trailer[]> {
    const params = new HttpParams()
      .set('startDate', startDate.toISOString())
      .set('endDate', endDate.toISOString());
    
    return this.http.get<Trailer[]>(`${this.API_URL}/available-for-dates`, { params });
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
