import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { BookingsRoutingModule } from './bookings-routing.module';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog'; // For dialogs
import { MatSelectModule } from '@angular/material/select'; // Add this import
import { MatOptionModule } from '@angular/material/core'; // Add this import

import { BookingDetailsComponent } from './booking-details/booking-details.component';
import { RefundDialogComponent } from './refund-dialog/refund-dialog.component'; // Adjust the path


@NgModule({
  declarations: [
    BookingDetailsComponent, // Booking details component
    RefundDialogComponent, // Refund dialog component
  ],
  imports: [
    CommonModule,
    BookingsRoutingModule,
    RouterModule,  // Make sure this is correctly imported
    MatTabsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    FormsModule,
    MatIconModule,
    MatButtonToggleModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MatDialogModule, // Importing dialog module
    MatSelectModule, // Importing MatSelectModule
    MatOptionModule  // Importing MatOptionModule
  ]
})
export class BookingsModule { }
