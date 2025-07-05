import { Component, OnInit } from '@angular/core';
import { Profile } from '../../models/profile';
import { AuthService } from '../../service/auth.service';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  standalone:true,
  imports: [CommonModule, NavbarComponent, FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  profile: Profile | null = null;
  error: string | null = null;
  editMode = false;

  editData = {
    username: '',
    email: '',
    password: ''
  };

  constructor(private authService: AuthService, private router:Router ) {}

  ngOnInit(): void {
    this.authService.getProfile().subscribe({
      next: (data) => {
        this.profile = data;
        console.log(this.profile);
        
      },
      error: (err) => {
        this.error = 'Hiba a profil lekérésekor.';
        this.router.navigate(['login'])
        localStorage.removeItem('token')
      }
    });
  }

  modifyProfile(): void {
    this.editMode = true;

    if (this.profile) {
      this.editData = {
        username: this.profile.username || '', 
        email: this.profile.email || '',     
        password: ''
      };
    }
  }

  cancelEdit(): void {
    this.editMode = false;
    this.editData.password = '';
  }

  onUpdateProfile(): void {
    const dataToUpdate: any = {};

    if (this.editData.username !== this.profile?.username) {
      dataToUpdate.username = this.editData.username;
    }
    if (this.editData.email !== this.profile?.email) {
      dataToUpdate.email = this.editData.email;
    }
    if (this.editData.password) {
      dataToUpdate.password = this.editData.password;
    }

    if (Object.keys(dataToUpdate).length === 0) {
      alert('Nincs változtatás.');
      return;
    }

    this.authService.updateProfile(dataToUpdate).subscribe({
      next: () => {
        alert('Sikeres frissítés! Újra bejelentkezés után frissülnek az adatok!');
        this.editMode = false;
        this.editData.password = '';
        this.ngOnInit();
      },
      error: (err) => {
        console.error(err);
        alert('Hiba a frissítés során.');
      }
    });
  }

  logout() {
    return this.authService.logout()
  }
}
