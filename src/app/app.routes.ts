import { authGuard } from './../service/auth.guard';
import { Routes } from '@angular/router';
import { LoginComponent } from '../components/login/login.component';
import { RegisterComponent } from '../components/register/register.component';
import { ProfileComponent } from '../components/profile/profile.component';
import { LandingPageComponent } from '../components/landing-page/landing-page.component';
import { NavbarComponent } from '../components/navbar/navbar.component';
import { ReservationComponent } from '../components/reservation/reservation.component';
import { PricesComponent } from '../components/prices/prices.component';
import { ReservationPendingComponent } from '../components/reservation-pending/reservation-pending.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent},
    { path: 'register', component: RegisterComponent},
    { path: 'profile', component: ProfileComponent },
    { path: '', redirectTo: 'landing', pathMatch: 'full' },
    {path: 'landing', component:LandingPageComponent},
    {path: 'navbar', component:NavbarComponent},
    {path: 'reservation', component:ReservationComponent},
    {path: 'prices', component:PricesComponent},
    {path: 'reservationPending', component:ReservationPendingComponent}
];
