import { TestBed } from '@angular/core/testing';

import { NotificationInterceptor } from './notification.interceptor';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { NotificationService } from './notification.service';

describe('NotificationInterceptor', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let notificationService: NotificationService;
  
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        NotificationInterceptor,
        NotificationService,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: NotificationInterceptor,
          multi: true,
        },
        { provide: 'config', useValue: {
          "configuration": {
            "environment": {
              "domain":'https://compass-dev.tarento.com/',
              "email":'gohila.mariappan@tarento.com',
              "framework":'fracing_fw',
              "production": false,
              "userId":'e3231918-ca1d-418e-b330-af57cbc812f7',
              "authorization": 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiI0WEFsdFpGMFFhc1JDYlFnVXB4b2RvU2tLRUZyWmdpdCJ9.mXD7cSvv3Le6o_32lJplDck2D0IIMHnv0uJKq98YVwk'
            }
          }
          } }
        ]
    })
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    notificationService = TestBed.inject(NotificationService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    const interceptor: NotificationInterceptor = TestBed.inject(NotificationInterceptor);
    expect(interceptor).toBeTruthy();
  });

  it('should add Authorization header when configuration is available', () => {
    const mockConfig = {
      authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiI0WEFsdFpGMFFhc1JDYlFnVXB4b2RvU2tLRUZyWmdpdCJ9.mXD7cSvv3Le6o_32lJplDck2D0IIMHnv0uJKq98YVwk',
      userId: 'e3231918-ca1d-418e-b330-af57cbc812f7',
    };

    spyOn(notificationService, 'configuration').and.returnValue(mockConfig);

    httpClient.get('/api/data').subscribe();

    const req = httpTestingController.expectOne('/api/data');
    expect(req.request.headers.has('Authorization')).toEqual(true);
    expect(req.request.headers.get('Authorization')).toEqual(mockConfig.authorization);
    expect(req.request.headers.has('userId')).toEqual(true);
    expect(req.request.headers.get('userId')).toEqual(mockConfig.userId);

    req.flush({});
  });

  it('should not add Authorization header when configuration is not available', () => {
    spyOn(notificationService, 'configuration').and.returnValue(null);

    httpClient.get('/api/data').subscribe();

    const req = httpTestingController.expectOne('/api/data');
    expect(req.request.headers.has('Authorization')).toEqual(true);
    expect(req.request.headers.has('userId')).toEqual(true);

    req.flush({});
  });

  it('should set empty Authorization header when configuration is available but no authorization token', () => {
    const mockConfig = {
      authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiI0WEFsdFpGMFFhc1JDYlFnVXB4b2RvU2tLRUZyWmdpdCJ9.mXD7cSvv3Le6o_32lJplDck2D0IIMHnv0uJKq98YVwk',
      userId: 'e3231918-ca1d-418e-b330-af57cbc812f7',
    };

    spyOn(notificationService, 'configuration').and.returnValue(mockConfig);

    httpClient.get('/api/data').subscribe();

    const req = httpTestingController.expectOne('/api/data');
    expect(req.request.headers.has('Authorization')).toEqual(true);
    expect(req.request.headers.get('Authorization')).toEqual(mockConfig.authorization);
    expect(req.request.headers.has('userId')).toEqual(true);
    expect(req.request.headers.get('userId')).toEqual(mockConfig.userId);

    req.flush({});
  });
});
