import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewFaqComponent } from './viewfaq.component';

describe('ViewfaqComponent', () => {
  let component: ViewFaqComponent;
  let fixture: ComponentFixture<ViewFaqComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewFaqComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewFaqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
