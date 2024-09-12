import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MerchantLayoutComponent } from './merchant-layout.component';

describe('MerchantLayoutComponent', () => {
  let component: MerchantLayoutComponent;
  let fixture: ComponentFixture<MerchantLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MerchantLayoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MerchantLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
