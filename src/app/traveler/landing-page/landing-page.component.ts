import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PlaceService } from '../services/place.service';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-landing-page',
    templateUrl: './landing-page.component.html',
    styleUrls: ['./landing-page.component.scss'],
    standalone: false
})
export class LandingPageComponent {
  places: any[] = [];
  randomBackgroundImage: string = '';

  constructor(private router: Router, private placeService: PlaceService) {}

  ngOnInit(): void {
    this.loadPlaces();
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  loadPlaces(): void {
    this.placeService.getPlaces().subscribe((data) => {
      this.places = data;
      console.log('places: ', this.places);

      // Set random background after places are loaded
      this.setRandomBackgroundImage();
    });
  }

  setRandomBackgroundImage() {
    if (this.places.length > 0) {
      const randomIndex = Math.floor(Math.random() * this.places.length);
      this.randomBackgroundImage = this.places[randomIndex].main_image;
    }
  }
}
