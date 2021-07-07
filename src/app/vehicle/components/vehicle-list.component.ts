import { Component, Inject, Input, OnInit } from '@angular/core';
import { APP_CONSTANTS, IAppConstants } from '../../config';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { UserCar } from '../../vehicle/models/user-car.model';
import * as vehicle from '../../vehicle/actions/vehicle.actions';
import * as fromVehicle from '../../vehicle/reducers';
import { EditVehicleComponent } from './edit-vehicle.component';

@Component({
    selector: 'vehicle-list',
    templateUrl: './__mobile__/vehicle-list.component.html',
})

export class VehicleListComponent implements OnInit {

    public userVehicles$: Observable<UserCar[]>;
    @Input() showDisabled: boolean = false;

    constructor(
        private _vehicleStore: Store<fromVehicle.State>, 
        @Inject(APP_CONSTANTS) 
        protected constants: IAppConstants,
        public dialog: MatDialog,         
    ) { }

    ngOnInit() {
        this.userVehicles$ = this._vehicleStore.select(fromVehicle.getUserVehicles);
        this._vehicleStore.dispatch(new vehicle.GetVehicleAction());        
    }

    public getLogo(mark: string): string {
        if (mark == null || mark == undefined)
            return;
        return this.constants.IMAGES.VIN_MODEL_CABINET + mark.toUpperCase() + '.PNG'
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
        //implement sort by colum
    }
}
