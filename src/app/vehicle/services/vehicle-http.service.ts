import { Injectable, Inject } from '@angular/core';
import { AuthHttpService } from '../../auth/auth-http.service';
import { Observable, throwError } from 'rxjs';
import { map, tap, catchError, share, finalize } from 'rxjs/operators';
import { UserCar } from '../models/user-car.model';
import { APP_CONSTANTS, IAppConstants } from '../../config/app-constants';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';

const LRU = require("lru-cache");

@Injectable()
export class VehicleHttpService {
    public cache: any = null;
    private defaultVehicleId: Observable<number>;
    private _getUserVehicleObservable$: Observable<UserCar[]>;

    constructor(
        private _http: HttpClient,
        private _authService: AuthHttpService,
        @Inject(APP_CONSTANTS) private _constants: IAppConstants,
    ) {
        this.defaultVehicleId = new Observable(observer => { observer.next(1); });
        var options = {
            max: this._constants.CACHE.SIZE,
            maxAge: this._constants.CACHE.MAX_AGE
        };
        this.cache = new LRU(options);
    }

    public addUserVehicle(params: UserCar) : Observable<number> {

        if (!this._authService.isAuthenticated())
            return this.defaultVehicleId;

        //intercept for auth
        return this._http.post<number>(environment.apiUrl + 'vehicle/add', JSON.stringify(params)).pipe(
            catchError((error: any) => throwError(error)));
    }

    public getUserVehicle(): Observable<UserCar[]> {

        let cacheKey: string = `user-vehicles`;
        if (this._authService.isAuthenticated())
            cacheKey = cacheKey.concat(`_` + this._authService.getCurrentUser().phone);

        var cached = this.cache.get(cacheKey);
        if (cached) {
            return new Observable((observer) => {
                observer.next(cached);
                observer.complete();
            });
        }

        if (this._getUserVehicleObservable$) {
            return this._getUserVehicleObservable$;
        }

        //intercept for auth
        this._getUserVehicleObservable$ = this._http.get<UserCar[]>(environment.apiUrl + 'vehicle/get').pipe(
            catchError((error: any) => throwError(error)),
            tap(data => this.cache.set(cacheKey, data)),
            finalize(() => this._getUserVehicleObservable$ = null),
            share());

        return this._getUserVehicleObservable$;
    }

    public editUserVehicle(params: UserCar) {
        //intercept for auth
        return this._http.post(environment.apiUrl + 'vehicle/edit', JSON.stringify(params)).pipe(
            catchError((error: any) => throwError(error)))
    }

    public disableUserVehicle(vehicleId: number, isActive: boolean) {
        
        const params = new HttpParams()   
            .set('vehicleId', vehicleId.toString())
            .set('isActive', (!isActive).toString());

        //intercept for auth
        return this._http.get(environment.apiUrl + 'vehicle/disable', {params}).pipe(
            map((resp: any) => resp),
            catchError((error: any) => throwError(error)))
    }
}