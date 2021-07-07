import { Cart } from './shoping-cart-product.model';

export class LocalCart {
    public cart: Cart;
    public expiresIn: number;

    constructor(cart: Cart, expiresIn: number) {
        this.cart = cart;
        this.expiresIn = expiresIn;
    }
}