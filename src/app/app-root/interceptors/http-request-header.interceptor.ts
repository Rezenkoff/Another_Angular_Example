import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { URLS_FOR_FORMDATA } from './urls-for-formdata-content.constants';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { json_content_type_headers } from '../utils/json-header.constant';

@Injectable()
export class HttpRequestHeaderInterceptor implements HttpInterceptor {

    constructor(
        @Inject(URLS_FOR_FORMDATA)
        private _urlsForFormData
    ) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        if ((req.method == "POST" || req.method == "PUT") && !this.CheckCurrentPathForFormData(req.url)) {
            let modifiedRequest = req.clone({ setHeaders: json_content_type_headers });

            return next.handle(modifiedRequest);
        }

        return next.handle(req);
    }

    private CheckCurrentPathForFormData(requestUrl: string): Boolean {
        let result = this._urlsForFormData.includes(requestUrl);
        return result;
    }
}