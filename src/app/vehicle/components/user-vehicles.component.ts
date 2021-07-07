import { Component, Output, Inject, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { APP_CONSTANTS, IAppConstants } from '../../config';
import { Observable, Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { UserCar } from '../../vehicle/models/user-car.model';
import * as vehicle from '../../vehicle/actions/vehicle.actions';
import * as fromVehicle from '../../vehicle/reducers';
import { AddVehicleComponent } from './add-vehicle.component';

@Component({
    selector: 'user-vehicles',
    templateUrl: './__mobile__/user-vehicles.component.html'
})

export class UserVehiclesComponent {

    public userVehicles$: Observable<UserCar[]>;
    public userVehicles: UserCar[] = [];
    private subscription: Subscription = new Subscription();    
    @Output() carSelected: EventEmitter<string> = new EventEmitter<string>();    

    constructor(
        private _vehicleStore: Store<fromVehicle.State>,
        @Inject(APP_CONSTANTS) protected constants: IAppConstants,
        public dialog: MatDialog, 
        private _detector: ChangeDetectorRef
    ) {
        this.userVehicles$ = this._vehicleStore.select(fromVehicle.getActiveUserVehicles);
    }

    ngOnInit() {
        this._vehicleStore.dispatch(new vehicle.GetVehicleAction());
        this.subscription = this.userVehicles$.subscribe(vehicles => { this.userVehicles = vehicles; this._detector.detectChanges(); });
    }

    public getLogo(mark: string): string {
        if (mark == null || mark == undefined)
            return;
        return this.constants.IMAGES.VIN_MODEL_CABINET + mark.toUpperCase() + '.PNG'
    }

    onColumnClick(propertyName: string): void {
        //implement sort by colum
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    private onCarSelected(vehicle: UserCar): void {
        this.carSelected.emit(vehicle.vin);
    }

    toggleAddBox() {
        this.dialog.open(AddVehicleComponent, {});
    }
}