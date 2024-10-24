import { TestBed } from '@angular/core/testing';

import { FypService } from './fyp.service';

describe('FypService', () => {
  let service: FypService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FypService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
