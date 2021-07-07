import { Component, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'brands-search',
    templateUrl: './__mobile__/brands-search.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class BrandsSearchComponent {
    filterString: string = '';
    @Output() searchChange: EventEmitter<string> = new EventEmitter<string>();

    search() {
        this.searchChange.emit(this.filterString);
    }
} 