﻿import { Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { IAppConstants, APP_CONSTANTS } from '../config/app-constants';
import { GtagSenderService } from '../seo/services/gtag-sender.service';


export class SignUp {
    private readonly eventType: string = "sign_up";
    private readonly recepientKeys: string[] = [];


    constructor(
        @Inject(APP_CONSTANTS) private _constants: IAppConstants,
        @Inject(PLATFORM_ID) private platformId: Object,
        private _sender: GtagSenderService,
    ) {
        this.recepientKeys = [this._constants.GTAG_ANALYTICS_KEY, this._constants.GTAG_AD_WORDS_KEY];
    }


    public sendEventSignUp(value: string) {
        if (!isPlatformBrowser(this.platformId)) {
            return;
        }

        let parameters = {
            "method": value,
        };

        this._sender.sendEvent(parameters, [this._constants.GTAG_ANALYTICS_KEY], this.eventType); 
    }
}