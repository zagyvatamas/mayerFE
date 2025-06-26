import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { ReservationServices, ServiceData} from '../../models/reservations-services';
import { ReservationService } from '../../service/reservation.service';
import { EmailService } from '../../service/email.service';
import { Profile } from '../../models/profile';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-reservation-pending',
  standalone:true,
  imports: [NavbarComponent, CommonModule],
  templateUrl: './reservation-pending.component.html',
  styleUrl: './reservation-pending.component.css'
})
export class ReservationPendingComponent {
  to = '';
  subject = 'Tigo masszázs foglalás';
  text = '';
  bookings:ReservationServices[] = [];
  bookingName:ServiceData[] = []
  profile: Profile | null = null;
  selectedBooking: ReservationServices | null = null;

  constructor(private reservationService: ReservationService, private emailService: EmailService, private authService: AuthService) {}

  ngOnInit() {
    this.reservationService.getServiceData().subscribe({
      next: (data) => {
        this.bookingName = data;
      },
      error: (err) => {
        console.error('Hiba történt az adatok lekérésekor:', err);
      }
    });
    this.reservationService.getAllApointments().subscribe({
      next: (data) => {
        this.bookings = data
        console.log(data);
        
      },
      error: (err) => {
        console.error('Hiba történt az adatok lekérésekor:', err);
      }
    });
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

  getBookingNameById(serviceId: number | undefined): string {
    const service = this.bookingName.find(s => s.id === serviceId);
    return service ? service.name : 'Ismeretlen szolgáltatás';
}

  refreshPage() {
    window.location.reload();
  }

  approve(bookingToApprove: ReservationServices) {
    const recipientEmail = this.profile?.email || '';
    const clientName = this.profile?.username || '';
    console.log(clientName, recipientEmail);
    const date = this.selectedBooking?.date ? new Date(this.selectedBooking.date).toLocaleDateString('hu-HU') : '';
    const startTime = this.selectedBooking?.start_time ? new Date(this.selectedBooking.start_time).toLocaleTimeString('hu-HU', { hour: '2-digit', minute: '2-digit' }) : '';
    const serviceName = this.getBookingNameById(this.selectedBooking?.service_id);
    
    this.subject = `Masszázs foglalás megerősítése - ${clientName}`;

    this.text = `
      <html>
        <body style="font-family: Arial, sans-serif; color: #333;">
          <h2 style="color: #4CAF50;">Masszázs időpont visszaigazolása</h2>
          <p>Kedves <strong>${clientName}</strong>,</p>
          <p>Köszönjük, hogy időpontot foglalt nálunk! Örömmel erősítjük meg a következő masszázskezelési kérelmét!:</p>
          <ul>
           <li><strong>Dátum:</strong> ${date}</li>
            <li><strong>Időpont:</strong> ${startTime}</li>
           <li><strong>Szolgáltatás:</strong> ${serviceName}</li>
          </ul>
          <p>Kérjük, érkezzen 5-10 perccel korábban.</p>
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

  reject(bookingToDecline: ReservationServices) {
    const recipientEmail = this.profile?.email || '';
    const clientName = this.profile?.username || '';

    this.subject = `Masszázs foglalás megerősítése - ${clientName}`;

    this.text = `
      <html>
        <body style="font-family: Arial, sans-serif; color: #333;">
          <h2 style="color: #4CAF50;">Masszázs időpont visszaigazolása</h2>
          <p>Kedves <strong>${clientName}</strong>,</p>
          <p>Sajnálattal értesítem, hogy az időpont foglalását el kell utasítanom mert az ön által kiválasztott időpont nem megfelelő nekem.</p>
          <p>Próbálkozzon másik időpontal, megértését köszönöm!</p>
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
          return;
        },
      });

    this.reservationService.deleteAppointment(bookingToDecline.id)

  }
  
}
