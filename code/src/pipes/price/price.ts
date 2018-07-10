import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the PricePipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'pricePipe',
})
export class PricePipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(value, ...args) {
    value = parseInt(value);
    value = isNaN(value) ? 0 : value;
    return (value / 100).toFixed(2);
  }
}
