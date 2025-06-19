import { Component } from '@angular/core';
import { LandingServices } from '../../interfaces/landing-services';
import { LandingService } from '../../service/landing.service';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from "../navbar/navbar.component";

@Component({
  selector: 'app-landing-page',
  standalone:true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.css'
})
export class LandingPageComponent {
  services:LandingServices[] = []

  constructor(private landingService: LandingService) {}

  ngOnInit() {
    this.landingService.serviceData().subscribe(
      data => {
        this.services = data;
      }
    )
  }
}
