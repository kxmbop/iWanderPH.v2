import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddressEditComponent } from './address-edit.component';

describe('AddressEditComponent', () => {
  let component: AddressEditComponent;
  let fixture: ComponentFixture<AddressEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddressEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddressEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
