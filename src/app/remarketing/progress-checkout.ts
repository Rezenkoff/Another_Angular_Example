import { Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CartProduct } from '../shoping-cart/models/shoping-cart-product.model';
import { CategoryInfoService } from '../../app/services/category-info.service';
import { Store } from '@ngrx/store';
import * as fromShopingCart from '../shoping-cart/reducers';
import { first } from 'rxjs/operators';
import { IAppConstants, APP_CONSTANTS } from '../config/app-constants';
import { GtagSenderService } from '../seo/services/gtag-sender.service';


export class ProgressCheckout {

    private readonly eventType: string = "checkout_progress";
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


    public sendCheckoutProgressAfterCartOpen(option: string) {
        if (!isPlatformBrowser(this.platformId)) {
            return;
      }

        this.cartStore.select(fromShopingCart.getCart).pipe(first()).subscribe(cart => {
            this.categoryInfoService.setProductCategories(cart.products).pipe(first()).subscribe(() => {

                let parameters = this.getParametersWithOption(cart.products, 1, option);
                this._sender.sendEvent(parameters, this.recepientKeys, this.eventType);
            })
        })
    }

    public sendCheckoutProgressAfterUserInfoChange(option: string) {
        if (!isPlatformBrowser(this.platformId)) {
            return;
        }

        this.cartStore.select(fromShopingCart.getCart).pipe(first()).subscribe(cart => {

            this.categoryInfoService.setProductCategories(cart.products).pipe(first()).subscribe(() => {
                let parameters = this.getParametersWithOption(cart.products, 2, option);
                
              this._sender.sendEvent(parameters, this.recepientKeys, this.eventType);
                
            })
        })
    }
    
    private getParametersWithoutOption(products: CartProduct[], step: number) {
        let total: number = 0;
        products.forEach(p => {
            total += p.price * p.quantity;
        });

        let parameters = {
            "value": total.toFixed(2),
            "currency": "UAH",
            "checkout_step": step,


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

        return parameters;
    }

    private getParametersWithOption(products: CartProduct[], step: number, option: string) {
        let total: number = 0;
        products.forEach(p => {
            total += p.price * p.quantity;
        });

        let parameters = {
            "value": total.toFixed(2),
            "currency": "UAH",
            "checkout_step": step,

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
