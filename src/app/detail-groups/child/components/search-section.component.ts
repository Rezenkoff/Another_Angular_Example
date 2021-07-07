import { Component, Input, Output, EventEmitter } from '@angular/core';
import { BaseLoader } from '../../../shared/abstraction/loaderbase.component';

@Component({
    selector: 'search-section',
    templateUrl: './__mobile__/search-section.component.html',
    styleUrls: ['./__mobile__/styles/search-section.component__.scss']
})

export class SearchSectionComponent extends BaseLoader {
    filterString: string = '';
    @Output() searchChange: EventEmitter<string> = new EventEmitter<string>();
    @Input() titleCar: string;

    constructor(
    ) {
        super();
    }

    onSearchChange() {
        this.searchChange.emit(this.filterString);
    }

    searchWithDetailInfoDrop() {
        this.onSearchChange();
    }
} 