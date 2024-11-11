import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessVerificationComponent } from './business-verification.component';

describe('BusinessVerificationComponent', () => {
  let component: BusinessVerificationComponent;
  let fixture: ComponentFixture<BusinessVerificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BusinessVerificationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BusinessVerificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
