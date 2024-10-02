import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router'; // Import ActivatedRoute
import { PlaceService } from '../services/place.service';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.component.html',
  styleUrls: ['./discover.component.scss']
})
export class DiscoverComponent implements OnInit {
  places: any[] = [];
  searchQuery: string = '';
  selectedIslandGroup: string = 'All'; // Default filter

  constructor(private placeService: PlaceService, private router: Router, private route: ActivatedRoute) { } // Inject ActivatedRoute

  ngOnInit(): void {
    this.loadPlaces();
  }

  loadPlaces(): void {
    this.placeService.getPlaces(this.searchQuery, this.selectedIslandGroup).subscribe(data => {
      this.places = data;
    });
  }

  onSearchInput(event: any): void {
    this.searchQuery = event.target.value;
    this.loadPlaces();
  }

  filterByIslandGroup(group: string): void {
    this.selectedIslandGroup = group;
    this.loadPlaces();
  }

  // Navigate to place-details with the place ID
  goToPlaceDetails(placeId: number): void {
    console.log("Navigating to place with ID:", placeId);  // Check placeId value
    this.router.navigate(['place-details', placeId], { relativeTo: this.route }).then(
        success => console.log('Navigation successful!'),
        error => console.error('Navigation error:', error)
    );
  }
}
