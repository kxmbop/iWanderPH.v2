import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnlineChatComponent } from './online-chat.component';

describe('OnlineChatComponent', () => {
  let component: OnlineChatComponent;
  let fixture: ComponentFixture<OnlineChatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OnlineChatComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OnlineChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
