import { Inject, Injectable } from "@angular/core";
import { Observable, throwError, BehaviorSubject } from "rxjs";
import { APP_CONSTANTS, IAppConstants } from "../../app/config/app-constants";
import { CategoryAutoModel } from '../search/models/category-plus.model';
import { map, catchError, tap } from 'rxjs/operators';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from "../../environments/environment";


const LRU = require("lru-cache");
@Injectable()
export class CategoryPlusService {
    public cache: any = null;

    constructor(
        @Inject(APP_CONSTANTS) private _constants: IAppConstants,
        private _httpClient: HttpClient
    ) {
        var options = {
            max: this._constants.CACHE.SIZE,
            maxAge: this._constants.CACHE.MAX_AGE
        };
        this.cache = new LRU(options);
    }

    public getUrlsForAuto(categoryAutoModel: CategoryAutoModel): Observable<CategoryAutoModel[]> {
        let cacheKey: string = categoryAutoModel.categoryPlusAutoUrl + categoryAutoModel.carMarkId;

        var cached = this.cache.get(cacheKey);
        if (cached) {
            return new Observable((observer) => {
                observer.next(cached);
                observer.complete();
            });
        }

        let params = {
            'CategoryId': (categoryAutoModel.categoryId ? categoryAutoModel.categoryId: ''),
            'CarMarkId': (categoryAutoModel.carMarkId ? categoryAutoModel.carMarkId: ''),
            'CarSerieId': (categoryAutoModel.carSerieId ? categoryAutoModel.carSerieId : ''),
            'CategoryPlusAutoUrl': (categoryAutoModel.categoryPlusAutoUrl ? categoryAutoModel.categoryPlusAutoUrl : '')
        };

        return this._httpClient.get(environment.apiUrl + 'metaservice/get-url-for-auto', {params}).pipe(
            map(resp => resp as CategoryAutoModel[]),
            tap(data => {
                this.cache.set(cacheKey, data);
            }),
            catchError(error => throwError(error)));

    }
}