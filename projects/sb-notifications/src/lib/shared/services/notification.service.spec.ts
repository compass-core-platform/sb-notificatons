import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { NotificationService } from './notification.service';
import { HttpErrorResponse } from '@angular/common/http';

describe('NotificationService', () => {
  let service: NotificationService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [NotificationService, { provide: 'config', useValue: {
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
        } }],
    });

    service = TestBed.inject(NotificationService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return the environment configuration', () => {
    const result = service.configuration;
    const expected = {
          "domain":'https://compass-dev.tarento.com/',
          "email":'gohila.mariappan@tarento.com',
          "framework":'fracing_fw',
          "production": false,
          "userId":'e3231918-ca1d-418e-b330-af57cbc812f7',
          "authorization": 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiI0WEFsdFpGMFFhc1JDYlFnVXB4b2RvU2tLRUZyWmdpdCJ9.mXD7cSvv3Le6o_32lJplDck2D0IIMHnv0uJKq98YVwk'
        }
    expect(result).toEqual(expected);
  });

  it('should get framework details', () => {
    const mockResponse = {
      result: {
        framework: {
          "identifier": "fracing_fw",
          "code": "fracing_fw",
          "name": "FRACing Framework",
          "description": "Fracing Framework",
          "categories": [
              {
                  "identifier": "fracing_fw_taxonomycategory1",
                  "code": "taxonomyCategory1",
                  "terms": [
                      {
                          "associations": [
                              {
                                  "identifier": "fracing_fw_taxonomycategory4_29860950-3faf-444b-b3ba-970e588faaf5",
                                  "code": "29860950-3faf-444b-b3ba-970e588faaf5",
                                  "translations": null,
                                  "name": "Interior Engineering",
                                  "description": "Create visually pleasing and functional interior spaces.",
                                  "index": 0,
                                  "category": "taxonomyCategory4",
                                  "moreProperties": {
                                      "competencyArea": "Engineering",
                                      "competencyType": "Technical"
                                  },
                                  "status": "Live"
                              }
                          ],
                          "identifier": "fracing_fw_taxonomycategory1_positions_a",
                          "code": "positions_a",
                          "translations": null,
                          "name": "Senior Engineer",
                          "description": "Senior Engineer responsible for major site activities",
                          "index": 1,
                          "category": "taxonomyCategory1",
                          "moreProperties": {
                              "competencyArea": "Functional",
                              "competencyType": "Visual Design"
                          },
                          "status": "Live"
                      },
                      {
                          "associations": [
                              {
                                  "identifier": "fracing_fw_taxonomycategory2_roles_a",
                                  "code": "roles_a",
                                  "translations": null,
                                  "name": "Area Manager",
                                  "description": "Vice President acts as Area Manager for the work site",
                                  "index": 1,
                                  "category": "taxonomyCategory2",
                                  "status": "Live"
                              }
                          ],
                          "identifier": "fracing_fw_taxonomycategory1_positions_b",
                          "code": "positions_b",
                          "translations": null,
                          "name": "Senior Engineer",
                          "description": "Junior Engineer responsible for major site activities",
                          "index": 2,
                          "category": "taxonomyCategory1",
                          "moreProperties": {
                              "competencyArea": "Functional",
                              "competencyType": "Visual Design"
                          },
                          "status": "Live"
                      }
                  ],
                  "translations": null,
                  "name": "Positions",
                  "description": "Position of the work order",
                  "index": 1,
                  "status": "Live"
              }
          ],
          "type": "K-12",
          "objectType": "Framework"
      }
      }
    };

    service.getFrameworkDetails().subscribe((response) => {
      expect(response).toEqual(mockResponse.result?.framework);
    });

    const req = httpTestingController.expectOne(`/api/framework/v1/read/${service.configuration.framework}?categories=`);
    expect(req.request.method).toEqual('GET');

    req.flush(mockResponse);
  });

  it('should handle error when getting framework details', () => {
    const errorMessage = 'Error fetching framework details';

    service.getFrameworkDetails().subscribe(
      () => fail('Expected an error, but received successful response'),
      (error) => {
        expect(error).toBeTruthy();
        expect(error.error).toBe(errorMessage);
      }
    );

    const req = httpTestingController.expectOne(`/api/framework/v1/read/${service.configuration.framework}?categories=`);
    expect(req.request.method).toEqual('GET');

    req.flush(errorMessage, { status: 404, statusText: 'Not Found' });
  });

  it('should return framework when types include "position" or "role"', () => {
    const len = [
      { type: 'position', term: 'Senior Engineer' },
      { type: 'department', term: 'Engineering' },
      { type: 'role', term: 'Manager' }
    ];

    const result = service.sendOnlyWhenTaxonomy(len);

    expect(result).toEqual(['fracing_fw']);
  });

  it('should return an empty array when types do not include "position" or "role"', () => {
    const len = [
      { type: 'department', term: 'Engineering' },
      { type: 'department', term: 'Marketing' }
    ];

    const result = service.sendOnlyWhenTaxonomy(len);

    expect(result).toEqual([]);
  });

  it('should return PLATFORM_ROLES when type is "role"', () => {
    const frameworkDetails = {}; // Provide your frameworkDetails here
    const type = 'role';
    const PLATFORM_ROLES = [
      { name: "CONTENT_REVIEWER", noOfMembers:'' },
      { name: "COURSE_MENTOR", noOfMembers:'' },
      { name: "PROGRAM_DESIGNER", noOfMembers:'' },
      { name: "REPORT_ADMIN", noOfMembers:'' },
      { name: "ORG_ADMIN", noOfMembers:'' },
      { name: "BOOK_CREATOR", noOfMembers:'' },
      { name: "BOOK_REVIEWER", noOfMembers:'' },
      { name: "PUBLIC", noOfMembers:'' },
      { name: "PROGRAM_MANAGER", noOfMembers:'' },
      { name: "CONTENT_CREATOR", noOfMembers:'' }
    ];

    const result = service.getCategorybasedAudienceList(frameworkDetails, type);

    expect(result).toEqual(PLATFORM_ROLES);
  });

  it('should return terms when type is not "role"', () => {
    const frameworkDetails = {
      categories: [
        {
          name: 'positions',
          terms: [
            { name: 'Senior Engineer', code: 'senior_engineer' },
            { name: 'Junior Engineer', code: 'junior_engineer' }
          ]
        }
      ]
    };
    const type = 'position';

    const result = service.getCategorybasedAudienceList(frameworkDetails, type);

    expect(result).toEqual(frameworkDetails.categories[0].terms);
  });

  it('should return POSITION_COLUMNS for "position"', () => {
    const result = service.getDisplayColumns('position');
    expect(result).toEqual(['select', 'position', 'noOfMembers']);
  });

  it('should return ROLE_COLUMNS for "role"', () => {
    const result = service.getDisplayColumns('role');
    expect(result).toEqual(['select', 'role', 'noOfMembers']);
  });

  it('should return DEPARTMENT_COLUMNS for "department"', () => {
    const result = service.getDisplayColumns('department');
    expect(result).toEqual(['select', 'department', 'noOfMembers']);
  });

  it('should return undefined for unknown type', () => {
    const result = service.getDisplayColumns('unknownType');
    expect(result).toBeUndefined();
  });

  it('should return department list', () => {
    const mockResponse = {
      "content": [
          {
              "userCount": 3,
              "department": "digital"
          },
          {
              "userCount": 1,
              "department": ""
          },
          {
              "userCount": 1,
              "department": "SAP"
          }
      ]
  };

    service.departmentList().subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpTestingController.expectOne('/learner/user/v1/department/list');
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual({ request: { filters: {}, limit: 100 } });

    req.flush(mockResponse);
  });

  it('should return notification list with a specific status', () => {
    const status = 'someStatus';
    const mockResponse = {
      // Your mock response data here
    };

    service.getNotificationList(status).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpTestingController.expectOne(`/learner/user/v1/notification/list/${status}`);
    expect(req.request.method).toEqual('GET');

    req.flush(mockResponse);
  });

  it('should upload an image successfully', () => {
    const mockFile = new File(['file-content'], 'test-file.jpg', { type: 'image/jpeg' });
    const mockResponse = {
      // Your mock response data here
    };

    service.uploadImage(mockFile).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpTestingController.expectOne('/api/user/v1/image/upload');
    expect(req.request.method).toEqual('POST');
    expect(req.request.headers.get('Authorization')).toEqual('Bearer ' + service.configuration?.authorization);

    expect(req.request.body instanceof FormData).toBeTruthy();
    expect(req.request.body.has('file')).toBeTruthy();
    expect(req.request.body.get('file')).toEqual(mockFile);

    req.flush(mockResponse);
  });

  it('should handle image upload failure', () => {
    const mockFile = new File(['file-content'], 'test-file.jpg', { type: 'image/jpeg' });
    const errorMessage = 'Image upload failed';
  
    service.uploadImage(mockFile).subscribe(
      () => fail('Expected to fail'),
      (error) => {
        expect(error instanceof HttpErrorResponse).toBe(true);
        expect(error.status).toEqual(500);
        expect(error.statusText).toEqual(errorMessage);
      }
    );
  
    const req = httpTestingController.expectOne('/api/user/v1/image/upload');
    expect(req.request.method).toEqual('POST');
  
    req.flush({}, { status: 500, statusText: errorMessage });
  });

  it('should merge date and time correctly', () => {
    const date = '2024-03-06';
    const time = '12:30';
    const expectedISOString = '2024-03-06T07:00:00.000Z';
    const result = service.mergeDateTime(date, time);
  
    expect(result).toEqual(expectedISOString);
  });
  
  it('should handle single-digit hours and minutes', () => {
    const date = '2022-01-01';
    const time = '9:05';
    const expectedISOString = '2022-01-01T03:35:00.000Z';
  
    const result = service.mergeDateTime(date, time);
  
    expect(result).toEqual(expectedISOString);
  });
  
  it('should handle midnight', () => {
    const date = '2023-05-15';
    const time = '00:00';
    const expectedISOString = '2023-05-14T18:30:00.000Z';
  
    const result = service.mergeDateTime(date, time);
  
    expect(result).toEqual(expectedISOString);
  });
  
  it('should handle different date and time formats', () => {
    const date = '2022/07/12';
    const time = '18:45';
    const expectedISOString = '2022-07-12T13:15:00.000Z';
  
    const result = service.mergeDateTime(date, time);
  
    expect(result).toEqual(expectedISOString);
  });
  
  it('should create notification with schedule', () => {
    const mockRequest = {
      isScheduleNotification: true,
      scheduleDate: '2024-03-06',
      scheduleTime: '12:30',
      audience: [{ type: 'position', term: 'Senior Engineer' }],
      notificationText: 'Test Notification',
      contentType: 'text/html',
      img: '',
      notificationTitle: 'Test notification'
    };

    const mockPayload = {
      "request": {
        "isScheduleNotification": true,
        "scheduleTime": "2024-03-06T07:00:00.000Z",
        "audience": [
          "position"
        ],
        "data": [
          {
            "type": "email",
            "priority": 1,
            "action": {
              "template": {
                "config": {
                  "sender":service.configuration.email,
                  "topic": null,
                  "otp": null,
                  "subject": mockRequest.notificationTitle
                },
                "type": "email",
                "data": "<!doctype html>\n                      <html>\n                         <head>\n                            <meta name=\"viewport\" content=\"width=device-width\">\n                            <meta http-equiv=\"Content-Type\" content=\"text/html; charset=UTF-8\">\n                            <title></title>\n                            <style>/* ------------------------------------- INLINED WITH htmlemail.io/inline ------------------------------------- */ /* ------------------------------------- RESPONSIVE AND MOBILE FRIENDLY STYLES ------------------------------------- */ @media only screen and (max-width: 620px){table[class=body] h1{font-size: 28px !important; margin-bottom: 10px !important;}table[class=body] p, table[class=body] ul, table[class=body] ol, table[class=body] td, table[class=body] span, table[class=body] a{font-size: 16px !important;}table[class=body] .wrapper, table[class=body] .article{padding: 10px !important;}table[class=body] .content{padding: 0 !important;}table[class=body] .container{padding: 0 !important; width: 100% !important;}table[class=body] .main{border-left-width: 0 !important; border-radius: 0 !important; border-right-width: 0 !important;}table[class=body] .btn table{width: 100% !important;}table[class=body] .btn a{width: 100% !important;}table[class=body] .img-responsive{height: auto !important; max-width: 100% !important; width: auto !important;}}/* ------------------------------------- PRESERVE THESE STYLES IN THE HEAD ------------------------------------- */ @media all{.ExternalClass{width: 100%;}.ExternalClass, .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td, .ExternalClass div{line-height: 100%;}.apple-link a{color: inherit !important; font-family: inherit !important; font-size: inherit !important; font-weight: inherit !important; line-height: inherit !important; text-decoration: none !important;}.btn-primary table td:hover{background-color: #34495e !important;}.btn-primary a:hover{background-color: #34495e !important; border-color: #34495e !important;}}</style>\n                         </head>\n                         <body class=\"\" style=\"background-color: #f6f6f6; font-family: sans-serif; -webkit-font-smoothing: antialiased; font-size: 14px; line-height: 1.4; margin: 0; padding: 0; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;\"><table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" class=\"body\" style=\"border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; background-color: #f6f6f6;\">\n                         <tr><td style=\"font-family: sans-serif; font-size: 14px; vertical-align: top;\"></td><td class=\"container\" style=\"font-family: sans-serif; font-size: 14px; vertical-align: top; display: block; Margin: 0 auto; max-width: 580px; padding: 10px; width: 580px;\"><div class=\"content\" style=\"box-sizing: border-box; display: block; Margin: 0 auto; max-width: 580px; padding: 10px;\"><span class=\"preheader\" style=\"color: transparent; display: none; height: 0; max-height: 0; max-width: 0; opacity: 0; overflow: hidden; mso-hide: all; visibility: hidden; width: 0;\"></span><table class=\"main\" style=\"border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; background: #ffffff; border-radius: 3px;\">\n                         <tr><td class=\"wrapper\" style=\"font-family: sans-serif; font-size: 14px; vertical-align: top; box-sizing: border-box; padding: 20px;\"><table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" style=\"border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;\">\n                         <tr></tr>\n                         <tr>\n                            <td></td>\n                         </tr>\n                         <td style=\"font-family: sans-serif; font-size: 14px; vertical-align: top;\">\n                              <p style=\"font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;\">Test Notification</p>\n                              <p style=\"font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;\">text/html</p>\n                              <p><img src=\"https://img.freepik.com/premium-vector/compass-logo-vector-compass-logo-template_10250-4962.jpg\" alt=\"compass\" style=\"display:block; margin:auto; max-width:100%; height:auto;\"> </p>\n                          </td>\n                          </table>\n                      </td></tr></table></div></td></tr></table><td style=\"font-family: sans-serif; font-size: 14px; vertical-align: top;\"></td></body>\n                      </html>",
                "id": "cbplanContentRequestTemplate",
                "params": {}
              },
              "type": "email",
              "category": "email",
              "createdBy": {
                "id": service.configuration.userId,
                "type": "user"
              }
            }
          }
        ],
        "filters": {
          "profileDetails.professionalDetails.designation": [
            "Senior Engineer"
          ],
          "framework.taxonomyCategory1": [
            "Senior Engineer"
          ],
          "framework.taxonomyCategory2": [],
          "framework.taxonomyCategory3": [],
          "framework.taxonomyCategory4": [],
          "framework.taxonomyCategory5": [],
          "framework.id": [
            "fracing_fw"
          ],
          "profileDetails.employmentDetails.departmentName": [],
          "roles.role": []
        },
        "dataValue": mockRequest.notificationText
      }
    }

    service.createNotification(mockRequest).subscribe();

    const req = httpTestingController.expectOne('/learner/user/feed/v2/create');
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual(mockPayload);

    req.flush({});
  });

  it('should create notification without schedule', () => {
    const mockRequest = {
      isScheduleNotification: true,
      scheduleDate: '2024-03-06',
      scheduleTime: '12:30',
      audience: [{ type: 'position', term: 'Senior Engineer' }],
      notificationText: 'Test Notification',
      contentType: 'text/html',
      img: '',
      notificationTitle: 'Test notification'
    };

    service.createNotification(mockRequest).subscribe();

    const req = httpTestingController.expectOne('/learner/user/feed/v2/create');
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual({
      "request": {
        "isScheduleNotification": true,
        "scheduleTime": "2024-03-06T07:00:00.000Z",
        "audience": [
          "position"
        ],
        "data": [
          {
            "type": "email",
            "priority": 1,
            "action": {
              "template": {
                "config": {
                  "sender":service.configuration.email,
                  "topic": null,
                  "otp": null,
                  "subject": mockRequest.notificationTitle
                },
                "type": "email",
                "data": "<!doctype html>\n                      <html>\n                         <head>\n                            <meta name=\"viewport\" content=\"width=device-width\">\n                            <meta http-equiv=\"Content-Type\" content=\"text/html; charset=UTF-8\">\n                            <title></title>\n                            <style>/* ------------------------------------- INLINED WITH htmlemail.io/inline ------------------------------------- */ /* ------------------------------------- RESPONSIVE AND MOBILE FRIENDLY STYLES ------------------------------------- */ @media only screen and (max-width: 620px){table[class=body] h1{font-size: 28px !important; margin-bottom: 10px !important;}table[class=body] p, table[class=body] ul, table[class=body] ol, table[class=body] td, table[class=body] span, table[class=body] a{font-size: 16px !important;}table[class=body] .wrapper, table[class=body] .article{padding: 10px !important;}table[class=body] .content{padding: 0 !important;}table[class=body] .container{padding: 0 !important; width: 100% !important;}table[class=body] .main{border-left-width: 0 !important; border-radius: 0 !important; border-right-width: 0 !important;}table[class=body] .btn table{width: 100% !important;}table[class=body] .btn a{width: 100% !important;}table[class=body] .img-responsive{height: auto !important; max-width: 100% !important; width: auto !important;}}/* ------------------------------------- PRESERVE THESE STYLES IN THE HEAD ------------------------------------- */ @media all{.ExternalClass{width: 100%;}.ExternalClass, .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td, .ExternalClass div{line-height: 100%;}.apple-link a{color: inherit !important; font-family: inherit !important; font-size: inherit !important; font-weight: inherit !important; line-height: inherit !important; text-decoration: none !important;}.btn-primary table td:hover{background-color: #34495e !important;}.btn-primary a:hover{background-color: #34495e !important; border-color: #34495e !important;}}</style>\n                         </head>\n                         <body class=\"\" style=\"background-color: #f6f6f6; font-family: sans-serif; -webkit-font-smoothing: antialiased; font-size: 14px; line-height: 1.4; margin: 0; padding: 0; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;\"><table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" class=\"body\" style=\"border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; background-color: #f6f6f6;\">\n                         <tr><td style=\"font-family: sans-serif; font-size: 14px; vertical-align: top;\"></td><td class=\"container\" style=\"font-family: sans-serif; font-size: 14px; vertical-align: top; display: block; Margin: 0 auto; max-width: 580px; padding: 10px; width: 580px;\"><div class=\"content\" style=\"box-sizing: border-box; display: block; Margin: 0 auto; max-width: 580px; padding: 10px;\"><span class=\"preheader\" style=\"color: transparent; display: none; height: 0; max-height: 0; max-width: 0; opacity: 0; overflow: hidden; mso-hide: all; visibility: hidden; width: 0;\"></span><table class=\"main\" style=\"border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; background: #ffffff; border-radius: 3px;\">\n                         <tr><td class=\"wrapper\" style=\"font-family: sans-serif; font-size: 14px; vertical-align: top; box-sizing: border-box; padding: 20px;\"><table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" style=\"border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;\">\n                         <tr></tr>\n                         <tr>\n                            <td></td>\n                         </tr>\n                         <td style=\"font-family: sans-serif; font-size: 14px; vertical-align: top;\">\n                              <p style=\"font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;\">Test Notification</p>\n                              <p style=\"font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;\">text/html</p>\n                              <p><img src=\"https://img.freepik.com/premium-vector/compass-logo-vector-compass-logo-template_10250-4962.jpg\" alt=\"compass\" style=\"display:block; margin:auto; max-width:100%; height:auto;\"> </p>\n                          </td>\n                          </table>\n                      </td></tr></table></div></td></tr></table><td style=\"font-family: sans-serif; font-size: 14px; vertical-align: top;\"></td></body>\n                      </html>",
                "id": "cbplanContentRequestTemplate",
                "params": {}
              },
              "type": "email",
              "category": "email",
              "createdBy": {
                "id": service.configuration.userId,
                "type": "user"
              }
            }
          }
        ],
        "filters": {
          "profileDetails.professionalDetails.designation": [
            "Senior Engineer"
          ],
          "framework.taxonomyCategory1": [
            "Senior Engineer"
          ],
          "framework.taxonomyCategory2": [],
          "framework.taxonomyCategory3": [],
          "framework.taxonomyCategory4": [],
          "framework.taxonomyCategory5": [],
          "framework.id": [
            "fracing_fw"
          ],
          "profileDetails.employmentDetails.departmentName": [],
          "roles.role": []
        },
        "dataValue": mockRequest.notificationText
      }
    });

    req.flush({});
  });

});
