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
  fileToUpload: any;
  contentTypeSelected = 'text';
  scheduleToSend = 'now';
  selectedAudiences = [];
  audienceList = ['position', 'role', 'department', 'All Users']
  frameworkDetails:any;
  departmentList!:string[];

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
      schedule:[''],
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

  handleFileInput(event:any) {
    this.fileToUpload = event.target.files[0];
     const formData: FormData = new FormData();
    formData.append('fileName', this.fileToUpload, this.fileToUpload?.name);
    this.notificationForm.patchValue({'img':formData});
  }

  onDropFiles(files: any[]): void {
    this.fileToUpload = files[0].file;
    const formData: FormData = new FormData();
    formData.append('fileName', this.fileToUpload, this.fileToUpload?.name);
    this.notificationForm.patchValue({'img':formData});
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
     this.notificationForm.patchValue({'audience':result});
     this.selectedAudiences = result;
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
      audience:'',
      img:'',
      schedule:''
    });
    this.selectedAudiences = [];
  }

}
