import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LandingServices } from '../interfaces/landing-services';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LandingService {

  private apiUrl = 'http://localhost:3000/api/landing'; 

  constructor(private http: HttpClient) { }

  serviceData(): Observable<LandingServices[]> {
    return this.http.get<any[]>(`${this.apiUrl}/landingData`).pipe(
      map(dataArray => 
        dataArray.map(item => new LandingServices(item.imageUrl, item.title, item.text))
      )
    );
  }
}
