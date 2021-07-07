﻿import { Component, ViewChild, Input } from '@angular/core';
import { Product } from '../../models/product.model';
import { BaseLoader } from './loaderbase.component';
import { SearchService } from '../../services/search.service';
import { NavigationService } from '../../services/navigation.service';
import { FavoriteProductService } from '../../services/favorite-product.service';
import { PixelFacebookService } from '../../services/pixel-facebook.service';
import { OrderPopupComponent } from '../../shoping-cart/components/order-popup.component';
import { Store } from '@ngrx/store';
import { CartProduct } from '../../shoping-cart/models/shoping-cart-product.model';
import { RestStatusEnum } from '../../search/models/rest-status-enum.model';
import * as shopingcart from '../../shoping-cart/actions/shoping-cart';
import * as fromShopingCart from '../../shoping-cart/reducers';
import * as fromSearch from '../../search/reducers';
import { Observable } from 'rxjs';
import { LoginPopupComponent } from '../../shared/components/login-popup.component';
import { AuthHttpService } from '../../auth/auth-http.service';
import { MatDialog } from '@angular/material/dialog';
import { GtagService } from '../../services/gtag.service';
import { NotifyWhenAvailableComponent } from '../../product/components/notify-when-available.component';
import { environment } from '../../../environments/environment';

@Component({
    selector: '',
    template: ''
})
export class BaseListComponent extends BaseLoader {
    public products$: Observable<Product[]>;
    public selectedProduct$: Observable<CartProduct>;
    @Input() public isList: boolean = false;
    @Input() showMoreButtonDisplayed: boolean = false;
    @ViewChild("orderpop") public orderPopup: OrderPopupComponent;
    @ViewChild("notifyWhenAvailablePopup") public notifyWhenAvailablePopup: NotifyWhenAvailableComponent;
    public moreProductsLoadInProcess: boolean = false;
    private optionForRemarketingCart = "extended order";
    public productsInBasket: CartProduct[] = [];

    constructor(
        
        public store: Store<fromShopingCart.State>,
        public searchStore: Store<fromSearch.State>,
        public _searchService: SearchService,
        public _navigationService: NavigationService,
        public _favoriteProductService: FavoriteProductService,
        public _authService: AuthHttpService,
        public dialog: MatDialog,
        public _gtagService: GtagService,
        private _faceBookPixelService: PixelFacebookService,
    ) {
        super();
        this.selectedProduct$ = this.store.select(fromShopingCart.getSelectedProduct);        
    }

    public navigateToProduct(item: any) {
        this._searchService.setCacheProduct(item);

        this._navigationService.NavigateToProduct(item.transliteratedTitle);
    }  

    public errorHandler(event) {
        event.target.src = 'https://res.cloudinary.com/dk5dc1wvr/image/upload/v1507713301/images/no_image.png';
    }

    public getImageUrl(id) {
        return environment.apiUrl + '/product/image?productId=' + id + '&number=1';
    }

    public onProductAdd(product: Product, addAll: boolean = true): void {
        this.store.dispatch(new shopingcart.AddProductAction(product));
        this._gtagService.sendEventAddToCart(product, this.optionForRemarketingCart);
        this._faceBookPixelService.trackAddToCartEvent(product.id, product.displayDescriptionRus, product.transliteratedTitle, product.price);
        if (addAll) {
            this.orderPopup.toggleWindow();
        }
    }

    public navigateToAnalogs(product: Product): void {
        this._searchService.setCacheProduct(product);
        this._navigationService.NavigateToAnalogs(product.id.toString());
    }

    public purchaseButtonShown(product: Product): boolean {
        return Boolean(product.restStatus === RestStatusEnum.Available || product.restStatus === RestStatusEnum.InAnotherStore || product.restStatus === RestStatusEnum.InAnotherPartner || product.restStatus === RestStatusEnum.InAnotherTiresStore);
    }

    public analogsButtonShown(product: Product): boolean {
        return Boolean(product.restStatus === RestStatusEnum.NotAvailable && product.analogsCount > 0);
    }

    public disabledPurchaseButtonShown(product: Product): boolean {
        return Boolean(product.restStatus === RestStatusEnum.NotAvailable && product.analogsCount <= 0);
    }

    public isAvailable(product: Product): boolean {
        return Boolean(product.restStatus === RestStatusEnum.Available);
    }

    public notAvailable(product: Product): boolean {
        return Boolean(product.restStatus === RestStatusEnum.NotAvailable);
    }

    public inAnotherStore(product: Product): boolean {
        return Boolean(product.restStatus === RestStatusEnum.InAnotherStore);
    }

    public inAnotherPartner(product: Product): boolean  {
        return Boolean(product.restStatus === RestStatusEnum.InAnotherPartner);
    }

    public inAnotherTiresStore(product: Product): boolean {
        return Boolean(product.restStatus === RestStatusEnum.InAnotherTiresStore);
    }

    public addToFavorite(product: Product) {
        if (this._authService.isAuthenticated()) {
            product.isFavorite = !product.isFavorite;
            this._favoriteProductService.upsertFavoritList(product);

            if (product.isFavorite)
                this._gtagService.addToWishlist.sendEventAddToWishlist(product);
        }
        else {
            let dialogRef = this.dialog.open(LoginPopupComponent);
            dialogRef.afterClosed().subscribe(confirm => {
                if (this._authService.isAuthenticated()) {
                    product.isFavorite = !product.isFavorite;
                    this._favoriteProductService.upsertFavoritList(product);

                    if (product.isFavorite)
                        this._gtagService.addToWishlist.sendEventAddToWishlist(product);
                }
            });
        }
    }

    public checkProductInBasket(product: Product): boolean {
        return this.productsInBasket.find(item => item.articleId === product.id) ? true : false;
    }

    public openNotifyWhenAvailablePopup(product: Product) {
        this.notifyWhenAvailablePopup.addProductAndOpenWindow(product);
    }
}