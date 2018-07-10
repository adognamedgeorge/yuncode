import { Component, Input, Output, EventEmitter } from '@angular/core';

/**
 * Generated class for the SearchHeaderComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'search-header',
  templateUrl: 'search-header.html'
})
export class SearchHeaderComponent {
  @Input() searchStatus : boolean;
  @Output() eventss =new EventEmitter();
  text: string;
  constructor() {
  }
  searchStatusChange() {
    this.searchStatus = !this.searchStatus;
    this.eventss.emit(this.searchStatus);
  }

}
