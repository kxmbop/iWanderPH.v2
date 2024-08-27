import { TestBed } from '@angular/core/testing';

import { ViewUsersService } from './view-users.service';

describe('ViewUsersService', () => {
  let service: ViewUsersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ViewUsersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
