import { TestBed } from '@angular/core/testing';

import { GenerateReportService } from './generate-report.service';

describe('GenerateReportService', () => {
  let service: GenerateReportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GenerateReportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
