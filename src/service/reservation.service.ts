import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map,Observable } from 'rxjs';
import { ReservationServices, ServiceData } from '../models/reservations-services';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {

  private apiUrl = "http://localhost:3000/api/reservation"

  constructor(private http: HttpClient) {}

  getAvailability(serviceId: number, date: string): Observable<string[]> {
    const params = new HttpParams()
      .set('serviceId', serviceId.toString())
      .set('date', date);
    return this.http.get<string[]>(`${this.apiUrl}/availability`, { params });
  }

  createAppointment(data: {service_id: number, client_name: string, date: string, start_time: string}): Observable<any> {
    return this.http.post(`${this.apiUrl}/appointments`, data);
  }

  getServiceData(): Observable<ServiceData[]> {
    return this.http.get<any[]>(`${this.apiUrl}/services`).pipe(
      map(dataArray => 
        dataArray.map(item => new ServiceData(item.id,item.name,item.description,item.duration_minutes,item.price))
      )
    );
  }

  getUserAppointments(clientName: string): Observable<any[]> {
    const params = new HttpParams().set('clientName', clientName);
    return this.http.get<any[]>(`${this.apiUrl}/appointments`, { params });
  }

  getAllApointments():Observable<ReservationServices[]> {
    return this.http.get<any[]>(`${this.apiUrl}/appointments/pending`)
  }

  deleteAppointment(id: number | undefined): Observable<any[]> {
    return this.http.delete<any[]>(`${this.apiUrl}/appointments/${id}`);
  }

  updateAppointmentStatus(id: number, status: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/appointments/${id}/status`, { status });
  }

}
