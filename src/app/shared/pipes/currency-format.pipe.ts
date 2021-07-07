import { PipeTransform, Pipe } from '@angular/core';

@Pipe({
    name: 'currencyFormat'
})

export class CurrencyFormatPipe implements PipeTransform {
    transform(items: any, ...args: any[]): any {
        items = items.toString();
        items.split(',').forEach(el => {
            items = items.replace(',', ' ');
        });
        return items;
    }
}