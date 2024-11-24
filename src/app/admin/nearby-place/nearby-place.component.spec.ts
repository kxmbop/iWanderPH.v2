import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NearbyPlaceComponent } from './nearby-place.component';

describe('NearbyPlaceComponent', () => {
  let component: NearbyPlaceComponent;
  let fixture: ComponentFixture<NearbyPlaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NearbyPlaceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NearbyPlaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
