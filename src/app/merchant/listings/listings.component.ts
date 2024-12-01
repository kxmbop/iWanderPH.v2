import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ListingService } from '../services/listing.service';

@Component({
    selector: 'app-listings',
    templateUrl: './listings.component.html',
    styleUrl: './listings.component.scss',
    standalone: false
})
export class ListingsComponent implements OnInit {
  listingForm: FormGroup;
  galleryFiles: { file: File, preview: string }[] = [];
  rooms: any[] = [];
  showAddRoomModal: boolean = false;
  showUpdateRoomModal: boolean = false;
  roomForm: FormGroup;
  updateForm: FormGroup;
  roomToUpdate: any;
  showViewRoomModal: boolean = false;
  viewRoomData: any;   
  vehicles: any[] = [];
  showAddVehicleModal: boolean = false;
  showUpdateVehicleModal: boolean = false;
  vehicleForm: FormGroup;
  updateVehicleForm: FormGroup;
  vehicleToUpdate: any;
  showViewVehicleModal: boolean = false;
  viewVehicleData: any;
  isRoomsVisible: boolean = true;
  isTransportationVisible: boolean = false;
  errorMessage: string = '';
  selectedRoomId: string | null = null;
  roomView: string[] = [];
  roomInclusions: { inclusion: string, description: string }[] = [];
  roomGallery: string[] = [];
  room: any;
  views: any[] = [];
  inclusions: any[] = [];
  selectedViews: string[] = [];
  selectedInclusions: string[] = [];
  Math = Math;


