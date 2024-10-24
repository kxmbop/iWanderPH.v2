import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BookingService } from '../../services/booking.service';
import { Location } from '@angular/common';


@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.scss']
})
export class BookingComponent implements OnInit {
  bookingForm: FormGroup;
  bookingType: string = ''; 
  itemId: number = 0;
  merchantId: number = 0;
  roomDetails: any = null;
  transportationDetails: any = null;
  isDataLoaded: boolean = false; 
  showGcashNumber: boolean = false; 
  selectedFile: File | null = null;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private bookingService: BookingService,
    private router: Router,
    private location: Location
  ) {
    this.bookingForm = this.fb.group({
      // Room Booking Controls
      checkIn: ['', Validators.required],
      checkOut: ['', Validators.required],
      specialRequest: [''],

      // Transportation Booking Controls
      pickupLocation: ['', Validators.required],
      dropOffLocation: ['', Validators.required],
      pickupDateTime: ['', Validators.required],
      dropOffDateTime: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.bookingType = params['type'];
      this.itemId = +params['id'];
      this.merchantId = +params['merchantId'];

      // Fetch room or transportation details based on bookingType
      if (this.bookingType === 'room') {
        this.getRoomDetails(this.itemId);
      } else if (this.bookingType === 'transportation') {
        this.getTransportationDetails(this.itemId);
      }

      // Clear validators based on bookingType
      if (this.bookingType === 'transportation') {
        this.bookingForm.get('checkIn')?.clearValidators();
        this.bookingForm.get('checkOut')?.clearValidators();
        this.bookingForm.get('specialRequest')?.clearValidators();
      } else if (this.bookingType === 'room') {
        this.bookingForm.get('pickupLocation')?.clearValidators();
        this.bookingForm.get('dropOffLocation')?.clearValidators();
        this.bookingForm.get('pickupDateTime')?.clearValidators();
        this.bookingForm.get('dropOffDateTime')?.clearValidators();
      }

      // Update form validation
      this.bookingForm.updateValueAndValidity();
    });
  }

  toggleGcashNumber(event: any): void {
    this.showGcashNumber = event.target.checked;
  }

  onFileSelected(event: any): void {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
      console.log('Selected file:', this.selectedFile);
    }
  }
  

  getRoomDetails(roomId: number): void {
    this.bookingService.getRoomDetails(roomId).subscribe(
      data => {
        this.roomDetails = data;
        console.log("Room Details:", this.roomDetails);
        this.isDataLoaded = true;
      },
      error => {
        console.error('Error fetching room details', error);
        this.isDataLoaded = false;
      }
    );
  }

  getTransportationDetails(transportationId: number): void {
    this.bookingService.getTransportationDetails(transportationId).subscribe(
      data => {
        this.transportationDetails = data;
        console.log("Transportation Details:", this.transportationDetails); // Debugging log
        this.isDataLoaded = true;
      },
      error => {
        console.error('Error fetching transportation details', error);
        this.isDataLoaded = false;
      }
    );
  }

  getSubtotal(): number {
    let subtotal = 0;
  
    // For room booking, calculate based on the number of nights
    if (this.bookingType === 'room' && this.roomDetails) {
      const roomRate = Number(this.roomDetails.RoomRate);
      const checkInDate = new Date(this.bookingForm.get('checkIn')?.value);
      const checkOutDate = new Date(this.bookingForm.get('checkOut')?.value);
      
      if (checkInDate && checkOutDate && !isNaN(roomRate)) {
        const timeDifference = checkOutDate.getTime() - checkInDate.getTime();
        const numberOfNights = Math.ceil(timeDifference / (1000 * 3600 * 24)); // Convert time difference to days
        subtotal = roomRate * numberOfNights;
        console.log(`Room Rate: ${roomRate}, Number of Nights: ${numberOfNights}, Subtotal: ${subtotal}`);
      }
      
    // For transportation booking, calculate based on the number of days
    } else if (this.bookingType === 'transportation' && this.transportationDetails) {
      const rentalPrice = Number(this.transportationDetails.RentalPrice);
      const pickupDate = new Date(this.bookingForm.get('pickupDateTime')?.value);
      const dropOffDate = new Date(this.bookingForm.get('dropOffDateTime')?.value);
      
      if (pickupDate && dropOffDate && !isNaN(rentalPrice)) {
        const timeDifference = dropOffDate.getTime() - pickupDate.getTime();
        const numberOfDays = Math.ceil(timeDifference / (1000 * 3600 * 24)); // Convert time difference to days
        subtotal = rentalPrice * numberOfDays;
        console.log(`Rental Price: ${rentalPrice}, Number of Days: ${numberOfDays}, Subtotal: ${subtotal}`);
      }
    }
  
    return subtotal;
  }
  

  getVAT(): number {
    const subtotal = this.getSubtotal();
    const vat = subtotal * 0.12; // 12% VAT
    console.log(`Subtotal: ${subtotal}, VAT: ${vat}`); // Corrected with backticks
    return vat;
  }

  getTotalAmount(): number {
    const subtotal = this.getSubtotal();
    const vat = this.getVAT();
    const total = subtotal + vat;
    console.log(`Subtotal: ${subtotal}, VAT: ${vat}, Total Amount: ${total}`); // Corrected with backticks
    return total;
  }

  submitBooking(): void {
    const confirmBooking = window.confirm('Are you sure you want to submit this booking?');
    
    if (!confirmBooking) {
      return;
    }
  
    // Validate the form
    if (this.bookingForm.invalid) {
      console.error('Form is invalid');
      return;
    }
  
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found');
      return;
    }
  
    const subtotal = this.getSubtotal();
    const payout = subtotal * 0.9;
  
    // Booking data
    const bookingData: any = {
      type: this.bookingType,
      itemId: this.itemId,
      subtotal: subtotal,
      payout: payout
    };
  
    // Add room-specific data
    if (this.bookingType === 'room') {
      bookingData.checkIn = this.bookingForm.get('checkIn')?.value;
      bookingData.checkOut = this.bookingForm.get('checkOut')?.value;
      bookingData.specialRequest = this.bookingForm.get('specialRequest')?.value;
    }
  
    // Add transportation-specific data
    else if (this.bookingType === 'transportation') {
      bookingData.pickupLocation = this.bookingForm.get('pickupLocation')?.value;
      bookingData.dropOffLocation = this.bookingForm.get('dropOffLocation')?.value;
      bookingData.pickupDateTime = this.bookingForm.get('pickupDateTime')?.value;
      bookingData.dropOffDateTime = this.bookingForm.get('dropOffDateTime')?.value;
    }
  
    const formData = new FormData();
  
    // Check if the file is selected before appending it to FormData
    if (this.selectedFile) {
      formData.append('file', this.selectedFile); // Attach payment file if selected
    }
  
    formData.append('bookingData', JSON.stringify(bookingData)); // Attach other booking data
  
    this.bookingService.uploadBooking(formData, token).subscribe(
      response => {
        if (response.success) {
          console.log('Booking created successfully.');
          this.router.navigate(['/traveler/bookings']);
        } else {
          console.error('Booking failed:', response.message);
        }
      },
      error => {
        console.error('Error booking:', error);
      }
    );
  }
  goBack(): void {
    this.location.back();
  }
}
