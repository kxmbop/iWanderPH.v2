import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PlaceService } from '../../services/place.service';

@Component({
  selector: 'app-place-details',
  templateUrl: './place-details.component.html',
  styleUrls: ['./place-details.component.scss']
})
export class PlaceDetailsComponent implements OnInit {
  place: any = {};
  placeImages: any[] = [];
  mainImage: string = ''; // Store the original main image separately
  selectedImage: string = ''; // The currently displayed image
  placeId!: number; // Define the placeId property

  constructor(private route: ActivatedRoute, private placeService: PlaceService) { }

  ngOnInit(): void {
    const placeIdParam = this.route.snapshot.paramMap.get('id');
    if (placeIdParam) {
      this.placeId = parseInt(placeIdParam, 10); // Set placeId from route
      this.loadPlaceDetails(this.placeId);
    }
  }

  loadPlaceDetails(placeId: number): void {
    this.placeService.getPlaceById(placeId).subscribe(data => {
      this.place = data.place;
      this.placeImages = data.images;
      this.mainImage = this.place.main_image || ''; // Store the original main image
      this.selectedImage = this.mainImage; // Initially display the main image
      console.log(this.placeImages);  // Check the images being received
    });
  }

  changeMainImage(image: string): void {
    this.selectedImage = image; // Change the displayed image
  }

  resetToMainImage(): void {
    this.selectedImage = this.mainImage; // Reset to the main image
  }
}
