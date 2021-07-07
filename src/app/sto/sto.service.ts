import { Injectable, Inject } from '@angular/core';
import { APP_CONSTANTS, IAppConstants } from '../config';
import { Observable, throwError, of } from "rxjs";
import { tap, catchError } from "rxjs/operators";
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';

var LRU = require("lru-cache");

@Injectable()
export class StoService {
    cache: any = null;
    stokey: string = 'sto';
    deliveryPointsKey: string = 'deliveryPoints';

    constructor(private _http: HttpClient, @Inject(APP_CONSTANTS) private _constants : IAppConstants) {
        var options = {
            max: this._constants.CACHE.SIZE,
            maxAge: this._constants.CACHE.MAX_AGE
        };

        this.cache = new LRU(options);
    }

    public getAllSto(settlementId?: number, areaId?: number, paymentMethodKey?: number) {
        let cacheKey = this.stokey + settlementId + paymentMethodKey; 
        var cached = this.cache.get(cacheKey);

        if (cached) {
            return of(cached);
        }

        const params = new HttpParams()   
            .set('settlementId', settlementId.toString() || null)
            .set('area', areaId.toString())
            .set('paymentKey', paymentMethodKey.toString());

        return this._http.get(environment.apiUrl + 'sto/get', {params}).pipe(
            tap(data => this.cache.set(cacheKey, data)),
            catchError((error: any) =>  throwError(error)))
  }

  public getAllActivePoints() {
    let cacheKey = "allActive"
    var cached = this.cache.get(cacheKey);

    if (cached) {
      return of(cached);
    }

    return this._http.get(environment.apiUrl + 'sto/get-active-points').pipe(
      tap(data => this.cache.set(cacheKey, data)),
      catchError((error: any) => throwError(error)))
  }

    public getDeliveryPoints(settlementId?: number, areaId?: number, paymentMethodKey?: number) {
        let cacheKey = this.stokey + settlementId + '_DP' + paymentMethodKey; 
        var cached = this.cache.get(cacheKey);

        if (cached) {
            return new Observable((observer) => {
                observer.next(cached);
                observer.complete();
            });
        }

        let params = new HttpParams()   
            .set('mode', 'DP')
            .set('settlementId', settlementId.toString() || null)
            .set('paymentKey', paymentMethodKey?.toString());
        
        if(areaId)
            params = params.set('area', areaId.toString());

        return this._http.get(environment.apiUrl + 'sto/get', {params}).pipe(
            tap(data => this.cache.set(cacheKey, data)),
            catchError((error: any) => throwError(error)))
    }

    public getOrderDeliveryInfo(longitude: number, latitude: number) {

        const params = new HttpParams().set('longitude', longitude.toString()).set('latitude',latitude.toString());

        return this._http.get(environment.apiUrl + 'sto/getorderdeliveryinfo',  {params});
    }    
}
