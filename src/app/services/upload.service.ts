import { Injectable, Inject } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { Result as ResultResponse } from '../models/result.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable()
export class UploadService {

    constructor(
        private _http: HttpClient) {
    }

    uploadImage(image: File): Observable<ResultResponse> 
    {
        let formData: FormData = new FormData();
        formData.append(image.name, image, image.name);

        return this._http.post<ResultResponse>(environment.apiUrl + 'upload/image', formData).pipe(
            catchError((error: any) =>
                throwError(error)
            ))
    }

    public uploadFile(file: File, apiUrl: string): Observable<ResultResponse>
    {
        let formData: FormData = new FormData();
        formData.append(file.name, file, file.name);

        return this._http.post<ResultResponse>(environment.apiUrl + apiUrl, formData).pipe(
            catchError((error: any) =>
                throwError(error)
            ));
    }

}