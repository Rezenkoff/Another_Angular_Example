import { Injectable } from '@angular/core';
import { UserStorageService } from './user-storage.service';
import { PixelFacebookService } from './pixel-facebook.service';
import { UtmService } from './utm.service';
import { HttpClient } from '@angular/common/http';
import { QuickOrder } from '../models/quick-order.model';
import { Callback } from '../models/callback.model';
import { throwError, Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { SelectMe } from '../detail-groups/child/models/select-me.model';
import { CallbackVin } from '../find-by-auto/child/models/callback-vin';
import { CartProduct } from '../shoping-cart/models/shoping-cart-product.model';
import { CheckoutItem } from '../shoping-cart/models/checkout-item.model';
import { Purchase } from '../remarketing/purchase';
import { TransactionType } from '../remarketing/enums/transaction-type';
import { environment } from '../../environments/environment';

@Injectable()
export class BitrixService {
    constructor(
        private _userStorage: UserStorageService,
        private _faceBookPixelService: PixelFacebookService,
        private _utmService: UtmService,
        private _http: HttpClient
    ) { }

    public sendOrderInfo(orderId: number, cartProducts: CartProduct[] | CheckoutItem[]) { }

    public createCallbackLead(model: Callback) {
        model.transactionId = Purchase.generateUniqueId(TransactionType.Сallback);
        model.refId = this._userStorage.getRefId();
        model.clientId = this._userStorage.getClientId();
        model.utmFields = this._utmService.GetUtmFieldsFromLocalStorage();
        return this._http.post<Callback>(environment.apiUrl + 'crm/leads/callback', JSON.stringify(model)).pipe(
            map((resp) => {
                this._userStorage.setRefId(null);
                return resp;
            }),
            catchError(error => throwError(error)));
    }

    public createQuickOrder(model: QuickOrder) {

        model.userUid = this._userStorage.getUserUid();
        model.refId = this._userStorage.getRefId();
        model.clientId = this._userStorage.getClientId();
        model.utmFields = this._utmService.GetUtmFieldsFromLocalStorage();
        this._faceBookPixelService.trackPurchaseOrderEvent(model.cartProducts);
        return this._http.post<QuickOrder>(environment.apiUrl + 'crm/deal/quickorder', JSON.stringify(model)).pipe(
            map((resp: any) => {
                this._userStorage.setRefId(null);
                this.sendOrderInfo(resp.result, model.cartProducts);
                return resp;
            }),
            catchError(error => throwError(error)));
    }

    private totalProductSum(cartProducts: any): number {

        if (typeof (cartProducts) === 'undefined') {
            return 0;
        }

        let totalSum = 0;
        cartProducts.map((product) => {

            if (product instanceof CartProduct) {
                totalSum += product.price * product.quantity;
            }

            if (product instanceof CheckoutItem) {
                totalSum += product.Price * product.Quantity;
            } 
        });
        totalSum = +totalSum.toFixed(2);
        return totalSum;
    }

    public createSelectMeLead(model: SelectMe) {
        model.refId = this._userStorage.getRefId();
        model.clientId = this._userStorage.getClientId();
        model.utmFields = this._utmService.GetUtmFieldsFromLocalStorage();
        return this._http.post<SelectMe>(environment.apiUrl + 'crm/leads/selectme', JSON.stringify(model)).pipe(
            map((resp) => {
                this._userStorage.setRefId(null);
                return resp;
            }),
            catchError(error => throwError(error)));
    }
    public createSelectMeCarCatalogLead(model: SelectMe, attachedFiles: Array<File>, url:string) : Observable<any> {
        model.transactionId = Purchase.generateUniqueId(TransactionType.SelectionForSpareParts);
        model.utmFields = this._utmService.GetUtmFieldsFromLocalStorage();
        model.clientId = this._userStorage.getClientId();

        let formData = new FormData();

        if (attachedFiles.length != 0) {
            for (let file of attachedFiles) {
                formData.append('attachedFiles', file);
           }
        }
        formData.append('modelStr', JSON.stringify(model));

        return this._http.post(environment.apiUrl + 'crm/leads/selectme/carcatalog', formData).pipe(
            catchError((error: any) => throwError(error)));
    }

    public createVinSearchCallback(model: CallbackVin) {
        model.refId = this._userStorage.getRefId();
        model.clientId = this._userStorage.getClientId();
        model.utmFields = this._utmService.GetUtmFieldsFromLocalStorage();
        return this._http.post<CallbackVin>(environment.apiUrl +  'crm/leads/callbackvin', model).pipe(
            map((resp) => {
                this._userStorage.setRefId(null);
                return resp;
            }),
            catchError(error => throwError(error)));
    }

    public getBitrixManagers() {
        return this._http.get(environment.apiUrl + 'crm/users/get-managers').pipe(            
            catchError(error => throwError(error)));
    }
}
