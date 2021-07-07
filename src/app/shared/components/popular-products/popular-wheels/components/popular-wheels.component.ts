import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID, ViewChild } from '@angular/core';
import { Product } from '../../../../../models/product.model';
import { IAppConstants, APP_CONSTANTS } from '../../../../../config';
import { ServerParamsTransfer } from '../../../../../server-params-transfer.service';
import { CdnImageHelper } from '../../../../../app-root/cdn-image-path';
import { Store } from '@ngrx/store';
import { FavoriteProductService } from '../../../../../services/favorite-product.service';
import { PixelFacebookService } from '../../../../../services/pixel-facebook.service';
import { PopularProductService } from '../../service/popular-products.service';
import { AuthHttpService } from '../../../../../auth/auth-http.service';
import { MatDialog } from '@angular/material/dialog';
import { GtagService } from '../../../../../services/gtag.service';
import * as fromShopingCart from '../../../../../shoping-cart/reducers';
import { takeUntil } from 'rxjs/operators';
import { Subscription, Observable, Subject } from 'rxjs';
import { SearchParameters } from '../../../../../search/models/search-parameters.model';
import { CartProduct } from '../../../../../shoping-cart/models/shoping-cart-product.model';
import { DragScrollComponent } from '../../../../../drag-scroll/ngx-drag-scroll.component';
import { LoginPopupComponent } from '../../../login-popup.component';
import * as shopingcart from '../../../../../shoping-cart/actions/shoping-cart';


@Component({
    selector: 'popular-wheels',
    templateUrl: './__mobile__/popular-wheels.component.html',
    styleUrls: ['./__mobile__/styles/popular-wheels.component__.scss']
})
export class PopularWheelsList implements OnInit, OnDestroy {

    public subscriptions: Array<Subscription> = new Array<Subscription>();
    public products: Product[];
    public searchParameters: SearchParameters = new SearchParameters();
    public listArtId: number[] = [];
    public popularTires$: Observable<Product[]>;
    public popularProducts: Product[] = [];
    public leftNavDisabled: boolean = false;
    public rightNavDisabled: boolean = false;
    public eventViewOption: string = "popular products home";
    private optionForRemarketingCart = "extended order";
    private ngUnsubscribe: Subject<boolean> = new Subject<boolean>();
    public productsInBasket: CartProduct[] = [];

    @ViewChild('nav', { read: DragScrollComponent }) public ds: DragScrollComponent;

    constructor(
        @Inject(APP_CONSTANTS) private __appconstants: IAppConstants,
        @Inject(PLATFORM_ID) private _platformId,
        private serverParamsService: ServerParamsTransfer,
        private _imagePathResolver: CdnImageHelper,
        public _favoriteProductService: FavoriteProductService,
        public _authHttpService: AuthHttpService,
        public _dialog: MatDialog,
        public _gtagService: GtagService,
        public _facebookPixelService: PixelFacebookService,
        private _popularProductService: PopularProductService,
        private storeShopingCart: Store<fromShopingCart.State>,
        public _authService: AuthHttpService,
        public dialog: MatDialog,
        private _faceBookPixelService: PixelFacebookService
    ) {}

    ngOnInit() {
        this.searchParameters.categoryUrl = 'diski-id50-3';
        this.searchParameters.sortOrder = 1;
        this.searchParameters.artId = 0;
        this.searchParameters.count = 20;

        this.popularTires$ = this._popularProductService.getPopularTires(this.searchParameters);
        this.popularTires$.subscribe(data => {
            this.popularProducts = data;
        });
    }

    ngOnDestroy() {
        this.subscriptions.forEach(s => s.unsubscribe());

        this.ngUnsubscribe.next(true);
        this.ngUnsubscribe.unsubscribe();
    }

    public isLoad(tires: Observable<Product[]>): boolean {
        return tires != null;
    }

    public getImageUrl(id: number): string {
        return this._imagePathResolver.getImage(id);
    }

    public LeftBound(reachesLeftBound: boolean) {
        this.leftNavDisabled = reachesLeftBound;
    }
    public RightBound(reachesRightBound: boolean) {
        this.rightNavDisabled = reachesRightBound;
    }

    moveLeft() {
        //this.ds.moveLeft();
    }

    moveRight() {
       // this.ds.moveRight();
    }

    public addToViewed(index: number) {
        this._gtagService.sendViewedProducts(index, this.popularProducts, this.eventViewOption);
    }

    public sendSelectContentEvent(product: Product, index: number) {
        this._gtagService.selectContent.sendEventSelectContent([product], index, this.eventViewOption);
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
                        })
                }
            });
        }
    }

    public checkProductInBasket(product: CartProduct): boolean {
        return this.productsInBasket.find(item => item.articleId === product.id) ? true : false;
    }

    public onProductAdd(product: Product): void {
        this.storeShopingCart.dispatch(new shopingcart.AddProductAction(product));
        this._gtagService.sendEventAddToCart(product, this.optionForRemarketingCart);
        this._faceBookPixelService.trackAddToCartEvent(product.id, product.displayDescriptionRus, product.transliteratedTitle, product.price);
    }

    public priceFormatting(price: number) {
        let priceStr = price.toFixed(2);
        let indexOfpoint = priceStr.indexOf('.');

        let grn = priceStr.substring(0, indexOfpoint);
        let kop = priceStr.substring(indexOfpoint);

        return `${grn}<span class="product-box-grn">${kop} грн</span>`;
    }

    public getQueryParams(param: string): Object {
        return { Tire_Diameter: param };
    }
}
