import { ComponentFixture, TestBed } from '@angular/core/testing';

import { of } from 'rxjs';
import { NotificationService } from '../../shared/services/notification.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Audience, AudienceListComponent } from './audience-list.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SelectionModel } from '@angular/cdk/collections';

describe('NotificationListComponent', () => {
  let component: AudienceListComponent;
  let fixture: ComponentFixture<AudienceListComponent>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<AudienceListComponent>>;
  let notificationServiceSpy: jasmine.SpyObj<NotificationService>;

  beforeEach(async () => {
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close', 'disableClose']);
    notificationServiceSpy = jasmine.createSpyObj('NotificationService', ['getFramworkterms']);

    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ AudienceListComponent ],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: {
          "selectedAudiences": [
              {
                  "term": "PUBLIC",
                  "type": "role"
              }
          ],
          "audienceList": [
              { "name": "PUBLIC", "noOfMembers": ""},
              { "name": "PROGRAM_MANAGER","noOfMembers": ""},
              { "name": "CONTENT_CREATOR","noOfMembers": ""}
          ],
          "type": "role",
          "displayedColumns": [
              "select",
              "role",
              "noOfMembers"
          ]
      } },
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

    fixture = TestBed.createComponent(AudienceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should disable close for the dialog', () => {
    expect(dialogRefSpy.disableClose).toBe(true);
  });

  it('should set slectedRowList based on isAudienceExist', () => {
    const selectedAudiences = [
      {
        "term": "PUBLIC",
        "type": "role"
      }
    ];
    const expectedSelectedAudiences = jasmine.arrayContaining([
      { term: 'PUBLIC', type: 'role' }
    ]);
    component.data = { selectedAudiences };

    fixture.detectChanges();

    expect(component.slectedRowList).toEqual(expectedSelectedAudiences);
  });

  it('should return true when all rows are selected', () => {
    const dataSource = [{ role: 'PUBLIC', noOfMembers: 5 }, { role: '"CONTENT_REVIEWER"', noOfMembers: 2 }];
    component.dataSource = dataSource;
    component.selection = new SelectionModel(true, [...dataSource]);

    const result = component.isAllSelected();

    expect(result).toBe(true);
  });

  it('should return false when no rows are selected', () => {
    const dataSource = [{ role: 'PUBLIC', noOfMembers: 5 }, { role: 'CONTENT_REVIEWER', noOfMembers: 2 }];
    component.dataSource = dataSource;
    component.selection = new SelectionModel<Audience>(true, []);

    const result = component.isAllSelected();

    expect(result).toBe(false);
  });

  it('should return false when only some rows are selected', () => {
    const dataSource = [{ role: 'PUBLIC', noOfMembers: 5 }, { role: 'CONTENT_REVIEWER', noOfMembers: 2 }];
    component.dataSource = dataSource;
    component.selection = new SelectionModel(true, [dataSource[0]]);

    const result = component.isAllSelected();

    expect(result).toBe(false);
  });

  it('should clear selection when all rows are initially selected', () => {
    const dataSource = [
      { role: 'PUBLIC', noOfMembers: 5 },
      { role: 'CONTENT_REVIEWER', noOfMembers: 2 }
    ];

    component.dataSource = dataSource;
    component.selection = new SelectionModel<Audience>(true, [...dataSource]);

    component.toggleAllRows();

    expect(component.selection.selected.length).toBe(0);
  });

  it('should select all rows when none are initially selected', () => {
    const dataSource = [
      { role: 'PUBLIC', noOfMembers: 5 },
      { role: 'CONTENT_REVIEWER', noOfMembers: 2 }
    ];

    component.dataSource = dataSource;
    component.selection = new SelectionModel<Audience>(true, []);

    component.toggleAllRows();

    expect(component.selection.selected).toEqual(dataSource);
  });

  it('should select all rows when only some are initially selected', () => {
    const dataSource = [
      { role: 'PUBLIC', noOfMembers: 5 },
      { role: 'CONTENT_REVIEWER', noOfMembers: 2 }
    ];

    component.dataSource = dataSource;
    component.selection = new SelectionModel<Audience>(true, [dataSource[0]]);

    component.toggleAllRows();

    expect(component.selection.selected).toEqual(dataSource);
  });

  it('should return "select all" when row is not provided and not all rows are selected', () => {
    spyOn(component, 'isAllSelected').and.returnValue(false);

    const result = component.checkboxLabel();

    expect(result).toBe('select all');
  });

  it('should return "deselect all" when row is not provided and all rows are selected', () => {
    spyOn(component, 'isAllSelected').and.returnValue(true);

    const result = component.checkboxLabel();

    expect(result).toBe('deselect all');
  });

  it('should return "select" when row is provided and the row is not selected', () => {
    const row = { role: 'PUBLIC', noOfMembers: 5 };
    spyOn(component.selection, 'isSelected').and.returnValue(false);

    const result = component.checkboxLabel(row);

    expect(result).toBe('select row PUBLIC1');
  });

  it('should return "deselect" when row is provided and the row is selected', () => {
    const row = { role: 'PUBLIC', noOfMembers: 5 };
    spyOn(component.selection, 'isSelected').and.returnValue(true);

    const result = component.checkboxLabel(row);

    expect(result).toBe('deselect row PUBLIC1');
  });

  it('should close the dialog with an empty array when no rows are selected', () => {
    component.selection = new SelectionModel<Audience>(true, []);

    component.onNoClick();

    expect(dialogRefSpy.close).toHaveBeenCalledWith([]);
  });

  it('should close the dialog with a single item when one row is selected', () => {
    const selectedRow = { role: 'PUBLIC', noOfMembers: 5 };
    component.selection = new SelectionModel(true, [selectedRow]);

    component.onNoClick();

    const expectedList = [{ term: 'PUBLIC', type: 'role' }];
    expect(dialogRefSpy.close).toHaveBeenCalledWith(expectedList);
  });

  it('should close the dialog with multiple items when multiple rows are selected', () => {
    const selectedRows = [
      { role: 'PUBLIC', noOfMembers: 5 },
      { role: 'CONTENT_REVIEWER', noOfMembers: 8 }
    ];
    component.selection = new SelectionModel(true, selectedRows);

    component.onNoClick();

    const expectedList = [
      { term: 'PUBLIC', type: 'role' },
      { term: 'CONTENT_REVIEWER', type: 'role' }
    ];
    expect(dialogRefSpy.close).toHaveBeenCalledWith(expectedList);
  });

  it('should reset dataSource to dataSourceList when search is empty', () => {
    component.search = '';
    component.dataSourceList = [{ role: 'PUBLIC', noOfMembers: 5 }];
    component.dataSource = [{ role: 'CONTENT_REVIEWER', noOfMembers: 2 }];

    component.searchQuery();

    expect(component.dataSource).toEqual(component.dataSourceList);
  });

  it('should filter dataSource based on search term', () => {
    component.search = 'PUBLIC';
    component.dataSourceList = [{ role: 'PUBLIC', noOfMembers: 5 }, { role: 'CONTENT_REVIEWER', noOfMembers: 2 }];
    component.dataSource = [{ role: 'PUBLIC', noOfMembers: 5 }, { role: 'CONTENT_REVIEWER', noOfMembers: 2 }];

    component.searchQuery();

    expect(component.dataSource).toEqual([{ role: 'PUBLIC', noOfMembers: 5 }]);
  });

  it('should split camelCase column name into words', () => {
    const result = component.splitColumnName('someColumnName');
    expect(result).toBe('some Column Name');
  });

  it('should handle column names without camelCase', () => {
    const result = component.splitColumnName('ColumnName');
    expect(result).toBe('Column Name');
  });

  it('should handle column names with only one word', () => {
    const result = component.splitColumnName('Name');
    expect(result).toBe('Name');
  });

  it('should return selectedAudiences when slectedRowList is undefined', () => {
    component.slectedRowList;
    const selectedAudiences = [{ term: 'PUBLIC', type: 'role' }];

    const result= component.isAudienceExist(selectedAudiences);

    expect(result).toEqual(selectedAudiences);
  });

  // it('should return selectedAudiences excluding terms in slectedRowList', () => {
  //   component.slectedRowList: any[] = [
  //     { term: 'ADMIN', type: 'role' },
  //     { term: 'USER', type: 'role' }
  //   ];
  //   const selectedAudiences = [
  //     { term: 'ADMIN', type: 'role' },
  //     { term: 'PUBLIC', type: 'role' },
  //     { term: 'USER', type: 'role' }
  //   ];

  //   const result = component.isAudienceExist(selectedAudiences);

  //   expect(result).toEqual([{ term: 'PUBLIC', type: 'role' }]);
  // });

  // it('should return selectedAudiences when slectedRowList is empty', () => {
  //   component.slectedRowList = [];
  //   const selectedAudiences = [{ term: 'PUBLIC', type: 'role' }];

  //   const result = component.isAudienceExist(selectedAudiences);

  //   expect(result).toEqual(selectedAudiences);
  // });

});