import { Directive, ElementRef } from '@angular/core';

/**
 * Generated class for the BottomLineDirective directive.
 *
 * See https://angular.io/api/core/Directive for more info on Angular
 * Directives.
 */
@Directive({
  selector: '[bottom-line]' // Attribute selector
})
export class BottomLineDirective {
  constructor(private el: ElementRef) {
    this.el.nativeElement.style.borderBottom = "1px solid #f8f8f8";
  }
}
