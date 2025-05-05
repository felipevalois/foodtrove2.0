import { TestBed } from '@angular/core/testing';

import { KevelService } from './kevel.service';

describe('KevelService', () => {
  let service: KevelService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KevelService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
