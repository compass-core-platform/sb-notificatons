import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationPreviewComponent } from './notification-preview.component';
import { SimpleChange } from '@angular/core';

describe('NotificationPreviewComponent', () => {
  let component: NotificationPreviewComponent;
  let fixture: ComponentFixture<NotificationPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotificationPreviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotificationPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have ngOnChanges method', () => {
    expect(component.ngOnChanges).toBeDefined();
  });

  it('ngOnChanges should update previewData', () => {
    const changes: SimpleChange = {
      currentValue: {
        notificationTitle: "notification test",
        notificationText: "Test notification",
        contentType: "test",
        audience: [
            {
                term: "CONTENT_REVIEWER",
                type: "role"
            }
        ],
        isScheduleNotification: false,
        scheduleDate: "",
        scheduleTime: "",
        img: ""
    },
      previousValue: null,
      firstChange: true,
      isFirstChange: () => true,
    };

    component.ngOnChanges(changes);

    expect(component.previewData).toEqual(changes);
  });
  
});
