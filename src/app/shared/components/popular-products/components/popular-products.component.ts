import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromPopularProducts from '../reducers';
import { Observable, Subject } from 'rxjs';
import { Product } from '../../../../models/product.model';
import { takeUntil } from 'rxjs/operators';
import * as popularProductAction from '../actions/popular-products.action';
import { FavoriteProductService } from '../../../../services/favorite-product.service';
import { LanguageService } from '../../../../services/language.service';
import { PixelFacebookService } from '../../../../services/pixel-facebook.service';
import { AuthHttpService } from '../../../../auth/auth-http.service';
import { LoginPopupComponent } from '../../login-popup.component';
import { MatDialog } from '@angular/material/dialog';
import * as shopingcart from '../../../../shoping-cart/actions/shoping-cart';
import { CartProduct } from '../../../../shoping-cart/models/shoping-cart-product.model';
import { OrderPopupComponent } from '../../../../shoping-cart/components/order-popup.component';
import * as fromShopingCart from '../../../../shoping-cart/reducers';
import { CdnImageHelper } from '../../../../app-root/cdn-image-path';
import { DragScrollComponent } from '../../../../drag-scroll/ngx-drag-scroll.component';
import { GtagService } from '../../../../services/gtag.service';

const LRU = require("lru-cache");

@Component({
    selector: 'popular-products',
    templateUrl: './__mobile__/popular-products.component.html',
    styleUrls: ['./__mobile__/styles/popular-products.component__.scss']
})
export class PopularProduct implements OnInit, OnDestroy {
    public loadInProcess$: Observable<boolean>;
    public popularProducts: Product[] = [];
    public productsInBasket: CartProduct[] = [];
    private ngUnsubscribe: Subject<boolean> = new Subject<boolean>();
    private cache: any = null;
    public selectedProduct$: Observable<CartProduct>;
    public leftNavDisabled: boolean = false;
    public rightNavDisabled: boolean = false;
    private optionForRemarketingCart = "extended order";
    public eventViewOption: string = "popular products home";

    @ViewChild("orderpop") public orderPopup: OrderPopupComponent;
    @ViewChild('nav', { read: DragScrollComponent }) public ds: DragScrollComponent;

    constructor(
        private _imagePathResolver: CdnImageHelper,
        private storePopularProduct: Store<fromPopularProducts.State>,
        public _favoriteProductService: FavoriteProductService,
        public _authService: AuthHttpService,
        public dialog: MatDialog,
        private _languageService: LanguageService,
        private storeShopingCart: Store<fromShopingCart.State>,
        public _gtagService: GtagService,
        private _faceBookPixelService: PixelFacebookService
    ) {
    }

    ngOnInit() {
        this.setSelectedLanguage();
        this._languageService.languageChange.pipe(takeUntil(this.ngUnsubscribe))
            .subscribe(() => this.setSelectedLanguage());

        this.selectedProduct$ = this.storeShopingCart.select(fromShopingCart.getSelectedProduct);

        this.storeShopingCart.select(fromShopingCart.getCart)
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe(item => {
                this.productsInBasket = item.products;
            });

        this._authService.userLogedIn.pipe(takeUntil(this.ngUnsubscribe))
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe(isLogedIn => {
                if (!isLogedIn)
                    this.resetpopularProductsFavorite();
            });

        this.getProducts();
    }

    public addToFavorite(product: Product) {
        if (this._authService.isAuthenticated()) {
            product.isFavorite = !product.isFavorite;
            this._favoriteProductService.upsertFavoritList(product);
        }
        else {
            let dialogRef = this.dialog.open(LoginPopupComponent);
            dialogRef.afterClosed().subscribe(confirm => {
                if (confirm && this._authService.isAuthenticated()) {
                    this._favoriteProductService.loadFavoritProducts()
                        .pipe(takeUntil(this.ngUnsubscribe))
                        .subscribe(favoriteIds => {
                            let elem = favoriteIds.find(element => element == product.id);
                            product.isFavorite = elem ? false : true;
                            this._favoriteProductService.upsertFavoritList(product);
                            this.getProducts();
                        })
                }
            });
        }
    }

    public getImageUrl(id: number): string {
        return this._imagePathResolver.getImage(id);
    }

    public getProducts() {
        this.storePopularProduct.dispatch(new popularProductAction.Load());
        this.storePopularProduct.select(fromPopularProducts.getPopularProducts)
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe(res => {
                this.popularProducts = res;
            });
    }

    public onProductAdd(product: Product): void {
        this.storeShopingCart.dispatch(new shopingcart.AddProductAction(product));
        this.orderPopup.toggleWindow();
        this._gtagService.sendEventAddToCart(product, this.optionForRemarketingCart);
        this._faceBookPixelService.trackAddToCartEvent(product.id, product.displayDescriptionRus, product.transliteratedTitle, product.price);
    }

    private resetpopularProductsFavorite() {
        this.popularProducts.map(el => { el.isFavorite = false });
    }

    private setSelectedLanguage() {
        let lang = this._languageService.getSelectedLanguage();
        let langName = lang.name;
        this.storePopularProduct.dispatch(new popularProductAction.SetSelectedLanguage(langName));
        this.storePopularProduct.dispatch(new popularProductAction.PerformDescriptionsTranslation());
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next(true);
        this.ngUnsubscribe.unsubscribe();
    }

    public checkProductInBasket(product: CartProduct): boolean {
        return this.productsInBasket.some(item => item.articleId === product.id);
    }

    moveLeft() {
        this.ds.moveLeft();
    }

    moveRight() {
        this.ds.moveRight();
    }

    public LeftBound(reachesLeftBound: boolean) {
        this.leftNavDisabled = reachesLeftBound;
    }

    public RightBound(reachesRightBound: boolean) {
        this.rightNavDisabled = reachesRightBound;
    }

    public priceFormatting(price: number) {
        let priceStr = price.toFixed(2);
        let indexOfpoint = priceStr.indexOf('.');

        let grn = priceStr.substring(0, indexOfpoint);
        let kop = priceStr.substring(indexOfpoint);

        return `${grn}<span class="product-box-grn">${kop} грн</span>`;
    }

    public addToViewed(index: number) {
        this._gtagService.sendViewedProducts(index, this.popularProducts, this.eventViewOption);
    }

    public sendSelectContentEvent(product: Product, index: number) {
        this._gtagService.selectContent.sendEventSelectContent([product], index, this.eventViewOption);
    }
}