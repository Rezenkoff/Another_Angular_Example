import { Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { GoogleResponse } from '../models/models_adm/google-response.model';

@Injectable()
export class GoogleGeocodingService {

    private url: string;

    constructor(
        private _http: HttpClient
        ) { }

    addressGeocoding(address: string): Observable<GoogleResponse> 
    {
        let encodedAddress = encodeURIComponent(address)
        return this._http.get<GoogleResponse>('https://maps.googleapis.com/maps/api/geocode/json?address=' + encodedAddress + "&key=AIzaSyClKZSySt38enOJIr3mt7P8dDlI2MTselM&language=ru").pipe(
            map(resp => resp),
            catchError((error: any) => throwError(error)));
    }
}