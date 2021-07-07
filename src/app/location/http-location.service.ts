import { Injectable, Inject } from '@angular/core';
import { APP_CONSTANTS, IAppConstants} from '../config';
import { ServerParamsTransfer } from '../server-params-transfer.service';
import { Observable, throwError, of } from "rxjs";
import { catchError } from "rxjs/operators";
import { Settlement } from './location.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable()
export class HttpLocationService {
    constructor(        
        private serverParamsService: ServerParamsTransfer,
        @Inject(APP_CONSTANTS) private _constants : IAppConstants,
        private _http: HttpClient
    ) {        
    }

    public GetSettlementByName(name: string, warehouseFlag: number = 0, useStrict: number = 0): Observable<Settlement[]> {
        
        const params = new HttpParams()   
            .set('name', name)
            .set('useStrict', useStrict.toString())        
            .set('warehouseFlag', warehouseFlag.toString());
        
        //change to transfer state
        return this._http.get<Settlement[]>(environment.apiUrl + 'location/settlements/findbyname', { params }).pipe(
            catchError((error: any) => throwError(error)));
    }

    public GetPopularSettlements(): Observable<Settlement[]> {
        
        if (!this.serverParamsService.serverParams.isBotRequest)
            return this._http.get<Settlement[]>(environment.apiUrl + 'location/settlements/popular');

        return of<Settlement[]>([]);
    }
}