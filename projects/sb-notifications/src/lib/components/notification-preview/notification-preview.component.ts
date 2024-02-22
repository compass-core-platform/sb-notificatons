import { Component, OnInit, Input, SimpleChange } from '@angular/core';

@Component({
  selector: 'notification-preview',
  templateUrl: './notification-preview.component.html',
  styleUrls: ['./notification-preview.component.scss']
})
export class NotificationPreviewComponent implements OnInit {
  @Input() previewData:any;

  constructor() { }

  ngOnInit(): void { }

  ngOnChanages(changes:SimpleChange){
      this.previewData = changes;
  }

}
