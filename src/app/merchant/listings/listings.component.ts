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

  rooms: any[] = [];
  showAddRoomModal: boolean = false;
  showUpdateRoomModal: boolean = false;
  roomForm: FormGroup;
  updateForm: FormGroup;
  roomToUpdate: any;
  showViewRoomModal: boolean = false;
  viewRoomData: any;   
  galleryFiles: any;
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
  }

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    
    if (!token) {
      console.error('Token not found in local storage.');
      return;
    } 
    this.fetchRooms(token);
    this.fetchVehicles(token);
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

  openAddVehicleModal(): void {
    this.showAddVehicleModal = true;
  }

  closeAddVehicleModal(): void {
    this.showAddVehicleModal = false;
    this.vehicleForm.reset();
  }

  addVehicle(): void {
    const token = localStorage.getItem('token');
    const newVehicle = this.vehicleForm.value;

    if (token) {
      this.listingService.addVehicle(newVehicle, token).subscribe(
        (response) => {
          if (response.success) {
            this.vehicles.push(response.data);  // Add new vehicle to list
            this.closeAddVehicleModal();
          } else {
            console.error('Failed to add vehicle:', response.message);
          }
        },
        (error) => console.error('Error adding vehicle:', error)
      );
    }
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

  addRoom(): void {
    const token = localStorage.getItem('token');
    const newRoom = this.roomForm.value;
    if (token) {
      this.listingService.addRoom(newRoom, token).subscribe(
        (response) => {
          if (response.success) {
            this.rooms.push(newRoom);  // Add the new room to local data
            this.closeAddRoomModal();
          } else {
            console.error('Failed to add room:', response.message);
          }
        },
        (error) => console.error('Error adding room:', error)
      );
    }
  }

  openAddRoomModal(): void {
    this.showAddRoomModal = true;
  }

  closeAddRoomModal(): void {
    this.showAddRoomModal = false;
    this.roomForm.reset();
  }

  updateRoom(): void {
    const updatedRoom = this.updateForm.value;
    if (this.roomToUpdate) {
      this.listingService.updateRoom(this.roomToUpdate.RoomID, updatedRoom).subscribe(
        (response) => {
          if (response.success) {
            const index = this.rooms.findIndex(room => room.RoomID === this.roomToUpdate.RoomID);
            if (index !== -1) {
              this.rooms[index] = updatedRoom;
            }
            this.closeUpdateRoomModal();
          } else {
            console.error('Failed to update room:', response.message);
          }
        },
        (error) => console.error('Error updating room:', error)
      );
    }
  }

  onFileChange(event: any): void {
    const files: FileList = event.target.files;
    this.galleryFiles = [];
  
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();
  
      reader.onload = () => {
        const fileWithPreview = {
          name: file.name,
          size: file.size,
          preview: reader.result as string
        };
        this.galleryFiles.push(fileWithPreview);
      };
  
      // Read the file as Data URL to create the preview
      reader.readAsDataURL(file);
    }
  
    // Validation for the number of images
    if (this.galleryFiles.length < 3) {
      console.error('At least 3 pictures are required');
    } else if (this.galleryFiles.length > 10) {
      console.error('You can upload up to 10 pictures only');
    }
  }

  deleteRoom(room: any): void {
    const token = localStorage.getItem('token');
    if (token && confirm(`Are you sure you want to remove ${room.RoomName}?`)) {
      this.listingService.deleteRoom(room.RoomID, token).subscribe(
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
  openUpdateRoomModal(room: any) {
    this.showUpdateRoomModal = true;
    }

  closeUpdateRoomModal(): void {
    this.showUpdateRoomModal = false;
    this.updateForm.reset();
  }

  viewRoom(room: any): void {
    this.viewRoomData = room;
    this.showViewRoomModal = true;
  }

  closeViewRoomModal(): void {
    this.showViewRoomModal = false;
    this.viewRoomData = null;
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

  // Fetch room details directly from component methods

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
}