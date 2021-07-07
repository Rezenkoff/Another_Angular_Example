import { Injectable } from "@angular/core";
import { catchError } from "rxjs/operators";
import { Observable } from "rxjs";
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable()
export class DiscountService {

    constructor(private _http: HttpClient) { }

    public getDiscountByPromo(promo: string) {
        return this._http.get(environment.apiUrl + 'discount/get/' + promo).pipe(
                catchError((error: any) => { return Observable.throw(error); }))
    }
}