  constructor(private listingService: ListingService, private fb: FormBuilder) {
    this.roomForm = this.fb.group({
      RoomName: ['', Validators.required],
      RoomQuantity: ['', [Validators.required, Validators.min(1)]],
      GuestPerRoom: ['', [Validators.required, Validators.min(1)]],
      RoomRate: ['', [Validators.required, Validators.min(1)]]
    });

    this.updateForm = this.fb.group({
      RoomName: ['', Validators.required],
      RoomQuantity: ['', [Validators.required, Validators.min(1)]],
      GuestPerRoom: ['', [Validators.required, Validators.min(1)]],
      RoomRate: ['', [Validators.required, Validators.min(1)]]
    });

    this.vehicleForm = this.fb.group({
      VehicleName: ['', Validators.required],
      Model: ['', Validators.required],
      Brand: ['', Validators.required],
      Capacity: ['', [Validators.required, Validators.min(1)]],
      RentalPrice: ['', [Validators.required, Validators.min(0)]]
    });

    this.updateVehicleForm = this.fb.group({
      VehicleName: ['', Validators.required],
      Model: ['', Validators.required],
      Brand: ['', Validators.required],
      Capacity: ['', [Validators.required, Validators.min(1)]],
      RentalPrice: ['', [Validators.required, Validators.min(0)]]
    });
    this.listingForm = this.fb.group({
      ViewName: ['', Validators.required],
      Inclusion: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    this.roomForm = this.fb.group({
      RoomName: [''],        // Default empty values
      RoomQuantity: [0],
      GuestPerRoom: [0],
      RoomRate: [0],
    });

    if (!token) {
      console.error('Token not found in local storage.');
      return;
    } 
    
    this.fetchRooms(token);
    this.fetchVehicles(token);
    this.fetchViewsInclusions();
  }

  fetchRooms(token: string): void {
    this.listingService.getRooms(token).subscribe(
      (response) => {
        if (response.success) {
          this.rooms = response.data;
          console.log(this.rooms);
        } else {
          console.error('Error fetching rooms:', response.message);
        }
      },
      (error) => console.error('Error:', error)
    );
  }
  fetchVehicles(token: string): void {
    this.listingService.getVehicles(token).subscribe(
      (response) => {
        if (response.transportations && response.transportations.length > 0) {
          this.vehicles = response.transportations; 
        } else {
          this.errorMessage = 'No vehicles found for this merchant';
          console.error('Error fetching vehicles:', response.message);
        }
      },
      (error) => {
        this.errorMessage = 'An error occurred while fetching vehicles.';
        console.error('Error:', error);
      }
    );
  }
  fetchViewsInclusions(): void {
    this.listingService.getViewsInclusions().subscribe(response => {
      if (response.success) {
        this.views = response.data.views || []; 
        this.inclusions = response.data.inclusions || []; 
      } else {
        console.error('Error fetching views and inclusions:', response.message);
      }
    });
  }

  // Add Room Functions ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  addRoom() {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('RoomName', this.roomForm.get('RoomName')?.value);
    formData.append('RoomQuantity', this.roomForm.get('RoomQuantity')?.value);
    formData.append('GuestPerRoom', this.roomForm.get('GuestPerRoom')?.value);
    formData.append('RoomRate', this.roomForm.get('RoomRate')?.value);
    formData.append('Views', JSON.stringify(this.selectedViews));
    formData.append('Inclusions', JSON.stringify(this.selectedInclusions));
  
    for (let i = 0; i < this.galleryFiles.length; i++) {
      formData.append('ImageFile[]', this.galleryFiles[i].file);
    }
  
    this.listingService.addRoom(formData, token).subscribe(response => {
      if (response.success) {
        console.log('Room added successfully');
        this.closeAddRoomModal();
      } else {
        console.error('Error:', response.message);
      }
    });
  }
  // onViewSelectionChange(viewID: string, event: any) {
  //   if (event.target.checked) {
  //     this.selectedViews.push(viewID);
  //   } else {
  //     this.selectedViews = this.selectedViews.filter(id => id !== viewID);
  //   }
  // }
  // onInclusionSelectionChange(inclusionID: string, event: any) {
  //   if (event.target.checked) {
  //     this.selectedInclusions.push(inclusionID);
  //   } else {
  //     this.selectedInclusions = this.selectedInclusions.filter(id => id !== inclusionID);
  //   }
  // }
  // onFileChange(event: any) {
  //   const files: FileList = event.target.files; 
  //   this.galleryFiles = Array.from(files).map((file: File) => ({  
  //     file: file, 
  //     preview: URL.createObjectURL(file)
  //   }));
  // }
  addFiles(files: FileList) {
    Array.from(files).forEach((file: File) => { 
      this.galleryFiles.push({
        file: file,
        preview: URL.createObjectURL(file) 
      });
    });
  }
  openAddRoomModal(): void {
    this.showAddRoomModal = true;
    this.fetchViewsInclusions();
  }
  closeAddRoomModal(): void {
    this.showAddRoomModal = false;
    this.roomForm.reset();
  }

  // Update Room Functions ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  updateRoom(): void {
    if (!this.roomForm.valid) {
      console.error('Form is invalid');
      return;
    }
  
    const formData = new FormData();
    formData.append('RoomID', this.viewRoomData.RoomID.toString()); 
    formData.append('RoomName', this.roomForm.get('RoomName')?.value);
    formData.append('RoomQuantity', this.roomForm.get('RoomQuantity')?.value);
    formData.append('GuestPerRoom', this.roomForm.get('GuestPerRoom')?.value);
    formData.append('RoomRate', this.roomForm.get('RoomRate')?.value);
    formData.append('Views', JSON.stringify(this.selectedViews));
    formData.append('Inclusions', JSON.stringify(this.selectedInclusions));
  
    for (let i = 0; i < this.galleryFiles.length; i++) {
      formData.append('ImageFile[]', this.galleryFiles[i].file); 
    }
  
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Authorization token is missing');
      return;
    }
  
