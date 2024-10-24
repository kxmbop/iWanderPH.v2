import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

interface BookingResponse {
  data: any[];
  success: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  private apiUrl = `${environment.apiUrl}/admin/`;
  
  constructor(private http: HttpClient) { }


  getBookings(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/get_bookings.php`);
  }

  getBookingDetails(bookingId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/get_booking_details.php?bookingId=${bookingId}`);
  }

  updatePaymentStatus(bookingId: number) {
    return this.http.post(`${this.apiUrl}initiate_payout.php`, { bookingId });
  }

updateRefundStatus(bookingId: number, refundAmount: number, refundTransactionID: string, refundReason: string, refundReasonOther: string) {
  return this.http.post(`${this.apiUrl}refund.php`, { bookingId, refundAmount, refundTransactionID, refundReason, refundReasonOther });
}

  updatePayoutStatus(bookingId: number, payoutTransactionID: string) {
    return this.http.post(`${this.apiUrl}payout.php`, { bookingId, payoutTransactionID });
  }
  updatePayment(paymentDetails: any): Observable<any> {
    const { bookingID, transactionID, paymentStatus } = paymentDetails;
    return this.http.post(`${this.apiUrl}updatePayment.php`, {
      bookingID,
      transactionID,
      paymentStatus
    });
  }  
  getBookingsByUserId(userId: number): Observable<BookingResponse> {
    return this.http.get<BookingResponse>(`${this.apiUrl}get_bookings_by_user.php?user_id=${userId}`);
  }
  getsaleBookingsByUserId(userId: number): Observable<BookingResponse> {
    return this.http.get<BookingResponse>(`${this.apiUrl}get_payout_by_user.php?user_id=${userId}`);
  }
}
