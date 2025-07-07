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
  isAdmin:boolean = false

  constructor (private authService: AuthService) {}

  ngOnInit() {
    this.authService.isAdmin$.subscribe(isAdmin => {
      this.isAdmin = isAdmin;
      if (!isAdmin) {
        console.log('Nem admin.');
      }
    });
  }

  isAuthenticated() {
    return this.authService.isAuthenticated()
  }

}
