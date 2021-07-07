import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable()
export class GCaptchaService {

    constructor(
        private _http: HttpClient) { }

    public verifyCaptcha(response: string, mainBlockerKey: string, blockerKey: string) {
        const params = new HttpParams()
            .set('capchaResult', response)
            .set('blockerKey', blockerKey)
            .set('mainBlockerKey', mainBlockerKey);        

        return this._http.get(environment.apiUrl + 'ip-rate-limit/unlock',  {params}).pipe(
            map((resp: any) => {
                return resp;
            }));
    }
}