import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PlaceService } from '../../services/place.service';

@Component({
  selector: 'app-nearby',
  templateUrl: './nearby.component.html',
  styleUrls: ['./nearby.component.scss']
})
export class NearbyComponent implements OnInit {
  placeId!: number;  // Place ID to be retrieved from route
  nearbyMerchants: any[] = []; // Array to hold nearby merchants

  constructor(private route: ActivatedRoute, private placeService: PlaceService) { }

  ngOnInit(): void {
    // Get placeId from the route parameter
    const placeIdParam = this.route.snapshot.paramMap.get('placeId'); // Ensure this matches the parameter name used in the route
    console.log(`Place ID param from route: ${placeIdParam}`); // Debug log
  
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
        console.log("Data retrieved from the API:", data); // Log the retrieved data
  
        try {
          const jsonData = JSON.parse(data);
          if (jsonData.error) {
            console.error("Error from API:", jsonData.error);
            alert(`Error: ${jsonData.error}`);
            return;
          }
          
          if (jsonData.message) {
            console.log("Message from API:", jsonData.message); // Log the message if there are no merchants
          }
          
          this.nearbyMerchants = jsonData.merchants || [];      
          console.log("Nearby merchants loaded:", this.nearbyMerchants); // Log the nearby merchants
        } catch (error) {
          console.error("Error parsing JSON:", error);
          alert('Failed to load nearby merchants. Please try again later.');
        }
      },
      error => {
        console.error("Error loading nearby merchants:", error);
        alert('Failed to load nearby merchants. Please try again later.');
      }
    );
  }
}
