import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { SettlementModel } from "./settlement.model";
import { HttpClient } from "@angular/common/http";
import { ApiResponse } from "../../models/api-response.model";
import { environment } from "../../../environments/environment";
import { map } from "rxjs/operators";
import { Result } from "../../models/result.model";

@Injectable()
export class SettlementService {

    constructor(
        private _http: HttpClient,
    ) { }

    public getSettlements(deliveryKey: number, searchString: string, languageId: number = 2): Observable<SettlementModel[]> {

        const request = {
            deliveryMethodKey: deliveryKey,
            searchString: searchString,
            languageId: languageId
        }

        //need auth?
        return this._http.post<ApiResponse>(environment.apiUrl + 'delivery/settlements', JSON.stringify(request)).pipe(map(response => {
            
            if (!response.success) {
                return null;
            }
            const searchTerm = searchString.toLowerCase();
            const settlementsResult = response.data.filter(x =>
                x.nameRus.toLowerCase().includes(searchTerm) ||
                x.nameUkr.toLowerCase().includes(searchTerm))

            return settlementsResult;
        }))
    }

    public getSettlementByKey(deliveryTypeKey: number, settlementKey: string, languageId: number = 2): Observable<SettlementModel> {

        const request = {
            deliveryMethodKey: deliveryTypeKey,
            settlementKey: settlementKey,
            languageId: languageId
        }

        //need auth?
        return this._http.post<ApiResponse>(environment.apiUrl + 'delivery/settlements', JSON.stringify(request)).pipe(map(response => {
            
            if (!response.success) {
                return null;
            }
            const result = response.data as SettlementModel[];
            return (result && result.length) ? result[0] : null;
        }))
    }

    public getSettlementsForArea(areaId: number): Observable<SettlementModel[]> { 
        return this._http.get<ApiResponse>(environment.apiUrl + 'delivery/settlements-for-area/' + areaId).pipe(map(response => {
            if (!response.success) {
                return null;
            }
            return response.data;
        }))
    }

    public checkIfFreeSettlementsExists(cityName: string): Observable<Result> {
        cityName = cityName.replace("город ", "").trim();
        return this._http.get<Result>(`${environment.apiUrl}delivery/settlements/free/${cityName}`).pipe();
    }
}