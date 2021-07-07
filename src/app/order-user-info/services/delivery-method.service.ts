import { Injectable, Inject } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { APP_CONSTANTS, IAppConstants } from '../../config';
import { map, tap, catchError, share } from "rxjs/operators";
import { ShipmentType } from "../../order-step/models";
import { environment } from "../../../environments/environment";
import { HttpClient, HttpParams } from "@angular/common/http";

var LRU = require("lru-cache");

@Injectable()
export class DeliveryMethodsService {

    public cache: any = null;
    private deliveryPointsObservable: Observable<ShipmentType[]> = null;
    private lastCacheKey: string = '';

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

    public GetDeliveryMethods(orderPaymentKey: number, cityId: number, languageId = 2): Observable<ShipmentType[]> {
        var deliveryKey: string = 'delivery_' + orderPaymentKey + cityId + languageId;
        var cached = this.cache.get(deliveryKey);

        if (cached) {
            return new Observable((observer) => {
                // Order model keeps ShipmentType reference
                //json used to avoid caching of modified objects
                observer.next(JSON.parse(cached));
                observer.complete();
            });
        }

        //if first http request still in progress
        if (deliveryKey == this.lastCacheKey && this.deliveryPointsObservable) {
            return this.deliveryPointsObservable;
        }

        const params = new HttpParams()
            .set("paymentMethodId", orderPaymentKey.toString())
            .set("languageId", languageId.toString())
            .set("cityId", cityId.toString());

        this.lastCacheKey = deliveryKey;

        //intercept for auth
        this.deliveryPointsObservable = this._http.get(environment.apiUrl + 'order/delivery', {params})
            .pipe(
                map((resp: any) => {
                    this.deliveryPointsObservable = null; //clear observable once call ended
                    return resp.map(i => new ShipmentType(i.id, i.name, i.key, i.deliveryPointCount, i.cost, i.isFreeFrom));
                }),
                tap(data => {
                    this.cache.set(deliveryKey, JSON.stringify(data));
                }),
                catchError((error: any) => { return throwError(error) }),
                share());
        return this.deliveryPointsObservable;
    }
}