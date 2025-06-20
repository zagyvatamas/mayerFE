import { Component, OnInit } from '@angular/core';
import { Profile } from '../../interfaces/profile';
import { AuthService } from '../../service/auth.service';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, NavbarComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  profile: Profile | null = null;
  error: string | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.getProfile().subscribe({
      next: (data) => {
        this.profile = data;
      },
      error: (err) => {
        this.error = 'Hiba a profil lekérésekor.';
        console.error(err);
      }
    });
  }

  logout() {
    return this.authService.logout()
  }
}
