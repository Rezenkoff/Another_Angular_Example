import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CartProduct } from '../shoping-cart/models/shoping-cart-product.model';
import { CatalogType } from '../catalog/models/catalog-type.enum';
import { MainUrlParser } from '../app-root/main-url.parser';
import { CatalogService } from './catalog-model.service';
import { Node } from '../catalog/models/node.model';

declare var fbq: any;

@Injectable()
export class PixelFacebookService {

    constructor(@Inject(PLATFORM_ID) public platformId: Object,
        private _catalogService: CatalogService,
        @Inject(MainUrlParser) private urlParser: MainUrlParser
        ) { }

    public trackProductCardViewEvent(content_ids, content_name, content_category, value) {
      if (isPlatformBrowser(this.platformId)) {

        if (typeof (fbq) === "undefined") {
          return;
        }

            fbq('track', 'ViewContent', {
                content_type: 'product',
                content_ids: content_ids, //['1234'],
                content_name: content_name, //'Подгузники Pampers 80шт',
                content_category: content_category, //'Подгузники',
                value: value, //200.45,
                currency: 'USD'
            });
        }
    }

    public trackAddToCartEvent(content_ids, content_name, transliteratedTitle, value) {
        if (isPlatformBrowser(this.platformId)) {
            var content_category = this.getCurrentNode(transliteratedTitle);

          if (content_category) {

            if (typeof (fbq) === "undefined") {
              return;
            }

                fbq('track', 'AddToCart', {
                    content_type: 'product',
                    content_ids: content_ids, //['1234'],
                    content_name: content_name, //'Подгузники Pampers 80шт',
                    content_category: content_category.name, //'Подгузники',
                    value: value, //200.45,
                    currency: 'USD'
                });
            }
        }
    }

  public trackPurchaseOrderEvent(products: Array<CartProduct>) {


        if (isPlatformBrowser(this.platformId)) {
            let content_ids = [];
            let content_name = [];
            let content_category = [];
            let sum = 0;
            products.forEach(item => {
                content_ids.push(item.articleId);
                content_name.push(item.displayDescription);
                content_category.push(this.getCurrentNode(item.transletiratedTitle).name);
                sum += item.price;
            });

          if (typeof (fbq) === "undefined") {
            return;
          }

            fbq('track', 'Purchase', {
                content_type: 'product',
                content_ids: content_ids, //['1234'],
                content_name: content_name, //'Подгузники Pampers 80шт',
                content_category: content_category, //'Подгузники',
                value: sum, //200.45,
                currency: 'USD'
            });
        }
    }

    private getCurrentNode(transliteratedTitle: string): Node {
        let categoryId = this.urlParser.parseUrlForCategoryId(transliteratedTitle);
        return this._catalogService.getNodeById(categoryId, CatalogType.Full);
    }
}
