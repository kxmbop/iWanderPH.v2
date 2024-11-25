import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // Import RouterModule
import { VerificationService } from '../services/verification.service';

@Component({
    selector: 'app-business-verification',
    templateUrl: './business-verification.component.html',
    styleUrls: ['./business-verification.component.scss']
})
export class BusinessVerificationComponent implements OnInit {
  merchants: any[] = [];

  constructor(private verificationService: VerificationService) {}

  ngOnInit(): void {
    this.loadUnapprovedMerchants();
  }

  loadUnapprovedMerchants(): void {
    this.verificationService.getUnapprovedMerchants().subscribe(
      (data: any[]) => {
        this.merchants = data;
      },
      error => {
        console.error('Error fetching merchants:', error);
      }
    );
  }

  viewMerchant(merchantID: number): void {
    console.log('View merchant with ID:', merchantID);
  }
}
