import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewVerificationComponent } from './view-verification.component';

describe('ViewVerificationComponent', () => {
  let component: ViewVerificationComponent;
  let fixture: ComponentFixture<ViewVerificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewVerificationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewVerificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
