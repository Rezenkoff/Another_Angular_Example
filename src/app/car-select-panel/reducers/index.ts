import { createSelector, createFeatureSelector } from '@ngrx/store';

import * as fromCarSelectPanel from './car-select-panel.reducer';
import * as fromRoot from '../../redux-store/reducers';

export interface CarSelectPanelState {
    filters: fromCarSelectPanel.State;
}

export interface State extends fromRoot.State {
    'car-filter-panel': CarSelectPanelState;
}

export const carSelectPanelReducer = {
    filters: fromCarSelectPanel.reducer
};

export const getCarSelectPanelMainState = createFeatureSelector<CarSelectPanelState>('car-filter-panel');
export const getCarSelectPanelState = createSelector(getCarSelectPanelMainState, (state: CarSelectPanelState) => state.filters);

export const getRequestParams = createSelector(getCarSelectPanelState, fromCarSelectPanel.getRequestParams);
export const getCarFiltersArray = createSelector(getCarSelectPanelState, fromCarSelectPanel.getCarFiltersArray);
export const getMostSpecificVehicleFilter = createSelector(getCarSelectPanelState, fromCarSelectPanel.getMostSpecificVehicleFilter);
export const getVehicleFiltersState = createSelector(getCarSelectPanelState, fromCarSelectPanel.getVehicleFiltersState);
