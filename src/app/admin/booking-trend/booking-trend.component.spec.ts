import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingTrendComponent } from './booking-trend.component';

describe('BookingTrendComponent', () => {
  let component: BookingTrendComponent;
  let fixture: ComponentFixture<BookingTrendComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookingTrendComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookingTrendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
