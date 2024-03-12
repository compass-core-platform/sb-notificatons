import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AudienceListComponent } from '../audience-list/audience-list.component';
import { NotificationService } from '../../shared/services/notification.service';


export interface PeriodicElement {
  name: string;
  scheduledFor:string
  audience: string;
}

@Component({
  selector: 'lib-notification-list',
  templateUrl: './notification-list.component.html',
  styleUrls: ['./notification-list.component.scss']
})
export class NotificationListComponent implements OnInit {
  search = '';
  displayedColumns: string[] = ['title', 'scheduledFor', 'audience'];
  clickedRows = new Set<PeriodicElement>();
  pastNotifications:PeriodicElement[] = [];
  scheduledNotifications = [];
  notificationList: PeriodicElement[] = [];

  constructor(private notificationService: NotificationService) { }

  ngOnInit(): void {
    this.getNotificationList(); 
  }

  searchResult(event:any){
    this.search = event;
  }
  getNotificationList(){
    this.notificationService.getNotificationList('false').subscribe((list:any) => {
      this.pastNotifications = list.result.response.notifications.map((notification:any) => {
        return this.updateResponse(notification);
      });
    })
    this.notificationService.getNotificationList('true').subscribe((list:any) => {
      this.scheduledNotifications = list.result.response.notifications.map((notification:any) => {
        return this.updateResponse(notification);
      });
    })
  }
  
  updateResponse(notification:any){
    return { title: notification.title, scheduledFor:new Date (notification.scheduletime).toLocaleDateString()+' '+new Date (notification.scheduletime).toLocaleTimeString(), audience: notification.audience  }
  }
}
