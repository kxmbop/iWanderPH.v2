import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BusinessService } from '../../services/business.service';

interface RoomDetails {
  name: string;
  quantity: number;
  rate: string;
  guests: number;
  inclusions: { InclusionID: number; InclusionName: string }[];
  views: { ViewID: number; ViewName: string }[];
  selectedInclusion: number;
  selectedView: number;
  imageFiles: File[];
}

interface TransportationDetails {
  type: string;
  model: string;
  brand: string;
  capacity: string;
  rate: string;
  imageFiles: File[];
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  constructor(private router: Router, private businessService: BusinessService) {}

  profilePictureUrl: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;
  currentStep = 1;
  selectedBusinessType: string | null = null;
  offersTransportation = false;
  transportationDetails: TransportationDetails[] = [];
  availableInclusions: { InclusionID: number; InclusionName: string }[] = [];
  availableViews: { ViewID: number; ViewName: string }[] = [];
  businessName: string = '';
  email: string = '';
  contact: string = '';
  address: string = '';
  businessTin: string = '';
  documentFiles: { [key: string]: File | null } = {
    BarangayClearance: null,
    MayorPermit: null,
    BirForm: null,
    DotAuth: null,
  };

  roomDetails: RoomDetails[] = [
    {
      name: '',
      quantity: 1,
      rate: '',
      guests: 1,
      inclusions: [],
      views: [],
      selectedInclusion: 0,
      selectedView: 0,
      imageFiles: []
    }
  ];

  ngOnInit(): void {
    this.loadInclusions();
    this.loadViews();
  }

  loadInclusions(): void {
    this.businessService.getInclusions().subscribe(
      (inclusions) => {
        this.availableInclusions = inclusions;
      },
      (error) => {
        console.error('Error loading inclusions:', error);
      }
    );
  }

  loadViews(): void {
    this.businessService.getViews().subscribe(
      (views) => {
        this.availableViews = views;
      },
      (error) => {
        console.error('Error loading views:', error);
      }
    );
  }

  onFileSelected(event: Event, documentType: string | null = null): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      if (documentType) {
        // For government documents
        this.documentFiles[documentType] = input.files[0];
      } else {
        // For the profile picture
        this.selectedFile = input.files[0];
        const reader = new FileReader();
        reader.onload = () => {
          this.profilePictureUrl = reader.result;
        };
        reader.readAsDataURL(this.selectedFile);
      }
    }
  }
  

  onRoomImagesSelected(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.roomDetails[index].imageFiles = Array.from(input.files);
    }
  }

  onTransportImagesSelected(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.transportationDetails[index].imageFiles = Array.from(input.files);
    }
  }

  goToNextStep() {
    this.currentStep = 2;
  }

  goToStep3() {
    this.currentStep = 3;
  }

  selectBusinessType(type: string) {
    this.selectedBusinessType = type;
  }

  addRoom() {
    this.roomDetails.push({
      name: '',
      quantity: 1,
      rate: '',
      guests: 1,
      inclusions: [],
      views: [],
      selectedInclusion: 0,
      selectedView: 0,
      imageFiles: []
    });
  }

  removeRoom(index: number) {
    this.roomDetails.splice(index, 1);
  }

  incrementRooms(index: number) {
    this.roomDetails[index].quantity++;
  }

  decrementRooms(index: number) {
    if (this.roomDetails[index].quantity > 1) {
      this.roomDetails[index].quantity--;
    }
  }

  incrementGuests(index: number) {
    this.roomDetails[index].guests++;
  }

  decrementGuests(index: number) {
    if (this.roomDetails[index].guests > 1) {
      this.roomDetails[index].guests--;
    }
  }

  addInclusion(index: number) {
    const selectedInclusionID = this.roomDetails[index].selectedInclusion;
    const selectedInclusion = this.availableInclusions.find(
      (inclusion) => inclusion.InclusionID === selectedInclusionID
    );

    if (selectedInclusion && !this.roomDetails[index].inclusions.some(incl => incl.InclusionID === selectedInclusionID)) {
      this.roomDetails[index].inclusions.push(selectedInclusion);
    }
  }

  removeInclusion(index: number, inclusion: { InclusionID: number; InclusionName: string }) {
    const inclusionIndex = this.roomDetails[index].inclusions.indexOf(inclusion);
    if (inclusionIndex > -1) {
      this.roomDetails[index].inclusions.splice(inclusionIndex, 1);
    }
  }

  addView(index: number) {
    const selectedViewID = this.roomDetails[index].selectedView;
    const selectedView = this.availableViews.find(
      (view) => view.ViewID === selectedViewID
    );

    if (selectedView && !this.roomDetails[index].views.some(view => view.ViewID === selectedViewID)) {
      this.roomDetails[index].views.push(selectedView);
    }
  }

  removeView(index: number, view: { ViewID: number; ViewName: string }) {
    const viewIndex = this.roomDetails[index].views.indexOf(view);
    if (viewIndex > -1) {
      this.roomDetails[index].views.splice(viewIndex, 1);
    }
  }

  addTransportation() {
    this.transportationDetails.push({
      type: '',
      model: '',
      brand: '',
      capacity: '',
      rate: '',
      imageFiles: []
    });
  }

  removeTransportation(index: number) {
    this.transportationDetails.splice(index, 1);
  }

  submitForm() {
    if (!this.businessName || !this.email || !this.contact || !this.address || !this.selectedBusinessType || !this.selectedFile) {
      alert('Please fill out all fields and select a profile picture.');
      return;
    }
  
    const confirmSubmission = confirm('Are you sure you want to submit the form?');
    if (!confirmSubmission) {
      return; // If the user cancels, exit the function
    }

    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found in localStorage');
      return;
    }
  
    const formData = new FormData();
    formData.append('businessName', this.businessName);
    formData.append('email', this.email);
    formData.append('contact', this.contact);
    formData.append('address', this.address);
    formData.append('businessType', this.selectedBusinessType);
    formData.append('profilePicture', this.selectedFile);
    formData.append('businessTin', this.businessTin);

    // Append government documents
    Object.keys(this.documentFiles).forEach((key) => {
      if (this.documentFiles[key]) {
        formData.append(key, this.documentFiles[key]!);
      }
    });

    // Append room and transportation details
    formData.append('roomDetails', JSON.stringify(this.roomDetails));
    formData.append('transportationDetails', JSON.stringify(this.transportationDetails));

    this.roomDetails.forEach((room, roomIndex) => {
      room.imageFiles.forEach((file, fileIndex) => {
        formData.append(`roomImage_${roomIndex}_${fileIndex}`, file);
      });
    });

    this.transportationDetails.forEach((transport, transportIndex) => {
      transport.imageFiles.forEach((file, fileIndex) => {
        formData.append(`transportImage_${transportIndex}_${fileIndex}`, file);
      });
    });

    this.businessService.registerBusiness(formData, token).subscribe(
      (response) => {
        if (response.success) {
          alert('Business registered successfully.');
          this.router.navigate(['/traveler/register-business/complete']);
        } else {
          console.error('Registration failed:', response.message);
        }
      },
      (error) => {
        console.error('Error registering business:', error);
      }
    );
  }

  goBack() {
    this.router.navigate(['/traveler/register-business']);
  }

  goBackToStep1() {
    this.currentStep = 1;
  }
}
