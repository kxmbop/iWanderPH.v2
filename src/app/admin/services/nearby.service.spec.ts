import { TestBed } from '@angular/core/testing';

import { NearbyService } from './nearby.service';

describe('NearbyService', () => {
  let service: NearbyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NearbyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
