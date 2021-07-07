import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { Product } from '../../../models';
import { NavigationService } from '../../../services/navigation.service'; 
import { SearchService } from '../../../services/search.service';
import { CatalogService } from '../../../services/catalog-model.service';
import { FavoriteProductService } from '../../../services/favorite-product.service';
import { LanguageService } from '../../../services/language.service';
import { PixelFacebookService } from '../../../services/pixel-facebook.service';
import { Store } from '@ngrx/store';
import { SearchParameters } from '../../../models/order-search-parameters.model';
import * as fromShopingCart from '../../../shoping-cart/reducers';
import { BaseListComponent } from '../../../shared/abstraction/search-base-list.component';
import * as fromSearch from '../../../search/reducers';
import { APP_CONSTANTS, IAppConstants } from '../../../config';
import { Rest } from '../../../search/models';
import { LocationService } from '../../../location/location.service';
import { Cart } from '../../../shoping-cart/models/shoping-cart-product.model';
import { AuthHttpService } from '../../../auth/auth-http.service';
import { MatDialog } from '@angular/material/dialog';
import { RequestImagesForProducts } from '../../../search/models/request-images-products';
import { Subject, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/Operators';
import { setTranslatedDescription } from '../../../product/product-functions-provider';
import { CdnImageHelper } from '../../../app-root/cdn-image-path';
import { GtagService } from '../../../services/gtag.service';
import { ArticleBalanceDetail } from '../../../models/article-balance-detail.model';
import { BalanceDetail } from '../../../search/models/balance-detail.model';
import { Area } from '../../../location/area/area.model';

@Component({
    selector: 'favorite',
    templateUrl: './__mobile__/favorite.component.html',
    styleUrls: ['./__mobile__/styles/favorite.component__.scss']
})
export class FavoriteComponent extends BaseListComponent implements OnInit, OnDestroy {    
    public pageSize: number = 5;
    public totalItems: number = 0;
    favoriteProducts: Product[];
    pager: any = {};
    pagedItems: Product[] = [];
    emptyFavoriteProducts: boolean = false;
    searchParameters: SearchParameters = new SearchParameters(1, this.pageSize);
    public cartIds: number [];    
    private cart$: Observable<Cart>;
    private iconType: number = 1; //this is 200x240
    private requestImagesForProducts: RequestImagesForProducts = new RequestImagesForProducts(this.iconType);
    private destroy$: Subject<boolean> = new Subject<boolean>();
    public eventViewOption: string = "wish list"; 

    constructor(
        @Inject(APP_CONSTANTS) private _constants: IAppConstants,
        public _store: Store<fromShopingCart.State>,
        public _searchStore: Store<fromSearch.State>,
        private _imagePathResolver: CdnImageHelper,
        public _searchService: SearchService,
        public _navigationService: NavigationService,
        public _locationService: LocationService,
        public _favoriteProductService: FavoriteProductService,
        public _authHttpService: AuthHttpService,
        public _dialog: MatDialog,
        public _languageService: LanguageService,
        public _gtagService: GtagService,
        private _facebookPixelService: PixelFacebookService,
        private _catalogService: CatalogService,
    ) {
        super( _store, _searchStore, _searchService, _navigationService, _favoriteProductService, _authHttpService, _dialog, _gtagService, _facebookPixelService);
    }

    ngOnInit() {

       // this._catalogService.getCatalogTreeModel().subscribe();
        this.cart$ = this.store.select(fromShopingCart.getCart);
        this.cart$.pipe(takeUntil(this.destroy$)).subscribe(cart => {
            this.cartIds = cart.products.map(p => p.articleId);
        })

        this.selectedProduct$ = this.store.select(fromShopingCart.getSelectedProduct);

        this._languageService.languageChange.pipe(takeUntil(this.destroy$)).subscribe(() => {
            this.translateDescriptions();
        });

        this.StartSpinning();
        this.loadFavoriteList();
    }

    getPriceLeft(price: number): string {

        let tempPrice = price.toString();
        let pointResult = tempPrice.indexOf('.', 0);
        if (pointResult != -1) {

            tempPrice = tempPrice.slice(0, pointResult);
            return tempPrice;
        }

        return tempPrice;
    }

    getPriceRight(price: number): string {

        let tempCoins = price.toString();
        let pointResult = tempCoins.indexOf('.', 0);

        if (pointResult != -1) {

            tempCoins = tempCoins.slice(pointResult, tempCoins.length);
            return tempCoins;
        }
        return '.00';
    }

    returnToCabinetInfo() {
        this._navigationService.NavigateToMobileInfo();
    }

    ngOnDestroy() {
        this.destroy$.next(true);
        this.destroy$.unsubscribe();
    }

    public loadFavoriteList() {
        this._favoriteProductService.getFavoriteProductsList().subscribe((result: Product[]) => {
            if (result.length > 0) {
                this.emptyFavoriteProducts = false;
                this.favoriteProducts = result;
               
                this.translateDescriptions();
                let idsList: ArticleBalanceDetail = new ArticleBalanceDetail(result.map(c => c.id), result.filter(c => c.isExpected == -1).map(c => c.id));
                this.getPricesAndRests(idsList);
                this.totalItems = this.favoriteProducts.length;
                this.pagedItems = this.favoriteProducts.slice(0, this.pageSize);
            }
            else {
                this.emptyFavoriteProducts = true;
            }
            this.EndSpinning();
        });
    }

    private getPricesAndRests(idList: ArticleBalanceDetail): void {

        this._searchService.getPrices(idList)
            .subscribe((prices: BalanceDetail) => {
                this.favoriteProducts.forEach(p => {

                    let price = prices.prices.find(x => x.articleId == p.id);
                    let supplierPrice = prices.supplierBalanceDetails.find(b => b.articleId == p.id);

                    if (price) {
                        p.price = price.customerPrice;
                        p.oldPrice = price.oldPrice;
                        p.hidePrice = price.hidePrice;
                    }
                    if (supplierPrice && supplierPrice.supliersRest && supplierPrice.supliersRest[0]) {
                        p.supplierProductRef_Key = supplierPrice.supliersRest[0].supplierProductRef_Key;
                        p.price = supplierPrice.supliersRest[0].customerPrice;
                        p.hidePrice = false;
                    }
                });
            });

        this._searchService.getRests(idList.articleIds)
            .subscribe((rests: Rest[]) => {

                this.favoriteProducts.forEach((product) => {

                    let rest = rests.find(x => x.artId == product.id);
                    if (rest) {
                        product.rest = rest;
                    }
                    let area = new Area({ nearestStoreAreaKey: this._locationService.selectedLocation.nearestStoreAreaKey });

                    product.setRestInfoForProduct(area);
                });
                this.requestImagesForProducts.articles = this.favoriteProducts.map(x => x.id);
            });
    }

    public pageChanged(event: any): void {
        this.searchParameters.currentPage = event.currentPage;
        var from = (this.searchParameters.currentPage - 1) * this.pageSize;
        var to = this.searchParameters.currentPage * this.pageSize;
        this.pagedItems = this.favoriteProducts.slice(from, to);
    }

    public deleteFromFavorite(product: Product) {
        product.isFavorite = false;
        this._favoriteProductService.removeFavoriteProduct(product);
        this.favoriteProducts.splice(this.favoriteProducts.indexOf(product), 1);
        this.pagedItems.splice(this.pagedItems.indexOf(product), 1);
    }


    public addAllPagedProducts() {

        let products = this.pagedItems.filter((product) => (typeof (product.hidePrice) != 'undefined' && !product.hidePrice) || product.price > 0 && !this.isInCart(product))

        if (products.length > 0) {

            if (products.length > 0) {

                products.forEach((product: Product, index: number) => {
                    if (index + 1 == products.length) {                        
                        this.onProductAdd(product);
                        return;
                    }
                    this.onProductAdd(product, false);
                });        
            }
        }
    }

    public notInCart(product: Product): boolean {
        return Boolean(this.cartIds.indexOf(product.id) == -1);
    }

    public isInCart(product: Product): boolean {
        return Boolean(this.cartIds.indexOf(product.id) != -1);
    }

    public errorHandler(event) {
        event.target.src = this._constants.IMAGES.NO_IMAGE_URL;
    }

    public getImage(id: number): string {
        return this._imagePathResolver.getImage(id);
    }

    public translateDescriptions(): void {
        let lang = this._languageService.getSelectedLanguage();
        let selectedLanguage = lang ? lang.name : 'RUS';
        if(this.favoriteProducts) {
            this.favoriteProducts.forEach(product => {
                setTranslatedDescription(product, selectedLanguage);
            });
     }
    }

    public addToViewed(index: number) {
        this._gtagService.sendViewedProducts(index, this.pagedItems, this.eventViewOption);
    }

    public sendSelectContentEvent(product: Product, index: number) {
        this._gtagService.selectContent.sendEventSelectContent([product], index, this.eventViewOption);
    }
}