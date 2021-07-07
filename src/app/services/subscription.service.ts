import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable()
export class SubscriptionService {
    constructor(private _http: HttpClient) {
    }

    public addSubscription(email: string) {
        
        const params = new HttpParams()           
        .set('email', email);

        return this._http.get(environment.apiUrl + 'subscription/add', {params}).pipe(
            catchError((error: any) => throwError(error)))
    }
}