﻿import { Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { IAppConstants, APP_CONSTANTS } from '../config/app-constants';
import { GtagSenderService } from '../seo/services/gtag-sender.service';
import { Product } from '../models';
import { GtagService } from '../services/gtag.service';

export class ViewItemList {
    private readonly eventType: string = "view_item_list";
    private readonly recepientKeys: string[] = [];


    constructor(
        @Inject(APP_CONSTANTS) private _constants: IAppConstants,
        @Inject(PLATFORM_ID) private platformId: Object,
        private _gtagService: GtagService,
        private _sender: GtagSenderService,
    ) {
        this.recepientKeys = [this._constants.GTAG_ANALYTICS_KEY, this._constants.GTAG_AD_WORDS_KEY];
    }


    public sendEventViewItemList(products: Product[], index: number, option: string) {
        if (!isPlatformBrowser(this.platformId)) {
            return;
        }
        let parameters = this.getParameters(products, index, option);
        this._sender.sendEvent(parameters, this.recepientKeys, this.eventType);
    }

    private getParameters(products: Product[], index: number, option: string) {
        let parameters = {
            "items": products.map(p => {
                return {
                    "id": p.id,
                    "name": (p.displayDescription) ? p.displayDescription.trimRight() : '',
                    "brand": p.brand,
                    "list_name": option,
                    "category": (this._gtagService.getCurrentNode(p.transliteratedTitle)) ? this._gtagService.getCurrentNode(p.transliteratedTitle).name : '',
                    "list_position": ++index,
                }
            }),
            "non_interaction": true
        };
        return parameters;        
    }
}