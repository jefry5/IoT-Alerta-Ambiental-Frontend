import { TestBed } from '@angular/core/testing';

import { PlugService } from './plug.service';

describe('PlugService', () => {
  let service: PlugService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlugService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
