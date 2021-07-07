import { Component, ViewChild, Input } from '@angular/core';
import { QuickOrderService } from '../services/quickorder.service';
import { BaseLoader } from '../../shared/abstraction/loaderbase.component';
import { Product } from '../../models';
import { Store } from '@ngrx/store';
import * as shopingcart from '../../shoping-cart/actions/shoping-cart';
import * as fromShopingCart from '../../shoping-cart/reducers';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
    selector: 'product-quick-order',
    templateUrl: './__mobile__/product-quick-order.component.html',
    styleUrls: ['./__mobile__/styles/product-quick-order.component__.scss']
})
export class ProductQuickOrderComponent extends BaseLoader{
    @ViewChild('phone') phoneEl = null;
    @Input() product: Product;
    private destroy$: Subject<boolean> = new Subject<boolean>();

    constructor(
        public _quickOrderService: QuickOrderService,
        private store: Store<fromShopingCart.State>
  ) { super(); }

  ngOnDestroy() {

    this.destroy$.next(true);
  }

  public createQuickOrder() {

    this.store.dispatch(new shopingcart.AddProductAction(this.product));
    let operationSubsctiption =  this._quickOrderService.createQuickOrderForCart(this.phoneEl).pipe(takeUntil(this.destroy$)).subscribe(() => {

      let subscription = this.store.select(fromShopingCart.getCart).subscribe((result) => {

        let products = result.products.filter((product) => product.articleId == this.product.id);

        if (products && products.length > 0) {

          this.store.dispatch(new shopingcart.RemoveProductAction(products[0]));

          subscription.unsubscribe();
        }

        operationSubsctiption.unsubscribe();
      });
    });
  }
}
