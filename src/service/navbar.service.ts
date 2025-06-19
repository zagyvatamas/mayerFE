import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { NavbarData } from '../interfaces/navbar';

@Injectable({
  providedIn: 'root'
})
export class NavbarService {

  private apiUrl = "http://localhost:3000/api/navbar"

  constructor(private http: HttpClient) { }

  navbarData(): Observable<NavbarData[]> {
    return this.http.get<any[]>(`${this.apiUrl}/navbarData`).pipe(
      map(dataArray =>
        dataArray.map(item => new NavbarData(item.routes,item.pathName))
      )
    );
  }
}
