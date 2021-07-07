import { Action } from '@ngrx/store';
import { UserCar } from '../models/user-car.model';
import { Result } from '../../models/result.model';

export const GET_VEHICLE = '[VehicleState] GEt vehicle';
export const GET_VEHICLE_SUCCESS = '[VehicleState] Get vehicle success';
export const GET_VEHICLE_FAIL = '[VehicleState] Get vehicle fail';

export const ADD_VEHICLE = '[VehicleState] Add vehicle';
export const ADD_VEHICLE_SUCCESS = '[VehicleState] Add vehicle success';
export const ADD_VEHICLE_FAIL = '[VehicleState] Add vehicle fail';

export const EDIT_VEHICLE = '[VehicleState] Edit vehicle';
export const EDIT_VEHICLE_SUCCESS = '[VehicleState] Edit vehicle success';
export const EDIT_VEHICLE_FAIL = '[VehicleState] Edit vehicle failed';

export const CHANGE_ISACTIVE = '[VehicleState] Disable/enable vehicle';
export const CHANGE_ISACTIVE_SUCCESS = '[VehicleState] Disable/enable vehicle success';
export const CHANGE_ISACTIVE_FAIL = '[VehicleState] Disable/enable vehicle failed';

export const SET_VEHICLE_ID_FOR_EDIT = '[VehicleState] Set vehicle id'



export class AddVehicleAction implements Action {
    readonly type = ADD_VEHICLE;

    constructor(public payload: UserCar) { }
}

export class AddVehicleSuccessAction implements Action {
    readonly type = ADD_VEHICLE_SUCCESS;

    constructor(public payload: number) { }
}

export class AddVehicleFailAction implements Action {
    readonly type = ADD_VEHICLE_FAIL;

    constructor(public payload: UserCar) { }
}

export class EditVehicleAction implements Action {
    readonly type = EDIT_VEHICLE;

    constructor(public payload: UserCar) { }
}

export class EditVehicleSuccessAction implements Action {
    readonly type = EDIT_VEHICLE_SUCCESS;

    constructor(public payload: Result) { }
}

export class EditVehicleFailAction implements Action {
    readonly type = EDIT_VEHICLE_FAIL;

    constructor(public payload: UserCar) { }
}

export class ChangeIsActive implements Action {
    readonly type = CHANGE_ISACTIVE;

    constructor(public payload: UserCar) { }
}

export class ChangeIsActiveSuccess implements Action {
    readonly type = CHANGE_ISACTIVE_SUCCESS;

    constructor(public payload: UserCar) { }
}

export class ChangeIsActiveFail implements Action {
    readonly type = CHANGE_ISACTIVE_FAIL;

    constructor() { }
}

export class GetVehicleFailAction implements Action {
    readonly type = GET_VEHICLE_FAIL;

    constructor() { }
}

export class GetVehicleSuccessAction implements Action {
    readonly type = GET_VEHICLE_SUCCESS;

    constructor(public payload: UserCar[]) { }
}

export class GetVehicleAction implements Action {
    readonly type = GET_VEHICLE;

    constructor() { }
}

export class SetVehicleIdForEditAction implements Action {
    readonly type = SET_VEHICLE_ID_FOR_EDIT;

    constructor(public payload: number) { }
}

export type Actions =
    AddVehicleAction
    | EditVehicleAction
    | ChangeIsActive
    | ChangeIsActiveSuccess
    | ChangeIsActiveFail
    | AddVehicleFailAction
    | EditVehicleFailAction
    | AddVehicleSuccessAction
    | EditVehicleSuccessAction
    | GetVehicleAction
    | GetVehicleSuccessAction
    | GetVehicleFailAction
    | SetVehicleIdForEditAction;