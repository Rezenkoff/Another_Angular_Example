import { Component, Input, Output, OnInit, OnDestroy, Inject, EventEmitter, ViewChild, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, of, Subject } from 'rxjs';
import { finalize, takeUntil, first } from 'rxjs/operators';
import { ProductService } from '../../product/product.service';
import { AreaService } from '../../location/area/area.service';
import { NavigationService } from '../../services/navigation.service';
import { SearchService } from '../../services/search.service';
import { LanguageService } from '../../services/language.service';
import { FavoriteProductService } from '../../services/favorite-product.service';
import { PixelFacebookService } from '../../services/pixel-facebook.service';
import { APP_CONSTANTS, IAppConstants } from '../../config';
import { BaseListComponent } from '../../shared/abstraction/search-base-list.component';
import { SearchParameters } from '../../search/models/search-parameters.model';
import { Product } from '../../models/product.model';
import { Rest, Price } from '../../search/models';
import { Store } from '@ngrx/store';
import * as fromShopingCart from '../../shoping-cart/reducers';
import * as fromSearch from '../../search/reducers'
import { AuthHttpService } from '../../auth/auth-http.service';
import { MatDialog } from '@angular/material/dialog';
import { SearchHelpCallbackComponent } from '../../shared/components/search-help-callback/search-help-callback.component';
import { isPlatformServer } from "@angular/common";
import { ServerParamsTransfer } from '../../server-params-transfer.service';
import { CdnImageHelper } from '../../app-root/cdn-image-path';
import { GtagService } from '../../services/gtag.service';
import { ArticleBalanceDetail } from '../../models/article-balance-detail.model';
import { AutodocBalanceDetails } from '../../search/models/autodoc-balance-details.model';

@Component({
    selector: 'search-analogs-list',
    templateUrl: '../../search/components/__mobile__/search-product-list.component.html',
    styleUrls: ['./__mobile__/styles/search-analogs.component__.scss']
})

export class SearchAnalogsListComponent extends BaseListComponent implements OnInit, OnDestroy {
    @Output() product$: EventEmitter<Observable<Product>> = new EventEmitter<Observable<Product>>();
    @Output() total$: EventEmitter<Observable<number>> = new EventEmitter<Observable<number>>();
    @Output() analogs$: EventEmitter<Product[]> = new EventEmitter<Product[]>();
    @Input() firstProduct: Product;
    public productId: number | string;
    public analogsList: Array<Product> = [];
    private product: Product = null;
    public searchParameters: SearchParameters = new SearchParameters();
    public totalCount$: Observable<number>;
    private ngUnsubscribe: Subject<void> = new Subject<void>();

    @ViewChild("callback") callbackComponent: SearchHelpCallbackComponent;

    constructor(
        
        @Inject(APP_CONSTANTS) private __appconstants: IAppConstants,
        @Inject(PLATFORM_ID) private _platformId,
        private serverParamsService: ServerParamsTransfer,
        private _imagePathResolver: CdnImageHelper,
        private __store: Store<fromShopingCart.State>,
        private __searchStore: Store<fromSearch.State>,
        private __searchService: SearchService,
        private __navigationService: NavigationService,
        private _productService: ProductService,
        private _activatedRoute: ActivatedRoute,
        private _areaService: AreaService,
        private _languageService: LanguageService,
        public _favoriteProductService: FavoriteProductService,
        public _authHttpService: AuthHttpService,
        public _dialog: MatDialog,
        public _gtagService: GtagService,
        public _facebookPixelService: PixelFacebookService,
    ) {
        super( __store, __searchStore, __searchService, __navigationService, _favoriteProductService, _authHttpService, _dialog, _gtagService, _facebookPixelService);
    }

    ngOnInit() {
        this._activatedRoute.params.pipe(takeUntil(this.ngUnsubscribe)).subscribe(params => {
            this.setPagingParameters(params);

            if (params['productId']) {
                this.productId = params['productId'];
                this.initialize();
            }
            if (this.firstProduct) {
                this.productId = this.firstProduct.id;
                this.initialize();
            }
        });

        this._areaService.areaChanged.pipe(takeUntil(this.ngUnsubscribe)).subscribe(area => {
            if (this.analogsList.length) {
                this.analogsList.map(m => new Product().deserialize(m)).forEach(analog => {
                    analog.setRestInfoForProduct(area);
                })
            }
        });

        this._languageService.languageChange.pipe(takeUntil(this.ngUnsubscribe)).subscribe(() => {
            if (this.analogsList.length) {
                this.analogsList.forEach(analog => {
                    this.performTitleTranslation(analog);
                })
            }
        });

        this.__store.select(fromShopingCart.getCart)
            .subscribe(item => {
                this.productsInBasket = item.products;
            })
    }

