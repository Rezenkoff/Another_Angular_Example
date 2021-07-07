import { createSelector, createFeatureSelector } from '@ngrx/store';

import * as fromVehicle from './vehicle.reducer';
import * as fromRoot from '../../redux-store/reducers';

export interface VehicleState {
    vehicles: fromVehicle.State;
}

export interface State extends fromRoot.State {
    'vehicle': VehicleState;
}

export const vehicleReducer = {
    vehicles: fromVehicle.reducer
};

export const getVehicleMainState = createFeatureSelector<VehicleState>('vehicle');

export const getVehiclesState = createSelector(getVehicleMainState, (state: VehicleState) => state.vehicles);


export const getUserVehicles = createSelector(getVehiclesState, fromVehicle.getUserVehicles);
export const getActiveUserVehicles = createSelector(getVehiclesState, fromVehicle.getActiveUserVehicles);
export const getVehiclesForFilter = createSelector(getVehiclesState, fromVehicle.getVehiclesForFilter);
export const getVehicleForEdit = createSelector(getVehiclesState, fromVehicle.getVehicleForEdit);
export const getActiveUserVehiclesCount = createSelector(getVehiclesState, fromVehicle.getActiveUserVehiclesCount);
