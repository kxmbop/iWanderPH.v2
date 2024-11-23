import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewReportComponent } from './review-report.component';

describe('ReviewReportComponent', () => {
  let component: ReviewReportComponent;
  let fixture: ComponentFixture<ReviewReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReviewReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReviewReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
