import { Injectable, Inject } from '@angular/core';
import { RefundStepModel, IRefundStepModel, RefundStepDataModel, ClientInfo, PaymentInfo } from './models';
import { OrderService } from '../services/order.service';
import { SearchService } from '../services/search.service';
import { APP_CONSTANTS, IAppConstants } from '../config';
import { InvoiceRowRefund } from '../refund-step/models/invoice-row-refund.model';
import { PackingRateRequest } from '../search/models';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { InvoiceRow } from '../models';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import * as FileSaver from 'file-saver';
var LRU = require("lru-cache");

@Injectable()
export class RefundStepService {
   
    private readonly ACCEPT_HEADER:string = 'Accept';
    private readonly MIME_TYPE = 'application/zip';

    private _refundStepModel: IRefundStepModel;
    cache: any = null;
    private _refundStepDataModel: RefundStepDataModel = new RefundStepDataModel();
    private _refundStepDataSubject = new BehaviorSubject(this._refundStepDataModel);

    constructor(
        @Inject(APP_CONSTANTS) private _constants : IAppConstants,
        private _orderService: OrderService,
        private _searchService: SearchService,
        private http: HttpClient
        ) {
        this._refundStepModel = new RefundStepModel();

        var options = {
            max: this._constants.CACHE.SIZE,
            maxAge: this._constants.CACHE.MAX_AGE
        };

        this.cache = new LRU(options);
    }
    //region params
    public get refundStepModel(): IRefundStepModel {
        return this._refundStepModel;
    }

    public get refundStepData(): Observable<any> {
        return this._refundStepDataSubject.asObservable();
    }

    public get clientInfo(): ClientInfo {
        return this._refundStepModel.ClientInfo;
    }

    public get paymentInfo(): PaymentInfo {
        return this._refundStepModel.PaymentInfo;
    }

    public get invoiceRows(): InvoiceRow[] {
        return this._refundStepModel.InvoiceRows;
    }

    public refundStepModelReset() {
        this._refundStepModel = new RefundStepModel();
    }
    //#endregion

    //#region method
    public getProductListByOrderId(orderId) {
        let cached = this.cache.get(orderId);
        let rows: InvoiceRowRefund[];

        if (cached) {
            this._refundStepDataModel.orderRows = cached;

            this._refundStepDataSubject.next(this._refundStepDataModel);
        }
        else {
            this._orderService.getInvoiceListByOrderId(orderId)
                .subscribe((data: InvoiceRowRefund[]) => {
                    rows = data;

                    let request: PackingRateRequest = { "listIds": rows.map(item => { return item.artId.toString() }), byCart: false };

                    this._searchService.getPackingRates(request).subscribe(rates => {
                        rows.forEach(
                            item => {
                                let rate = rates[item.artId];
                                item.compulsory = rate ? rate.compulsory : 1;
                                item.incDecStep = rate ? rate.value : 1;
                            })

                        rows.forEach(item => item.quantityRefund = item.quantity);

                        this.cache.set(orderId, rows);

                        this._refundStepDataModel.orderRows = rows;

                        this._refundStepDataSubject.next(this._refundStepDataModel);
                    });
                });
        }
    }

    public generateExcelFile() {
        const headers = new HttpHeaders().set(this.ACCEPT_HEADER, this.MIME_TYPE);
        const params = JSON.stringify(this._refundStepModel);

        return this.http.post(environment.apiUrl + "refund/downloadRefundAct", params, { headers: headers, responseType: 'blob'}).pipe(
                catchError((error: any) =>
                    throwError(error)
                ))
    }

    private saveContent(blob: Blob) {        
        FileSaver.saveAs(blob, "АКТ-ЗАЯВА на повернення товару.xlsx");
    }

    public downloadFile() {
        return this.generateExcelFile().pipe(
            map(res => {
                this.saveContent(res)
            }),
            catchError((error: any) =>
                throwError(error)
            ))
    }
    //#endregion
}