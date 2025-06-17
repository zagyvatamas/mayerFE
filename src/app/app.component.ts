import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoginComponent } from "../components/login/login.component";
import { ProfileComponent } from "../components/profile/profile.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LoginComponent, ProfileComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'webshop';
}
