import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentsManagerComponent } from './payments-manager.component';

describe('PaymentsManagerComponent', () => {
  let component: PaymentsManagerComponent;
  let fixture: ComponentFixture<PaymentsManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentsManagerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentsManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
