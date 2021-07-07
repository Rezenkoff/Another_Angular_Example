import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, Subject, throwError, of } from "rxjs";
import { map, tap, catchError, share } from "rxjs/operators";
import { APP_CONSTANTS, IAppConstants } from '../config';
import { MarkerModel } from './models/marker';
import { environment } from '../../environments/environment';

var LRU = require("lru-cache");
declare var google: any;

@Injectable()
export class GoogleMapsService {
    public cache: any = null;
    public stoCacheKey: string = 'autodoc';

    private markersObservable: Observable<MarkerModel[]> = null;
    private lastMarkersKey: string = '';

    constructor( @Inject(APP_CONSTANTS) private _constants: IAppConstants, 
    private _http: HttpClient
    ) {
        var options = {
            max: this._constants.CACHE.SIZE,
            maxAge: this._constants.CACHE.MAX_AGE
        };

        this.cache = new LRU(options);
    }

    public GetMarkers(deliveryTypeId: number, paymentKey: number, settlementId?: number): Observable<Array<MarkerModel>> {

        let cacheKey: string = deliveryTypeId + '' + settlementId + '' + paymentKey;
        var cached = this.cache.get(cacheKey) as Array<MarkerModel>;

        if (cached && cached.length > 0) {
            return of(cached);            
        }

        if (cacheKey == this.lastMarkersKey && this.markersObservable) {
            return this.markersObservable;
        }

        const params = new HttpParams()   
        .set('deliveryTypeKey', deliveryTypeId.toString())
        .set('paymentKey', paymentKey.toString());


        if (settlementId)
            params.set('settlementId', settlementId.toString());

        this.lastMarkersKey = cacheKey;
        this.markersObservable = this._http.get<Array<MarkerModel>>(environment.apiUrl + this._constants.G_MAPS.MARKERS_LOAD_PATH, { params }).pipe(

            //change type
            map((response: any) => {
                this.markersObservable = null;
                return response.json().map(obj => new MarkerModel(obj))
            }),
            tap(data => this.cache.set(cacheKey, data)),
            catchError((error: any) => throwError(error)),
            share());
        return this.markersObservable
    }

    public GetStoMarkers(): Observable<Array<MarkerModel>> {
        var cached = this.cache.get(this.stoCacheKey);

        if (cached) {
            return new Observable((observer) => {
                observer.next(cached);
                observer.complete();
            });
        }

        return this._http.get<Array<MarkerModel>>(environment.apiUrl + this._constants.G_MAPS.STO_MARKERS_LOAD_PATH).pipe(
            tap(data => this.cache.set(this.stoCacheKey, data)),
            catchError((error: any) => throwError(error)));
    }
}