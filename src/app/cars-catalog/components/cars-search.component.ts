import { Component, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'cars-search',
    templateUrl: './__mobile__/cars-search.component.html',
    styleUrls: ['./__mobile__/styles/cars-search.component__.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class CarsSearchComponent {
    public filterString: string = '';
    @Output() searchChange: EventEmitter<string> = new EventEmitter<string>();

    search() {
        this.searchChange.emit(this.filterString);
    }
} 