import { PipeTransform, Pipe } from '@angular/core';

@Pipe({
    name: 'sortByKey'
})

export class SortByKey implements PipeTransform {
    transform(array: any[], args: string[]): any {
        array.sort((a: any, b: any) => {
            return parseInt(a.key) > parseInt(b.key) ? 1 : -1;
        });
        return array;
    }
}