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
    const reservedBooking = this.bookings.find(b => b.id === bookingToApprove.id);
    const reservedDate = reservedBooking?.date
      ? new Date(reservedBooking.date).toLocaleDateString('hu-HU')
      : '';
    const startTime = reservedBooking?.start_time
    const serviceName = this.getBookingNameById(reservedBooking?.service_id);
    
    this.subject = `Masszázs foglalás megerősítése - ${clientName}`;

    this.text = `
      <html>
        <body style="font-family: Arial, sans-serif; color: #333;">
          <h2 style="color: #4CAF50;">Masszázs időpont visszaigazolása</h2>
          <p>Kedves <strong>${clientName}</strong>,</p>
          <p>Köszönjük, hogy időpontot foglalt nálunk! Örömmel értesítjük ,hogy elfogadásra került a masszázskezelési kérelme:</p>
          <ul>
           <li><strong>Dátum:</strong> ${reservedDate}</li>
            <li><strong>Időpont:</strong> ${startTime}</li>
           <li><strong>Szolgáltatás:</strong> ${serviceName}</li>
          </ul>
          <p>Kérjük a lefoglalt időpontra pontosan érkezzen.</p>
          <p>Üdvözlettel,<br><strong>Tigo Masszázs</strong></p>
        </body>
      </html>
    `;
    this.emailService.sendEmail(recipientEmail, this.subject, this.text)
      .subscribe({
        next: () => {
          alert('Foglalás elfogadva!');
        },
        error: (err) => {
          alert('Hiba történt az email küldésekor: ' + err.error?.error);
        },
      });

    if (bookingToApprove.id) {
      this.reservationService.updateAppointmentStatus(bookingToApprove.id, 'accepted').subscribe({
        next:() =>{
          bookingToApprove.status = 'accepted'
        },
        error:err => console.error('Hiba a státusz frissítésekor', err)
      })
    }
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
          <p>Próbálkozzon másik időponttal, megértését köszönöm!</p>
          <p>Üdvözlettel,<br><strong>Tigo Masszázs</strong></p>
        </body>
      </html>
    `;

    this.emailService.sendEmail(recipientEmail, this.subject, this.text).subscribe({
      next: () => {
        alert('Foglalás törölve:');
      },
      error: (err) => {
        alert('Hiba történt az email küldésekor: ' + err.error?.error);
      },
    });

    if (bookingToDecline.id) {
      this.reservationService.updateAppointmentStatus(bookingToDecline.id, "rejected").subscribe({
        next: () => {
          bookingToDecline.status = 'rejected'
        },
        error:err => console.error('Hiba a státusz frissítésekor', err)
      })
      
    }
  }
  
}
