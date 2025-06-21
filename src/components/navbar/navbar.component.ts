import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../service/auth.service';
import { NavbarData } from '../../models/navbar';

@Component({
  selector: 'app-navbar',
  standalone:true,
  imports: [RouterLink, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  navbars:NavbarData[] = []

  constructor (private authService: AuthService) {}

  ngOnInit() {
  }

  isAuthenticated() {
    return this.authService.isAuthenticated()
  }
}
