import { Component, Inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { CartProduct, Cart } from '../../shoping-cart/models/shoping-cart-product.model';
import * as fromShopingCart from '../../shoping-cart/reducers';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'confirm-order-popup',
    templateUrl: './__mobile__/confirm-order-popup.component.html'
})
export class ConfirmOrderPopup {

    private cart$: Observable<Cart>;
    public cartProducts: Array<CartProduct>;
    public comparisonTable: Array<any> = [];

    constructor(
        private store: Store<fromShopingCart.State>,        
        @Inject(MAT_DIALOG_DATA) public data: any[], private dialogRef: MatDialogRef<ConfirmOrderPopup>) {
        this.cart$ = store.select(fromShopingCart.getCart);
        this.cart$.subscribe(cart => this.cartProducts = cart.products);
    }

    ngOnInit() {
        //TODO move to service
        this.cartProducts.forEach(pr => {
            let reservedProduct = this.data.find(rp => rp.artId == pr.articleId);
            if (reservedProduct) {
                this.comparisonTable.push({
                    lookupNumber: pr.lookupNumber,
                    displayDescription: pr.displayDescription,
                    reservedPrice: reservedProduct.price,
                    cartPrice: pr.price
                });
            }
        })
    }

    public close(accept: boolean): void {
        this.dialogRef.close(accept);
    }
}
