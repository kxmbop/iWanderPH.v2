import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BookingService } from '../services/booking.service';



@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent implements OnInit {
  user: any = {}; // Initialize user as an empty object
  reports: any[] = [];
  bookings: any[] = [];
  saleBookings: any[] =[];
  showModal = false;
  action = { violation: '' };
  activeTab: string = 'bookings';
  userId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private bookingService: BookingService,
    private router: Router

  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const userIdParam = params['user_id'];
      this.userId = userIdParam ? +userIdParam : null; 

      if (this.userId) {
        this.fetchBookings(); 
        this.fetchsaleBookings();
      }
    });

    const userId = this.route.snapshot.queryParamMap.get('user_id');
    if (userId) {
      this.userService.getUserDetails(userId).subscribe(
        (data) => {
          this.user = data || {}; // Ensure user is an object
          this.loadReports(); 
        },
        (error) => {
          console.error('Error fetching user details', error);
        }
      );
    }
  }

  loadReports(): void {
    const userId = this.user?.userID; 
    if (userId) {
      this.userService.getReports(userId).subscribe(data => {
        this.reports = Array.isArray(data) ? data : []; 
      }, error => {
        console.error('Error fetching reports:', error);
        this.reports = []; 
      });
    }
  }

  fetchBookings(): void {
    if (this.userId !== null) {
      this.bookingService.getBookingsByUserId(this.userId).subscribe(response => {
        this.bookings = Array.isArray(response.data) ? response.data : [];
        console.log('Bookings: ', this.bookings);
      }, error => {
        console.error('Error fetching bookings:', error);
        this.bookings = []; 
      });
    }
  }

  fetchsaleBookings(): void {
    if (this.userId !== null) {
      this.bookingService.getsaleBookingsByUserId(this.userId).subscribe(response => {
        this.saleBookings = Array.isArray(response.data) ? response.data : [];
        console.log('Bookings: ', this.saleBookings);
      }, error => {
        console.error('Error fetching bookings:', error);
        this.saleBookings = []; 
      });
    }
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

  switchTab(tab: string): void {
    this.activeTab = tab;
  }
  openBookingDetails(bookingId: string): void {
    const url = this.router.createUrlTree(['/admin/booking-details', bookingId]).toString();
    window.open(url, '_blank');
  }
}