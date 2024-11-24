import { Component, Input, Output, EventEmitter } from '@angular/core';
import { AdminService } from '../services/admin.service';

@Component({
    selector: 'app-address-edit',
    templateUrl: './address-edit.component.html',
    styleUrls: ['./address-edit.component.scss'],
    standalone: false
})
export class AddressEditComponent {
  @Input() admin: any;
  @Output() closeModal = new EventEmitter<void>();

  constructor(private adminService: AdminService) {}

  submitEditProfile() {
    // Log or send the updated profile data to the backend
    console.log('Updated admin info:', this.admin);
    
    // After form submission, you can emit the close modal event
    this.closeModal.emit();
  }
}