    this.listingService.updateRoom(formData, token).subscribe(
      response => {
        if (response.success) {
          console.log('Room updated successfully');
          this.closeUpdateRoomModal();
        } else {
          console.error('Error:', response.message);
        }
      },
      error => {
        console.error('HTTP Error:', error);
      }
    );
  }
  openUpdateRoomModal(room: any): void {
    this.showUpdateRoomModal = true;
    this.fetchViewsInclusions(); 
  
    this.roomForm.patchValue({
      RoomName: room.RoomName || '',
      RoomQuantity: room.RoomQuantity || 0,
      GuestPerRoom: room.GuestPerRoom || 0,
      RoomRate: room.RoomRate || 0,
    });
  
    this.selectedViews = room.Views ? room.Views.map((view: any) => view.ViewID.toString()) : [];
    this.selectedInclusions = room.Inclusions
      ? room.Inclusions.map((inclusion: any) => inclusion.InclusionID.toString())
      : [];
  
    this.viewRoomData = room;
  }
  closeUpdateRoomModal(): void {
    this.showUpdateRoomModal = false;
    this.updateForm.reset();
  }
  onViewSelectionChange(viewID: number, event: Event): void {
    const viewIDStr = viewID.toString();
    if ((event.target as HTMLInputElement).checked) {
      this.selectedViews.push(viewIDStr);
    } else {
      this.selectedViews = this.selectedViews.filter(id => id !== viewIDStr);
    }
  }
  onInclusionSelectionChange(inclusionID: number, event: Event): void {
    const inclusionIDStr = inclusionID.toString();
    if ((event.target as HTMLInputElement).checked) {
      this.selectedInclusions.push(inclusionIDStr);
    } else {
      this.selectedInclusions = this.selectedInclusions.filter(id => id !== inclusionIDStr);
    }
  }
  onFileChange(event: any): void {
    const files = event.target.files as FileList; 
    this.galleryFiles = Array.from(files).map((file: File) => ({
      file,
      preview: URL.createObjectURL(file), 
    }));
  }


  // View Room Functions ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  viewRoom(room: any): void {
    this.viewRoomData = room;
    this.showViewRoomModal = true;
  }
  closeViewRoomModal(): void {
    this.showViewRoomModal = false;
    this.viewRoomData = null;
  }

  // Delete Room Functions ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  deleteRoom(room: any): void {
    if (confirm(`Are you sure you want to remove ${room.RoomName}?`)) {
      this.listingService.deleteRoom(room.RoomID).subscribe(
        (response) => {
          if (response.success) {
            this.rooms = this.rooms.filter(r => r.RoomID !== room.RoomID);
            console.log(`Room ${room.RoomName} deleted successfully`);
          } else {
            console.error('Failed to delete room:', response.message);
          }
        },
        (error) => console.error('Error deleting room:', error)
      );
    }
  }





  // Add Vehicle Funcions ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  addVehicle(): void {
    const token = localStorage.getItem('token');
    const formData = new FormData();
  
    if (!token) {
      console.error('No token found. Unable to proceed.');
      return;
    }
  
    formData.append('VehicleName', this.vehicleForm.get('VehicleName')?.value);
    formData.append('Model', this.vehicleForm.get('Model')?.value);
    formData.append('Brand', this.vehicleForm.get('Brand')?.value);
    formData.append('Capacity', this.vehicleForm.get('Capacity')?.value);
    formData.append('RentalPrice', this.vehicleForm.get('RentalPrice')?.value);
  
    if (this.galleryFiles.length < 3 || this.galleryFiles.length > 10) {
      console.error('Invalid number of images.');
      return;
    }
    this.galleryFiles.forEach((file, index) => {
      formData.append(`ImageFile[${index}]`, file.file);
    });
  
    this.listingService.addVehicle(formData, token).subscribe(
      (response) => {
        if (response.success) {
          this.vehicles.push(response.data); 
          this.closeAddVehicleModal();
        } else {
          console.error('Failed to add vehicle:', response.message);
        }
      },
      (error) => console.error('Error adding vehicle:', error)
    );
  }

  openUpdateVehicleModal(vehicle: any) {
    this.vehicleToUpdate = vehicle;
    this.showUpdateVehicleModal = true;
    this.updateVehicleForm.patchValue({
      VehicleName: vehicle.VehicleName,
      Model: vehicle.Model,
      Brand: vehicle.Brand,
      Capacity: vehicle.Capacity,
      RentalPrice: vehicle.RentalPrice
    });
  }

  closeUpdateVehicleModal(): void {
    this.showUpdateVehicleModal = false;
    this.updateVehicleForm.reset();
  }

  updateVehicle(): void {
    const updatedVehicle = this.updateVehicleForm.value;
    if (this.vehicleToUpdate) {
      this.listingService.updateVehicle(this.vehicleToUpdate.VehicleID, updatedVehicle).subscribe(
        (response) => {
          if (response.success) {
            const index = this.vehicles.findIndex(vehicle => vehicle.VehicleID === this.vehicleToUpdate.VehicleID);
            if (index !== -1) {
              this.vehicles[index] = { ...this.vehicleToUpdate, ...updatedVehicle };
            }
            this.closeUpdateVehicleModal();
          } else {
            console.error('Failed to update vehicle:', response.message);
          }
        },
        (error) => console.error('Error updating vehicle:', error)
      );
    }
  }

  deleteVehicle(vehicle: any): void {
    const token = localStorage.getItem('token');
    if (token && confirm(`Are you sure you want to remove ${vehicle.VehicleName}?`)) {
      this.listingService.deleteVehicle(vehicle.VehicleID, token).subscribe(
        (response) => {
          if (response.success) {
            this.vehicles = this.vehicles.filter(v => v.VehicleID !== vehicle.VehicleID);
          } else {
            console.error('Failed to delete vehicle:', response.message);
          }
        },
        (error) => console.error('Error deleting vehicle:', error)
      );
    }
  }

  viewVehicle(vehicle: any): void {
    this.viewVehicleData = vehicle;
    this.showViewVehicleModal = true;
  }

  closeViewVehicleModal(): void {
    this.showViewVehicleModal = false;
    this.viewVehicleData = null;
  }








  // Show Rooms section
  showRooms() {
    this.isRoomsVisible = true;
    this.isTransportationVisible = false;
  }

  // Show Transportation section
  showTransportation() {
    this.isRoomsVisible = false;
    this.isTransportationVisible = true;
  }

  toggleRoomDetails(roomId: string) {
    this.selectedRoomId = this.selectedRoomId === roomId ? null : roomId;
  }

  loadRoomDetails(roomId: number): void {
    // Assuming you have a service that fetches data, you would call it here.
    this.listingService.getRoomView(roomId).subscribe((viewData: any[]) => {
        this.getRoomView(roomId, viewData); // Passing roomId and data
    });

    this.listingService.getRoomInclusions(roomId).subscribe((inclusionsData: any[]) => {
        this.getRoomInclusions(roomId, inclusionsData); // Passing roomId and data
    });

    this.listingService.getRoomGallery(roomId).subscribe((galleryData: any[]) => {
        this.getRoomGallery(roomId, galleryData); // Passing roomId and data
    });
  }

  getRoomView(roomId: number, data: any[]): void {
    this.roomView = data.map((view: any) => view.ViewName); // Fetches view names
  }

  getRoomInclusions(roomId: number, data: any[]): void {
    this.roomInclusions = data.map((inclusion: any) => ({
        inclusion: inclusion.InclusionName, // Fetches inclusion names
        description: inclusion.Description   // Fetches descriptions
    }));
  }

  getRoomGallery(roomId: number, data: any[]): void {
    this.roomGallery = data.map((gallery: any) => gallery.ImageFile); // Fetches gallery images
  }


  openAddVehicleModal(): void {
    this.showAddVehicleModal = true;
  }
  closeAddVehicleModal(): void {
    this.showAddVehicleModal = false;
    this.vehicleForm.reset();
  }
}