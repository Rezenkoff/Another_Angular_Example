﻿import { Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { IAppConstants, APP_CONSTANTS } from '../config/app-constants';
import { GtagSenderService } from '../seo/services/gtag-sender.service';
import { Product } from '../models/product.model';
import { GtagService } from '../services/gtag.service';


export class SelectContent {
    private readonly eventType: string = "select_content";
    private readonly recepientKeys: string[] = [];


    constructor(
        @Inject(APP_CONSTANTS) private _constants: IAppConstants,
        @Inject(PLATFORM_ID) private platformId: Object,
        private _gtagService: GtagService,
        private _sender: GtagSenderService,
    ) {
        this.recepientKeys = [this._constants.GTAG_ANALYTICS_KEY, this._constants.GTAG_AD_WORDS_KEY];
    }


    public sendEventSelectContent(products: Product[], index: number, option: string) {
        if (!isPlatformBrowser(this.platformId)) {
            return;
        }

        let parameters = this.getParameters(products, index, option);
        this._sender.sendEvent(parameters, this.recepientKeys, this.eventType);
    }


    private getParameters(products: Product[], index: number, option: string) {

            let parameters = {
                "content_type": "product",
                "items": products.map(p => {
                    return {
                        "id": p.id,
                        "name": p.displayDescription.trimRight(),
                        "brand": p.brand,
                        "list_name": option,
                        "category": (this._gtagService.getCurrentNode(p.transliteratedTitle)) ? this._gtagService.getCurrentNode(p.transliteratedTitle).name : '',
                        "list_position": index + 1,
                    }
                })
            };
            return parameters;
    }
}