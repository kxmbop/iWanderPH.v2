import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HubLayoutComponent } from './hub-layout.component';

describe('HubLayoutComponent', () => {
  let component: HubLayoutComponent;
  let fixture: ComponentFixture<HubLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HubLayoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HubLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
