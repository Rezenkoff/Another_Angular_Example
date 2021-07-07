import { Component, Inject } from '@angular/core';
import { APP_CONSTANTS, IAppConstants } from '../../config';
import { Observable } from 'rxjs';
import { MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { UserCar } from '../../vehicle/models/user-car.model';
import * as vehicle from '../../vehicle/actions/vehicle.actions';
import * as fromVehicle from '../../vehicle/reducers';

@Component({
    selector: 'short-vehicle-list',
    templateUrl: './__mobile__/short-vehicle-list.component.html'
})

export class ShortVehicleListComponent {

    public userVehicles$: Observable<UserCar[]>;
    public userVehicles: UserCar[] = [];
    subscription: any;

    constructor(private _vehicleStore: Store<fromVehicle.State>,
        @Inject(APP_CONSTANTS) protected constants: IAppConstants,
        public dialogRef: MatDialogRef<ShortVehicleListComponent>) {
        this._vehicleStore.dispatch(new vehicle.GetVehicleAction());
        this.userVehicles$ = this._vehicleStore.select(fromVehicle.getActiveUserVehicles);
        this.subscription = this.userVehicles$.subscribe(vehicles => this.userVehicles = vehicles);
    }

    public getLogo(mark: string): string {
        if (mark == null || mark == undefined)
            return;
        return this.constants.IMAGES.VIN_MODEL_CABINET + mark.toUpperCase() + '.PNG'
    }

    selectUserVehicle(vehicle) {
        this.dialogRef.close(vehicle);
    }

    public close(): void {
        this.dialogRef.close();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}
