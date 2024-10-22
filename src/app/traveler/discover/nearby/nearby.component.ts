import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PlaceService } from '../../services/place.service';

@Component({
  selector: 'app-nearby',
  templateUrl: './nearby.component.html',
  styleUrls: ['./nearby.component.scss']
})
export class NearbyComponent implements OnInit {
  placeId!: number;  // Place ID retrieved from route
  nearbyMerchants: any[] = []; // Array to hold nearby merchants

  constructor(private route: ActivatedRoute, private placeService: PlaceService) { }

  ngOnInit(): void {
    // Get placeId from the route parameter
    const placeIdParam = this.route.snapshot.paramMap.get('placeId');
    console.log(`Place ID param from route: ${placeIdParam}`);

    if (placeIdParam) {
      this.placeId = +placeIdParam;  // Convert to number
      console.log(`Navigating to nearby merchants for Place ID: ${this.placeId}`);
      this.loadNearbyMerchants();
    } else {
      console.error("Place ID is missing in the route.");
    }
  }

  loadNearbyMerchants(): void {
    console.log(`Loading nearby merchants for Place ID: ${this.placeId}`);
    this.placeService.getNearbyMerchants(this.placeId).subscribe(
      data => {
        console.log("Data retrieved from the API:", data);

        if (data.error) {
          console.error("Error from API:", data.error);
          alert(`Error: ${data.error}`);
          return;
        }

        if (data.message) {
          console.log("Message from API:", data.message);
        }

        this.nearbyMerchants = data.merchants.map((merchant: any) => {
          if (merchant.merchant_img) {
            // Add the Base64 prefix to the image data
            merchant.merchant_img = 'data:image/jpeg;base64,' + merchant.merchant_img;
          }
          return merchant;
        });

        console.log("Nearby merchants loaded:", this.nearbyMerchants);
      },
      error => {
        console.error("Error loading nearby merchants:", error);
        alert('Failed to load nearby merchants. Please try again later.');
      }
    );
  }
}
