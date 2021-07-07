import { Injectable, Inject } from '@angular/core';
import { APP_CONSTANTS, IAppConstants } from '../config';
import { UserCar } from '../vehicle/models/user-car.model';
import { NavigationService } from '../services/navigation.service';
import { KeyValueModel } from '../models/key-value.model';
import { Observable, throwError } from "rxjs";
import { catchError, map, tap } from 'rxjs/operators';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';

var LRU = require("lru-cache");

@Injectable()
export class VinSearchService {
    private cache: any = null;

    constructor(
        @Inject(APP_CONSTANTS) private _constants: IAppConstants,
        private _http: HttpClient,
        private navigation: NavigationService) {
        var options = {
            max: this._constants.CACHE.SIZE,
            maxAge: this._constants.CACHE.MAX_AGE
        };

        this.cache = new LRU(options);
    }

    public SearchByVin(vin: string, refId: string = null): any {
        let params = new HttpParams()
            .set('vin', vin);

        if (refId) {
            params = params.set('refId', refId);
        }
        return this._http.get(environment.apiUrl + 'vin/search', { params }).pipe(
            //change type
            map((car: UserCar) => {
                if (car) {
                    car.vin = vin;
                }
                return car;
            }),
            catchError(error => {
                this.navigation.HandleError(error);
                return throwError(error);
            })
        );
    }

    public GetCarMarks(searchPhrase: string): Observable<KeyValueModel[]> {
        var marksCacheKey: string = 'vehicle_marks' + searchPhrase;
        var cached = this.cache.get(marksCacheKey);

        if (cached) {
            return new Observable((observer) => {
                setTimeout(() => {
                    observer.next(cached);
                    observer.complete();
                });
            });
        }

        const params = new HttpParams()
            .set('searchPhrase', searchPhrase);

        return this._http.get<KeyValueModel[]>(environment.apiUrl + 'vin/carmarks', { params }).pipe(
            tap(data => {
                this.cache.set(marksCacheKey, data);
            }),
            catchError(error => {
                this.navigation.HandleError(error);
                return throwError(error);
            }))
    }

    public GetCarModels(markid: number) {
        var modelsCacheKey: string = 'models_by_marks' + markid;
        var cached = this.cache.get(modelsCacheKey);

        if (cached) {
            return new Observable((observer) => {
                setTimeout(() => {
                    observer.next(cached);
                    observer.complete();
                });
            });
        }

        const params = new HttpParams()
            .set('markId', markid.toString());

        return this._http.get<KeyValueModel>(environment.apiUrl + 'vin/carmodels', { params }).pipe(
            tap(data => {
                this.cache.set(modelsCacheKey, data);
            }),
            catchError(error => {
                this.navigation.HandleError(error);
                return throwError(error);
            }))
    }

    public GetModelYears(modelid: number) {
        const params = new HttpParams()
            .set('modelid', modelid.toString());

        return this._http.get<string[]>(environment.apiUrl + 'vin/modelyears', { params }).pipe(
            catchError(error => {
                this.navigation.HandleError(error);
                return throwError(error);
            }))
    }
}