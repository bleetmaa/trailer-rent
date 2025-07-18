import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { TrailerListComponent } from './components/trailer-list/trailer-list.component';
import { TrailerDetailComponent } from './components/trailer-detail/trailer-detail.component';
import { RentTrailerComponent } from './components/rent-trailer/rent-trailer.component';
import { authGuard } from './core/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/trailers', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'trailers', component: TrailerListComponent },
  { path: 'trailers/:id', component: TrailerDetailComponent },
  { path: 'rent/:id', component: RentTrailerComponent, canActivate: [authGuard] },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'my-rentals', component: DashboardComponent, canActivate: [authGuard] }, // Will be replaced with actual component
  { path: '**', redirectTo: '/trailers' }
];
