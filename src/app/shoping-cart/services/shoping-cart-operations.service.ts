import { Injectable } from '@angular/core';
import { CartProduct } from '../models/shoping-cart-product.model';
import { Observable, of } from "rxjs";

@Injectable()
export class ShopingCartOperationsService {
    public incrementProductQuantity(product: CartProduct): Observable<CartProduct> {

        let incremntation_step = product.compulsory && product.compulsory == "2" ? 1 : +product.incDecStep;
        let quantity = product.quantity + incremntation_step;
        if (quantity <= 99) {
            product.quantity = quantity;
        }

        let prod = {
            ...product
        };

        return of<CartProduct>(prod);
    }

    public decrementProductQuantity(product: CartProduct): Observable<CartProduct> {

        let decremntation_step = product.compulsory && product.compulsory == "2" ? 1 : +product.incDecStep;
        let quantity = product.quantity - decremntation_step;
        if (quantity > 0)
            product.quantity = quantity;

        let prod = {
            ...product
        };

        return of<CartProduct>(prod);
    }

    public updateProductQuantity(product: CartProduct, quantity: number): Observable<CartProduct> {

        let qty = +quantity;
        if (qty <= 99) {
            let difference = product.quantity - qty;

            if (difference > 0 && product.compulsory) {
                return this.incrementProductQuantity(product);
            }

            if (difference < 0 && product.compulsory) {
                return this.decrementProductQuantity(product);
            }

            product.quantity = qty <= 0 ? 1 : qty;
        }
        let prod = {
            ...product
        };

        return of<CartProduct>(prod);
    }
}
