import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AudienceListComponent } from '../audience-list/audience-list.component';
import { MatDialog } from '@angular/material/dialog';
import { NotificationService } from '../../shared/services/notification.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'lib-create-notification',
  templateUrl: './create-notification.component.html',
  styleUrls: ['./create-notification.component.scss']
})
export class CreateNotificationComponent implements OnInit {
  notificationForm!: FormGroup;
  fileToUpload!: File;
  contentTypeSelected = 'text';
  scheduleToSend = 'now';
  selectedAudiences:any = [];
  audienceList = ['position', 'role', 'department', 'All Users']
  frameworkDetails:any;
  departmentList!:any[];
  minDate = new Date();
  uploadedImaglink:any;
  url:any;
  constructor(private fb: FormBuilder, public dialog: MatDialog, private notificationService: NotificationService, private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.getFramworkDetails();
    this.getDepartmentList();
    this.initForm();
  }

  initForm() {
    this.notificationForm = this.fb.group({
      notificationTitle:['', Validators.required],
      notificationText:['', Validators.required],
      contentType:['', Validators.required],
      audience:[''],
      isScheduleNotification:[false],
      scheduleDate:[''],
      scheduleTime:[''],
      img:['']
    });
  }


  onSubmit() {
    if(this.notificationForm.valid){
      this.notificationService.createNotification(this.notificationForm.value).subscribe((res:any) => {
        this._snackBar.open('Notification has been Published.','',  {duration:5000});
        this.clear();
      });
    }
  }

  onContentTypeChange(e: any) {
     this.contentTypeSelected = e.source.value;
  }

  onScheduleChange(e:any) {
    this.scheduleToSend = e.source.value;
    this.notificationForm.patchValue({'isScheduleNotification': this.scheduleToSend === 'later'?true:false});
  }

  handleFileInput(event:any) {
       this.notificationService.uploadImage(event.target.files[0]).subscribe((res:any) => {
          this.uploadedImaglink = res.result.url;
          this.notificationForm.patchValue({'img':res.result.url});
        });
  }

  onDropFiles(files: any[]): void {
   this.notificationService.uploadImage(files[0].file).subscribe((res:any) => {
      this.uploadedImaglink = res.result.url;
      this.notificationForm.patchValue({'img':res.result.url});
    });
  }

  scroll(el:any, event:any) {
    event.target.previousSibling !== null? event.target.previousSibling?.classList.remove('active'):'';
    event.target.nextSibling !== null? event.target.nextSibling.classList?.remove('active'):'';
    document.getElementById(el)?.scrollIntoView({behavior: 'smooth'});
    event.target.classList.add('active');
  }
  
  openDialog(audience:any) {
    if(audience === this.audienceList[3]){
      this.notificationForm.patchValue({'audience':[]});
      this.selectedAudiences.length = 0;
      return;
    }
    const filteredAudienceList = audience !== 'department' ? this.notificationService.getCategorybasedAudienceList(this.frameworkDetails, audience): this.departmentList;
    const dialogRef = this.dialog.open(AudienceListComponent, {
      data:{
        selectedAudiences: this.selectedAudiences, 
        audienceList: filteredAudienceList,
        type:audience,
        displayedColumns: this.notificationService.getDisplayColumns(audience)
      }
    });

    dialogRef.afterClosed().subscribe(result => {
     
      result.forEach((k:any) => {
        const selectTerms = this.selectedAudiences.map((aud:any) => aud.term);
          if(!selectTerms.includes(k.term)){
            this.selectedAudiences.push(k);
          }
          this.notificationForm.patchValue({'audience':this.selectedAudiences});
      });
    });

  }

  getFramworkDetails() {
    this.notificationService.getFrameworkDetails().subscribe((res:any) => {
      this.frameworkDetails = res;
    });
  }

  getDepartmentList() {
    this.notificationService.departmentList().subscribe((res:any) => {
        this.departmentList = res.result.content.map((r:any) => {
          return { name:r.department, noOfMembers:r.userCount }
        });
    });
  }

  clear(){
    this.notificationForm.reset({
      notificationTitle:'',
      notificationText:'',
      contentType:'',
      audience:[],
      img:'',
      scheduleDate:'',
      scheduleTime:''
    });
    this.selectedAudiences = [];
  }


}
