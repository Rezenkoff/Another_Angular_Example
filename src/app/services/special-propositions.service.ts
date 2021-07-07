import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable()
export class SpecialPropositionsService {

    private url: string;

    constructor(        
        private _http: HttpClient
        ) {
    }

    public getSpecialOffersUrls() {
        return this._http.get(environment.apiUrl + 'specialpropositions');
    }
}