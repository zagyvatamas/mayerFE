import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-prices',
  standalone:true,
  imports: [NavbarComponent],
  templateUrl: './prices.component.html',
  styleUrl: './prices.component.css'
})
export class PricesComponent {
  image:string = "http://localhost:3000/uploads/arak.jpg" 
}
