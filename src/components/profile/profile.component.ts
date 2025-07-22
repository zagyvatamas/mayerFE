import { Component, OnInit } from '@angular/core';
import { Profile } from '../../models/profile';
import { AuthService } from '../../service/auth.service';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ReservationService } from '../../service/reservation.service';
import { ReservationServices, ServiceData } from '../../models/reservations-services';
import { forkJoin } from 'rxjs'; // Import forkJoin

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
  deletedAppointments:ReservationServices[] = []
  totalDeletedAppointments: number = 0;
  deletedByService:string = "";
  deletedByMonth: { [key: string]: number } = {};
  totalDeletedDuration: number = 0;
  serviceData:ServiceData[] = [];
  favoriteMassage:string = '';

  editData = {
    username: '',
    password: ''
  };

  constructor(private authService: AuthService, private router:Router, private reservationService:ReservationService ) {}

  ngOnInit(): void {
    this.authService.getProfile().subscribe({
      next: (data) => {
        this.profile = data;
        if (this.profile) {
          forkJoin([
            this.reservationService.getDeletedAppointments(),
            this.reservationService.getServiceData()
          ]).subscribe({
            next: ([deletedAppointmentsData, serviceDataData]) => {
              this.deletedAppointments = deletedAppointmentsData;
              this.serviceData = serviceDataData;
              this.calculateStatistics();
            },
            error: (err) => {
              this.error = 'Hiba a foglalások vagy szolgáltatások lekérésekor.';
              console.error(this.error, err);
            }
          });
        }
      },
      error: (err) => {
        this.error = 'Hiba a profil lekérésekor.';
        this.router.navigate(['login']);
        localStorage.removeItem('token');
      }
    });
  }

  calculateStatistics(): void {
    this.totalDeletedAppointments = 0;
    this.deletedByService = "";
    this.deletedByMonth = {};
    this.totalDeletedDuration = 0;
    const serviceCountMap: { [serviceId: number]: number } = {};

    for (const appointment of this.deletedAppointments) {
      if (appointment.duration_minutes && this.profile?.username === appointment.client_name) {
        this.totalDeletedDuration += appointment.duration_minutes;
        this.totalDeletedAppointments++;
      }

      if (appointment.date) {
        const dateObj = new Date(appointment.date);
        const monthKey = `${dateObj.getFullYear()}-${(dateObj.getMonth() + 1).toString().padStart(2, '0')}`;
        if (!this.deletedByMonth[monthKey]) {
          this.deletedByMonth[monthKey] = 0;
        }
        this.deletedByMonth[monthKey]++;
      }

      if (this.profile && appointment.client_email === this.profile.email && appointment.service_id != null) {
        const serviceId = appointment.service_id;
        serviceCountMap[serviceId] = (serviceCountMap[serviceId] || 0) + 1;
      }
    }

    let maxServiceId: number | null = null;
    let maxCount = 0;

    for (const [serviceIdStr, count] of Object.entries(serviceCountMap)) {
      const serviceId = Number(serviceIdStr);
      if (count > maxCount) {
        maxServiceId = serviceId;
        maxCount = count;
      }
    }

    if (maxServiceId !== null) {
      const favoriteService = this.serviceData.find(s => s.id === maxServiceId);
      if (favoriteService) {
        this.favoriteMassage = favoriteService.name;
      } else {
        console.warn(`Service with ID ${maxServiceId} not found in serviceData.`);
        this.favoriteMassage = 'Ismeretlen masszázs';
      }
    } else {
      this.favoriteMassage = 'Nincs kedvenc masszázs (még nem törölt foglalás)';
    }

  }

  modifyProfile(): void {
    this.editMode = true;

    if (this.profile) {
      this.editData = {
        username: this.profile.username || '',
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
    if (this.editData.password) {
      dataToUpdate.password = this.editData.password;
    }

    if (Object.keys(dataToUpdate).length === 0) {
      alert('Nincs változtatás.');
      return;
    }

    this.authService.updateProfile(dataToUpdate).subscribe({
      next: () => {
        alert('Sikeres frissítés! Jelentkezz be újra az adatok frissítéséhez!');
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