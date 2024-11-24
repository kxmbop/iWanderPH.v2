import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { VerificationService } from '../services/verification.service';

@Component({
    selector: 'app-view-verification',
    imports: [CommonModule],
    templateUrl: './view-verification.component.html',
    styleUrls: ['./view-verification.component.scss']
})
export class ViewVerificationComponent implements OnInit {
  traveler: any = {};
  profilePicUrl: string | null = null;
  barangayClearanceUrl: string | null = null;
  mayorPermitUrl: string | null = null;
  birFormUrl: string | null = null;
  dotAuthUrl: string | null = null;
  rooms: any[] = [];
  transportations: any[] = [];
  merchantID: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private verificationService: VerificationService
  ) {}

  ngOnInit(): void {
    this.merchantID = this.route.snapshot.paramMap.get('merchantID');
    if (this.merchantID) {
      this.loadTravelerDetails(this.merchantID);
      this.loadRoomListings(this.merchantID);
      this.loadTransportationListings(this.merchantID);
    }
  }

  loadTravelerDetails(merchantID: string): void {
    this.verificationService.getTravelerDetails(merchantID).subscribe(
      (data: any) => {
        this.traveler = data;
        if (this.traveler.ProfilePic) {
          this.profilePicUrl = `data:image/png;base64,${this.traveler.ProfilePic}`;
        }
        if (this.traveler.BarangayClearance) {
          this.barangayClearanceUrl = `data:image/png;base64,${this.traveler.BarangayClearance}`;
        }
        if (this.traveler.MayorPermit) {
          this.mayorPermitUrl = `data:image/png;base64,${this.traveler.MayorPermit}`;
        }
        if (this.traveler.BirForm) {
          this.birFormUrl = `data:image/png;base64,${this.traveler.BirForm}`;
        }
        if (this.traveler.DotAuth) {
          this.dotAuthUrl = `data:image/png;base64,${this.traveler.DotAuth}`;
        }
      },
      error => {
        console.error('Error fetching traveler details:', error);
      }
    );
  }

  loadRoomListings(merchantID: string): void {
    this.verificationService.getRoomListings(merchantID).subscribe(
      (data: any[]) => {
        this.rooms = data;
      },
      error => {
        console.error('Error fetching room listings:', error);
      }
    );
  }

  loadTransportationListings(merchantID: string): void {
    this.verificationService.getTransportationListings(merchantID).subscribe(
      (data: any[]) => {
        this.transportations = data;
      },
      error => {
        console.error('Error fetching transportation listings:', error);
      }
    );
  }

  approveMerchant(): void {
    if (window.confirm('Are you sure you want to approve this merchant?')) {
      if (this.merchantID) {
        this.verificationService.approveMerchant(this.merchantID).subscribe(
          response => {
            alert('Merchant approved successfully!');
            this.router.navigate(['/admin/business-verification']);
          },
          error => {
            console.error('Error approving merchant:', error);
          }
        );
      }
    }
  }
}
