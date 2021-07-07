import { Component, Output, EventEmitter } from '@angular/core';
import { PromoSliderService } from '../promo-slider.service';
import { CarsPanelStateChange } from '../../car-select-panel/models/cars-panel-state-change.model';

@Component({
    selector: 'car-select-tab',
    templateUrl: './__mobile__/car-select-tab.component.html'
})
export class CarSelectTabComponent {
    @Output() onCarSelectPanelChange: EventEmitter<CarsPanelStateChange[]> = new EventEmitter<CarsPanelStateChange[]>();

    public carPanelSate: CarsPanelStateChange[] = [];

    constructor(private _service: PromoSliderService) { }

    public applyChanges(changes: CarsPanelStateChange[]): void {
        this.carPanelSate = changes;
        this.onCarSelectPanelChange.emit(changes);
    }

    public toCatalog(): void {
        this._service.navigateToCarsCatalog(this.carPanelSate);
    }

    public isCarSelected(): boolean {
        return this.carPanelSate.filter(x => x.selectedOptions.length > 0).length > 0;
    }
}