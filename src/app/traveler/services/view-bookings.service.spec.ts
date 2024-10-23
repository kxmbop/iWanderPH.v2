import { TestBed } from '@angular/core/testing';

import { ViewBookingsService } from './view-bookings.service';

describe('ViewBookingsService', () => {
  let service: ViewBookingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ViewBookingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
