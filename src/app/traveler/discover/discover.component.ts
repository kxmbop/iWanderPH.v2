import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PlaceService } from '../services/place.service';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.component.html',
  styleUrls: ['./discover.component.scss']
})
export class DiscoverComponent implements OnInit {
  places: any[] = [];
  merchants: any[] = []; // Add this to store merchants
  filteredMerchants: any[] = [];
  searchQuery: string = '';
  selectedIslandGroup: string = 'All'; // Default filter

  constructor(private placeService: PlaceService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.loadPlaces();
    this.loadMerchants(); // Load merchants when component initializes
  }

  loadPlaces(): void {
    this.placeService.getPlaces(this.searchQuery, this.selectedIslandGroup).subscribe(data => {
      this.places = data;
    });
  }

  loadMerchants(): void {
    this.placeService.getMerchants().subscribe(data => {
      this.merchants = data; // Store the merchants
      this.filteredMerchants = this.merchants; // Initially show all merchants
    });
  }

  filterMerchants(): void {
    if (this.searchQuery) {
      this.filteredMerchants = this.merchants.filter(merchant =>
        merchant.BusinessName.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    } else {
      this.filteredMerchants = this.merchants; // Show all if search query is empty
    }
  }

  onSearchInput(event: any): void {
    this.searchQuery = event.target.value;
    this.loadPlaces();
  }

  filterByIslandGroup(group: string): void {
    this.selectedIslandGroup = group;
    this.loadPlaces();
  }

  goToPlaceDetails(placeId: number): void {
    this.router.navigate(['place-details', placeId], { relativeTo: this.route });
  }
}
