import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { of } from 'rxjs';
import { NotificationService } from '../../shared/services/notification.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CreateNotificationComponent } from './create-notification.component';
import { FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

describe('CreateNotificationComponent', () => {
  let component: CreateNotificationComponent;
  let fixture: ComponentFixture<CreateNotificationComponent>;
  let notificationServiceSpy: jasmine.SpyObj<NotificationService>;
  let matDialogSpy: jasmine.SpyObj<MatDialog>;
  let matSnackBarSpy: jasmine.SpyObj<MatSnackBar>;

  beforeEach(async () => {
    notificationServiceSpy = jasmine.createSpyObj('NotificationService', ['getFrameworkDetails', 'departmentList', 'createNotification', 'uploadImage','getCategorybasedAudienceList', 'getDisplayColumns']);
    matDialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    matSnackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);
    
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MatDialogModule],
      declarations: [ CreateNotificationComponent ],
      providers: [
        FormBuilder,
        MatSnackBar,
        { provide: NotificationService, useValue: notificationServiceSpy },
        { provide: 'config', useValue: {
          domain:'https://compass-dev.tarento.com/',
          email:'gohila.mariappan@tarento.com',
          framework:'fracing_fw',
          production: false,
          userId:'e3231918-ca1d-418e-b330-af57cbc812f7',
          authorization: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiI0WEFsdFpGMFFhc1JDYlFnVXB4b2RvU2tLRUZyWmdpdCJ9.mXD7cSvv3Le6o_32lJplDck2D0IIMHnv0uJKq98YVwk'
        } }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form and call getFramworkDetails and getDepartmentList on ngOnInit', () => {
    const getFrameworkDetailsSpy = notificationServiceSpy.getFrameworkDetails.and.returnValue(of({}));
    const departmentListSpy = notificationServiceSpy.departmentList.and.returnValue(of({}));

    component.ngOnInit();

    expect(component.notificationForm).toBeDefined();
    expect(getFrameworkDetailsSpy).toHaveBeenCalled();
    expect(departmentListSpy).toHaveBeenCalled();
  });

  it('should call createNotification and reset the form on successful form submission', fakeAsync(() => {
    const createNotificationSpy = notificationServiceSpy.createNotification.and.returnValue(of({}));
    const resetFormSpy = spyOn(component, 'clear').and.callThrough();
  
    component.notificationForm.setValue({
      notificationTitle: 'New notification',
      notificationText: 'New notification',
      contentType: 'text/html',
      audience: [],
      isScheduleNotification: false,
      scheduleDate: '',
      scheduleTime: '',
      img: '',
    });
  
    component.onSubmit();
    tick();
  
    expect(createNotificationSpy).toHaveBeenCalledWith(component.notificationForm.value);
    expect(resetFormSpy).toHaveBeenCalled();
    expect(matSnackBarSpy.open).toHaveBeenCalledWith('Notification has been Published.', '', { duration: 5000 });
  }));

  it('should set contentTypeSelected when onContentTypeChange is called', () => {
    const testEvent = { source: { value: 'html' } };
    component.onContentTypeChange(testEvent);
    expect(component.contentTypeSelected).toBe('html');
  });

  it('should set scheduleToSend and isScheduleNotification when onScheduleChange is called', () => {
    const testEvent = { source: { value: 'later' } };
    component.onScheduleChange(testEvent);
    expect(component.scheduleToSend).toBe('later');
    expect(component.notificationForm.get('isScheduleNotification')?.value).toBeTrue();
  });

  it('should set isScheduleNotification to false when onScheduleChange is called with immediate', () => {
    const testEvent = { source: { value: 'immediate' } };
    component.onScheduleChange(testEvent);
    expect(component.scheduleToSend).toBe('immediate');
    expect(component.notificationForm.get('isScheduleNotification')?.value).toBeFalse();
  });

  it('should call uploadImage and update form value in handleFileInput', () => {
    const file = new File(['content'], 'image.jpg');
    const uploadImageResponse = { result: { url: 'http://example.com/image.jpg' } };
    notificationServiceSpy.uploadImage.and.returnValue(of(uploadImageResponse));

    const event = { target: { files: [file] } };
    component.handleFileInput(event);

    expect(notificationServiceSpy.uploadImage).toHaveBeenCalledWith(file);
    expect(component.uploadedImaglink).toBe(uploadImageResponse.result.url);
    expect(component.notificationForm.get('img')?.value).toBe(uploadImageResponse.result.url);
  });

  it('should call uploadImage and update form value in onDropFiles', () => {
    const file = new File(['content'], 'image.jpg');
    const uploadImageResponse = { result: { url: 'http://example.com/image.jpg' } };
    notificationServiceSpy.uploadImage.and.returnValue(of(uploadImageResponse));

    component.onDropFiles([{ file }]);

    expect(notificationServiceSpy.uploadImage).toHaveBeenCalledWith(file);
    expect(component.uploadedImaglink).toBe(uploadImageResponse.result.url);
    expect(component.notificationForm.get('img')?.value).toBe(uploadImageResponse.result.url);
  });

  it('should scroll to the element and add "active" class to the target', () => {
    const mockElementId = 'testElement';
    const mockEvent = {
      target: document.createElement('div'),
    };
    const mockElement = document.createElement('div');
    mockElement.id = mockElementId;
    document.body.appendChild(mockElement);
  
    spyOn(mockElement, 'scrollIntoView');
  
    component.scroll(mockElementId, mockEvent);
  
    expect(mockEvent.target.classList.contains('active')).toBeTruthy();
    expect(mockElement.scrollIntoView).toHaveBeenCalled();
  });

  it('should call getFrameworkDetails and set frameworkDetails correctly', () => {
    // Arrange
    const frameworkDetails =  {
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
    };;
    notificationServiceSpy.getFrameworkDetails.and.returnValue(of(frameworkDetails));

    component.getFramworkDetails();

    expect(notificationServiceSpy.getFrameworkDetails).toHaveBeenCalled();
    expect(component.frameworkDetails).toEqual(frameworkDetails);
  });
  
  it('should call departmentList and set departmentList correctly', () => {
  
    const departmentListResponse = { result: { content: [ {
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
        }] } };
    const expectedDepartmentList = departmentListResponse.result.content.map((r: any) => ({ name: r.department, noOfMembers: r.userCount }));
    notificationServiceSpy.departmentList.and.returnValue(of(departmentListResponse));

    component.getDepartmentList();

    expect(notificationServiceSpy.departmentList).toHaveBeenCalled();
    expect(component.departmentList).toEqual(expectedDepartmentList);
  });

  it('should reset notification form and selected audiences', () => {
  
    component.notificationForm.setValue({
      notificationTitle: 'Test Title',
      notificationText: 'Test Text',
      contentType: 'text/html',
      audience: ['Audience1', 'Audience2'],
      img: 'test-img-url',
      scheduleDate: '2024-03-15',
      scheduleTime: '08:00',
      isScheduleNotification: 'true'
    });
    component.selectedAudiences = ['Audience1', 'Audience2'];
  
    component.clear();
  
    expect(component.notificationForm.value).toEqual({
      notificationTitle: '',
      notificationText: '',
      contentType: '',
      audience: [],
      img: '',
      scheduleDate: '',
      scheduleTime: '',
      isScheduleNotification: null
    });
    expect(component.selectedAudiences).toEqual([]);
  });
  
  

});