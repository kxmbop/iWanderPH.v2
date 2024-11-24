import { Component } from '@angular/core';
import { ViewListingService } from '../services/view-listing.service';

@Component({
  selector: 'app-view-listing',
  templateUrl: './view-listing.component.html',
  styleUrls: ['./view-listing.component.scss']
})
export class ViewListingComponent {
  rooms: any[] = [];
  vehicles: any[] = [];
  roomSearch: string = ''; // For RoomID and RoomName
  vehicleSearch: string = ''; // For TransportationID, VehicleName, Model, and Brand
  isRoomsVisible: boolean = true;
  isTransportationVisible: boolean = false;
  
  // View modal properties
  showViewRoomModal: boolean = false;
  viewRoomData: any = null;

  showViewVehicleModal: boolean = false;
  viewVehicleData: any = null;

  constructor(private viewListingService: ViewListingService) {}

  ngOnInit(): void {
    const token = localStorage.getItem('admintoken');
    if (token === null) {
      console.error('Token not found in local storage.');
      return;
    }
    this.fetchRooms(token);
    this.fetchVehicles(token);
  }

 // Method to search for rooms
 filterRooms() {
  if (this.roomSearch) {
    this.rooms = this.rooms.filter(room => 
      room.RoomID.toString().includes(this.roomSearch) ||
      room.RoomName.toLowerCase().includes(this.roomSearch.toLowerCase())
    );
  } else {
    const token = localStorage.getItem('token');
    if (token) {
      this.fetchRooms(token); // Reset rooms list
    }
  }
}

// Method to search for vehicles
filterVehicles() {
  if (this.vehicleSearch) {
    this.vehicles = this.vehicles.filter(vehicle => 
      vehicle.TransportationID.toString().includes(this.vehicleSearch) ||
      vehicle.VehicleName.toLowerCase().includes(this.vehicleSearch.toLowerCase()) ||
      vehicle.Model.toLowerCase().includes(this.vehicleSearch.toLowerCase()) ||
      vehicle.Brand.toLowerCase().includes(this.vehicleSearch.toLowerCase())
    );
  } else {
    const token = localStorage.getItem('token');
    if (token) {
      this.fetchVehicles(token); // Reset vehicles list
    }
  }
}

  showRooms() {
    this.isRoomsVisible = true;
    this.isTransportationVisible = false;
  }

  showTransportation() {
    this.isRoomsVisible = false;
    this.isTransportationVisible = true;
  }

  fetchRooms(token: string): void {
    this.viewListingService.getRooms(token).subscribe(response => {
      if (response.success) {
        this.rooms = response.data;
        console.log("Rooms: ", this.rooms);
      } else {
        console.error('Error fetching rooms:', response.message);
      }
    });
  }

  fetchVehicles(token: string): void {
    this.viewListingService.getVehicles(token).subscribe(response => {
      if (response.success) {
        this.vehicles = response.data;
        console.log("Vehicles: ", this.vehicles);

      } else {
        console.error('Error fetching vehicles:', response.message);
      }
    });
  }

  // View methods for Room and Vehicle
  viewRoom(room: any) {
    console.log("Room clicked:", room); 
    this.viewRoomData = room;
    this.showViewRoomModal = true;
  }
  
  closeViewRoomModal() {
    this.showViewRoomModal = false;
    this.viewRoomData = null;
  }

  viewVehicle(vehicle: any) {
    this.viewVehicleData = vehicle;
    this.showViewVehicleModal = true;
  }

  closeViewVehicleModal() {
    this.showViewVehicleModal = false;
    this.viewVehicleData = null;
  }
}
