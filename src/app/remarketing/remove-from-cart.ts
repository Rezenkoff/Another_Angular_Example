﻿import { Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CartProduct } from '../shoping-cart/models/shoping-cart-product.model';
import { IAppConstants, APP_CONSTANTS } from '../config/app-constants';
import { GtagSenderService } from '../seo/services/gtag-sender.service';
import { GtagService } from '../services/gtag.service';

export class RemoveFromCart {

    private readonly eventType: string = "remove_from_cart";
    private readonly recepientKeys: string[] = [];

    constructor(
        @Inject(APP_CONSTANTS) private _constants: IAppConstants,
        @Inject(PLATFORM_ID) private platformId: Object,
        private _gtagService: GtagService,
        private _sender: GtagSenderService,
    ) {
        this.recepientKeys = [this._constants.GTAG_ANALYTICS_KEY, this._constants.GTAG_AD_WORDS_KEY];
    }

    public sendRemoveFromCart(products: CartProduct[]) {
        if (!isPlatformBrowser(this.platformId)) {
            return;
        }
        let parameters = this.getParameters(products);
        if (parameters) {

            this._sender.sendEvent(parameters, this.recepientKeys, this.eventType);
        }
    }    

    private getParameters(products: CartProduct[]) {
        let total: number = 0;
        products.forEach(p => {
            total += p.price * p.quantity;
        });

        let parameters = {
            "value": total.toFixed(2),
            "currency": "UAH",
            "items": products.map(p => {
                return {
                    "id": p.articleId,
                    "name": p.displayDescription.trimRight(),
                    "brand": p.brand,
                    "category": this._gtagService.getCurrentNode(p.transletiratedTitle).name || '',
                    "price": p.price
                }
            })
        };
        return parameters;
    }   
}