import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentModerationComponent } from './content-moderation.component';

describe('ContentModerationComponent', () => {
  let component: ContentModerationComponent;
  let fixture: ComponentFixture<ContentModerationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContentModerationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContentModerationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
