import { TestBed } from '@angular/core/testing';

import { SwapiService } from './swapi.service';

describe('CharacterService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SwapiService = TestBed.get(SwapiService);
    expect(service).toBeTruthy();
  });
});
