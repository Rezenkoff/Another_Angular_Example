import { Component, OnInit } from "@angular/core";
import { Cart, CartProduct } from "../../shoping-cart/models/shoping-cart-product.model";
import { Observable } from "rxjs";
import * as fromShopingCart from '../../shoping-cart/reducers';
import { Store } from "@ngrx/store";
import * as shopingcart from '../../shoping-cart/actions/shoping-cart';

@Component({
    selector: 'product-installing',
    templateUrl: './__mobile__/product-installing.component.html'
})
export class ProductInstallingComponent implements OnInit {
    public cart$: Observable<Cart>;

    constructor(private store: Store<fromShopingCart.State>, ) { }

    ngOnInit() {
        this.cart$ = this.store.select(fromShopingCart.getCart);
    }

    public selectProduct(product: CartProduct, $event: any) {
        let isNeedToInstall = $event.currentTarget.checked;
        this.store.dispatch(new shopingcart.SelectProductForInstalling({ product: product, isNeedToInstall: isNeedToInstall }));
    }
}