import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router'; // Import Router
import { PlacesService } from '../services/places.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-assign-place',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './assign-place.component.html',
  styleUrls: ['./assign-place.component.scss']
})
export class AssignPlaceComponent implements OnInit {
  places: any[] = [];
  showAddPlaceModal: boolean = false;
  showEditPlaceModal: boolean = false;
  newPlace: any = {
    place_name: '',
    description: '',
    region: '',
    province: '',
    full_address: '',
    island_group: 'Luzon',
  };
  editPlace: any = {};
  mainImageFile: File | null = null;
  additionalImages: File[] = [];

  constructor(private placesService: PlacesService, private router: Router) {} // Inject Router

  ngOnInit(): void {
    this.loadPlaces();
  }

  loadPlaces(): void {
    this.placesService.getPlaces().subscribe({
      next: (data) => this.places = data,
      error: (err) => console.error('Error fetching places:', err)
    });
  }

  openAddPlaceModal(): void {
    this.showAddPlaceModal = true;
  }

  closeAddPlaceModal(): void {
    this.showAddPlaceModal = false;
  }

  onMainImageSelected(event: any): void {
    this.mainImageFile = event.target.files[0];
  }

  onAdditionalImagesSelected(event: any): void {
    this.additionalImages = Array.from(event.target.files);
  }

  addPlace(): void {
    const formData = new FormData();
    formData.append('place_name', this.newPlace.place_name);
    formData.append('description', this.newPlace.description);
    formData.append('region', this.newPlace.region);
    formData.append('province', this.newPlace.province);
    formData.append('full_address', this.newPlace.full_address);
    formData.append('island_group', this.newPlace.island_group);
    if (this.mainImageFile) {
      formData.append('main_image', this.mainImageFile);
    }
    this.additionalImages.forEach((image, index) => {
      formData.append(`additional_images[${index}]`, image);
    });

    this.placesService.addPlace(formData).subscribe({
      next: () => {
        this.loadPlaces();
        this.closeAddPlaceModal();
      },
      error: (err) => console.error('Error adding place:', err)
    });
  }

  

  deletePlace(placeId: number): void {
    if (confirm('Are you sure you want to delete this place?')) {
      this.placesService.deletePlace(placeId).subscribe(
        () => {
          alert('Place deleted successfully');
          this.loadPlaces(); // Refresh the list after deletion
        },
        error => {
          console.error('Error deleting place:', error);
          alert('Error deleting place');
        }
      );
    }
  }

  assignPlace(placeId: number): void {
    alert(`Place with ID: ${placeId} has been assigned.`);
    // Add further logic for assigning the place
  }

  openEditPlaceModal(place: any): void {
    console.log('Editing place:', place); // Log the place data for debugging
    this.editPlace = { ...place }; // Copy the place data into editPlace for editing
    this.showEditPlaceModal = true; // Show the modal
  }
  
  closeEditPlaceModal(): void {
    this.showEditPlaceModal = false; // Close the modal
  }
  updatePlace(): void {
    const formData = new FormData();
    formData.append('place_id', this.editPlace.id); // Add place ID for the update
    formData.append('place_name', this.editPlace.place_name);
    formData.append('description', this.editPlace.description);
    formData.append('region', this.editPlace.region);
    formData.append('province', this.editPlace.province);
    formData.append('full_address', this.editPlace.full_address);
    formData.append('island_group', this.editPlace.island_group);
    
    // Append main image only if a new file is selected
    if (this.mainImageFile) {
      formData.append('main_image', this.mainImageFile);
    }
  
    // Append additional images only if new files are selected
    this.additionalImages.forEach((image, index) => {
      formData.append(`additional_images[${index}]`, image);
    });
  
    this.placesService.updatePlace(formData).subscribe({
      next: () => {
        this.loadPlaces();
        this.closeEditPlaceModal();
      },
      error: (err) => console.error('Error updating place:', err)
    });
  }
  
}
