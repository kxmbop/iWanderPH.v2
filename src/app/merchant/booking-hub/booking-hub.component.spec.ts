import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingHubComponent } from './booking-hub.component';

describe('BookingHubComponent', () => {
  let component: BookingHubComponent;
  let fixture: ComponentFixture<BookingHubComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookingHubComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookingHubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
