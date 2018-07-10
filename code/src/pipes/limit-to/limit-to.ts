import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the LimitToPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'limitTo',
})
export class LimitToPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(value, ...args) {
    return value.substring(0,args[0]);
  }
}
