import { createSelector, createFeatureSelector } from '@ngrx/store';

import * as fromSearch from './search.reducer';
import * as fromRoot from '../../redux-store/reducers';

export interface SearchState {
    search: fromSearch.State;
}

export interface State extends fromRoot.State {
    'search': SearchState;
}

export const searchReducer = {
    search: fromSearch.reducer
};

export const getSearchMainState = createFeatureSelector<SearchState>('search');

export const getSearchState = createSelector(getSearchMainState, (state: SearchState) => state.search);
export const getSearchParameters = createSelector(getSearchState, fromSearch.getSearchParameters);
export const getProducts = createSelector(getSearchState, fromSearch.getProducts);
export const selectedCarTypes = createSelector(getSearchState, fromSearch.selectedCarTypes);
export const selectedCarModels = createSelector(getSearchState, fromSearch.selectedCarModels);
export const getSelectedFormFactor = createSelector(getSearchState, fromSearch.getSelectedFormFactor);
export const getIsRest = createSelector(getSearchState, fromSearch.getIsRest);
export const getTotalCount = createSelector(getSearchState, fromSearch.getTotalCount);

export const getCarTypes = createSelector(getSearchState, fromSearch.getCarTypes);
export const getCarTypesParameters = createSelector(getSearchState, fromSearch.getCarTypesFilterParams);
export const getCarModels = createSelector(getSearchState, fromSearch.getCarModels);
export const getCarModelsParameters = createSelector(getSearchState, fromSearch.getCarModelsFilterParams);
export const getPromotedFiltersSettings = createSelector(getSearchState, fromSearch.getPromotedFiltersSettings);

export const getFirstProduct = createSelector(getSearchState, fromSearch.getFirstProduct);
export const getFirstFiveProducts = createSelector(getSearchState, fromSearch.getFirstFiveProducts);
export const getImagesLookup = createSelector(getSearchState, fromSearch.getImagesLookup);
export const getLoadState = createSelector(getSearchState, fromSearch.getLoadState);