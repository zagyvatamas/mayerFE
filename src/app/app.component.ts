import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from '../service/auth.service';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'webshop';

  constructor (private authService: AuthService) {}

  ngOnInit() {
    this.authService.initializeUserFromToken();
  }
}
