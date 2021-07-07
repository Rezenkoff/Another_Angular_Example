import { Injectable } from "@angular/core";
import { DeliveryPointGeocoded } from "./delivery-point-geocoded.model";
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { ApiResponse } from "../../models/api-response.model";

@Injectable()
export class DeliveryPointsService {

    constructor(
        private _http: HttpClient,
    ) { }

    public getDeliveryPoints(cityKey: string, deliveryMethodKey: number, paymentMethodId: number, languageId: number,
        productsForInstalling: number[]): Observable<DeliveryPointGeocoded[]> {
        let request: DeliveryPointsRequest = {
            cityKey: cityKey,
            deliveryMethodKey: deliveryMethodKey,
            paymentMethodId: paymentMethodId,
            languageId: languageId,
            productsForInstalling: productsForInstalling
        };
        return this._http.post<ApiResponse>(environment.apiUrl +  'delivery/points', JSON.stringify(request)).pipe(map(response => {
            return response.success ? response.data as DeliveryPointGeocoded[] : [];
        }));
    }
}

class DeliveryPointsRequest {
    cityKey: string;
    deliveryMethodKey: number;
    paymentMethodId: number;
    languageId: number;
    productsForInstalling: number[];
}