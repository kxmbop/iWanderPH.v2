import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.scss'
})
export class UserDetailsComponent implements OnInit{
  user: any;
  reports: any[] = [];
  bookings: any[] = [];
  showModal = false;
  action = { violation: '' };

  constructor(
    private route: ActivatedRoute,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    const userId = this.route.snapshot.queryParamMap.get('user_id');

    if (userId) {
      this.userService.getUserDetails(userId).subscribe(
        (data) => {
          this.user = data;
          this.loadReports(); 
          this.loadBookings(); 
        },
        (error) => {
          console.error('Error fetching user details', error);
        }
      );
    }
  }

  loadReports(): void {
    this.userService.getReports(this.user.userID).subscribe(data => {
      this.reports = data;
    });
  }

  loadBookings(): void {
    this.userService.getBookings(this.user.userID).subscribe(data => {
      this.bookings = data;
    });
  }

  openModal(): void {
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  submitAction(actionType?: string): void {
    if (actionType) {
      this.action.violation = actionType;
    }
    this.userService.createAction(this.action).subscribe(() => {
      this.loadReports();
      this.closeModal();
    });
  }
}
