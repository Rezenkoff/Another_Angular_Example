import { Component, Input, ViewChild, OnInit, EventEmitter, Output, ChangeDetectionStrategy, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';
import { Product } from '../../models/product.model';
import { OrderPopupComponent } from '../../shoping-cart/components/order-popup.component';
import { CartProduct } from '../../shoping-cart/models/shoping-cart-product.model';
import { ProductDetail } from '../models/product-detail.model';
import * as shopingcart from '../../shoping-cart/actions/shoping-cart';
import * as fromShopingCart from '../../shoping-cart/reducers';
import { Store } from '@ngrx/store';
import { FavoriteProductService } from '../../services/favorite-product.service';
import { PixelFacebookService } from '../../services/pixel-facebook.service';
import { LoginPopupComponent } from '../../shared/components/login-popup.component';
import { AuthHttpService } from '../../auth/auth-http.service';
import { MatDialog } from '@angular/material/dialog';
import { Observable, Subject } from 'rxjs';
import { GtagService } from '../../services/gtag.service';
import { ProductReviews } from '../../reviews/models/product-reviews.model';
import { Specification } from '../models';
import { Cart } from '../../shoping-cart/models/shoping-cart-product.model';
import { ServerParamsTransfer } from '../../server-params-transfer.service';
import { NotifyWhenAvailableComponent } from './notify-when-available.component';
import { ActivatedRoute } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { environment } from '../../../environments/environment';


@Component({
    selector: 'product-main-info',
    templateUrl: './__mobile__/product-main-info.component.html',
    styleUrls: ['./__mobile__/styles/product-main-info.component__.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
})
export class ProductMainInfoComponent implements OnInit {

    @Input() product: Product = null;
    @Input() productDetails: ProductDetail = null;
    public showArticle: boolean = false;
    @Input() categoryName: string;
    @Output() onDetailedButtonClickEvent: EventEmitter<boolean> = new EventEmitter<boolean>();
    @ViewChild("orderpop") private orderPopup: OrderPopupComponent = null;
    @ViewChild("notifyWhenAvailablePopup") public notifyWhenAvailablePopup: NotifyWhenAvailableComponent;

    private optionForRemarketingCart = "extended order";
    private specificationItemsPreviewCount: number = 5;
    public selectedProduct$: Observable<CartProduct>;
    public cart: Cart = null;
    public productReviews$: Subject<ProductReviews> = new Subject<ProductReviews>();
    public isOemCodesDisplay: Boolean = false;
    public isReviewsDisplay: Boolean = true;
    public isPopularCarsDisplay: Boolean = true;
    public isApplicabilityDisplay: Boolean = false;
    public isSpecificationDiplayed: Boolean = false;
    public isAvailableProduct: Boolean = false;
    public inAnotherStore: Boolean = false;
    public inAnotherPartner: Boolean = false;
    public notAvailable: Boolean = false;
    public isProductPriceDisplayed: Boolean = false;
    public isPurchaseButtonHidden: Boolean = false;
    public readonly limitForAddInfoConst: number = 222;//limit for preview of add info in product.
    public limitForAddInfo: number = this.limitForAddInfoConst;
    public collapsed: boolean = true;
    private destroy$: Subject<boolean> = new Subject<boolean>();
    public urlProduct: string = `${environment.hostUrl}/product/`;

    private unshowedScpecifications: string[] = ["Ось"];

    constructor(
        public serverParamsService: ServerParamsTransfer,
        private store: Store<fromShopingCart.State>,
        public _favoriteProductService: FavoriteProductService,
        public _authService: AuthHttpService,
        public dialog: MatDialog,
        public _gtagService: GtagService,
        private _faceBookPixelService: PixelFacebookService,
        private _activatedRoute: ActivatedRoute
    ) {
    }

    ngOnInit(): void {
        this.selectedProduct$ = this.store.select(fromShopingCart.getSelectedProduct);
        this._activatedRoute.params.pipe(takeUntil(this.destroy$)).subscribe(
            params => {
                this.urlProduct += params['urlEnding'];
            });
    }

    ngOnDestroy() {
        this.destroy$.next(true);
        this.destroy$.unsubscribe();
    }

    public getInStock(): string {
        if (this.product.isAvailableProduct || this.product.inAnotherProductStore) {
            return "https://schema.org/InStock";
        } else if (this.product.inAnotherProductPartner) {
            return "https://schema.org/PreOrder";
        } else {
            return "https://schema.org/OutOfStock";
        }
    }

    public getUrlProduct(): string {
        return this.urlProduct;
    }

    ngAfterViewInit(): void {
        this.isOemCodesDisplay = this.productDetails && this.productDetails.oeCodeList && this.productDetails.oeCodeList.length > 0;
        this.isApplicabilityDisplay = this.productDetails && this.productDetails.applicabilityList && this.productDetails.applicabilityList.length > 0;
        this.isSpecificationDiplayed = this.productDetails && this.productDetails.specificationList && this.productDetails.specificationList.length > 0;        
    }    

    public getPreviewedSpecificationItems(): Array<Specification> {
        return this.productDetails.specificationList.slice(0, this.specificationItemsPreviewCount).filter(x => !this.unshowedScpecifications.includes(x.key));
    }

    public onProductAdd(product: Product): void {
        this.store.dispatch(new shopingcart.AddProductAction(product));
        this._gtagService.sendEventAddToCart(product, this.optionForRemarketingCart);
        this._faceBookPixelService.trackAddToCartEvent(product.id, product.displayDescriptionRus, product.transliteratedTitle, product.price);
        this.orderPopup.toggleWindow();
    }

    public onDetailedButtonClick(): void {
        this.onDetailedButtonClickEvent.emit();
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
                if (confirm && this._authService.isAuthenticated()) {
                    product.isFavorite = !product.isFavorite;
                    this._favoriteProductService.upsertFavoritList(product);

                    if (product.isFavorite)
                        this._gtagService.addToWishlist.sendEventAddToWishlist(product);
                }
            });
        }
    }   

    public hideOrShowText(): string {
        if (this.showArticle) {
            return 'block-show';
        } else {
            return 'block-hide';
        }
    }

    public changeShowText(): void {
        this.showArticle = !this.showArticle;
    }

    public getAutodocInfo() {
        return (this.product.info ? this.product.info + '<br /><br />' : '') + (this.product.autodocInfo ? this.product.autodocInfo + '<br /><br />' : '');
    }
    public checkLimitForAutodocInfo(): boolean {

        if (this.product.autodocInfo) {
            return (this.product.autodocInfo.length + (this.product.info ? this.product.info.length : 0)) > this.limitForAddInfoConst;
        }
        return false;
    }
    public hideMore(): void {
        this.collapsed = true;
        this.limitForAddInfo = this.limitForAddInfoConst;
    }
    public showMoreAutodocInfo(): void {
        this.collapsed = false;
        this.limitForAddInfo = this.product.autodocInfo.length + (this.product.info === null ? 0 : this.product.info.length);
    }

    public openNotifyWhenAvailablePopup() {
        this.notifyWhenAvailablePopup.addProductAndOpenWindow(this.product);
    }

    public showPopupMobile(type:string) {
        //this._popup.showApplyVehiclePopup_2_Mobile(type); //#825 - pause from Bugayov
    }
}