    public isServerPlatformAndBot(): Boolean {
        return isPlatformServer(this._platformId) && this.serverParamsService.serverParams.isBotRequest;
    }

    public getImage(id: number): string {
        return this._imagePathResolver.getImage(id);
    }

    public errorHandler(event) {
        event.target.src = this.__appconstants.IMAGES.NO_IMAGE_URL;
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    public initialize(): void {
        this.StartSpinning();
        this.product = this._searchService.getCacheProduct(this.productId.toString());

        if (this.product) {
            this.processResult();
            return;
        }

        this._productService.getProductById(Number(this.productId))
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe(data => {
                this.product = data;
                this.processResult()
            });
    }

    private processResult() {
        this.product$.emit(of(this.product));
        this.getAnalogs();
    }

    getAnalogs() {
        this._productService.getProductAnalogsWithCount(
            this.product.id,
            this.product.lookupNumber,
            this.product.groupId,
            this.product.brandId,
            this.searchParameters.from,
            this.searchParameters.count
        )
            .pipe(
                takeUntil(this.ngUnsubscribe),
                finalize(() => {
                    this.moreProductsLoadInProcess = false;
                    this.EndSpinning();
                    if (this.analogsList) {
                        this.products$ = of(this.analogsList);
                    }
                }))
            .subscribe(data => {
                this.setTotalCount(data['totalCount']);

                if (!data['products']) {
                    return;
                }

                let newAnalogsList: Product[] = data['products'].map(x => x = new Product().deserialize(x));

                newAnalogsList.forEach(analog => this.performTitleTranslation(analog));

                let idsList: ArticleBalanceDetail = new ArticleBalanceDetail(newAnalogsList.map(c => c.id), newAnalogsList.filter(c => c.isExpected == -1).map(c => c.id));

                this._searchService.getPrices(idsList).pipe(takeUntil(this.ngUnsubscribe))
                    .subscribe((prices:any) => {

                        newAnalogsList.forEach(analog => {
                            let analogPrice = prices.prices.find(pr => pr.articleId == analog.id) as Price;
                            let analogBalance = prices.supplierBalanceDetails.find(b => b.articleId == analog.id) as AutodocBalanceDetails;

                            if (analogPrice) {
                                analog.price = analogPrice.customerPrice;
                                if (analogPrice.oldPrice)
                                    analog.oldPrice = analogPrice.oldPrice;
                                analog.hidePrice = analogPrice.hidePrice;
                            }

                            if (analogBalance && analogBalance.supliersRest && analogBalance.supliersRest[0]) {
                                analog.supplierProductRef_Key = analogBalance.supliersRest[0].supplierProductRef_Key;
                                analog.price = analogBalance.supliersRest[0].customerPrice;
                                analog.hidePrice = false;
                            }
                        })
                    }
                    );

                this._searchService.getRests(idsList.articleIds).pipe(takeUntil(this.ngUnsubscribe)).subscribe(
                    (rests: Rest[]) => {
                        this._areaService.getSelectedArea().pipe(first()).subscribe(area => {
                            newAnalogsList.forEach((analog: Product) => {
                                let analogRest = rests.find(pr => pr.artId == analog.id);
                                if (analogRest) {
                                    analog.rest = analogRest;
                                }
                                analog.setRestInfoForProduct(area);
                            })
                        });
                    }
                );

                this.analogsList = [...this.analogsList, ...newAnalogsList];
                this.analogs$.emit(this.analogsList);
            });
    }

    public setTotalCount(total: any): void {
        this.totalCount$ = of(total as number || 0);
        this.total$.emit(this.totalCount$);
        this.showMoreButtonDisplayed = this.isShowMoreDisplayed(total);
    }

    public setPagingParameters(params: any): void {
        this.searchParameters = new SearchParameters();
        let pageSize: number = Number(params["pageSize"]) || 20;
        let page: number = Number(params["page"]) || 1;
        this.searchParameters.count = pageSize;
        this.searchParameters.from = (page - 1) * pageSize;
    }

    private performTitleTranslation(product: Product): void {
        if (!product) {
            return;
        }
        let language = this._languageService.getSelectedLanguage();
        let langName = language.name || 'RUS';

        let transletedProduct  = this._productService.setTranslatedDescription(product, langName);
        Object.assign(product, transletedProduct);
    }

    public isShowMoreDisplayed(total: number): boolean {
        return Boolean((this.searchParameters.from + this.searchParameters.count) < total);
    }

    private showMore(): void {
        if (this.moreProductsLoadInProcess) {
            return;
        }
        this.moreProductsLoadInProcess = true;
        this.searchParameters.from = this.searchParameters.from += this.searchParameters.count;
        this.getAnalogs();
    }

    toggleCallbackWindow() {
        this.callbackComponent.toggleWindow();
    }

    public addToViewed(product: Product) {
    }

    public sendSelectContentEvent(product: Product) {
    }
}