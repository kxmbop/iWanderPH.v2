import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RefundReportComponent } from './refund-report.component';

describe('RefundReportComponent', () => {
  let component: RefundReportComponent;
  let fixture: ComponentFixture<RefundReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RefundReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RefundReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});