﻿import { Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { IAppConstants, APP_CONSTANTS } from '../config/app-constants';
import { GtagSenderService } from '../seo/services/gtag-sender.service';
import { Product } from '../models/product.model';
import { GtagService } from '../services/gtag.service';

export class ViewItem {
    private readonly eventType: string = "view_item";
    private readonly recepientKeys: string[] = [];


    constructor(
        @Inject(APP_CONSTANTS) private _constants: IAppConstants,
        @Inject(PLATFORM_ID) private platformId: Object,
        private _gtagService: GtagService,
        private _sender: GtagSenderService,
    ) {
        this.recepientKeys = [this._constants.GTAG_ANALYTICS_KEY, this._constants.GTAG_AD_WORDS_KEY];
    }


    public sendEventViewItem(products: Product[]) {
        if (!isPlatformBrowser(this.platformId)) {
            return;
        }

        let parameters = this.getParameters(products);
        this._sender.sendEvent(parameters, this.recepientKeys, this.eventType);
    }

    private getParameters(products: Product[]) {
  
        let parameters = {
            "items": products.map(p => {
                return {
                    "id": p.id,
                    "name": p.displayDescription.trimRight(),
                    "brand": p.brand,
                    "category": p.categoryName, //(this._gtagService.getCurrentNode(p.transliteratedTitle)) ? this._gtagService.getCurrentNode(p.transliteratedTitle).name : '',
                    "price": p.price,
                }
            }),
            "non_interaction": true
        };
        return parameters;
    }
}