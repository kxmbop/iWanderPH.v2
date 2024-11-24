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

  constructor(
    private route: ActivatedRoute, 
    private router: Router, 
    private placeService: PlaceService, 
    private location: Location
  ) {}

  ngOnInit(): void {
      const merchantId = this.route.snapshot.paramMap.get('merchantId');



      if (merchantId) {
          this.loadMerchantDetails(+merchantId);
      } else {
          console.error("Merchant ID is missing in the route.");
      }
  }


  loadMerchantDetails(merchantId: number): void {
    this.placeService.getMerchantById(merchantId).subscribe(
        data => {
            this.merchantDetails = data.merchant;

            if (this.merchantDetails.profilePicture) {
                this.merchantDetails.profilePicture = 'data:image/jpeg;base64,' + this.merchantDetails.profilePicture;
            }

            this.rooms = data.rooms.map((room: Room) => ({
              ...room,
              AvailabilityStatus: room.AvailableQuantity > 0 ? `${room.AvailableQuantity} Available` : 'Fully Booked'
          }));
            this.transportations = data.transportations;
        },
        error => {
            console.error('Error loading merchant details:', error);
        }
    );
}


  goBack(): void {
    this.location.back();
  }
}
interface Room {
  RoomID: number;
  RoomName: string;
  RoomRate: number;
  RoomQuantity: number;
  AvailableQuantity: number;
  GuestPerRoom: number;
  [key: string]: any; // Optional to allow additional dynamic properties
}