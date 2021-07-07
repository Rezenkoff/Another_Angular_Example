import { Component, OnInit, OnDestroy, Inject, Output, EventEmitter, ViewChild } from '@angular/core';
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
    selector: 'popular-tires',
    templateUrl: './__mobile__/popular-tires.component.html',
    styleUrls: ['./__mobile__/styles/popular-tires.component__.scss']
})
export class PopularTiresList implements OnInit, OnDestroy  
{

    public subscriptions: Array<Subscription> = new Array<Subscription>();
    public products: Product[];
    public searchParameters: SearchParameters = new SearchParameters();
    public listArtId: number[] = [];
    public popularTires$: Observable<Product[]> = new Observable<Product[]>();
    public popularProducts: Product[] = [];
    public leftNavDisabled: boolean = false;
    public rightNavDisabled: boolean = false;
    public eventViewOption: string = "popular products home";
    private optionForRemarketingCart = "extended order";
    private ngUnsubscribe: Subject<boolean> = new Subject<boolean>();
    public productsInBasket: CartProduct[] = [];
    private regexpTire = /(([0-9]{2,4})\/([0-9]{2,4}R[0-9]{2}\,\d{1,2}))|(([0-9]{2,4})\/([0-9]{2,4}R[0-9]{2}))/g;
    public dictionaryList: Map<string, Array<string>> = new Map<string, Array<string>>();
    public keysDictionary: Array<string> = new Array<string>();
    public isLoad:boolean = false;

    @Output() onLoadDictionaryList = new EventEmitter<Map<string, Array<string>>>();
    @Output() onLoadKeysDictionary = new EventEmitter<Array<string>>();
    @ViewChild('nav', { read: DragScrollComponent }) public ds: DragScrollComponent;

    constructor(
        @Inject(APP_CONSTANTS) private __appconstants: IAppConstants,
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
        this.searchParameters.categoryUrl = 'shiny-id49-3';
        this.searchParameters.formFactor = 2;
        this.searchParameters.sortOrder = 1;
        this.searchParameters.artId = 0;
        this.searchParameters.count = 20;

        this.popularTires$ = this._popularProductService.getPopularTires(this.searchParameters);
        this.popularTires$.subscribe(data => {
            this.popularProducts = data;

            data.forEach(val => {
                let helper = val.displayDescription.match(this.regexpTire);
                if (helper && helper.length > 0) {
  
                    if (!this.dictionaryList.has('R' + helper[0].split('R')[1])) {
                        this.dictionaryList.set('R' + helper[0].split('R')[1], [helper[0]])
                    }
                    else {
                        this.dictionaryList.get('R' + helper[0].split('R')[1]).push(helper[0]);
                    }
                }    
                this.keysDictionary = Array.from(this.dictionaryList.keys()).sort();
            });

            this.onLoadDictionaryList.emit(this.dictionaryList);
            this.onLoadKeysDictionary.emit(this.keysDictionary);
            this.isLoad = true;
        });      
    }
   
    ngOnDestroy() {
        this.subscriptions.forEach(s => s.unsubscribe());

        this.ngUnsubscribe.next(true);
        this.ngUnsubscribe.unsubscribe();
    }

    public typeSize: string = '';
    public typeDiameter: string = '';

    public reset() {
        this.typeSize = '';
        this.typeDiameter ='';
    }

    public applayTypeSizeParam(ts: string): void {
        this.typeSize = ts;
    }

    public applayTypeDiameter(diamenet: string): void {
        this.typeDiameter = diamenet;
    }

    public getPopularTires(popTires: Product[]): Product[] {
        if (this.typeSize != '' && this.typeDiameter != '') {
            return popTires.filter(product => product.displayDescription.includes(this.typeSize) && product.displayDescription.includes(this.typeDiameter));
        }
        else if (this.typeSize != '') {
            return popTires.filter(product => product.displayDescription.includes(this.typeSize));
        }
        else if (this.typeDiameter != '') {
            return popTires.filter(product => product.displayDescription.includes(this.typeDiameter));
        }
        return popTires;
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
        this.ds.moveLeft();
    }

    moveRight() {
        this.ds.moveRight();
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
        return { Tire_Diameter: param.split('R')[1]};
    }

    public getImgSeasone(seasone: string): string {
        switch (seasone) {
            case 'Зима':
                return 'label-winter';
            case 'Лето':
                return 'label-summer';
            default:
                return 'label-allseason';
        }
    }
}
