import { Injectable } from '@angular/core';
import { Action, Store } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Observable, of, empty } from 'rxjs';
import { withLatestFrom, switchMap, catchError, map } from 'rxjs/operators';
import * as carSelectPanel from '../actions/car-select-panel.actions';
import { CarSelectPanelService } from '../services/car-select-panel.service';
import * as fromFilters from '../reducers';
import { CarExtended, CarMark, CarSerie, CarModel } from '../../cars-catalog/models';
import { StrKeyValueModel } from '../../models/key-value-str.model';
import * as routingParamsService from '../../services/routing-parameters.service';
import { CarFilterKeys } from '../../filters/models/car-filter-keys';

const markTypeKey: string = CarFilterKeys.markKey;
const serieTypeKey: string = CarFilterKeys.serieKey;
const yearTypeKey: string = CarFilterKeys.yearKey;
const modelTypeKey: string = CarFilterKeys.modelKey;
const modifTypeKey: string = CarFilterKeys.modifKey;

@Injectable()
export class CarSelectPanelEffects {

    requestParamLoadMarks = this.store.select(fromFilters.getRequestParams);

    @Effect()
    loadMarks$: Observable<Action> = this.actions$.pipe(
        ofType(carSelectPanel.LOAD_MARKS, carSelectPanel.CANCEL_LOAD_MARKS),
        map((action:Action) => action),
        withLatestFrom(this.requestParamLoadMarks),
        switchMap(([action, state]) =>        
            action.type === carSelectPanel.CANCEL_LOAD_MARKS ?
            empty() :
            this._carselectPanelService.getMarks(action ? (action as any).payload : null).pipe
            (
                switchMap((result: CarMark[]) => [
                    new carSelectPanel.SetMarksOptionsAction(result),
                    new carSelectPanel.SetGenericDropdownLoadStateAction({ filterType: markTypeKey, boolValue: false })
                ]),
                catchError(error => { return of(new carSelectPanel.LoadErrorAction()); })
            )        
    ));

    @Effect()
    loadSeries$: Observable<Action> = this.actions$
        .pipe(
            ofType(carSelectPanel.LOAD_SERIES, carSelectPanel.CANCEL_LOAD_SERIES),
            map((action:Action) => action),
            withLatestFrom(this.store.select(fromFilters.getRequestParams)),
            switchMap(([action, state]) => action.type === carSelectPanel.CANCEL_LOAD_SERIES ?
                empty() :
                this._carselectPanelService.getSeries(state.markKey, action ? (action as any).payload : null).pipe(
                    switchMap((result: CarSerie[]) => [
                        new carSelectPanel.SetSeriesOptionsAction(result),
                        new carSelectPanel.SetGenericDropdownLoadStateAction({ filterType: serieTypeKey, boolValue: false })
                    ]),
                    catchError(error => { return of(new carSelectPanel.LoadErrorAction()); }))
        ));

    @Effect()
    loadModels$: Observable<Action> = this.actions$
        .pipe(
            ofType(carSelectPanel.LOAD_MODELS, carSelectPanel.CANCEL_LOAD_MODELS),
            map((action:Action) => action),
            withLatestFrom(this.store.select(fromFilters.getRequestParams)),
            switchMap(([action, state]) => action.type === carSelectPanel.CANCEL_LOAD_MODELS ?
                empty() :
                this._carselectPanelService.getModels(state).pipe(
                    switchMap((result: CarModel[]) => [
                        new carSelectPanel.SetModelsOptionsAction(result),
                        new carSelectPanel.SetGenericDropdownLoadStateAction({ filterType: modelTypeKey, boolValue: false })
                    ]),
                    catchError(error => { return of(new carSelectPanel.LoadErrorAction()); }))
        ));

    @Effect()
    loadModifs$: Observable<Action> = this.actions$.pipe(
            ofType(carSelectPanel.LOAD_MODIFS, carSelectPanel.CANCEL_LOAD_MODIFS),
            map((action:Action) => action),
            withLatestFrom(this.store.select(fromFilters.getRequestParams)),
            switchMap(([action, state]) => action.type === carSelectPanel.CANCEL_LOAD_MODIFS ?
                empty() :
                this._carselectPanelService.getModifs(state).pipe(
                    switchMap((result: CarExtended[]) => [
                        new carSelectPanel.SetYearsOptionsAction(result),
                        new carSelectPanel.SetGenericDropdownLoadStateAction({ filterType: yearTypeKey, boolValue: false }),
                        new carSelectPanel.SetModifsOptionsAction(result),
                        new carSelectPanel.SetGenericDropdownLoadStateAction({ filterType: modifTypeKey, boolValue: false })
                    ]),
                    catchError(error => { return of(new carSelectPanel.LoadErrorAction()); }))
        ));

