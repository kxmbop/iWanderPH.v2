import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcceptedComponent } from './accepted.component';

describe('AcceptedComponent', () => {
  let component: AcceptedComponent;
  let fixture: ComponentFixture<AcceptedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AcceptedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AcceptedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
