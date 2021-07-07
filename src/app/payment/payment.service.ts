import { Injectable, Inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { APP_CONSTANTS, IAppConstants } from '../config/app-constants';
import { PaymentMethod } from './models';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';

var LRU = require("lru-cache");

@Injectable()
export class PaymentService {
    cache: any = null;

    constructor(@Inject(APP_CONSTANTS) private _constants: IAppConstants, private _http: HttpClient) {
        var options = {
            max: this._constants.CACHE.SIZE,
            maxAge: this._constants.CACHE.MAX_AGE
        };

        this.cache = new LRU(options);
    }

    public getPaymentMethods(languageId = 2): Observable<PaymentMethod[]> {
        var key: string = 'payment_' + languageId;
        var cached = this.cache.get(key);

        if (cached) {
            return new Observable((observer) => {
                observer.next(cached);
                observer.complete();
            });
        }

        const params = new HttpParams()
            .set("languageId", languageId.toString());

        return this._http.get<PaymentMethod[]>(environment.apiUrl + 'payment/paymentMethod', {params}).pipe(
            tap(data => this.cache.set(key, data)),
            catchError((error: any) => throwError(error)));
    }

    public getPaymentsByDelyveryPointId(deliveryPointId: number, languageId = 2): Observable<any> {

        const params = new HttpParams()
            .set("languageId",languageId.toString())
            .set("deliveryPointId", deliveryPointId.toString());

        return this._http.get(environment.apiUrl + 'payment/byDeliveryPoint', {params}).pipe(
            map((resp: Response) => resp),
            catchError((error: any) => throwError(error)))
    }
}