import { Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CartProduct } from '../shoping-cart/models/shoping-cart-product.model';
import { CategoryInfoService } from '../../app/services/category-info.service';
import { Store } from '@ngrx/store';
import * as fromShopingCart from '../shoping-cart/reducers';
import { first } from 'rxjs/operators';
import { IAppConstants, APP_CONSTANTS } from '../config/app-constants';
import { GtagSenderService } from '../seo/services/gtag-sender.service';
import { TransactionType } from './enums/transaction-type';
import { DiscountModel } from '../shoping-cart/models/discount.model';
import { SumType } from '../shoping-cart/models/sum-type.enum';
import { DiscountType } from '../shoping-cart/models/discount-type.enum';

export class Purchase {
    private readonly eventType: string = "purchase";
    private readonly recepientKeys: string[] = [];
    private readonly quickOrder = "quick order";

    constructor(
        @Inject(APP_CONSTANTS) private _constants: IAppConstants,
        @Inject(PLATFORM_ID) private platformId: Object,
        private cartStore: Store<fromShopingCart.State>,
        private categoryInfoService: CategoryInfoService,
        private _sender: GtagSenderService,
    ) {
        this.recepientKeys = [this._constants.GTAG_ANALYTICS_KEY, this._constants.GTAG_AD_WORDS_KEY];
    }

  public sendPurchaseEvent(transactionId: string): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.cartStore.select(fromShopingCart.getCart).pipe(first()).subscribe(cart => {
      this.categoryInfoService.setProductCategories(cart.products).pipe(first()).subscribe(() => {

        this.cartStore.select(fromShopingCart.getDiscount).pipe(first()).subscribe((result) => {

          if (result && result.promo) {

            let parameters = this.getParametrsModelWithDiscount(cart.products, transactionId, null, result);
            parameters['coupon'] = result.promo;

            this._sender.sendEvent(parameters, this.recepientKeys, this.eventType);
          }
          else {

            let parameters = this.getParametersModel(cart.products, transactionId, null);
            this._sender.sendEvent(parameters, this.recepientKeys, this.eventType);
          }
        });
      });
    });
  }


  private getParametrsModelWithDiscount(products: CartProduct[], transaction_id: string, option: string, discount: DiscountModel) {

    let total: number = 0;

    total = products.map((p) => p.price * p.quantity).reduce((p, n) => p += n);

    let parameters = {
      "transaction_id": transaction_id,
      "value": this.getDiscount(total, discount, SumType.Total).toFixed(2),
      "currency": "UAH",
      "items": products.map(p => {
        return {
          "id": p.articleId,
          "price": this.getDiscount(p.price, discount, SumType.OneProduct).toFixed(2),
          "quantity": p.quantity,
          "name": p.displayDescription,
          "brand": p.brand,
          "category": p.category || ''
        }
      })
    };

    if (option) {
      parameters["custom_purchase_type"] = option;
    }

    return parameters;
  }

  private getDiscount(productSum: number, discount: DiscountModel, sumType: SumType): number {

    if (!productSum && productSum == 0) {
      return productSum;
    }

    let sum = productSum;

    if (discount && discount.size && discount.typeDiscount && discount.typeDiscount) {

      if (sumType == SumType.OneProduct) {

        if (discount.typeDiscount === DiscountType.Percent) {

          sum = this.getSumUsingProcent(discount.size, sum);
        }
      }

      if (sumType == SumType.Total) {

        if (discount.typeDiscount === DiscountType.FixPrice) {
          sum -= discount.size;
        }

        if (discount.typeDiscount === DiscountType.Percent) {

          sum = this.getSumUsingProcent(discount.size, sum);
        }
      }
    }

    return sum;
  }

  private getSumUsingProcent(percent: number, sum: number): number {

    sum -= sum * (percent / 100);
    return sum;
  }

    public sendPurchaseEventForQuickOrder(transactionId: string): void {
        if (!isPlatformBrowser(this.platformId)) {
            return;
      }

        this.cartStore.select(fromShopingCart.getCart).pipe(first()).subscribe(cart => {
            this.categoryInfoService.setProductCategories(cart.products).pipe(first()).subscribe(() => {
                let parameters = this.getParametersModel(cart.products, transactionId, this.quickOrder);
                this._sender.sendEvent(parameters, this.recepientKeys, this.eventType);
            });
        });
    }

    public static generateUniqueId(type: TransactionType): string {

        let getStringTransactionType = "";

        if (type == TransactionType.QuickOrder) {
            getStringTransactionType = "Q";
        }

        if (type == TransactionType.ExtendedOrder) {
            getStringTransactionType = "E";
        }

        if (type == TransactionType.Сallback) {
            getStringTransactionType = "C";
        }

        if (type == TransactionType.SelectionForSpareParts) {
            getStringTransactionType = "S";
        }

        if (type == TransactionType.VinSearch) {
            getStringTransactionType = "V";
        }

        return `S${getStringTransactionType}_${new Date().getTime()}`;
    }

    private getParametersModel(products: CartProduct[], transaction_id: string, option: string) {
        let total: number = 0;
        products.forEach(p => {
            total += p.price * p.quantity;
        });

        let parameters = {
            "transaction_id": transaction_id,
            "value": total.toFixed(2),
            "currency": "UAH",
            "items": products.map(p => {
                return {
                    "id": p.articleId,
                    "price": p.price,
                    "quantity": p.quantity,
                    "name": p.displayDescription,
                    "brand": p.brand,
                    "category": p.category || ''
                }
            })
        };

        if (option) {
            parameters["custom_purchase_type"] = option;
        }

        return parameters;
    }
}
