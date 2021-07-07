import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { makeStateKey, TransferState } from '@angular/platform-browser';
import { URLS_FOR_TRANSFERCACHE } from './urls-for-transferstate.constants';
import { Observable, of } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class BrowserStateInterceptor implements HttpInterceptor {

    constructor(
        private transferState: TransferState,
        @Inject(URLS_FOR_TRANSFERCACHE) 
        private _toBeTransferedUrls,
        @Inject(PLATFORM_ID)
        private _platformId
    ) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
       
        if(isPlatformBrowser(this._platformId)) {
        
            if(this.checkPermittedUrls(req.url))
            {
                let cacheKey = req.url;
                        
                if(req.method == "POST") {
                    cacheKey += req.serializeBody();
                }
                
                const key = makeStateKey(this.createHashKey(cacheKey));
                const storedResponse: string = this.transferState.get(key, null);
                
                if (storedResponse) {
                    const response = new HttpResponse({ body: storedResponse, status: 200 });
                    return of(response);
                }     
            }   
        }       

        return next.handle(req);
    }

    private checkPermittedUrls(url: string) : Boolean {
        return this._toBeTransferedUrls[url];
    }

    private createHashKey(str:string) : string {
        var hash = 0, i, chr;
        for (i = 0; i < str.length; i++) {
          chr   = str.charCodeAt(i);
          hash  = ((hash << 5) - hash) + chr;
          hash |= 0; 
        }
        return hash.toString();      
    }
}