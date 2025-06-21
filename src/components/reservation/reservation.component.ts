import { Component } from '@angular/core';
import { NavbarComponent } from "../navbar/navbar.component";
import { FormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';


@Component({
  selector: 'app-reservation',
  standalone:true,
  imports: [NavbarComponent, FormsModule, CommonModule, DatePipe],
  templateUrl: './reservation.component.html',
  styleUrl: './reservation.component.css',
  providers: [DatePipe]
})
export class ReservationComponent {
  
}
