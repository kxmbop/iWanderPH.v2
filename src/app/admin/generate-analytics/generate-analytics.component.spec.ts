import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateAnalyticsComponent } from './generate-analytics.component';

describe('GenerateAnalyticsComponent', () => {
  let component: GenerateAnalyticsComponent;
  let fixture: ComponentFixture<GenerateAnalyticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenerateAnalyticsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenerateAnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
