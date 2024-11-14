import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignPlaceComponent } from './assign-place.component';

describe('AssignPlaceComponent', () => {
  let component: AssignPlaceComponent;
  let fixture: ComponentFixture<AssignPlaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssignPlaceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignPlaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
