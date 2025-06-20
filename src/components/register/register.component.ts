import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../navbar/navbar.component';
import { RegisterData } from '../../interfaces/register';

@Component({
  selector: 'app-register',
  imports: [CommonModule,FormsModule, NavbarComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  // username = "";
  // email = "";
  // password = "";
  // confirmPassword = "";

  registerData:RegisterData = {
    username:"",
    email:"",
    password:"",
    confirmPassword:"",
  }

  constructor (private authService: AuthService, private router: Router) {}

  onRegister() {
    this.authService.register(this.registerData.username,this.registerData.email,this.registerData.password).subscribe({
      next: (response) => {
        alert("Sikeres regisztráció!")
        this.router.navigate(['login'])
      }
    })
  }

}
