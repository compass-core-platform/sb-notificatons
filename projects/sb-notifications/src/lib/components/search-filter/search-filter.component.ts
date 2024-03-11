import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { debounceTime } from 'rxjs/operators';
import { Subject } from 'rxjs';


@Component({
  selector: 'search-filter',
  templateUrl: './search-filter.component.html',
  styleUrls: ['./search-filter.component.scss']
})
export class SearchFilterComponent implements OnInit {
  
  searchText = '';
  @Output() updateSearchResults = new EventEmitter();
  public onModelChangeSubject = new Subject<string>();  

  constructor() { }

  ngOnInit(): void {

    this.onModelChangeSubject.pipe(debounceTime(500)).subscribe(_ => {
      this.search();
    });
    
  }

  search() {
    this.updateSearchResults.emit(this.searchText);
  }

}
