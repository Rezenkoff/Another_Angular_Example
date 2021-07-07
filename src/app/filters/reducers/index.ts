import { createSelector, createFeatureSelector } from '@ngrx/store';

import * as fromFilters from './filters.reducer';
import * as fromRoot from '../../redux-store/reducers';

export interface FiltersState {
    filters: fromFilters.State;
}

export interface State extends fromRoot.State {
    'filters': FiltersState;
}

export const filtersReducer = {
    filters: fromFilters.reducer
};

export const getFiltersMainState = createFeatureSelector<FiltersState>('filters');
export const getFiltersState = createSelector(getFiltersMainState, (state: FiltersState) => state.filters);

export const getCarFiltersArray = createSelector(getFiltersState, fromFilters.getCarFiltersArray);
export const getDropdownsArray = createSelector(getFiltersState, fromFilters.getDropdowns);
export const getComboboxesArray = createSelector(getFiltersState, fromFilters.getComboboxes);
export const isSuitableVehiclesEnabled = createSelector(getFiltersState, fromFilters.getSuitableVehiclesEnabledProperty);
export const getFiltersDict = createSelector(getFiltersState, fromFilters.getFiltersDict);
export const getTextForCategoryTitle = createSelector(getFiltersState, fromFilters.getTextForCategoryTitle);
export const getRouteParams = createSelector(getFiltersState, fromFilters.getRouteParams);
export const getAppliedOptions = createSelector(getFiltersState, fromFilters.getAppliedOptions);
export const getCategoryUrl = createSelector(getFiltersState, fromFilters.getCategoryUrl);