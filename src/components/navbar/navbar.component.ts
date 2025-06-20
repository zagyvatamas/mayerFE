import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavbarData } from '../../interfaces/navbar';
import { NavbarService } from '../../service/navbar.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-navbar',
  standalone:true,
  imports: [RouterLink, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  navbars:NavbarData[] = []

  constructor (private navbarService: NavbarService, private authService: AuthService) {}

  ngOnInit() {
    this.navbarService.navbarData().subscribe(
      data =>{
        this.navbars = data;
      }
    ) 
  }

  isAuthenticated() {
    return this.authService.isAuthenticated()
  }
}
