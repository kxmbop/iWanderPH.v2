import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ListingService } from '../services/listing.service';

@Component({
  selector: 'app-listings',
  templateUrl: './listings.component.html',
  styleUrl: './listings.component.scss'
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
  }

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    
    if (!token) {
      console.error('Token not found in local storage.');
      return;
    } 
    this.fetchRooms(token);
  }

  fetchRooms(token: string): void {
    this.listingService.getRooms(token).subscribe(
      (response) => {
        if (response.success) {
          this.rooms = response.data;
        } else {
          console.error('Error fetching rooms:', response.message);
        }
      },
      (error) => console.error('Error:', error)
    );
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
    this.galleryFiles = []; // Clear any previously stored files
  
    // Loop through selected files
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();
  
      // Generate preview
      reader.onload = () => {
        const fileWithPreview = {
          name: file.name,
          size: file.size,
          preview: reader.result as string // Base64 preview
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

  // Method to open the Update Room modal and prefill the form
openUpdateRoomModal(room: any): void {
  this.roomToUpdate = room;
  this.showUpdateRoomModal = true;
  this.updateForm.patchValue({
    RoomName: room.RoomName,
    RoomQuantity: room.RoomQuantity,
    GuestPerRoom: room.GuestPerRoom,
    RoomRate: room.RoomRate
  });
}

// Method to close the Update Room modal
closeUpdateRoomModal(): void {
  this.showUpdateRoomModal = false;
  this.updateForm.reset();
}

// Method to open the View Room modal with inclusions
viewRoom(room: any): void {
  this.viewRoomData = room; // Include additional inclusions here if available
  this.showViewRoomModal = true;
}

// Method to close the View Room modal
closeViewRoomModal(): void {
  this.showViewRoomModal = false;
  this.viewRoomData = null;
}
}