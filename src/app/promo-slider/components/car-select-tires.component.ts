import { Component, Output, EventEmitter, Inject } from '@angular/core';
import { APP_CONSTANTS, IAppConstants } from '../../config';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'car-select-tires',
    templateUrl: './__mobile__/car-select-tires.component.html',
    styleUrls: ['./__mobile__/styles/car-select-tires.component__.scss']
})
export class CarSelectTiresComponent {
    public selectedCar: any[] = [];
    public isCarSelected: boolean = false;
    @Output() public onSelectCar: EventEmitter<any> = new EventEmitter<any>();


    constructor(
        @Inject(APP_CONSTANTS) protected constants: IAppConstants,
        public dialogRef: MatDialogRef<CarSelectTiresComponent>) {
    }

    public onVehicleCreated(): void {
        this.onSelectCar.emit(this.selectedCar);
    }

    public CarIsValid(): boolean {
        return this.isCarSelected;
    }

    public updateCarInfo(changes: any[]): void {
        this.selectedCar = changes;
        this.isCarSelected = true;
    }
}