import { TestBed } from '@angular/core/testing';

import { SbNotificationsService } from './sb-notifications.service';

describe('SbNotificationsService', () => {
  let service: SbNotificationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SbNotificationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
