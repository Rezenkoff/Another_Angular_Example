import { Injectable, Inject } from '@angular/core';
import { Observable, throwError, of } from 'rxjs';
import { map, catchError, tap, share } from 'rxjs/operators';
import { FiltersSettingsModel } from '../models/filters-settings.model';
import { SearchParameters} from '../../search/models/search-parameters.model';
import { APP_CONSTANTS, IAppConstants } from '../../config';
import { StrKeyValueModel, GroupModel, StrKeyValueSizeModel } from '../../models/key-value-str.model';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { environment } from "../../../environments/environment";

const LRU = require("lru-cache");

@Injectable()
export class FiltersService {

    private cache: any;
    private category: string;

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

    public getFiltersSettings(categoryUrl: string): Observable<FiltersSettingsModel> {
        var cached = this.cache.get(categoryUrl);
        if (cached) {
            return new Observable((observer) => {
                observer.next(cached);
                observer.complete();
            });
        }

        const params = new HttpParams().
            set('categoryUrl', categoryUrl);
        
        return this._http.get<FiltersSettingsModel>(environment.apiUrl + 'filters/get-filters-settings', { params }).pipe(            
            map(resp => resp),
            tap(data => this.cache.set(categoryUrl, data)),
            catchError(error => throwError(error)));
    }

    public getFilterOptions(filterType: string, selectedCategory: string, filtersModel: SearchParameters): Observable<Array<StrKeyValueSizeModel>> {
        if (selectedCategory == "tires" && (filtersModel as object).hasOwnProperty("SuitableVehicles_Mark") && (filterType == "Tire_Season" || filterType == "Tire_Manufacturer" || filterType == "Tire_Usage")) {
            return of(new Array<StrKeyValueSizeModel>());
        }

        let cacheKey = filterType + JSON.stringify(filtersModel);
        let cached = this.cache.get(cacheKey);
        if (cached) {
            return new Observable((observer) => {
                observer.next(cached);
                observer.complete();
            });
        }

        filtersModel = { ...filtersModel, selectedCategory : selectedCategory };

        const params = {
            "filterType": filterType,
            "jsonGetParams": JSON.stringify(filtersModel)
        };

        return this._http.post<Array<StrKeyValueSizeModel>>(environment.apiUrl + 'filters/get-filters-options', JSON.stringify(params)).pipe(                   
            tap(data => {               
                this.cache.set(cacheKey, data);
            }

            ),
            catchError(error=> throwError(error)));
    }   
    public filterManufactired$: Observable<any>;
    public filterAllGroup$: Observable<Array<GroupModel>>;
    public filterAll$: Observable<Array<StrKeyValueModel>>;
    private countQueryMethod = 0;
    
    public getFilterOptionsNewGen(filterType: string, selectedCategory: string, filtersModel: SearchParameters, payload?: any): Observable<Array<StrKeyValueSizeModel>> {
        if(this.category != selectedCategory){
            this.countQueryMethod = 0;
            this.category = selectedCategory;
        }
        this.category = selectedCategory;
        if (selectedCategory == "tires" && (filtersModel as object).hasOwnProperty("SuitableVehicles_Mark") && (filterType == "Tire_Season" || filterType == "Tire_Manufacturer" || filterType == "Tire_Usage")) {
            return of(new Array<StrKeyValueSizeModel>());
        }
        if (selectedCategory == "tires" && (filtersModel as object).hasOwnProperty("SuitableVehicles_Mark")) {
            let filterTireAuto = this.getFilterOptions(filterType, selectedCategory, filtersModel);
            return filterTireAuto;
        }

        let count: number;
        let groupNumber: number;
        payload.subscribe(x => {
            count = x.length - 1;  
            if(x.filter(x => x.filterType == filterType)[0])
            {
                groupNumber = x.filter(x => x.filterType == filterType)[0].groupNewGeneration;
            }       
            
        });

        let cached;
        let cacheKey;
      
        cacheKey = filterType + JSON.stringify(filtersModel);
        cached = this.cache.get(cacheKey); 

        if (cached) {
            return new Observable((observer) => {
                observer.next(cached);
                observer.complete();
            });
        }

        filtersModel.selectedCategory = selectedCategory;

        let  params = {
              "filterType": filterType,
              "jsonGetParams": JSON.stringify(filtersModel)
        };
        
        if (filterType.includes("_Manufacturer")) {
            this.filterManufactired$ = this._http.post(environment.apiUrl +'filters/get-filters-options-newgen', JSON.stringify(params)).pipe(
                tap(data => { this.cache.set(cacheKey, data);}),
                catchError(error => throwError(error)));

            return this.filterManufactired$.pipe(map(x => {
                return x;
            }));  
        }
        else {
            this.countQueryMethod++;
            let targetFromAll$: Observable<any>;

            if(this.countQueryMethod == 1){

                this.filterAllGroup$ = this.getAllFilter(params);
                                
            }
            else{
                if(this.countQueryMethod == count){
                    this.countQueryMethod = 0;
                }
            }   
            
            targetFromAll$ = this.getCurentGroup(groupNumber, cacheKey); 
            return targetFromAll$; 
        } 
    }

    private getCurentGroup(groupNumber: number, cacheKey: string): Observable<any>{
         return this.filterAllGroup$.pipe(
            map(x => {
                let res = x.filter(item => item.groupKey == groupNumber);
                if(res[0]){
                    return res[0].values;
                }
                else{
                    return [];
                }
            }),
            tap(res => {this.cache.set(cacheKey, res)}),
            catchError(error => throwError(error))
        );
    }

    public getAllFilter(params: any): Observable<Array<GroupModel>> {
        let cached;
        let cacheKey;
      
        cacheKey = JSON.stringify(params);
        cached = this.cache.get(cacheKey); 

        if (cached) {
            return new Observable((observer) => {
                observer.next(cached);
                observer.complete();
            });
        }

        return this._http.post<Array<GroupModel>>(environment.apiUrl + 'filters/get-filters-options-newgen', JSON.stringify(params)).pipe(
            share(),
            tap(res => {this.cache.set(cacheKey, res)}), 
            catchError(error => throwError(error)));
    }

    public getFilterOptionsCar(filterType: string, filtersModel: string[]): Observable<Array<StrKeyValueModel>> {

        let cacheKey = filterType + JSON.stringify(filtersModel);
        let cached = this.cache.get(cacheKey);
        if (cached) {
            return new Observable((observer) => {
                observer.next(cached);
                observer.complete();
            });
        }

        const params = new HttpParams()
            .set("Mark", `${filtersModel[0]}`)
            .set("Model", `${filtersModel[1]}`)
            .set("Type", `${filtersModel[2]}`);

        return this._http.get<Array<StrKeyValueModel>>(environment.apiUrl + 'filters/get-filters-car',  { params }).pipe(            
            tap(data => this.cache.set(cacheKey, data)),
            catchError(error => throwError(error)));
    }  
}