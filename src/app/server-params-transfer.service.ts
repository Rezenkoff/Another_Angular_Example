import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { makeStateKey, TransferState } from '@angular/platform-browser';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { TRANSFER_CACHE } from './transfer.const';
import { SERVERPARAMS } from './server.params';

@Injectable()
export class ServerParamsTransfer {
   constructor(private transferState: TransferState, 
    @Inject(SERVERPARAMS) private serverParamsValue: any,
    @Inject(PLATFORM_ID) private platformId: Object) 
    { 
        if(isPlatformServer(this.platformId))
        {
            this.transferState.set(makeStateKey(TRANSFER_CACHE), JSON.stringify(this.serverParamsValue));
            this.serverParams = this.serverParamsValue;
        }

        if(isPlatformBrowser(this.platformId))
        {
           this.serverParams = JSON.parse(this.transferState.get(makeStateKey(TRANSFER_CACHE), "{ \"isMobileDevice\": false, \"isBotRequest\": false, \"isTabletDevice\": false }"));
        }
    }  

    public serverParams: any;
}