    @Effect()
    initByMark$: Observable<Action> = this.actions$
        .pipe(
            ofType(carSelectPanel.INIT_BY_MARK, carSelectPanel.CANCEL_LOAD_MARKS),
            map((action:Action) => action),
            withLatestFrom(this.store.select(fromFilters.getRequestParams)),
            switchMap(([action, state]) => action.type === carSelectPanel.CANCEL_LOAD_MARKS ?
                empty() :
                this._carselectPanelService.getMarks().pipe(
                    switchMap((result: CarMark[]) => {
                        let selectedOption: StrKeyValueModel = { key: result[0].markKey, value: result[0].markName };
                        let markKey = (action as carSelectPanel.InitByMarkAction).payload;
                        let selected = result.find(mark => mark.markKey == markKey);
                        if (selected) {
                            selectedOption = { key: selected.markKey, value: selected.markName }
                        }
                        return [
                            new carSelectPanel.SetMarksOptionsAction(result),
                            new carSelectPanel.SetSelectedMarkAction(selectedOption)
                        ]
                    }),
                    catchError(error => { return of(new carSelectPanel.LoadErrorAction()); }))
            ));

    @Effect()
    initBySerie$: Observable<Action> = this.actions$
        .pipe(
            ofType(carSelectPanel.INIT_BY_SERIE, carSelectPanel.CANCEL_LOAD_SERIES),
            map((action:Action) => action),
            withLatestFrom(this.store.select(fromFilters.getRequestParams)),
            switchMap(([action, state]) => action.type === carSelectPanel.CANCEL_LOAD_SERIES ?
                empty() :
                this._carselectPanelService.restoreCarInfoBySerie(state.serieKey).pipe(
                    switchMap((result: CarExtended) => {
                        return [
                            new carSelectPanel.SetMarksOptionsAction([{ markKey: result.markKey, markName: result.markName, seriesList: [] }]),
                            new carSelectPanel.SetSelectedMarkAction({ key: result.markKey, value: result.markName }),
                            new carSelectPanel.SetSeriesOptionsAction([{ serieKey: result.serieKey, serieName: result.serieName }]),
                            new carSelectPanel.SetSelectedSerieAction({ key: result.serieKey, value: result.serieName })
                        ]
                    }),
                    catchError(error => { return of(new carSelectPanel.LoadErrorAction()); }))
            ));

    @Effect()
    initByModel$: Observable<Action> = this.actions$
        .pipe(
            ofType(carSelectPanel.INIT_BY_MODEL, carSelectPanel.CANCEL_LOAD_MODELS),
            map((action:Action) => action),
            withLatestFrom(this.store.select(fromFilters.getRequestParams)),
            switchMap(([action, state]) => action.type === carSelectPanel.CANCEL_LOAD_MODELS ?
                empty() :
                this._carselectPanelService.restoreCarInfoByModel(state.modelKey).pipe(
                    switchMap((result: CarExtended) => [
                        new carSelectPanel.SetMarksOptionsAction([{ markKey: result.markKey, markName: result.markName, seriesList: [] } as CarMark]),
                        new carSelectPanel.SetSelectedMarkAction({ key: result.markKey, value: result.markName }),
                        new carSelectPanel.SetSeriesOptionsAction([{ serieKey: result.serieKey, serieName: result.serieName } as CarSerie]),
                        new carSelectPanel.SetSelectedSerieAction({ key: result.serieKey, value: result.serieName }),
                        new carSelectPanel.SetModelsOptionsAction([{ modelKey: result.modelKey, modelName: result.modelName } as CarModel]),
                        new carSelectPanel.SetSelectedModelAction({ key: result.modelKey, value: result.modelName }),
                        new carSelectPanel.SetModelInputStateAction(true)
                    ]),
                    catchError(error => { return of(new carSelectPanel.LoadErrorAction()); }))
            ));

    @Effect()
    initByModif$: Observable<Action> = this.actions$.pipe(
            ofType(carSelectPanel.INIT_BY_MODIF),
            map((action:Action) => action),
            withLatestFrom(this.store.select(fromFilters.getRequestParams)),
            switchMap(([action, state]) => 
                (action.type === carSelectPanel.CANCEL_LOAD_MODIFS || !state.modifKey) ?
                empty() :
                this._carselectPanelService.restoreCarInfoByModif(state.modifKey).pipe(
                    switchMap((result: CarExtended) => [
                        new carSelectPanel.SetMarksOptionsAction([{ markKey: result.markKey, markName: result.markName, seriesList: [] } as CarMark]),
                        new carSelectPanel.SetSelectedMarkAction({ key: result.markKey, value: result.markName }),
                        new carSelectPanel.SetSeriesOptionsAction([{ serieKey: result.serieKey, serieName: result.serieName } as CarSerie]),
                        new carSelectPanel.SetSelectedSerieAction({ key: result.serieKey, value: result.serieName }),
                        new carSelectPanel.SetModelsOptionsAction([{ modelKey: result.modelKey, modelName: result.modelName } as CarModel]),
                        new carSelectPanel.SetSelectedModelAction({ key: result.modelKey, value: result.modelName }),                        
                        new carSelectPanel.SetYearsOptionsAction([result]),
                        new carSelectPanel.SetModifsOptionsAction([result]),
                        new carSelectPanel.SetSelectedModifAction({ key: result.typeKey, value: result.typeName }),
                        new carSelectPanel.SetModifInputStateAction(true)
                    ]),
                    catchError(error => { return of(new carSelectPanel.LoadErrorAction()); }))
            )
        );

