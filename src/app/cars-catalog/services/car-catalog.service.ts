import { Injectable, Inject } from '@angular/core';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { map, tap, catchError, share } from 'rxjs/operators';
import { CarMark } from '../models/car-mark.model';
import { CarSerie } from '../models/car-serie.model';
import { CarModel } from '../models/car-model.model';
import { FilterTypesEnum } from '../../filters/models/filter-types.enum';
import { APP_CONSTANTS, IAppConstants } from '../../config';
import { Node } from '../../catalog/models/node.model';
import { SearchParameters } from '../../search/models/search-parameters.model';
import { CarFilterKeys } from '../../filters/models/car-filter-keys';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';

const LRU = require("lru-cache");
const urlDelimiter: string = '--';

@Injectable()
export class CarCatalogService {

    private cache: any;
    private _allCars: CarMark[] = [];
    private _cars$: BehaviorSubject<CarMark[]> = new BehaviorSubject<CarMark[]>([]);
    public carmarksWithSeries: Observable<CarMark[]>;

    constructor(
        @Inject(APP_CONSTANTS) private _constants: IAppConstants,
        private _http:HttpClient
    ) {
        var options = {
            max: this._constants.CACHE.SIZE,
            maxAge: this._constants.CACHE.MAX_AGE
        };
        this.cache = new LRU(options);
    }

    public getAllSeries(): Observable<CarMark[]> {
        let cacheKey: string = 'cars-catalog';

        var cached = this.cache.get(cacheKey);
        if (cached) {
            return new Observable((observer) => {
                observer.next(cached);
                observer.complete();
            });
        }

        //intercept for auth
        this.carmarksWithSeries =  this._http.get<CarMark[]>(environment.apiUrl + 'autocatalog/carmarks-with-series').pipe(
            share(),
            tap((data:any )=> {
                this._allCars = data;
                this.cache.set(cacheKey, data);
                this._cars$.next(this._allCars);
                return this._cars$;
            }),
            catchError(error => throwError(error)));
        
        return this.carmarksWithSeries;
    }

    public getSeriesForMark(markKey: string): Observable<CarMark> {

        let cacheKey: string = `series-${markKey}`;

        var cached = this.cache.get(cacheKey);
        if (cached) {
            return new Observable((observer) => {
                observer.next(cached);
                observer.complete();
            });
        }

        const params = new HttpParams()   
            .set('markKey', markKey);

        //intercept for auth
        return this._http.get<CarMark>(environment.apiUrl + 'autocatalog/carmarks', {params}).pipe(
            map((resp: any) => {
                return (resp[0]) ? resp[0] : null;
            }),
            tap(data => {
                return this.cache.set(cacheKey, data)
            }),
            catchError(error => throwError(error)));
    }

    public getRouteForMark(mark: CarMark): string[] {
        return ['/cars-catalog', this.getFilterTypeMark(mark.markKey)];
    }

    public getRouteForCarSerie(mark: CarMark, serie: CarSerie): string[] {
        return ['/cars-catalog', this.getFilterTypeMark(mark.markKey), this.getFilterTypeSerie(serie.serieKey)];
    }

    public getFilterUrlForCarSerie(serie: string): string {
        return `${serie}`;
    }
    public getFilterUrlForCarMark(carMarkUrl: string): string {
        return `${carMarkUrl}`;
    }

    public getKeyStringFromUrl(url: string): string {
        let arr: string[] = url.split(urlDelimiter);
        return arr[0];
    }

    public getIdFromUrl(url: string): number {
        let keyStr = this.getKeyStringFromUrl(url);
        let startIdx = keyStr.indexOf('-id') + 3;
        let endInx = keyStr.indexOf(urlDelimiter);
        endInx = (endInx > 0) ? endInx : keyStr.length;
        return Number(url.substring(startIdx, endInx));
    }

    public getAutoCatalog(selectedMarkKey: string, selectedSerieKey: string): Observable<Node[]> {
        let cacheKey: string = `${selectedMarkKey}_${selectedSerieKey}`;

        var cached = this.cache.get(cacheKey);
        if (cached) {
            return new Observable((observer) => {
                observer.next(cached);
                observer.complete();
            });
        }

        let markKey = CarFilterKeys.markKey;
        let serieKey = CarFilterKeys.serieKey;

        let searchParams = new SearchParameters();
        searchParams[markKey] = [selectedMarkKey];
        if (selectedSerieKey) {
            searchParams[serieKey] = [selectedSerieKey];
        }

        let requestModel = {
            categoryUrl: searchParams.categoryUrl,
            searchParametersJson: JSON.stringify(searchParams)
        }

        //intercept for auth
        return this._http.post<Node[]>(environment.apiUrl + 'catalog/get-filled', requestModel).pipe(
            tap(data => {
                return this.cache.set(cacheKey, data)
            }),
            catchError(error => throwError(error)));
    }

    public getModelsForSerie(selectedMarkKey: string, selectedSerieKey: string): Observable<CarModel> {
        const params = new HttpParams()
            .set('serieKey', selectedSerieKey)   
            .set('markKey', selectedMarkKey);

        //intercept for auth
        return this._http.get<CarModel>(environment.apiUrl + 'autocatalog/carmodels', {params}).pipe(
            map((resp: any) => {
                let count = resp.length - 1;
                return (resp[count]) ? resp[count] : null;
            }),
            catchError(error => throwError(error)));
    }

    private getFilterTypeMark(mark: string) {
        return `${mark}${urlDelimiter}${FilterTypesEnum.SuitableVehicles_Mark}`;
    }

    private getFilterTypeSerie(serie: string) {
        return `${serie}${urlDelimiter}${FilterTypesEnum.SuitableVehicles_Serie}`;
    }

    public applyFilter(searchString: string): void {
        const filteredCars = (searchString) ?
            this._allCars.filter(car => car.markKey.toLowerCase().includes(searchString.toLowerCase())) :
            this._allCars;

        this._cars$.next(filteredCars);
    }
}
