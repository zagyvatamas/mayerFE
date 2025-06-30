import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { Prices } from '../../models/price-services';
import { PriceService } from '../../service/price.service';

@Component({
  selector: 'app-prices',
  standalone:true,
  imports: [NavbarComponent, CommonModule],
  templateUrl: './prices.component.html',
  styleUrl: './prices.component.css'
})
export class PricesComponent {
  prices:Prices[] = []

  constructor (private price: PriceService) {}

  ngOnInit(){
    this.price.getPrices()
    .subscribe({
      next:(data) => {
        this.prices = data
        console.log(this.prices);
        
      },
      error: (err) => {
        console.error('Hiba történt a lekérés során:', err);
      }
    })
  }
}
