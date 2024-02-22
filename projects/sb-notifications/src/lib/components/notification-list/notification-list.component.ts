import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AudienceListComponent } from '../audience-list/audience-list.component';


export interface PeriodicElement {
  name: string;
  scheduledFor:string
  audiance: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {name: 'Hydrogen Tuts', scheduledFor: '12/2/24', audiance: 'Juniors'},
  {name: 'kwoledge source', scheduledFor: '12/2/24', audiance: 'Leads'},
  {name: 'Lux', scheduledFor: '12/3/24', audiance: 'Senior Leads'},
];

@Component({
  selector: 'lib-notification-list',
  templateUrl: './notification-list.component.html',
  styleUrls: ['./notification-list.component.scss']
})
export class NotificationListComponent implements OnInit {
  search = '';
  displayedColumns: string[] = ['name', 'scheduledFor', 'audiance'];
  dataSource = ELEMENT_DATA;
  clickedRows = new Set<PeriodicElement>();
  
  constructor() { }

  ngOnInit(): void {
  }

  searchResult(event:any){
      console.log(event);
  }
  createLink(){}


 
}
