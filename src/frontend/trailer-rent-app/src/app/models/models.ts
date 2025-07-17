// User and Authentication models
export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  createdAt: Date;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// Trailer models
export interface Trailer {
  id: number;
  name: string;
  description?: string;
  type: TrailerType;
  pricePerDay: number;
  maxWeight: number;
  licensePlate?: string;
  isAvailable: boolean;
  images: TrailerImage[];
}

export interface CreateTrailerRequest {
  name: string;
  description?: string;
  type: TrailerType;
  pricePerDay: number;
  maxWeight: number;
  licensePlate?: string;
}

export interface TrailerImage {
  id: number;
  imageUrl: string;
  description?: string;
  isPrimary: boolean;
}

export enum TrailerType {
  Cargo = 'Cargo',
  Utility = 'Utility',
  Boat = 'Boat',
  Car = 'Car',
  Equipment = 'Equipment',
  Livestock = 'Livestock',
  Refrigerated = 'Refrigerated'
}

// Rental models
export interface Rental {
  id: number;
  userId: number;
  user: User;
  trailerId: number;
  trailer: Trailer;
  startDate: Date;
  endDate: Date;
  totalPrice: number;
  status: RentalStatus;
  notes?: string;
  createdAt: Date;
}

export interface CreateRentalRequest {
  trailerId: number;
  startDate: Date;
  endDate: Date;
  notes?: string;
}

export interface UpdateRentalStatusRequest {
  status: RentalStatus;
}

export enum RentalStatus {
  Pending = 'Pending',
  Confirmed = 'Confirmed',
  Active = 'Active',
  Completed = 'Completed',
  Cancelled = 'Cancelled'
}

// API Response wrapper
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}
