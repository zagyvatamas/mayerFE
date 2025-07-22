import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReservationVisibilityService {
  private visibleSubject = new BehaviorSubject<boolean>(true);
  visible$ = this.visibleSubject.asObservable();

  setVisibility(value: boolean) {
    this.visibleSubject.next(value);
  }

  getVisibility(): boolean {
    return this.visibleSubject.getValue();
  }

  toggleVisibility() {
    this.visibleSubject.next(!this.getVisibility());
  }
}
