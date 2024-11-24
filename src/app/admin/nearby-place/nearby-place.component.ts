import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NearbyService } from '../services/nearby.service';

@Component({
  selector: 'app-nearby-place',
  templateUrl: './nearby-place.component.html',
  styleUrls: ['./nearby-place.component.scss']
})
export class NearbyPlaceComponent implements OnInit {
  placeId!: number;
  merchants: any[] = [];
  allMerchants: any[] = [];
  availableMerchants: any[] = []; // Merchants that are not assigned to the place
  selectedMerchantId!: number;
  placeName!: string;

  constructor(
    private route: ActivatedRoute,
    private nearbyService: NearbyService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.placeId = +params['id'];
      this.loadNearbyMerchants(this.placeId);
      this.loadAllMerchants();
    });
  }

  loadNearbyMerchants(placeId: number): void {
    this.nearbyService.getNearbyMerchants(placeId).subscribe({
      next: (data) => {
        this.placeName = data.placeName;
        this.merchants = data.merchants;
        this.filterAvailableMerchants(); // Update available merchants
      },
      error: (err) => console.error('Error fetching nearby merchants:', err)
    });
  }

  loadAllMerchants(): void {
    this.nearbyService.getAllMerchants().subscribe({
      next: (data) => {
        this.allMerchants = data;
        this.filterAvailableMerchants(); // Update available merchants
      },
      error: (err) => console.error('Error fetching all merchants:', err)
    });
  }

  filterAvailableMerchants(): void {
    // Filter out merchants that are already assigned to the current place
    this.availableMerchants = this.allMerchants.filter(
      (merchant) => !this.merchants.some((assignedMerchant) => assignedMerchant.merchantID === merchant.merchantID)
    );
  }

  assignMerchant(): void {
    if (!this.selectedMerchantId) {
      alert('Please select a merchant.');
      return;
    }

    // Confirmation prompt before assigning
    if (confirm(`Are you sure you want to assign this merchant to ${this.placeName}?`)) {
      this.nearbyService.assignMerchantToPlace(this.placeId, this.selectedMerchantId).subscribe({
        next: () => {
          alert('Merchant successfully assigned!');
          this.loadNearbyMerchants(this.placeId); // Refresh the nearby merchants
        },
        error: (err) => {
          console.error('Error assigning merchant:', err);
          alert('Error assigning merchant. Please try again.');
        }
      });
    }
  }

  unassignMerchant(merchantId: number): void {
    if (confirm('Are you sure you want to unassign this merchant from this place?')) {
      this.nearbyService.unassignMerchantFromPlace(this.placeId, merchantId).subscribe({
        next: () => {
          alert('Merchant successfully unassigned!');
          this.loadNearbyMerchants(this.placeId); // Refresh the nearby merchants
        },
        error: (err) => console.error('Error unassigning merchant:', err)
      });
    }
  }
}
