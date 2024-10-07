import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PlaceService } from '../../services/place.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.scss']
})
export class BookingComponent implements OnInit {
  bookingForm: FormGroup;
  bookingType: 'room' | 'transportation' | null = null;
  itemId: number | null = null;
  bookingDetails: any = {};
  gallery: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private placeService: PlaceService,
    private fb: FormBuilder
  ) {
    this.bookingForm = this.fb.group({
      date: ['', Validators.required],
      checkIn: [''],
      checkOut: [''],
      pickupLocation: [''],
      payment: ['', [Validators.required, Validators.pattern('^[0-9]+(\\.[0-9]{1,2})?$')]]
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      console.log('Received Query Params:', params); // Debugging line
      this.bookingType = params['type'];
      this.itemId = +params['id'];

      if (this.bookingType && this.itemId) {
        this.loadBookingDetails(this.bookingType, this.itemId);
      } else {
        // Invalid parameters, navigate back or show error
        console.error('Invalid booking parameters');
        this.router.navigate(['/']);
      }
    });
  }

  loadBookingDetails(type: 'room' | 'transportation', id: number): void {
    if (type === 'room') {
      this.placeService.getRoomById(id).subscribe(
        data => {
          if (data.room) {
            this.bookingDetails = data.room;
            this.gallery = data.room.gallery || [];
          } else {
            console.error('Room not found');
            // Optionally, display an error message instead of navigating away
            // this.errorMessage = 'Room not found';
          }
        },
        error => {
          console.error('Error fetching room details:', error);
          // Optionally, display an error message
        }
      );
    } else if (type === 'transportation') {
      this.placeService.getTransportationById(id).subscribe(
        data => {
          if (data.transportation) {
            this.bookingDetails = data.transportation;
            this.gallery = data.transportation.gallery || [];
          } else {
            console.error('Transportation not found');
            // Optionally, display an error message instead of navigating away
            // this.errorMessage = 'Transportation option not found';
          }
        },
        error => {
          console.error('Error fetching transportation details:', error);
          // Optionally, display an error message
        }
      );
    }
  }

  onSubmit(): void {
    if (this.bookingForm.valid && this.bookingType && this.itemId) {
      const formValues = this.bookingForm.value;
      const bookingData: any = {
        type: this.bookingType,
        itemId: this.itemId,
        date: formValues.date,
        payment: formValues.payment
      };

      if (this.bookingType === 'room') {
        bookingData.checkIn = formValues.checkIn;
        bookingData.checkOut = formValues.checkOut;
      } else if (this.bookingType === 'transportation') {
        bookingData.pickupLocation = formValues.pickupLocation;
      }
    }
  }
}
