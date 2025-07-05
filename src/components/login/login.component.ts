import { Component } from '@angular/core';

import { CommonModule } from '@angular/common';
import { AuthService } from '../../service/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from "../navbar/navbar.component";

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email = '';
  password = '';

  constructor (private authService: AuthService, private router: Router) {}

  onLogin() {
    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {

        alert("Sikeres bejelentkezés!")
        this.authService.startTokenTimer();
        this.router.navigate(['landing']); 
      },
      error: (error) => {
        alert("Nem sikerült a bejelentkezés!")
      }
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['login']); 
  }

  navigateToRegister() {
    this.router.navigate(['register'])
  }
}
