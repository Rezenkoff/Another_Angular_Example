import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

@Injectable()
export class ForDevService {

    constructor(private _http: HttpClient) { }

    public getApiToken(password: string) {
        const RequestData = {
            'Password': password
        };

        //need auth
        return this._http.post(environment.apiUrl + 'account/publicapi/access', JSON.stringify(RequestData)).pipe(
            catchError((error: any) => throwError(error)))
    }
}