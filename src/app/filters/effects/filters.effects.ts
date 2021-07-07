import { Injectable } from '@angular/core';
import { Action, Store } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { withLatestFrom, switchMap, map, mergeMap } from 'rxjs/operators';
import * as filtersActions from '../actions/filters.actions';
import { FiltersService } from '../services/filters.service';
import * as fromFilters from '../reducers';
import * as fromSearch from '../reducers';
import * as routingParamsService from '../../services/routing-parameters.service';

@Injectable()
export class FiltersEffects {

    @Effect()
    loadFilterSettings$: Observable<Action> = this.actions$.pipe(
        ofType(filtersActions.LOAD_FILTERS_SETTINGS),
        map((action: filtersActions.LoadFilterSettingsAction) => action.payload),
        switchMap(searchParams =>
            this._filtersService.getFiltersSettings(searchParams.categoryUrl).pipe(
                switchMap(result => [                    
                    new filtersActions.SetCategoryUrlAction(searchParams.categoryUrl),
                    new filtersActions.SetFiltersSettingsAction(result),
                    new filtersActions.SetPromotedFiltersInfoAction(result.filterBlocksList),
                    new filtersActions.SetFiltersDictAction(),
                    new filtersActions.SyncWithSearchParametersAction(searchParams),
                    new filtersActions.SetupRoutingParametersAction(),
                    new filtersActions.SetFiltersSettingsSuccessAction(searchParams)
                ]))
        ));

    @Effect()
    setFilterSettingsSuccess$: Observable<Action> = this.actions$.pipe(
        ofType(filtersActions.SET_FILTERS_SETTINGS_SUCCESS),
        map((action: filtersActions.SetFiltersSettingsSuccessAction) => action.payload),
        withLatestFrom(this.store.select(fromFilters.getComboboxesArray)),
            mergeMap(([searchParams, comboboxes]) => {   
                return comboboxes.map(c => new filtersActions.LoadComboboxOptionsAction({
                    filterType: c.filterType,
                    searchParameters: searchParams,
                    selectedCategory: c.selectedCategoryLabel
            }))
        }));

    @Effect()
    loadFilterOptions$: Observable<Action> = this.actions$.pipe(
        ofType(filtersActions.LOAD_FILTER_OPTIONS),
        map((action: filtersActions.LoadFilterOptionsAction) => action.payload),
        mergeMap(payload => 
            //this._filtersService.getFilterOptions(payload.filterType, payload.selectedCategory, payload.searchParameters).pipe(
            this._filtersService.getFilterOptionsNewGen(payload.filterType, payload.selectedCategory, payload.searchParameters, this.store.select(fromSearch.getComboboxesArray)).pipe(
            switchMap(options => [                    
                    new filtersActions.SetGenericFilterOptionsAction({ filterType: payload.filterType, options: options }),
                    new filtersActions.SetGenericDropdownLoadStateAction({ filterType: payload.filterType, boolValue: false }),
                    new filtersActions.SetGenericDropdownStateAction({ filterType: payload.filterType, boolValue: true }),
                    new filtersActions.SetGenericDropdownLoadStateAction({ filterType: payload.filterType, boolValue: false })
                ])))
        );

    @Effect()
    loadComboboxOptions$: Observable<Action> = this.actions$.pipe(
        ofType(filtersActions.LOAD_COMBOBOX_OPTIONS),
        map((action: filtersActions.LoadComboboxOptionsAction) => action.payload),
        mergeMap(payload =>
            //this._filtersService.getFilterOptions(payload.filterType, payload.selectedCategory, payload.searchParameters).pipe(
            this._filtersService.getFilterOptionsNewGen(payload.filterType, payload.selectedCategory, payload.searchParameters, this.store.select(fromSearch.getComboboxesArray)).pipe(
                switchMap(options => [                    
                    new filtersActions.SetGenericFilterOptionsAction({ filterType: payload.filterType, options: options }),                    
                    new filtersActions.SetupRoutesForComboxAction(payload.filterType),
                    new filtersActions.SetCategoryTitleAction(),
                    new filtersActions.SetGenericDropdownLoadStateAction({ filterType: payload.filterType, boolValue: false })
                ])))
        );

    @Effect()
    setupRoutesForCombobox$: Observable<Action> = this.actions$.pipe(
        ofType(filtersActions.SETUP_ROUTES_FOR_COMBOBOX),
        map((action: filtersActions.SetupRoutesForComboxAction) => action.payload),
        withLatestFrom(this.store.select(fromFilters.getRouteParams)),
        withLatestFrom(this.store.select(fromFilters.getFiltersDict)),
        map(([[filterType, seoRoute], filtersDict]) => {
            let filter = filtersDict[filterType];
            let routesDict = this._routingParamsService.getRoutesDictForFilter(filter, seoRoute);
            return new filtersActions.SetRoutesDictForComboboxAction({ filterType: filterType, routesDict: routesDict })
        }));

    @Effect()
    selectDropdownOption$: Observable<Action> = this.actions$.pipe(
        ofType(filtersActions.SELECT_DROPDOWN_OPTION),
        map((action: filtersActions.SetSelectedDropdownOptionAction) => action.payload),
        switchMap(payload => [
            new filtersActions.SetSelectedDropdownOptionAction(payload),
            new filtersActions.SetupRoutingParametersAction()
        ]));

    @Effect()
    selectComboboxOption$: Observable<Action> = this.actions$.pipe(
        ofType(filtersActions.SELECT_COMBOBOX_OPTION),
        map((action: filtersActions.SetSelectedDropdownOptionAction) => action.payload),
        switchMap(payload => [
            new filtersActions.SetSelectedComboboxOptionAction(payload),
        ]));

    @Effect()
    removePromoted$: Observable<Action> = this.actions$.pipe(
        ofType(filtersActions.REMOVE_PROMOTED_ON_COMBOBOXES),
        switchMap(() => [
            new filtersActions.SetupRoutingParametersAction()
        ]));

    constructor(private actions$: Actions,
        private _filtersService: FiltersService,
        private store: Store<fromFilters.State>,
        private _routingParamsService: routingParamsService.RoutingParametersService) {
    }
}