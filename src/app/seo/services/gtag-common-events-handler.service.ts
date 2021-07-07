import { Injectable, Inject, OnDestroy, PLATFORM_ID } from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { tap, filter } from 'rxjs/operators';
import { APP_CONSTANTS, IAppConstants } from '../../config/app-constants';
import { GtagSenderService } from './gtag-sender.service';

const customTypesDict = { 
    //gtag events for those pages handled separately
    "search-result": true,
    "category": true,
    "product": true,
    "order-checkout": true
};
const maxAttempts = 5;

@Injectable()
export class GtagCommonEventsHandlerService {

    private routerSub$: Subscription = new Subscription();
    private recepientKeys: string[] = [];
    private interval: any = null;
    private attemptCount: number = 0;

    constructor(
        @Inject(APP_CONSTANTS) private _constants: IAppConstants,
        @Inject(PLATFORM_ID) private platformId: Object,
        private _activatedRoute: ActivatedRoute,
        private router: Router,
        private _sender: GtagSenderService,
    ) {
        if (isPlatformServer(this.platformId)) {
            return;
        }
        this.recepientKeys = [ this._constants.GTAG_AD_WORDS_KEY ];
        this.routerSub$ = router.events.pipe(
            filter(event => event instanceof NavigationEnd),
            tap(() => this.sendEvent(this.router.url))
        ).subscribe();       
    }

    ngOnDestroy() {
        this.routerSub$.unsubscribe();
    }

    private sendEvent(url: string): void {
        let pageType: string = this.getPageType(url);
        if (!pageType) {
            return;
        }
        let parameters = {            
            'ecomm_pagetype': pageType            
        };
        this._sender.sendEvent(parameters, this.recepientKeys, 'page_view');
    }

    private getPageType(url: string): string {
        let startIdx = 1;
        let endIdx = url.indexOf("?");
        endIdx = (endIdx > 0) ? endIdx : url.length;
        url = url.substring(startIdx, endIdx);
        if (!url || url === "/") {
            return "home";
        }
        let sections = url.split("/");
        if (!sections.length) {
            return null;
        }
        if (customTypesDict[sections[0]]) {
            return null;
        }
        return 'other';
    }
}