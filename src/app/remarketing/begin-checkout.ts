import { Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CartProduct } from '../shoping-cart/models/shoping-cart-product.model';
import { CategoryInfoService } from '../../app/services/category-info.service';
import { Store } from '@ngrx/store';
import * as fromShopingCart from '../shoping-cart/reducers';
import { first } from 'rxjs/operators';
import { IAppConstants, APP_CONSTANTS } from '../config/app-constants';
import { GtagSenderService } from '../seo/services/gtag-sender.service';


export class BeginCheckout {

    private readonly eventType: string = "begin_checkout";
    private readonly recepientKeys: string[] = [];

    constructor(
        @Inject(APP_CONSTANTS) private _constants: IAppConstants,
        @Inject(PLATFORM_ID) private platformId: Object,
        private cartStore: Store<fromShopingCart.State>,
        private categoryInfoService: CategoryInfoService,
        private _sender: GtagSenderService,
    ) {
        this.recepientKeys = [this._constants.GTAG_ANALYTICS_KEY, this._constants.GTAG_AD_WORDS_KEY];
    }

    public sendCheckout(option: string) {
        if (!isPlatformBrowser(this.platformId)) {
            return;
      }

        this.cartStore.select(fromShopingCart.getCart).pipe(first()).subscribe(cart => {
            this.categoryInfoService.setProductCategories(cart.products).pipe(first()).subscribe(() => {
                let parameters = this.getParameters(cart.products, option);
                this._sender.sendEvent(parameters, this.recepientKeys, this.eventType);
            })
        })
    }


    private getParameters(products: CartProduct[], option: string) {
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
                    "category": p.category || '',
                    "quantity": p.quantity,
                    "price": p.price
                }
            }),

            "non_interaction": true
        };

        if (option) {
            parameters["custom_purchase_type"] = option;
        }

        return parameters;
    }
}
