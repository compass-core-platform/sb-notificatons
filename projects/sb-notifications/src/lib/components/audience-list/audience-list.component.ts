import { Component, Inject, OnInit } from '@angular/core';
import {SelectionModel} from '@angular/cdk/collections';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NotificationService } from '../../shared/services/notification.service';

export interface Audience {
  role: string;
 noOfMembers: number
}

const ELEMENT_DATA:Audience[] = [];

@Component({
  selector: 'lib-audience-list',
  templateUrl: './audience-list.component.html',
  styleUrls: ['./audience-list.component.scss']
})
export class AudienceListComponent implements OnInit {
  dataSource: any[] = [];
  search:any = '';
  displayedColumns: string[];
  selection = new SelectionModel<Audience>(true, []);
  slectedRowList:string[];
  audienceList!:any;  
  audienceType: any;
  dataSourceList: any;
  constructor( public dialogRef: MatDialogRef<AudienceListComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private notificationService: NotificationService) { 
      this.dialogRef.disableClose = true;
      this.slectedRowList = this.isAudienceExist(data.selectedAudiences);
      this.dataSource = data?.audienceList?.map((a:any) => {
        return  { [data.type]:a.name, noOfMembers:a.noOfMembers || '' }
      });
      this.dataSourceList = this.dataSource;
      this.audienceType = data.type;
      this.displayedColumns = data.displayedColumns;
      this.getFramworkterms();
    }   

  ngOnInit(): void {
    this.isAllSelected();
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }
    this.selection.select(...this.dataSource);
  }
     /** The label for the checkbox on the passed row */
  checkboxLabel(row?: Audience): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.role + 1}`;
  }

 
  onNoClick(): void {
    const selectedList = [...this.selection.selected.map((rl:any) => { 
      return { term:rl[this.audienceType], type:this.audienceType }
    })];
    this.dialogRef.close(selectedList);
  }

  getFramworkterms() {
    if(!this.slectedRowList) return;
        this.dataSource.forEach((row:any)  => {
          if(this.slectedRowList.map((tr:any) => tr.term).indexOf(row[this.audienceType]) !== -1){
            this.selection.select(row)
          }
        });
  }
 

  searchQuery() {
      if(!this.search.trim().toLowerCase()) {
        this.dataSource = this.dataSourceList;
        return;
      }
      this.dataSource =  this.dataSource.filter((s:any) => s[this.audienceType].toLowerCase().includes(this.search.trim().toLowerCase()));
  }

  splitColumnName(str:any) {
    return str.split(/(?=[A-Z])/).join(' ');
  }

  isAudienceExist(selectedAudiences:any[]){
    if(!this.slectedRowList){
          return selectedAudiences;
    }  
    return selectedAudiences.filter((r:any) =>  !this.slectedRowList.map((r:any) => r.term).includes(r));
  }

}
