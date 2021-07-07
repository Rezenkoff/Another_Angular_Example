import { Component, OnInit, Inject, OnDestroy, ViewChild, EventEmitter, Output, PLATFORM_ID, Input } from '@angular/core';
import { Product } from '../../models/product.model';
import { APP_CONSTANTS, IAppConstants } from '../../config';
import { BaseListComponent } from '../../shared/abstraction/search-base-list.component';
import { Subscription, Observable } from 'rxjs';
import { NavigationService } from '../../services/navigation.service';
import { SearchService } from '../../services/search.service';
import { FavoriteProductService } from '../../services/favorite-product.service';
import { PixelFacebookService } from '../../services/pixel-facebook.service';
import { Store } from '@ngrx/store';
import * as fromShopingCart from '../../shoping-cart/reducers';
import * as fromSearch from '../../search/reducers';
import * as fromFilters from '../../filters/reducers';
import { SearchHelpCallbackComponent } from '../../shared/components/search-help-callback/search-help-callback.component';
import { AuthHttpService } from '../../auth/auth-http.service';
import { MatDialog } from '@angular/material/dialog';
import { isPlatformServer } from "@angular/common";
import { ServerParamsTransfer } from '../../server-params-transfer.service';
import { CdnImageHelper } from '../../app-root/cdn-image-path';
import { GtagService } from '../../services/gtag.service';
import { SeoCommonService } from '../../services/seo-common.service';
import { map } from 'rxjs/operators';

@Component({
    selector: 'search-product-list',
    templateUrl: './__mobile__/search-product-list.component.html',
    styleUrls: ['./__mobile__/styles/search-product-list.component__.scss']
})
export class SearchProductListComponent extends BaseListComponent implements OnInit, OnDestroy {

    public totalCount$: Observable<number>;
    private products: Product[];
    private eventViewOption: string;
    private selectedFilters: Object;

    public subscriptions: Array<Subscription> = new Array<Subscription>();
    @ViewChild("callback") callbackComponent: SearchHelpCallbackComponent;
    @Output() onShowMoreClick: EventEmitter<void> = new EventEmitter<void>();
    @Input() isCategoryPage: boolean;
    @Input() categoryTitle: string = '';

    constructor(
        @Inject(APP_CONSTANTS) private __appconstants: IAppConstants,
        @Inject(PLATFORM_ID) private _platformId,
        private serverParamsService: ServerParamsTransfer,
        private _imagePathResolver: CdnImageHelper,
        private __store: Store<fromShopingCart.State>,
        private __searchStore: Store<fromSearch.State>,
        private __searchService: SearchService,
        private __navigationService: NavigationService,
        public _favoriteProductService: FavoriteProductService,
        public _authHttpService: AuthHttpService,
        public _dialog: MatDialog,
        public _gtagService: GtagService,
        private _seoCommonService: SeoCommonService,
        public _facebookPixelService: PixelFacebookService,
        private storeShopingCart: Store<fromShopingCart.State>,
        private filterStore: Store<fromFilters.State>,
    ) {
        super( __store, __searchStore, __searchService, __navigationService, _favoriteProductService, _authHttpService, _dialog, _gtagService, _facebookPixelService);
        this.totalCount$ = this.searchStore.select(fromSearch.getTotalCount);
        this.products = [];
        this.setupSpinners();
    }

    ngOnInit() {
        this.selectedProduct$ = this.store.select(fromShopingCart.getSelectedProduct);
        this.products$ = this.searchStore.select(fromSearch.getProducts);
      this.products$.subscribe(products => {

        this.products = products;

        if (this.products && this.products.length > 0) {

          this.products.forEach(product => {

            product.hidePrice = false

          });
        }
      });
        this.eventViewOption = this.isCategoryPage ? "category" : "search result";

        this.products$.pipe(
            map(products => {
                products.map(product => {
                    this._seoCommonService.setSeoFriendlyTitle(product);
                })
            })).subscribe();

        this.subscriptions.push(
            this.storeShopingCart.select(fromShopingCart.getCart)
                .subscribe(item => {
                    this.productsInBasket = item.products;
                })
        );

        this.subscriptions.push(
            this.filterStore.select(fromFilters.getFiltersDict).subscribe(result => {
                this.selectedFilters = result;
            })
        );
    }

    ngOnDestroy() {
        this.subscriptions.forEach(s => s.unsubscribe());
    }

    toggleCallbackWindow() {
        this.callbackComponent.toggleWindow();
    }

    public isServerPlatformAndBot(): Boolean {       
        return isPlatformServer(this._platformId) && this.serverParamsService.serverParams.isBotRequest;
    }

    public errorHandler(event) {
        event.target.src = this.__appconstants.IMAGES.NO_IMAGE_URL;
    }

    public getImage(id: number): string {
        return this._imagePathResolver.getImage(id);
    }

    setupSpinners() {
        this.subscriptions.push(
            this.searchStore.select(fromSearch.getLoadState).subscribe(loadInProcess => {
                if (loadInProcess && !this.moreProductsLoadInProcess) {
                    this.StartSpinning();
                    return;
                } else if (!loadInProcess) {
                    this.EndSpinning();
                    this.moreProductsLoadInProcess = false;
                }
            }));
    }

    private showMore(): void {
        if (this.moreProductsLoadInProcess) {
            return;
        }
        this.moreProductsLoadInProcess = true;
        this.onShowMoreClick.emit();
    }

    public addToViewed(index: number) {
        this._gtagService.sendViewedProducts(index, this.products, this.eventViewOption);
    }

    public sendSelectContentEvent(product: Product, index: number) {
        this._gtagService.selectContent.sendEventSelectContent([product], index, this.eventViewOption);
    }

    public getProductTitle(product: Product) {
        let filters = this.selectedFilters;
        if (this.isSelectedCarAndMark() && this.categoryTitle) {
            return `${this.categoryTitle} ${product.lookupNumber} ${product.brand}`;
        }
        return product.displayDescription;
    }

    public isSelectedCarAndMark() {
        let filters = this.selectedFilters;
        return filters && filters["SuitableVehicles_Mark"]?.selectedOptions?.length && filters["SuitableVehicles_Serie"]?.selectedOptions?.length;
    }
}