    @Effect()
    selectMark$: Observable<Action> = this.actions$.pipe(
        ofType(carSelectPanel.SELECT_MARK),
        map((action: carSelectPanel.SetSelectedMarkAction) => action.payload),
        switchMap((option) => [
            new carSelectPanel.SetSelectedMarkAction(option),
            new carSelectPanel.ClearSelectedSerieAction(),
            new carSelectPanel.SetSeriesOptionsAction([])
        ]));

    @Effect()
    selectSerie$: Observable<Action> = this.actions$.pipe(
        ofType(carSelectPanel.SELECT_SERIE),
        map((action: carSelectPanel.SetSelectedSerieAction) => action.payload),
        switchMap((option) => [
            new carSelectPanel.SetSelectedSerieAction(option),
            new carSelectPanel.ClearSelectedModelAction(),
            new carSelectPanel.SetModelsOptionsAction([])
        ]));

    @Effect()
    selectModel$: Observable<Action> = this.actions$.pipe(
        ofType(carSelectPanel.SELECT_MODEL),
        map((action: carSelectPanel.SetSelectedModelAction) => action.payload),
        switchMap((option) => [
            new carSelectPanel.SetSelectedModelAction(option),
            new carSelectPanel.ClearSelectedYearAction(),
            new carSelectPanel.SetYearsOptionsAction([]),
            new carSelectPanel.SetModifsOptionsAction([])
        ]));

    @Effect()
    selectYear$: Observable<Action> = this.actions$.pipe(
        ofType(carSelectPanel.SELECT_YEAR),
        map((action: carSelectPanel.SetSelectedSerieAction) => action.payload),
        switchMap((option) => [
            new carSelectPanel.SetSelectedYearAction(option),
            new carSelectPanel.ClearSelectedModifAction()            
        ]));

    @Effect()
    selectModif$: Observable<Action> = this.actions$.pipe(
        ofType(carSelectPanel.SELECT_MODIF),
        map((action: carSelectPanel.SetSelectedModifAction) => action.payload),
        switchMap((option) => [
            new carSelectPanel.SetSelectedModifAction(option) 
        ]));

    @Effect()
    setMark$: Observable<Action> = this.actions$.pipe(
        ofType(carSelectPanel.SET_SELECTED_MARK),
        map((action: carSelectPanel.SetSelectedMarkAction) => action.payload),
        switchMap((option) => [
            new carSelectPanel.SetMarkRequestParamsAction(option.key),
            new carSelectPanel.SetSerieInputStateAction(true)           
        ]));

    @Effect()
    setSerie$: Observable<Action> = this.actions$.pipe(
        ofType(carSelectPanel.SET_SELECTED_SERIE),
        map((action: carSelectPanel.SetSelectedSerieAction) => action.payload),
        switchMap((option) => [
            new carSelectPanel.SetSerieRequestParamsAction(option.key),
            new carSelectPanel.SetModelInputStateAction(true) 
        ]));

    @Effect()
    setModel$: Observable<Action> = this.actions$.pipe(
        ofType(carSelectPanel.SET_SELECTED_MODEL),
        map((action: carSelectPanel.SetSelectedModelAction) => action.payload),
        switchMap((option) => [
            new carSelectPanel.SetModelRequestParamsAction(option.key),
            new carSelectPanel.SetYearInputStateAction(true)            
        ]));

    @Effect()
    setYear$: Observable<Action> = this.actions$.pipe(
        ofType(carSelectPanel.SET_SELECTED_YEAR),
        switchMap(() => [
            new carSelectPanel.SetModifInputStateAction(true)            
        ]));

    @Effect()
    clearMark$: Observable<Action> = this.actions$.pipe(
        ofType(carSelectPanel.CLEAR_MARK),
        switchMap(() => [
            new carSelectPanel.ClearSelectedSerieAction(),
            new carSelectPanel.SetSerieInputStateAction(false)
        ]));

    @Effect()
    clearSerie$: Observable<Action> = this.actions$.pipe(
        ofType(carSelectPanel.CLEAR_SERIE),
        switchMap(() => [
            new carSelectPanel.ClearSelectedModelAction(),
            new carSelectPanel.SetModelInputStateAction(false)
        ]));

    @Effect()
    clearModel$: Observable<Action> = this.actions$.pipe(
        ofType(carSelectPanel.CLEAR_MODEL),
        switchMap(() => [
            new carSelectPanel.ClearSelectedYearAction(),
            new carSelectPanel.SetYearInputStateAction(false)
        ]));

    @Effect()
    clearYear$: Observable<Action> = this.actions$.pipe(
        ofType(carSelectPanel.CLEAR_YEAR),
        switchMap(() => [
            new carSelectPanel.ClearSelectedModifAction(),
            new carSelectPanel.SetModifInputStateAction(false)
        ]));

    constructor(private actions$: Actions,
        private _carselectPanelService: CarSelectPanelService,
        private store: Store<fromFilters.State>,
        private _routingParamsService: routingParamsService.RoutingParametersService) {
    }
}