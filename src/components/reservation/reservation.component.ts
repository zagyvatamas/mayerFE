import { Component } from '@angular/core';
import { NavbarComponent } from "../navbar/navbar.component";
import { FormsModule } from '@angular/forms';
import { CommonModule} from '@angular/common';
import { ReservationService } from '../../service/reservation.service';
import { ReservationServices, ServiceData } from '../../models/reservations-services';
import { JwtDecoderService } from '../../service/jwt-decoder.service';
import { first } from 'rxjs/operators'; 
import { EmailService } from '../../service/email.service';
import { Profile } from '../../models/profile';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-reservation',
  standalone:true,
  imports: [NavbarComponent, FormsModule, CommonModule],
  templateUrl: './reservation.component.html',
  styleUrl: './reservation.component.css'
})
export class ReservationComponent {
  to = '';
  subject = 'Tigo masszázs foglalás';
  text = '';
  profile: Profile | null = null;
  services:ReservationServices[] = [];
  serviceId:number = 1;
  date = new Date().toISOString().slice(0, 10);
  availableTimes: string[] = [];
  selectedTime = '';
  clientName:string | null = '';
  serviceData:ServiceData[] = [] 
  hasExistingAppointment = false;

  constructor(private reservationService: ReservationService, private jwtDecoder: JwtDecoderService, private emailService: EmailService, private authService: AuthService) {}

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

    this.authService.getProfile().subscribe({
      next: (data) => {
        this.profile = data;
        this.to = data.email;
        console.log('Profil betöltve:', data);
      },
      error: (err) => {

      }
    });
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
    const selectedService = this.serviceData.find(data => data.id === this.serviceId);
    const durationTime = selectedService ? selectedService.duration_minutes : 0;
    
    const [hour, minute] = this.selectedTime.split(':').map(Number);
    const startInMinutes = hour * 60 + minute;
    const endInMinutes = startInMinutes + durationTime;

    const closingTimeInMinutes = 19 * 60; 

    if (endInMinutes > closingTimeInMinutes) {
      alert("Ez a szolgáltatás túl hosszú ehhez az időponthoz, mert átlépnéd a zárási időt.");
      return;
    }
    

    if (!this.selectedTime || !this.serviceId) {
      alert('Kérlek válassz időpontot és szolgáltatást!');
      return;
    }

    if (!this.clientName) {
      alert('Nem vagy bejelentkezve, vagy a felhasználónév nem elérhető.');
      return;
    }

    const reservedTime = this.selectedTime;

    this.reservationService.getUserAppointments(this.clientName).pipe(
      first() 
    ).subscribe({
      next: (appointments) => {
        if (appointments.length > 0) {
          alert('Csak egy foglalási kérelmed lehet egyszerre!');
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
              alert('Köszönjük a foglalási kérelmét! További információkért nézze az emailjét!');
              this.hasExistingAppointment = true;
              this.loadAvailability();
              this.selectedTime = '';
              this.onSend(reservedTime);
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

  onSend(time: string) {
    const recipientEmail = this.profile?.email;
    const clientName = this.profile?.username || this.clientName || 'Kedves Vendég';
    const selectedService = this.serviceData.find(data => data.id === this.serviceId)?.name || 'választott szolgáltatás';

    if (!recipientEmail) {
      alert('Nem található email cím a profilban.');
      return;
    }

    this.subject = `Masszázs foglalás megerősítése - ${clientName}`;

    this.text = `
      <html>
        <body style="font-family: Arial, sans-serif; color: #333;">
          <h2 style="color: #4CAF50;">Masszázs időpont visszajelzés</h2>
          <p>Kedves <strong>${clientName}</strong>,</p>
          <p>Az időpontfoglalás <strong>sikeres</strong> volt!</p>
          <p>Kérelme jóváhagyásra vár, köszönjük türelmét!</p>
          <br></br>
          <p>Kérem erre az üzenetre ne válaszoljon!</p>
          <p>Üdvözlettel,<br><strong>Tigo Masszázs</strong></p>
        </body>
      </html>
    `;

    this.emailService.sendEmail(recipientEmail, this.subject, this.text)
      .subscribe({
        next: () => {
          console.log('Email elküldve:', recipientEmail);
        },
        error: (err) => {
          alert('Hiba történt az email küldésekor: ' + err.error?.error);
        },
      });
  }
}