import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../navbar/navbar.component';
import { RegisterData } from '../../models/register';
import { JwtDecoderService } from '../../service/jwt-decoder.service';

@Component({
  selector: 'app-register',
  imports: [CommonModule,FormsModule, NavbarComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  registerData:RegisterData = {
    username:"",
    email:"",
    password:"",
    age:0,
    gender:""
  }
  occupiedEmail:string | null = ""

  constructor (private authService: AuthService, private router: Router, private jwtDecoder: JwtDecoderService) {}

  onRegister() {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const usernameRegex = /^[a-zA-Z0-9_ ]{3,20}$/;

  if (
    !this.registerData.username ||
    !this.registerData.email ||
    !this.registerData.password ||
    !this.registerData.gender ||
    !this.registerData.age
  ) {
    return alert("Nem töltötted ki az összes mezőt!");
  }

  if (!emailRegex.test(this.registerData.email)) {
    return alert("Érvénytelen e-mail cím!");
  }

  if (!usernameRegex.test(this.registerData.username)) {
    return alert("Érvénytelen teljes név!")
  }

  
  console.log(this.occupiedEmail);
  

  this.authService.register(
    this.registerData.username,
    this.registerData.email,
    this.registerData.password,
    this.registerData.age,
    this.registerData.gender
  ).subscribe({
    next: (response) => {
      alert("Sikeres regisztráció!");
      this.router.navigate(['login']);
    },
    error: (error) => {
      if (error.status === 409) {
        return alert("Nem sikerült a regisztráció! Már regisztráltak evvel az e-mail címmel!");
      }

      return alert("Nem sikerült a regisztráció! Próbáld újra.");
    }
  });
}

}
