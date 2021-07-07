import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { UserStorageService } from '../../services/user-storage.service';
import { CartProduct, Cart } from '../models/shoping-cart-product.model';
import { LocalCart } from '../models/local-storage-cart.model';
import { isPlatformBrowser } from '@angular/common';
import { Observable, of } from "rxjs";

@Injectable()
export class ShopingCartLocalService {
    private readonly UserLocalCartKey: string = 'LocalCart';
    private currentProductIdentity: number = 0;
    private localStorageCart: LocalCart;

    constructor(
        @Inject(PLATFORM_ID) private platformId: Object,
        private _userStorage: UserStorageService
    ) {

    }

    public loadCartProducts(): Observable<Cart> {
        if (isPlatformBrowser(this.platformId)) {
            let currentDate = new Date().getTime();

            this.localStorageCart = this._userStorage.getData(this.UserLocalCartKey) as LocalCart;

            if (this.localStorageCart !== null) {

                if (currentDate < this.localStorageCart.expiresIn)
                    return of<Cart>(this.localStorageCart.cart);
                else {
                    this._userStorage.removeData(this.UserLocalCartKey);
                }
            }
        }

        return of<Cart>(new Cart([], 0, 0, 0));
    }

    private getLastIdentity(): void {
        if (this.localStorageCart !== null && this.localStorageCart.cart.products.length > 0)
            this.localStorageCart.cart.products.map(p => {
                if (p.id > this.currentProductIdentity)
                    this.currentProductIdentity = p.id;
            });
    }

    public updateProduct(cartProduct: CartProduct): Observable<CartProduct> {
        if (isPlatformBrowser(this.platformId)) {
            this.localStorageCart = this._userStorage.getData(this.UserLocalCartKey) as LocalCart;
            const product = this.localStorageCart.cart.products.find(x => x.articleId == cartProduct.articleId);

            if (product) {
                product.quantity = cartProduct.quantity;
                product.isNeedToInstall = cartProduct.isNeedToInstall;
                this._userStorage.upsertData(this.UserLocalCartKey, this.localStorageCart);
                return of<CartProduct>(product);
            }

            return of<CartProduct>(cartProduct);
        }
    }

    public upsertProductArray(products: CartProduct[]): Observable<CartProduct[]> {
        if (isPlatformBrowser(this.platformId)) {
            this.localStorageCart = this._userStorage.getData(this.UserLocalCartKey) as LocalCart;

            if (products.length > 0) {
                products.map(item => {
                    let product = this.localStorageCart.cart.products.find(p => p.articleId == item['artId']);
                    if (product) {
                        product.quantity = item.quantity;
                    }                                        
                });

                this._userStorage.upsertData(this.UserLocalCartKey, this.localStorageCart);
                return of<CartProduct[]>(this.localStorageCart.cart.products);
            }

            return of<CartProduct[]>(products);
        }
    }

    public removeProduct(cartProduct: CartProduct): Observable<CartProduct> {
        this.localStorageCart = this._userStorage.getData(this.UserLocalCartKey) as LocalCart;
        let prodIndex = this.localStorageCart.cart.products.map(p => p.id).indexOf(cartProduct.id);

        if (prodIndex > -1) {
            this.localStorageCart.cart.products.splice(prodIndex, 1);
            this._userStorage.upsertData(this.UserLocalCartKey, this.localStorageCart);
            return of<CartProduct>(this.localStorageCart.cart.products[prodIndex]);
        }

        return of<CartProduct>(cartProduct);
    }

    public clearCart(): Observable<boolean> {
        if (isPlatformBrowser(this.platformId)) {
            this._userStorage.removeData(this.UserLocalCartKey);
        }
        return of<boolean>(true);
    }

    public addProduct(cartProduct: CartProduct): Observable<CartProduct> {
        if (isPlatformBrowser(this.platformId)) {
            let expiresIn: number = 0;
            let currentDate = new Date();

            this.localStorageCart = this._userStorage.getData(this.UserLocalCartKey) as LocalCart;

            if (this.localStorageCart == null) {
                currentDate.setDate(currentDate.getDate() + 30);
                expiresIn = currentDate.getTime();
                this.localStorageCart = new LocalCart(new Cart([], 0, 0, 0), expiresIn);
            }

            let prodIndex = this.localStorageCart.cart.products.map(p => p.articleId).indexOf(cartProduct.articleId);

            if (prodIndex > -1) {
                return of<CartProduct>(this.localStorageCart.cart.products[prodIndex]);
            }

            this.getLastIdentity();
            cartProduct.id = ++this.currentProductIdentity;

            this.localStorageCart.cart.products.push(cartProduct);
            this._userStorage.upsertData(this.UserLocalCartKey, this.localStorageCart);

            return of<CartProduct>(cartProduct);
        }
    }
}
