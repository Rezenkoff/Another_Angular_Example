import { Component, Inject } from '@angular/core';
import { APP_CONSTANTS, IAppConstants } from '../../config';
import { Observable } from 'rxjs';
import { MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { UserCar } from '../../vehicle/models/user-car.model';
import * as vehicle from '../../vehicle/actions/vehicle.actions';
import * as fromVehicle from '../../vehicle/reducers';

@Component({
    selector: 'edit-vehicle',
    templateUrl: './__mobile__/edit-vehicle.component.html'
})

export class EditVehicleComponent {

    public vehicle$: Observable<UserCar>;
    public vehicle: UserCar;
    public customPatterns = { '0': { pattern: new RegExp('\[a-zA-Zа-яА-Я0-9\]') } };

    constructor(private _vehicleStore: Store<fromVehicle.State>,
        @Inject(APP_CONSTANTS) protected constants: IAppConstants,
        public dialogRef: MatDialogRef<EditVehicleComponent>) {
        this.vehicle$ = this._vehicleStore.select(fromVehicle.getVehicleForEdit);
        this.vehicle$.subscribe(v => this.vehicle = v);
    }

    public close(): void {
        this.dialogRef.close();
    }

    public editVehicle() {
        this._vehicleStore.dispatch(new vehicle.EditVehicleAction(this.vehicle));
        this.dialogRef.close();
    }
}
