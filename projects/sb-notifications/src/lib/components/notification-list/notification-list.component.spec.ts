import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationListComponent } from './notification-list.component';
import { of } from 'rxjs';
import { NotificationService } from '../../shared/services/notification.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('NotificationListComponent', () => {
  let component: NotificationListComponent;
  let fixture: ComponentFixture<NotificationListComponent>;
  let notificationServiceSpy: jasmine.SpyObj<NotificationService>;

  beforeEach(async () => {
    notificationServiceSpy = jasmine.createSpyObj('NotificationService', ['getNotificationList']);

    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ NotificationListComponent ],
      providers: [
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

    fixture = TestBed.createComponent(NotificationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

   it('should set the search property with the provided event', () => {
    const event = 'sample search query';
    component.searchResult(event);
    expect(component.search).toEqual(event);
  });

  it('should fetch past notifications and update them correctly', () => {
    const resultMock = [
          {
              "audience": [
                  "ROLES",
                  "POSITIONS"
              ],
              "scheduletime": 1713013202349,
              "title": "Testing Schedule Notification"
          },
          {
              "audience": [
                  "ALL"
              ],
              "scheduletime": 1710315900000,
              "title": "Testing Schedule Notification"
          }
      ]
    const pastNotificationsMock = [
      {
      "title": "Testing Schedule Notification",
      "scheduledFor": "13/04/2024 18:30:02",
      "audience": ["ROLES","POSITIONS"]
      },
      {
        "title": "Testing Schedule Notification",
        "scheduledFor": "13/03/2024 13:15:00",
        "audience": ["ALL"]
      }
    ]

    notificationServiceSpy.getNotificationList.and.returnValue(of({ result: { response: { notifications: resultMock } } }));

    component.getNotificationList();

    expect(component.pastNotifications).toEqual(jasmine.arrayContaining(pastNotificationsMock));
  });
});