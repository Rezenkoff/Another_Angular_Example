﻿import { Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CategoryInfoService } from '../../app/services/category-info.service';
import { Store } from '@ngrx/store';
import * as fromShopingCart from '../shoping-cart/reducers';
import { IAppConstants, APP_CONSTANTS } from '../config/app-constants';
import { GtagSenderService } from '../seo/services/gtag-sender.service';
import { Product } from '../models/product.model';
import { MainUrlParser } from '../app-root/main-url.parser';
import { CatalogService } from '../services/catalog-model.service';
import { Common } from './common';

export class AddToWishlist {

    private readonly eventType: string = "add_to_wishlist";
    private readonly recepientKeys: string[] = [];
    private readonly helper: Common;

    constructor(
        @Inject(APP_CONSTANTS) private _constants: IAppConstants,
        @Inject(PLATFORM_ID) private platformId: Object,
        private cartStore: Store<fromShopingCart.State>,
        private categoryInfoService: CategoryInfoService,
        private _sender: GtagSenderService,
        @Inject(MainUrlParser) private urlParser: MainUrlParser,
        private _catalogService: CatalogService,
    ) {
        this.recepientKeys = [this._constants.GTAG_ANALYTICS_KEY, this._constants.GTAG_AD_WORDS_KEY];
        this.helper = new Common(this.urlParser, this._catalogService);
    }


    public sendEventAddToWishlist(product: Product) {
        if (!isPlatformBrowser(this.platformId) || !product) {
            return;
        }

        let categoryId = this.helper.getCategoryId(product.transliteratedTitle);
        let currentNode = this.helper.getCurrentNode(categoryId);

        let parameters = {
            "value": product.price,
            "currency": "UAH",
            "items": [
                {
                    "id": product.id,
                    "name": product.displayDescription.trimRight(),
                    "brand": product.brand,
                    "category": currentNode.name,
                    "price": product.price
                }
            ]
        };

        this._sender.sendEvent(parameters, [this._constants.GTAG_ANALYTICS_KEY], this.eventType);    
    }
}