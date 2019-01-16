import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'stringPipe'
})
export class StringPipe implements PipeTransform {
  wrapCharNumber: number = 39;

  /*
    Takes a value and makes it lowercase.
   */
  transform(value: string): string {
    // value = value + ''; // make sure it's a string
    // return value.toLowerCase();
    if (value.length > this.wrapCharNumber) {
      return value.substring(0, this.wrapCharNumber) + "...";
    } else {
      return value;
    }
  }
}
