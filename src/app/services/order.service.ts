import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { ShipmentType } from '../order-step/models/index';
import { Observable, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { InvoiceRow } from '../models/invoice-row.model';
import { APP_CONSTANTS, IAppConstants } from '../config';
import { SearchParameters } from '../models/order-search-parameters.model';
import { OrderCreationModel } from '../shoping-cart/models/order-creation-model.model';
import { StatusInvoice } from '../models/status-invoice.model';
import { NavigationService } from '../services/navigation.service';
import { environment } from '../../environments/environment';
import  FileSaver from 'file-saver';
var LRU = require("lru-cache");

@Injectable()
export class OrderService {
    public cache: any = null;

    constructor(
        @Inject(APP_CONSTANTS) private _constants: IAppConstants,
        private navigation: NavigationService,
         private _http: HttpClient
        ) {

        var options = {
            max: this._constants.CACHE.SIZE,
            maxAge: this._constants.CACHE.MAX_AGE
        };

        this.cache = new LRU(options);
    }

    public getUserOrders(params: SearchParameters) {

        const headers: HttpHeaders = new HttpHeaders({
            'Accept': 'application/zip'
        })

        return this._http.post(environment.apiUrl + 'cabinet/order', JSON.stringify(params), { headers }).pipe(
            map((resp) => resp,
            catchError((error: any) => { return throwError(error); })));
    }

    public downloadFiles(id: string) {
        
        const params = new HttpParams()           
            .set('orderId', id.toString());
        
        const httpHeaders: HttpHeaders = new HttpHeaders({
            'Accept': 'application/zip'
        })
        
        return this._http.get(environment.apiUrl + '/cabinet/download', { headers: httpHeaders, params: params }).pipe( 
            map(this.extractContent),           
            catchError(err=> { 
                this.navigation.HandleError(err); 
                return throwError(err)
            })
        );      
    }

    public downloadFilesActReturned(): any {
        return this._http.get<Blob>(environment.apiUrl + 'refund/download-act-returned', { observe: 'response', responseType: 'blob' as 'json' })
    }

    private extractContent(res: any) {
        let blob: Blob = res.blob();
        FileSaver.saveAs(blob, "files.zip");
    }

    public getInvoiceListByOrderId(id): Observable<InvoiceRow[]> {
        
        const params = new HttpParams()           
            .set('orderId', id.toString());

        //intercept this url and add authorize token
        return this._http.get<InvoiceRow[]>(environment.apiUrl + 'invoice/get/user', {params}).pipe(
            map(resp => resp),
            catchError((error: any) => { return throwError(error)}));           
    }

    public getOrderStatus(secret: string) {

        const params = new HttpParams()           
        .set('secret', secret);

        return this._http.get(environment.apiUrl + 'order/status',{ params }).pipe(
            map((resp) => resp ),
            catchError((error: any) => { return throwError(error)}));
    }

    public GetDeliveryMethods(orderPaymentKey: number, cityId: number, languageId = 2): Observable<ShipmentType[]> {
        var deliveryKey: string = 'delivery_' + orderPaymentKey + cityId + languageId;
        var cached = this.cache.get(deliveryKey);

        if (cached) {
            return new Observable((observer) => {                
                observer.next(JSON.parse(cached));
                observer.complete();
            });
        }

        const params = new HttpParams()   
            .set('paymentMethodId', orderPaymentKey.toString())
            .set('languageId', languageId.toString())        
            .set('cityId', cityId.toString());

        //intercept this url and add authorize token
        return this._http.get<ShipmentType[]>(environment.apiUrl + 'order/delivery', {params})
        .pipe(
            map((resp: any) => resp.map(i => new ShipmentType(i.id, i.name, i.key, i.deliveryPointCount, i.cost))),
            tap(data => {
                this.cache.set(deliveryKey, JSON.stringify(data));
            }),
            catchError((error: any) => { return throwError(error)}));
    }

    public updateInvoiceProduct(orderCreationModel: OrderCreationModel, articlesToBeUpdated: string[]) {

        let requestData = { orderModel: orderCreationModel, articlesToBeUpdated: articlesToBeUpdated };

        //intercept this url and add authorize token
        return this._http.post(environment.apiUrl + 'invoice/updateInvoiceProduct', JSON.stringify(requestData)).pipe(
            map(resp => resp),
            catchError((error: any) => { return throwError(error) }));
    }

    public PayForResurvedRows(orderId: string, invoiceRows: InvoiceRow[], summa: number) {

        let paymentModel = {};

        paymentModel["reservedRows"] = invoiceRows;
        paymentModel["id"] = orderId;
        paymentModel["totalSumm"] = summa;

        return this._http.post(environment.apiUrl + 'invoice/order/pay', JSON.stringify(paymentModel)).pipe(
            map(resp => resp),
            catchError((error: any) => { return throwError(error)}));
    }

    public GetInvoiceStatus(orderId: string) : Observable<StatusInvoice[]> {
        //intercept this url and add authorize token
        return this._http.post<StatusInvoice[]>(environment.apiUrl + 'invoice/get/status', JSON.stringify(orderId)).pipe(
            map(resp => resp),
            catchError((error: any) => { return throwError(error)}));
    }

    public sendFromCartDeal(orderId: string) {
        if (!orderId)
            return;
       
        const params = new HttpParams()                   
            .set('orderId', orderId);

        this._http.get(environment.apiUrl + 'invoice/sendFromCartDeal', {params}).toPromise();
    }

    public sendSmsOrEmail(orderId: string) {
        if (!orderId)
            return;

            const params = new HttpParams()                   
            .set('orderId', orderId);

        this._http.get(environment.apiUrl + 'invoice/sendSmsOrEmail', {params}).toPromise();
    }
}