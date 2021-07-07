import { Injectable } from "@angular/core";
import { ApiResponse } from "../../models/api-response.model";
import { map } from "rxjs/operators";
import { Observable } from "rxjs";
import { DistrictModel } from "./district.model";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";

@Injectable()
export class DistrictService {
    constructor(private _http: HttpClient) { }

    public getDistrics(areaId: number, searchString: string, deliveryMethodKey: number, languageId: number = 2): Observable<DistrictModel[]> {

        const request = {
            areaId: areaId,
            searchString: searchString,
            languageId: languageId,
            deliveryMethodKey: deliveryMethodKey
        }
//need auth interception?

        return this._http.post<ApiResponse>(environment.apiUrl + 'delivery/district', JSON.stringify(request)).pipe(map(response => {
            
            if (!response.success) {
                return null;
            }
            const searchTerm = searchString.toLowerCase();
            const districtResult = response.data.filter(x =>
                x.districtUA.toLowerCase().includes(searchTerm) ||
                x.districtRU.toLowerCase().includes(searchTerm))

            return districtResult;
        }))
    }
}