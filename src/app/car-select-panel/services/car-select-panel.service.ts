import { Injectable, Inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { APP_CONSTANTS, IAppConstants } from '../../config/app-constants';
import { CarMark, CarSerie, CarExtended, CarModel } from '../../cars-catalog/models';
import { DropdownFilterModel } from '../../filters/models/dropdown-filter.model';
import { CarFilterRequestParameters } from '../models/car-filter-request-parameters.model';
import { FilterTypesEnum } from '../../filters/models/filter-types.enum';
import * as handlers from './handlers';
import { Store } from '@ngrx/store';
import * as fromCarSelectPanel from '../reducers';
import { CarFilterKeys } from '../../filters/models/car-filter-keys';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment'

const LRU = require("lru-cache");

const markKey: string = CarFilterKeys.markKey;
const serieKey: string = CarFilterKeys.serieKey;
const yearKey: string = CarFilterKeys.yearKey;
const modelKey: string = CarFilterKeys.modelKey;
const modifKey: string = CarFilterKeys.modifKey;

@Injectable()
export class CarSelectPanelService {

    private cache: any;

    constructor(
        @Inject(APP_CONSTANTS) private _constants: IAppConstants,
        private _http: HttpClient
    ) {
        var options = {
            max: this._constants.CACHE.SIZE,
            maxAge: this._constants.CACHE.MAX_AGE
        };
        this.cache = new LRU(options);
    }

    public getMarks(categoryId?: string): Observable<CarMark[]> {
        let cacheKey: string = `marks-category-${categoryId}`;

        var cached = this.cache.get(cacheKey);
        if (cached) {
            return new Observable((observer) => {
                observer.next(cached);
                observer.complete();
            });
        }

        let params = new HttpParams();
        if (categoryId) {
            params = params.append('categoryId', categoryId);
        }

        //add auth
        return this._http.get<CarMark[]>(environment.apiUrl + 'autocatalog/carmarks', { params: params }).pipe(
            map(resp => resp),
            tap(data => {
                return this.cache.set(cacheKey, data)
            }),
            catchError(error => throwError(error)));
    }

    public getMarksPPTires(): Observable<CarMark[]> {
        let cacheKey: string = `marksPP`;

        var cached = this.cache.get(cacheKey);
        if (cached) {
            return new Observable((observer) => {
                observer.next(cached);
                observer.complete();
            });
        }
        return this._http.get<CarMark[]>(environment.apiUrl + 'autocatalog/carmarks-pp-tires').pipe(
            map(resp => resp),
            tap(data => {
                return this.cache.set(cacheKey, data)
            }),
            catchError(error => throwError(error)));
    }

    public getModelsByMarksPPTires(markKey: string): Observable<CarMark[]> {
        let cacheKey: string = `modelPP${markKey}`;

        var cached = this.cache.get(cacheKey);
        if (cached) {
            return new Observable((observer) => {
                observer.next(cached);
                observer.complete();
            });
        }

        let params = new HttpParams().set('year', '1');

        if (markKey) {
            params = params.set('markKey', markKey);
        }

        //add auth
        return this._http.get<CarMark[]>(environment.apiUrl + 'autocatalog/carmodelbymark-pp-tires', { params }).pipe(
            map(resp => resp),
            tap(data => {
                return this.cache.set(cacheKey, data)
            }),
            catchError(error => throwError(error)));
    }

    public getSeries(markKey: string, categoryId?: string): Observable<CarSerie[]> {
        let cacheKey: string = `series-${markKey}-category-${categoryId}`;

        var cached = this.cache.get(cacheKey);
        if (cached) {
            return new Observable((observer) => {
                observer.next(cached);
                observer.complete();
            });
        }

        let params = new HttpParams();

        if (markKey) {
            params = params.append('markKey', markKey);
        }

        if (categoryId) {
            params = params.append('categoryId', categoryId);
        }

        //add auth
        return this._http.get<CarSerie[]>(environment.apiUrl + 'autocatalog/carseries', { params }).pipe(
            map(resp => {
                let series = resp;

                let other = new CarSerie();
                other.markKey = markKey;
                other.serieKey = null;
                other.serieName = "Все";

                return [...series, other];
            }),
            tap(data => {
                return this.cache.set(cacheKey, data)
            }),
            catchError(error => throwError(error)));
    }

    public getModels(parameters: CarFilterRequestParameters): Observable<CarModel[]> {
        let cacheKey: string = `models-${parameters.modelKey}--${parameters.serieKey}--${parameters.markKey}`;

        var cached = this.cache.get(cacheKey);
        if (cached) {
            return new Observable((observer) => {
                observer.next(cached);
                observer.complete();
            });
        }

        let params = new HttpParams();

        if (parameters.markKey) {
            params = params.set('markKey', parameters.markKey);
        }
        if (parameters.serieKey) {
            params = params.set('serieKey', parameters.serieKey);
        }

        //add auth
        return this._http.get<CarModel[]>(environment.apiUrl + 'autocatalog/carmodels', { params }).pipe(
            map(resp => resp),
            tap(data => {
                return this.cache.set(cacheKey, data)
            }),
            catchError(error => throwError(error)));
    }

    public getModifs(parameters: CarFilterRequestParameters): Observable<CarExtended[]> {
        let cacheKey: string = `modifs-${parameters.modelKey}`;

        var cached = this.cache.get(cacheKey);
        if (cached) {
            return new Observable((observer) => {
                observer.next(cached);
                observer.complete();
            });
        }

        let params = new HttpParams();

        if (parameters.modelKey) {
            params = params.set('modelKey', parameters.modelKey);
        }

        //add auth
        return this._http.get<CarExtended[]>(environment.apiUrl + 'autocatalog/carmodifs', { params }).pipe(
            map(resp => {

                let modifs = resp;

                let other = new CarExtended();
                other.modelKey = parameters.modelKey;
                other.typeKey = null;
                other.typeName = "Все";

                return [...modifs, other];
            }),
            tap(data => {
                return this.cache.set(cacheKey, data)
            }),
            catchError(error => throwError(error)));
    }

    public restoreCarInfoBySerie(serieKey: string): Observable<CarExtended> {
        let cacheKey: string = `serie-ext-${serieKey}`;

        var cached = this.cache.get(cacheKey);
        if (cached) {
            return new Observable((observer) => {
                observer.next(cached);
                observer.complete();
            });
        }

        let params = new HttpParams();
        if (serieKey) {
            params = params.set('serieKey', serieKey);
        }

        //add auth
        return this._http.get<CarExtended>(environment.apiUrl + 'autocatalog/serieinfo', { params }).pipe(
            map(resp => resp),
            tap(data => {
                return this.cache.set(cacheKey, data)
            }),
            catchError(error => throwError(error)));
    }

    public restoreCarInfoByModel(key: string): Observable<CarModel> {
        let cacheKey: string = `models-${key}`;

        var cached = this.cache.get(cacheKey);
        if (cached) {
            return new Observable((observer) => {
                observer.next(cached);
                observer.complete();
            });
        }

        let params = new HttpParams();
        if (key) {
            params = params.set('modelKey', key);
        }

        //add auth
        return this._http.get<CarModel>(environment.apiUrl + 'autocatalog/modelinfo', { params }).pipe(
            map(resp => resp),
            tap(data => {
                return this.cache.set(cacheKey, data)
            }),
            catchError(error => throwError(error)));
    }

    public restoreCarInfoByModif(key: string): Observable<CarExtended> {
        let cacheKey: string = `car-ext-${key}`;

        var cached = this.cache.get(cacheKey);
        if (cached) {
            return new Observable((observer) => {
                observer.next(cached);
                observer.complete();
            });
        }

        let params = new HttpParams();
        if (key) {
            params = params.set('modifKey', key);
        }

        return this._http.get<CarExtended>(environment.apiUrl + 'autocatalog/modifinfo', { params }).pipe(
            map(resp => resp),
            tap(data => {
                return this.cache.set(cacheKey, data)
            }),
            catchError(error => throwError(error)));
    }

    public getModifsBySerie(parameters: CarFilterRequestParameters): Observable<CarExtended[]> {

        let params = new HttpParams();

        if (parameters.markKey) {
            params = params.set('markKey', parameters.markKey);
        }
        if (parameters.serieKey) {
            params = params.set('serieKey', parameters.serieKey);
        }

        return this._http.get<CarExtended[]>(environment.apiUrl + 'autocatalog/carmodifs-by-serie', { params }).pipe(
            map(resp => {
                return resp;
            }),
            catchError(error => throwError(error)));
    }
    
    public GetHandler(type: FilterTypesEnum, store: Store<fromCarSelectPanel.State>): handlers.ICarSelectPanelHandler {
        switch (type) {
            case FilterTypesEnum.SuitableVehicles_Mark:
                return new handlers.MarkHandler(store);
            case FilterTypesEnum.SuitableVehicles_Serie:
                return new handlers.SerieHandler(store);
            case FilterTypesEnum.SuitableVehicles_Year:
                return new handlers.YearHandler(store);
            case FilterTypesEnum.SuitableVehicles_Model:
                return new handlers.ModelHandler(store);
            case FilterTypesEnum.SuitableVehicles_Modif:
                return new handlers.ModifHandler(store);
            default:
                return null;
        }
    }

    public getDefaultVehicleFilterSetting(): DropdownFilterModel[] {
        return [
            {
                filterType: markKey,
                isPromoted: true,
                options: [],
                positionPriority: -6,
                selectedCategoryLabel: "suitableVehicle",
                titleRus: "Марка",
                titleUkr: "Марка",
                selectedOptions: [],
                optionsFullList: [],
                placeholder: "Выберите марку"
            }, {
                filterType: serieKey,
                isPromoted: true,
                options: [],
                positionPriority: -5,
                selectedCategoryLabel: "suitableVehicle",
                titleRus: "Серия",
                titleUkr: "Серія",
                selectedOptions: [],
                optionsFullList: [],
                placeholder: "Выберите серию"
            }, {
                filterType: modelKey,
                isPromoted: false,
                options: [],
                positionPriority: -4,
                selectedCategoryLabel: "suitableVehicle",
                titleRus: "Модель",
                titleUkr: "Модель",
                selectedOptions: [],
                optionsFullList: [],
                placeholder: "Выберите модель"
            }, {
                filterType: yearKey,
                isPromoted: false,
                options: [],
                positionPriority: -3,
                selectedCategoryLabel: "suitableVehicle",
                titleRus: "Год",
                titleUkr: "Рiк",
                selectedOptions: [],
                optionsFullList: [],
                placeholder: "Выберите год"
            }, {
                filterType: modifKey,
                isPromoted: false,
                options: [],
                positionPriority: -2,
                selectedCategoryLabel: "suitableVehicle",
                titleRus: "Модификация",
                titleUkr: "Модифiкацiя",
                selectedOptions: [],
                optionsFullList: [],
                placeholder: "Выберите модификацию"
            }
        ];
    }
}