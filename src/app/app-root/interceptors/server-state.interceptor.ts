import { HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable, Inject } from '@angular/core';
import { makeStateKey, TransferState } from '@angular/platform-browser';
import { URLS_FOR_TRANSFERCACHE } from './urls-for-transferstate.constants';
import { tap, last } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class ServerStateInterceptor implements HttpInterceptor {

    constructor(private transferState: TransferState, 
    @Inject(URLS_FOR_TRANSFERCACHE) 
    private _toBeTransferedUrls) { }

    intercept(req: HttpRequest<any>, next: HttpHandler) {
        return next.handle(req).pipe(
            last(),
            tap(event => {
             if(this.checkUrlToBeStateTransfered(req.url)) {
                    let cacheKey = req.url;
                    
                    if(req.method == "POST") {
                        cacheKey += req.serializeBody();
                    }

                    if ((event instanceof HttpResponse && (event.status === 200 || event.status === 202))) {
                        let key = makeStateKey(this.createHashKey(cacheKey));
                        this.transferState.set(key, event.body);
                    }
                }                
            }),
        );
    }

    private checkUrlToBeStateTransfered(url: string) : Boolean {
        return this._toBeTransferedUrls[url];
    }

    private createHashKey(str:string) : string {
            var hash = 0, i, chr;
            for (i = 0; i < str.length; i++) {
              chr   = str.charCodeAt(i);
              hash  = ((hash << 5) - hash) + chr;
              hash |= 0; // Convert to 32bit integer
            }
            return hash.toString();      
    }
}