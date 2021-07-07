import { Injectable } from "@angular/core";
import { catchError } from "rxjs/operators";
import { throwError } from "rxjs";
import { HttpClient, HttpParams } from "@angular/common/http"
import { environment } from "../../environments/environment";

@Injectable()
export class PolisService {

    constructor( 
        private _http: HttpClient) { }

    public GetCarInfoByNumber(number: string) {
        const params = new HttpParams()
            .set('number', number);

        return this._http.get(environment.apiUrl + 'polis/info-by-number', {params}).pipe(
            catchError((error: any) => throwError(error)))
    }
}