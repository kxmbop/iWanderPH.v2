import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RefundDialogComponent } from './refund-dialog.component';

describe('RefundDialogComponent', () => {
  let component: RefundDialogComponent;
  let fixture: ComponentFixture<RefundDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RefundDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RefundDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
