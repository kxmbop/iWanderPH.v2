import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { PlaceService } from '../../services/place.service';

@Component({
  selector: 'app-nearby-details',
  templateUrl: './nearby-details.component.html',
  styleUrls: ['./nearby-details.component.scss']
})
export class NearbyDetailsComponent implements OnInit {
  merchantDetails: any = {};
  rooms: any[] = [];
  transportations: any[] = [];

  constructor(private route: ActivatedRoute, private router: Router, private placeService: PlaceService, private location: Location) { }

  ngOnInit(): void {
    const merchantId = this.route.snapshot.paramMap.get('merchantId');
    if (merchantId) {
      this.loadMerchantDetails(+merchantId);
    }
  }

  loadMerchantDetails(merchantId: number): void {
    this.placeService.getMerchantById(merchantId).subscribe(
      data => {
        this.merchantDetails = data.merchant;
        this.rooms = data.rooms;
        this.transportations = data.transportations;
      },
      error => {
        console.error('Error loading merchant details:', error);
      }
    );
  }
  goBack(): void {
    this.location.back(); // This method will go back to the previous page
  }

}