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
  merchants: any[] = [];
  filteredMerchants: any[] = [];
  searchQuery: string = '';
  selectedIslandGroup: string = 'All';
  selectedRegion: string = '';
  selectedProvince: string = '';
  uniqueRegions: string[] = [];
  filteredProvinces: string[] = [];

  constructor(private placeService: PlaceService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.loadPlaces();
    this.loadMerchants(); // Load merchants when component initializes
  }

  loadPlaces(): void {
    this.placeService.getPlaces(
      this.searchQuery,
      this.selectedIslandGroup,
      this.selectedRegion,
      this.selectedProvince
    ).subscribe(data => {
      this.places = data;
      this.populateRegionsAndProvinces(data);
    });
  }
  
  populateRegionsAndProvinces(places: any[]): void {
    // Get unique regions based on filtered places
    this.uniqueRegions = [...new Set(places.map(place => place.region))];
  
    // Get unique provinces based on the selected region or all provinces within the island group
    this.filteredProvinces = this.selectedRegion
      ? [...new Set(places.filter(place => place.region === this.selectedRegion).map(place => place.province))]
      : [...new Set(places.map(place => place.province))];
  }
  
  
  filterByRegion(event: any): void {
    this.selectedRegion = event.target.value;
    this.selectedProvince = ''; // Reset province selection
    
    // If no region is selected, reset provinces
    if (this.selectedRegion === '') {
      this.filteredProvinces = []; // Show all provinces again
    } else {
      // Filter provinces based on the new region
      this.filteredProvinces = this.places
        .filter(place => place.region === this.selectedRegion)
        .map(place => place.province);
        
      this.filteredProvinces = [...new Set(this.filteredProvinces)];
    }
  
    this.loadPlaces(); // Refresh places after updating filters
  }
  

  filterByProvince(event: any): void {
    this.selectedProvince = event.target.value;
  
    // If no province is selected, reload places based on current region and island group
    if (this.selectedProvince === '') {
      this.loadPlaces();
    } else {
      // Otherwise, filter by selected province
      this.loadPlaces();
    }
  }
  
  loadMerchants(): void {
    this.placeService.getMerchants().subscribe(data => {
      this.merchants = data;
      this.filteredMerchants = this.merchants;
    });
  }

  filterMerchants(): void {
    if (this.searchQuery) {
      this.filteredMerchants = this.merchants.filter(merchant =>
        merchant.BusinessName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        merchant.Address.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    } else {
      this.filteredMerchants = this.merchants;
    }
  }

  onSearchInput(event: any): void {
    this.searchQuery = event.target.value;
    this.loadPlaces();
  }

  filterByIslandGroup(group: string): void {
    this.selectedIslandGroup = group;
  
    // Clear selected region and province when switching island groups
    this.selectedRegion = '';
    this.selectedProvince = '';
  
    // Refresh regions and provinces based on the new island group
    this.placeService.getPlaces('', group).subscribe(data => {
      this.places = data;
      this.populateRegionsAndProvinces(data);
    });
  }
  

  goToPlaceDetails(placeId: number): void {
    this.router.navigate(['place-details', placeId], { relativeTo: this.route });
  }
}
