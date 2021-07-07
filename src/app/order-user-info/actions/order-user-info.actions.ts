import { Action } from '@ngrx/store';
import { UserPreferencesModel } from '../../auth/models/user-preferences.model';
import { MarkerModel } from '../../google-maps/models/marker';
import { Settlement } from '../../location';
import { ShipmentType } from '../../order-step/models/shipment-type.model';
import { MainUserInfoModel } from '../models/main-user-info.model';
import { SettlementModel } from '../../location/settlement/settlement.model';
import { DeliveryPointGeocoded } from '../../delivery/points/delivery-point-geocoded.model';
import { Area } from '../../location/area/area.model';

export const SYNC_WITH_PREFERENCES = '[Order user info] Sync with preferences';
export const SET_USER_INFO = '[OrderUserInfo] Set user info';
export const SET_PAYMENT_METHOD = '[OrderUserInfo] Set payment method';
export const SET_DELIVERY_METHOD = '[OrderUserInfo] Set delivery method';
export const SET_DELIVERY_POINT = '[OrderUserInfo] Set delivery point';
export const SET_USER_CITY = '[OrderUserInfo] Set user city';
export const SET_USER_ADDRESS = '[OrderUserInfo] Set user address';
export const SET_COMMENT = '[OrderUserInfo] Set comment';
export const SET_AREA_INFO = '[OrderUserInfo] Set area info';
export const SET_PROMO = '[OrderUserInfo] Set promo';
export const SET_TIRE_DATE = '[OrderUserInfo] Set tire date'

export class SyncWithPreferences implements Action {
    readonly type = SYNC_WITH_PREFERENCES;

    constructor(public payload: UserPreferencesModel) { }
}

export class SetUserInfo implements Action {
    readonly type = SET_USER_INFO;

    constructor(public payload: MainUserInfoModel) { }
}

export class SetPaymentMethod implements Action {
    readonly type = SET_PAYMENT_METHOD;

    constructor(public payload: number) { }
}

export class SetDeliveryMethod implements Action {
    readonly type = SET_DELIVERY_METHOD;

    constructor(public payload: ShipmentType) { }
}

export class SetDeliveryPoint implements Action {
    readonly type = SET_DELIVERY_POINT;

    constructor(public payload: DeliveryPointGeocoded) { }
}

export class SetUserCity implements Action {
    readonly type = SET_USER_CITY;

    constructor(public payload: SettlementModel) { }
}

export class SetUserAddress implements Action {
    readonly type = SET_USER_ADDRESS;

    constructor(public payload: string) { }
}

export class SetTireFittingDate implements Action {
  readonly type = SET_TIRE_DATE;

  constructor(public payload: string) { }
}

export class SetComment implements Action {
    readonly type = SET_COMMENT;

    constructor(public payload: string) { }
}

export class SetAreaInfo implements Action {
    readonly type = SET_AREA_INFO;

    constructor(public payload: Area) { }
}

export class SetPromo implements Action {
    readonly type = SET_PROMO;

    constructor(public promo: string) { }
}

export type Actions =
    SyncWithPreferences
    | SetUserInfo
    | SetPaymentMethod
    | SetDeliveryMethod
    | SetDeliveryPoint
    | SetUserCity
    | SetUserAddress
    | SetAreaInfo
    | SetComment
    | SetPromo
    | SetTireFittingDate;
