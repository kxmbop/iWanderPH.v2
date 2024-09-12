import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TravelerLayoutComponent } from './traveler-layout.component';

describe('TravelerLayoutComponent', () => {
  let component: TravelerLayoutComponent;
  let fixture: ComponentFixture<TravelerLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TravelerLayoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TravelerLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
