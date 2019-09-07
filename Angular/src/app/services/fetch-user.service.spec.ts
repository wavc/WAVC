import { TestBed } from '@angular/core/testing';

import { FetchUserService } from './fetch-user.service';

describe('FetchUserService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FetchUserService = TestBed.get(FetchUserService);
    expect(service).toBeTruthy();
  });
});
