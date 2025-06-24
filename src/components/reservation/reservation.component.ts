import { Component } from '@angular/core';
import { NavbarComponent } from "../navbar/navbar.component";
import { FormsModule } from '@angular/forms';
import { CommonModule} from '@angular/common';
import { ReservationService } from '../../service/reservation.service';
import { ReservationServices, ServiceData } from '../../models/reservations-services';
import { JwtDecoderService } from '../../service/jwt-decoder.service';
import { first } from 'rxjs/operators'; // Fontos: Importáld a 'first' operátort

@Component({
  selector: 'app-reservation',
  standalone:true,
  imports: [NavbarComponent, FormsModule, CommonModule],
  templateUrl: './reservation.component.html',
  styleUrl: './reservation.component.css'
})
export class ReservationComponent {
  services:ReservationServices[] = [];
  serviceId:number = 1;
  date = new Date().toISOString().slice(0, 10);
  availableTimes: string[] = [];
  selectedTime = '';
  clientName:string | null = '';
  serviceData:ServiceData[] = [] 
  hasExistingAppointment = false;

  constructor(private reservationService: ReservationService, private jwtDecoder: JwtDecoderService) {
    
  }

  ngOnInit() {
    this.clientName = this.jwtDecoder.getUsernameFromToken();

    this.reservationService.getServiceData().subscribe({
      next: (data) => {
        this.serviceData = data;
        this.loadAvailability();
      },
      error: (err) => {
        console.error('Hiba történt az adatok lekérésekor:', err);
      }
    });

    if (this.clientName) {
      this.checkUserAppointments(); 
    } else {
      console.log('Nincs felhasználónév a tokenben vagy nincs token.');
    }
  }

  checkUserAppointments() {
    if (!this.clientName) {
      this.hasExistingAppointment = false;
      return;
    }

    this.reservationService.getUserAppointments(this.clientName).subscribe({
      next: (appointments) => {
        this.hasExistingAppointment = appointments.length > 0;
      },
      error: (err) => {
        console.error('Hiba a foglalások lekérésekor:', err);
        this.hasExistingAppointment = false; 
      }
    });
  }

  loadAvailability() {
    this.reservationService.getAvailability(this.serviceId, this.date).subscribe({
      next: (times) => (this.availableTimes = times),
      error: (err) => alert('Hiba az elérhetőségnél: ' + (err.message || 'Ismeretlen hiba')),
    });
  }

  bookAppointment() {
    if (!this.selectedTime || !this.serviceId) {
      alert('Kérlek válassz időpontot és szolgáltatást!');
      return;
    }

    if (!this.clientName) {
      alert('Nem vagy bejelentkezve, vagy a felhasználónév nem elérhető.');
      return;
    }

    this.reservationService.getUserAppointments(this.clientName).pipe(
      first() 
    ).subscribe({
      next: (appointments) => {
        if (appointments.length > 0) {
          alert('Csak egy foglalásod lehet egyszerre!');
          this.hasExistingAppointment = true; 
          return;
        }
        this.reservationService
          .createAppointment({
            service_id: this.serviceId,
            client_name: this.clientName ?? '',
            date: this.date,
            start_time: this.selectedTime + ':00',
          })
          .subscribe({
            next: () => {
              alert('Foglalás sikeres!');
              this.hasExistingAppointment = true;
              this.loadAvailability();
              this.selectedTime = '';
            },
            error: (err) => alert('Foglalási hiba: ' + (err.error?.message || 'Ismeretlen hiba')),
          });
      },
      error: (err) => {
        console.error('Hiba a foglalások ellenőrzésekor a foglalás előtt:', err);
        alert('Hiba történt a foglalások ellenőrzésekor. Kérlek próbáld újra!');
      }
    });
  }
}