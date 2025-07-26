import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BlockedTime } from '../models/BlockedTime';

@Injectable({ providedIn: 'root' })
export class BlockedTimesService {
  private apiUrl = 'http://localhost:3000/api/blockedTimes';

  constructor(private http: HttpClient) {}

  getBlockedTimes(): Observable<BlockedTime[]> {
    return this.http.get<BlockedTime[]>(`${this.apiUrl}/allData`);
  }

  addBlockedTime(date: string, time: string): Observable<any> {
    return this.http.post(this.apiUrl, { date, time });
  }
}