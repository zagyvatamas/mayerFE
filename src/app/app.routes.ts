import { authGuard } from './../service/auth.guard';
import { Routes } from '@angular/router';
import { LoginComponent } from '../components/login/login.component';
import { RegisterComponent } from '../components/register/register.component';
import { ProfileComponent } from '../components/profile/profile.component';
import { LandingPageComponent } from '../components/landing-page/landing-page.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent},
    { path: 'register', component: RegisterComponent},
    { path: 'profile', component: ProfileComponent },
    { path: '', redirectTo: 'landing', pathMatch: 'full' },
    {path: 'landing', component:LandingPageComponent}
];
