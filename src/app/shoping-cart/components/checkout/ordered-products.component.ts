import { Component, OnInit, OnDestroy, ViewChild, Output, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subject, of } from 'rxjs';
import * as shopingcart from '../../actions/shoping-cart';
import * as fromShopingCart from '../../reducers';
import { LanguageService } from '../../../services/language.service';
import { Cart, CartProduct } from '../../models/shoping-cart-product.model';
import { takeUntil } from 'rxjs/operators';
import { NavigationService } from '../../../services/navigation.service';
import { OrderPopupComponent } from '../order-popup.component';

@Component({
    selector: 'ordered-products',
    templateUrl: './__mobile__/ordered-products.component.html'
})
export class OrderedProductsComponent implements OnDestroy, OnInit {

    @Output() productsConfirmed: EventEmitter<boolean> = new EventEmitter<boolean>();

    public cart$: Observable<Cart>;
    private destroy$: Subject<boolean> = new Subject<boolean>();
    @ViewChild("orderpop") public orderPopup: OrderPopupComponent;
    public product$: Observable<CartProduct> = new Observable<CartProduct>();

    constructor(
        private store: Store<fromShopingCart.State>,
        private _languageService: LanguageService,
        private _navigationService: NavigationService,
    ) {  }

    ngOnInit(): void {
        this.cart$ = this.store.select(fromShopingCart.getCart);
        this.cart$.pipe(takeUntil(this.destroy$)).subscribe(() => {
            this.performDescriptionTranslation();
        })

        this._languageService.languageChange.pipe(takeUntil(this.destroy$)).subscribe(() => {
            this.performDescriptionTranslation();
        })

        this.product$ = of(null);//
    }

    ngOnDestroy(): void {
        this.destroy$.next(true);
        this.destroy$.unsubscribe();
    }

    public navigateToProduct(product: CartProduct): void {
        if (!product.transletiratedTitle) {
            return;
        }
        let title = product.transletiratedTitle;
        if (title.endsWith(".html")) {
            title = title.substring(0, title.indexOf(".html"));
        }
        this._navigationService.OpenProductInNewTab(title);
    }

    public getImageUrl(product: CartProduct): string {
        if (product.image)
            return 'data:image/jpeg;base64,' + product.image;

        return '';
    }

    private performDescriptionTranslation(): void {
        let language = this._languageService.getSelectedLanguage();
        let langName = language.name || 'RUS';
        this.store.dispatch(new shopingcart.PerformDescriptionsTranslation(langName));
    }

    public editProductsList(): void {
        this.orderPopup.toggleWindow();
    }

    public confirmProducts(): void {
        this.productsConfirmed.emit(true);
    }
}
