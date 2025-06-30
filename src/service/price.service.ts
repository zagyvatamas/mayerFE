import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Prices } from '../models/price-services';

@Injectable({
  providedIn: 'root'
})
export class PriceService {

  private apiUrl = 'http://localhost:3000/api/prices'; 

  constructor(private http:HttpClient) { }

  getPrices(): Observable<Prices[]> {
    return this.http.get<Prices[]>(`${this.apiUrl}/priceData`).pipe(
      map(dataArray =>
        dataArray.map(item => new Prices(item.id, item.imageUrl, item.title, item.price, item.description))
      )
    )
  }
}
