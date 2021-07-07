import { Component, Output, EventEmitter } from '@angular/core';
import { UserCar } from '../../vehicle/models/user-car.model';
import { PromoSliderService } from '../promo-slider.service';

@Component({
    selector: 'garage-tab',
    templateUrl: './__mobile__/garage-tab.component.html'
})
export class GarageTabComponent {
    @Output() onCarsCountChange = new EventEmitter<number>();
    public userCar: UserCar = null;

    constructor(private _service: PromoSliderService) { }

    public carCountChanged(count: number): void {
        this.onCarsCountChange.emit(count);
    }

    public selectCar(car: UserCar): void {
        this.userCar = car;
    }

    public toCatalog(): void {
        this._service.navigateToCarsCatalogWithCar(this.userCar);
    }
}