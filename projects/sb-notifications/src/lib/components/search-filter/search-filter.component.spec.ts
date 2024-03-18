import { ComponentFixture, TestBed, fakeAsync, tick, waitForAsync } from '@angular/core/testing';

import { SearchFilterComponent } from './search-filter.component';
import { EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';

describe('SearchFilterComponent', () => {
  let component: SearchFilterComponent;
  let fixture: ComponentFixture<SearchFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchFilterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize searchText as an empty string', () => {
    expect(component.searchText).toBe('');
  });

  it('should create an EventEmitter named updateSearchResults', () => {
    expect(component.updateSearchResults).toEqual(jasmine.any(EventEmitter));
  });

  it('should create a Subject named onModelChangeSubject', () => {
    expect(component.onModelChangeSubject).toEqual(jasmine.any(Subject));
  });

  it('should subscribe to onModelChangeSubject with debounceTime and call search()', fakeAsync(() => {
    spyOn(component, 'search');

    component.onModelChangeSubject.next('test');
    
    tick(500);
    fixture.detectChanges();
  
    expect(component.search).toHaveBeenCalled();
  }));

  it('should emit searchText through updateSearchResults when search() is called', () => {
    const mockSearchText = 'test';
    spyOn(component.updateSearchResults, 'emit');

    component.searchText = mockSearchText;
    component.search();

    expect(component.updateSearchResults.emit).toHaveBeenCalledWith(mockSearchText);
  });
});
