import { PipeTransform, Pipe } from '@angular/core';

@Pipe({
    name: 'docfilter',
    pure: false
})

export class DocFilterPipe implements PipeTransform {
    transform(items: any[], args: any[]): any {
        return items.filter(item => item.docType == args);
    }
}
