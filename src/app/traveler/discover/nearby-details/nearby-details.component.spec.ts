import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NearbyDetailsComponent } from './nearby-details.component';

describe('NearbyDetailsComponent', () => {
  let component: NearbyDetailsComponent;
  let fixture: ComponentFixture<NearbyDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NearbyDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NearbyDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
