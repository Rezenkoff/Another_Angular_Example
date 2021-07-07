import { Component, Inject, Output, OnInit, Input } from '@angular/core';
import { APP_CONSTANTS, IAppConstants } from '../../config';
import { Subscription, Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { UserCar } from '../../vehicle/models/user-car.model';
import * as vehicle from '../../vehicle/actions/vehicle.actions';
import * as fromVehicle from '../../vehicle/reducers';
import { EditVehicleComponent } from './';
import { EventEmitter } from '@angular/core';

@Component({
    selector: 'vehicle-list-mygarage',
    templateUrl: './__mobile__/vehicle-list-mygarage.component.html',
    styleUrls: ['./__mobile__/styles/vehicle-list-mygarage.component__.scss']
})

export class VehicleListMyGarageComponent implements OnInit {

    public userVehicles$: Observable<UserCar[]> = new Observable<UserCar[]>();
    public userVehicles: UserCar[] = [];
    @Input() showDisabled: boolean = false;
    @Output() onSelectedUserCar = new EventEmitter<UserCar>();
    public currentCar: number = -1;

    constructor(
        private _vehicleStore: Store<fromVehicle.State>,
        @Inject(APP_CONSTANTS)
        protected constants: IAppConstants,
        public dialog: MatDialog,
    ) { }

    ngOnInit() {
        this.userVehicles$ = this._vehicleStore.select(fromVehicle.getUserVehicles);
        this.userVehicles$.subscribe(carsList => {
            this.userVehicles = carsList;
        });
    }

    public getLogo(vehicle: UserCar): string {
        if (vehicle.mark == null || vehicle.mark == undefined)
            return;

        if (vehicle.urlImg != null || vehicle.urlImg != undefined || vehicle.urlImg != '') {
            return vehicle.urlImg;
        }

        return this.constants.IMAGES.VIN_MODEL_CABINET + vehicle.mark.toUpperCase() + '.PNG'
    }

    getDisButtonBackgroud(isActive: boolean): string {
        return isActive ? this.constants.STYLING.DISABLE_COLOR : this.constants.STYLING.ENABLE_COLOR;
    }

    changeActive(userVehicle: UserCar) {
        this._vehicleStore.dispatch(new vehicle.ChangeIsActive(userVehicle));
    }

    public toggleEditBox(vehicleId: number): void {
        this._vehicleStore.dispatch(new vehicle.SetVehicleIdForEditAction(vehicleId));
        let dialogRef = this.dialog.open(EditVehicleComponent, {});
    }

    onColumnClick(propertyName: string): void {
    }

    public selectedCar(userCar: UserCar) {
        this.currentCar = userCar.id;
        this.onSelectedUserCar.emit(userCar);
    }
}
