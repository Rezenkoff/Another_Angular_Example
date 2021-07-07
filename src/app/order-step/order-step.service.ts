import { Injectable, Inject } from '@angular/core';
import { APP_CONSTANTS, IAppConstants } from '../config';
import { OrderStepMainModel } from './models/order-step.model';
import { IOrderStepModel } from './models/order-step.interface';
import { throwError } from "rxjs";
import { map, catchError } from "rxjs/operators";
import { LoggerService } from '../logger/services/logger.service';
import { FindDetailEnterRecordModel } from '../logger/models/findDetailEnterLogRecord.model';
import { UserStorageService } from '../services/user-storage.service';
import { UtmService } from '../services/utm.service';
import { UidParams } from '../services/uid-params.service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Purchase } from '../remarketing/purchase';
import { TransactionType } from '../remarketing/enums/transaction-type';
import { environment } from '../../environments/environment';

var LRU = require("lru-cache");

@Injectable()
export class OrderStepService {
    private _orderStepMainModel: IOrderStepModel = new OrderStepMainModel();
    public cache: any = null;
    constructor(
        @Inject(APP_CONSTANTS) private _constants: IAppConstants,
        private _loggerService: LoggerService, 
        private _userStorage: UserStorageService,
        private _utmService: UtmService,
        private _uidParams: UidParams,
        private _http: HttpClient
    ) {
        var options = {
            max: this._constants.CACHE.SIZE,
            maxAge: this._constants.CACHE.MAX_AGE
        };

        this.cache = new LRU(options);
    }

    public get OrderStepMainModel(): IOrderStepModel {
        return this._orderStepMainModel;
    }

    public resetModel(): void {
        this._orderStepMainModel = new OrderStepMainModel();
    }

    public createConfirmOrderIfUserIsNotAuthentificated(): any {
        const params = new HttpParams().set('userPhone', this._orderStepMainModel.ContactInfo.Phone);

      return this._http.get(environment.apiUrl + "crm/uid/getuid", { params: params, responseType: "text" }).pipe(

            map((uidResult: any) => {
                let uid = uidResult._body;
                this._uidParams.setCurrentUnauthorizeUid(uid);
                this._userStorage.checkUidParam();
            })
        );
    }
    public PostOrder(): any {
        var formData: any = new FormData();
        this._orderStepMainModel.RefId = this._userStorage.getRefId();
        this._orderStepMainModel.ClientId = this._userStorage.getClientId();
        this._orderStepMainModel.UtmFields = this._utmService.GetUtmFieldsFromLocalStorage();

        this.OrderStepMainModel.ContactInfo.Uid = this._userStorage.getUserUid();
        this.OrderStepMainModel.TransactionId = Purchase.generateUniqueId(TransactionType.VinSearch);

        formData.append("model", JSON.stringify(this._orderStepMainModel));

        if (this._orderStepMainModel.AttachedFiles.length != 0) {
            for (let file of this._orderStepMainModel.AttachedFiles) {
                formData.append("attachedFiles", file);
            }
        }
        
       
        let head: HttpHeaders = new HttpHeaders();
        head.append('Content-Type', 'multipart/form-data');
      
       
      

        return this._http.post<any>(environment.apiUrl + 'order/create',formData,{headers:head}).pipe(
           map((resp: any) => {
               this._userStorage.setRefId(null);
                return resp;
            }),
           catchError((error: any) => throwError(error)));
    }


    public logEnterToFindDetail(): void {
        const log = new FindDetailEnterRecordModel();
        this._loggerService.logRecord(log);
    }
}
