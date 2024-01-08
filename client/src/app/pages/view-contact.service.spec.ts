import { TestBed } from '@angular/core/testing';

import { ViewContactService } from './view-contact.service';

describe('ViewContactService', () => {
  let service: ViewContactService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ViewContactService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
