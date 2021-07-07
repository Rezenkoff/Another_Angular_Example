import { Injectable } from '@angular/core';
import { Action, Store } from '@ngrx/store';
import { Effect, Actions,ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { map, mergeMap, catchError, switchMap } from 'rxjs/operators';
import * as vehicle from '../actions/vehicle.actions';
import { VehicleHttpService } from '../services/vehicle-http.service';
import * as fromVehicle from '../reducers';
import { Result } from '../../models/result.model';


@Injectable()
export class VehicleEffects {

    constructor(private actions$: Actions, private _vehicleHttpService: VehicleHttpService, private store: Store<fromVehicle.State>) {
    }

    @Effect()
    addVehicle$: Observable<Action> = this.actions$
        .pipe(
            ofType(vehicle.ADD_VEHICLE),
            map((action: vehicle.AddVehicleAction) => action.payload),
            mergeMap(vh =>
                this._vehicleHttpService.addUserVehicle(vh).pipe(
                 map((id) => new vehicle.AddVehicleSuccessAction(id)),
                 catchError(() => of(new vehicle.AddVehicleFailAction(vh)))
                ))
            );

    @Effect()
    editVehicle$: Observable<Action> = this.actions$
        .pipe(
            ofType(vehicle.EDIT_VEHICLE),
            map((action: vehicle.EditVehicleAction) => action.payload),
            mergeMap(vh => this._vehicleHttpService.editUserVehicle(vh).pipe(
                //change type
                map((resp: Result) => new vehicle.EditVehicleSuccessAction(resp)),
                catchError(() => of(new vehicle.EditVehicleFailAction(vh)))
            )));

    @Effect()
    changeIsActive$: Observable<Action> = this.actions$
        .pipe(
            ofType(vehicle.CHANGE_ISACTIVE),
            map((action: vehicle.ChangeIsActive) => action.payload),
            mergeMap(vh => this._vehicleHttpService.disableUserVehicle(vh.id, vh.isActive).pipe(
                //change type
                map((resp: any) => {
                    vh.isActive = (resp.success) ? !vh.isActive : vh.isActive;
                    return new vehicle.ChangeIsActiveSuccess(vh);
                }),
                catchError(() =>of(new vehicle.ChangeIsActiveFail()))
        )));

    @Effect()
    getVehicle$: Observable<Action> = this.actions$
        .pipe(
            ofType(vehicle.GET_VEHICLE),
            map((action: vehicle.GetVehicleAction) => action),
            switchMap(res => this._vehicleHttpService.getUserVehicle().pipe(
                map((resp) => new vehicle.GetVehicleSuccessAction(resp)),
                catchError(() => of(new vehicle.GetVehicleFailAction()))
        )));    
}