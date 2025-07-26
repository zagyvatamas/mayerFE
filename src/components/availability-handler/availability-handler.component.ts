import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NavbarComponent } from "../navbar/navbar.component";
import { Profile } from '../../models/profile';
import { AuthService } from '../../service/auth.service';
import { Router } from '@angular/router';
import { ReservationVisibilityService } from '../../service/reservation-visibility.service';
import { BlockedTimesService } from '../../service/blockedtimes.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-availability-handler',
  standalone:true,
  imports: [CommonModule, NavbarComponent, FormsModule],
  templateUrl: './availability-handler.component.html',
  styleUrl: './availability-handler.component.css'
})
export class AvailabilityHandlerComponent {
  profile:Profile[] = []
  error: string | null = null;
  choice:boolean = false;
  isVisible: boolean = true;
  date: string = '';
  time: string = '';

  constructor (private authService: AuthService, private router : Router, private visibilityService: ReservationVisibilityService,private blockedService: BlockedTimesService) {}

  ngOnInit() {
    this.visibilityService.visible$.subscribe(v => this.isVisible = v);
    this.authService.getAllProfile().subscribe({
      next: (data) => {
        this.profile = data
      },
      error: (err) => {
        this.error = 'Hiba a profil lekérésekor.';
        this.router.navigate(['login']);
        localStorage.removeItem('token');
      }
    })
  }

  blockTime() {
    if (this.date && this.time) {
      this.blockedService.addBlockedTime(this.date, this.time).subscribe({
        next: () => {
          alert(`Sikeresen letiltva: ${this.date} - ${this.time}`);
          this.date = '';
          this.time = '';
        },
        error: (err) => {
          alert(err.error?.message || 'Hiba történt a tiltás során.');
        }
      });
    } else {
      alert('Kérlek adj meg mind dátumot, mind időpontot!');
    }
  }

  onDelete(id: number) {
    if (confirm('Biztosan törölni szeretnéd ezt a felhasználót?')) {
      this.authService.deleteProfile(id).subscribe({
        next: () => {
          alert("Felhasználó sikeresen törölve!");
          this.profile = this.profile.filter(user => user.id !== id);
        },
        error: (err) => {
         console.error('Hiba a törlés során:', err);
        }
      });
    }
  }

  toggleVisibility() {
    this.visibilityService.toggleVisibility();
  }
}
