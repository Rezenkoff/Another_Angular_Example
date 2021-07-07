import { Injectable, Inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Product } from '../../../../models/product.model';
import { IAppConstants, APP_CONSTANTS } from '../../../../config';
import { SearchParameters as SearchParamsModel } from '../../../../search/models';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';

const LRU = require("lru-cache");

@Injectable()
export class PopularProductService {

    private cache: any = null;

    constructor(private _http: HttpClient,
        @Inject(APP_CONSTANTS) private _constants: IAppConstants) {
        var options = {
            max: this._constants.CACHE.SIZE,
            maxAge: this._constants.CACHE.MAX_AGE
        };
        this.cache = new LRU(options);
    }

    public getPopularProducts(): Observable<Product[]> {
        let cacheKey = 'popular-products'
        let cached = this.cache.get(cacheKey);

        if (cached) {
            return new Observable((observer) => {
                observer.next(cached);
                observer.complete();
            })
        }

        //intercept this for auth
        return this._http.get<Product[]>(environment.apiUrl + 'popularProduct').pipe(           
            tap(data => {
                return this.cache.set(cacheKey, data);
            }),
            catchError((error: any) => { return throwError(error); })
        )
    }

    public getPopularTires(searchParameters: SearchParamsModel): Observable<Product[]> {
        let requestModel = {
            categoryUrl: searchParameters.categoryUrl,
            searchParametersJson: JSON.stringify(searchParameters)
        }

        let cacheKey = `popular-${searchParameters.categoryUrl}`;
        let cached = this.cache.get(cacheKey);

        if (cached) {
            return new Observable((observer) => {
                observer.next(cached);
                observer.complete();
            })
        }
        return this._http.post<Product[]>(environment.apiUrl + 'popularProduct/popular-tires', JSON.stringify(requestModel)).pipe(
            tap(data => { return this.cache.set(cacheKey, data) }),
            catchError((error: any) => throwError(error)));
    }
} 