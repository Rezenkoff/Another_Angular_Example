import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { APP_CONSTANTS, IAppConstants } from '../config';
import { SearchParamsDeliveryPoint } from '../models/models_adm/search-params-dp.model';
import { environment } from '../../environments/environment'

@Injectable()
export class DeliveryPointsAdminService {

    constructor(
        @Inject(APP_CONSTANTS) private _constants: IAppConstants,
        private _http: HttpClient
        ) {
    }

    getDeliveryPoints(searchParamsDeliveryPoint: SearchParamsDeliveryPoint) {
        const params = new HttpParams()
            .set('deliveryPointName', searchParamsDeliveryPoint.deliveryPointName)
            .set('pageSize', searchParamsDeliveryPoint.pageSize.toString())
            .set('currentPage', searchParamsDeliveryPoint.currentPage.toString())
            .set('isActive', searchParamsDeliveryPoint.isActive)
            .set('isDeliveryPoint', searchParamsDeliveryPoint.isDeliveryPoint)
            .set('cityId', searchParamsDeliveryPoint.cityId.toString())            
            .set('addressDeliveryPoint', searchParamsDeliveryPoint.addressDeliveryPoint);        
       
        return this._http.get(environment.apiUrl + 'delivery-point/deliverypoints/get', {params}).pipe(
            map(resp => resp),
            catchError((error: any) => 
                throwError(error)
            ));
    }   
}