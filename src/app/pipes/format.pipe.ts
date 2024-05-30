import { Pipe, PipeTransform } from '@angular/core';

const currencies: any = {
  'IRR': 'ریال'
};

@Pipe({
  name: 'format',
  standalone: true
})
export class FormatPipe implements PipeTransform {

  transform(value: any, type: 'price' | 'currency' | 'discount', ...args: any[]): unknown {
    switch (type) {
      case 'price':
        return Number(value).toLocaleString('fa-IR');

      case 'currency':
        return currencies[value] ?? value;

      case 'discount':
        return Math.round(value - ((value / args[0]) / 100));

      default:
        return value;
    }
  }

}
