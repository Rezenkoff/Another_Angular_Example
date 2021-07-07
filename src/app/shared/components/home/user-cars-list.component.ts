import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { UserCar } from '../../../vehicle/models/user-car.model';
import { VehicleHttpService } from '../../../vehicle/services/vehicle-http.service';

@Component({
    selector: 'user-cars-list',
    templateUrl: './__mobile__/user-cars-list.component.html',
})
export class UserCarsListComponent implements OnInit {
    public userCars: UserCar[] = [];
    private _selectedCar: UserCar = null;

    @Output() onCarSelect = new EventEmitter<UserCar>();
    @Output() onCarsCountChanged = new EventEmitter<number>();

    constructor(
        private _vehicleHttpService: VehicleHttpService,
    ) { }

    ngOnInit() {
        this._vehicleHttpService.getUserVehicle().subscribe(result => {
            this.userCars = result.filter(x => x.isActive);
            this.onCarsCountChanged.emit(this.userCars.length);
        });
    }

    public selectCarFromGarage(item: UserCar) {
        this._selectedCar = item;
        this.onCarSelect.emit(item);
    }

    public getYearFromDate(date: string) {
        if (date.length === 0) {
            return '';
        }
        if (date.length === 4) {
            return date;
        }
        let splittedDate = date.split('.');
        return splittedDate[2];
    }

    public isSelected(car: UserCar): boolean {
       return car == this._selectedCar;
    }
}