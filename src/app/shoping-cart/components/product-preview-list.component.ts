import { Component, ChangeDetectorRef, OnInit, OnDestroy } from '@angular/core';
import { CartProduct, Cart } from '../models/shoping-cart-product.model';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import * as shopingcart from '../actions/shoping-cart';
import * as fromShopingCart from '../reducers';
import { SearchService } from '../../services/search.service';
import { LanguageService } from '../../services/language.service';
import { GtagService } from '../../services/gtag.service';
import { takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
    selector: 'product-preview-list',
    templateUrl: './__mobile__/product-preview-list.component.html'
})
export class ProductPreviewListComponent implements OnDestroy, OnInit 
{
    public cart$: Observable<Cart>;
    private _destroy$: Subject<boolean> = new Subject<boolean>();

    constructor(private store: Store<fromShopingCart.State>, private cd: ChangeDetectorRef, private _languageService: LanguageService, private _searchService: SearchService,    
        private _gtagService: GtagService, private _route: Router) {
        this.cart$ = store.select(fromShopingCart.getCart);
    }

    ngOnInit(): void {
        this.cart$.pipe(takeUntil(this._destroy$)).subscribe((cart) => {
            this.performDescriptionTranslation();
            this.cd.markForCheck();
            var pagetype = this._route.routerState.snapshot.url;
            if (pagetype.startsWith('/order-checkout/checkout-in-process')) {
                this._gtagService.setCartDataLayer(cart.products);
            }

            this._destroy$.next(true);
        })

        this._languageService.languageChange.pipe(takeUntil(this._destroy$)).subscribe(() => {
            this.performDescriptionTranslation();
        })

        this.performDescriptionTranslation();
    }

    ngOnDestroy(): void {
        this._destroy$.next(true);
        this._destroy$.unsubscribe();
    }

    public removeProduct(product: CartProduct) {
        this.store.dispatch(new shopingcart.RemoveProductAction(product));
        this._gtagService.removeFromCart.sendRemoveFromCart([product]);
    }

    public incrementProductQuantity(cartProduct: CartProduct): void {
        this.store.dispatch(new shopingcart.SelectProductAction(cartProduct));
        this.store.dispatch(new shopingcart.IncrementQuantityAction(cartProduct));
    }

    public decrementProductQuantity(cartProduct: CartProduct): void {
        this.store.dispatch(new shopingcart.SelectProductAction(cartProduct));
        this.store.dispatch(new shopingcart.DecrementQuantityAction(cartProduct));
    }

    public updateProductQuantity(obj: any): void {
        this.store.dispatch(new shopingcart.SelectProductAction(obj.product));
        this.store.dispatch(new shopingcart.UpdateQuantityAction(obj));
    }

    public updateQuantity(cartProduct: CartProduct): void {
        if (!cartProduct) {
            return;
        }
        this.store.dispatch(new shopingcart.SelectProductAction(cartProduct));
        this.store.dispatch(new shopingcart.UpdateQuantityAction({ product: cartProduct, quantity: cartProduct.quantity }));
    }

    public getImageUrl(product: CartProduct): string {
        if (product.image)
            return 'data:image/jpeg;base64,' + product.image;


        return '';
    }

    public trackByFn(index, item) {
        return index;
    }

    private performDescriptionTranslation(): void {
        let language = this._languageService.getSelectedLanguage();
        let langName = language.name || 'RUS';
        this.store.dispatch(new shopingcart.PerformDescriptionsTranslation(langName));
    }
}
