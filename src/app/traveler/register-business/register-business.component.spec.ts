import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterBusinessComponent } from './register-business.component';

describe('RegisterBusinessComponent', () => {
  let component: RegisterBusinessComponent;
  let fixture: ComponentFixture<RegisterBusinessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterBusinessComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterBusinessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
