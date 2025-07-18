import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Rental, CreateRentalRequest, UpdateRentalStatusRequest } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class RentalService {
  private readonly API_URL = '/api/rentals';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Rental[]> {
    return this.http.get<Rental[]>(this.API_URL);
  }

  getById(id: number): Observable<Rental> {
    return this.http.get<Rental>(`${this.API_URL}/${id}`);
  }

  getMyRentals(): Observable<Rental[]> {
    return this.http.get<Rental[]>(`${this.API_URL}/my-rentals`);
  }

  create(rental: CreateRentalRequest): Observable<Rental> {
    return this.http.post<Rental>(this.API_URL, rental);
  }

  updateStatus(id: number, statusUpdate: UpdateRentalStatusRequest): Observable<Rental> {
    return this.http.patch<Rental>(`${this.API_URL}/${id}/status`, statusUpdate);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }
}
