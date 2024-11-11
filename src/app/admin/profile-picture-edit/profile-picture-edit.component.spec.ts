import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilePictureEditComponent } from './profile-picture-edit.component';

describe('ProfilePictureEditComponent', () => {
  let component: ProfilePictureEditComponent;
  let fixture: ComponentFixture<ProfilePictureEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfilePictureEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfilePictureEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
