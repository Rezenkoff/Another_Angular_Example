import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID, ViewChild, ElementRef, Output, ViewEncapsulation } from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { AreaService } from '../../location/area/area.service';
import { ProductService } from '../product.service';
import { SearchService } from '../../services/search.service';
import { LanguageService } from '../../services/language.service';
import { FavoriteProductService } from '../../services/favorite-product.service';
import { ProductInfoStorageService } from '../../services/product-info-storage.service';
import { LinkService } from '../../services/link.service';
import { GtagService } from '../../services/gtag.service';
import { LastInfoService } from '../../order-step/last-info.service';
import { ProductDetail } from '../models/product-detail.model';
import { Product } from '../../models/product.model';
import { ActivatedRoute } from '@angular/router';
import { Subject, BehaviorSubject } from 'rxjs';
import { MainUrlParser } from '../../app-root/main-url.parser';
import { Rest, Price } from '../../search/models';
import { McBreadcrumbsService } from '../../breadcrumbs/service/mc-breadcrumbs.service';
import { TransferState, makeStateKey } from '@angular/platform-browser';
import { takeUntil, first } from 'rxjs/operators';
import { SeoCommonService } from '../../services/seo-common.service';
import { ScrollService } from '../../services/scroll.service';
import { ArticleBalanceDetail } from '../../models/article-balance-detail.model';
import { AutodocBalanceDetails } from '../../search/models/autodoc-balance-details.model';
import { QuickOrderService } from '../services/quickorder.service';
import { ServerParamsTransfer } from '../../server-params-transfer.service';
import { CatalogService } from 'src/app/services/catalog-model.service';

const reviewsId: string = "reviewsTab";

@Component({
    selector: 'product',
    templateUrl: './__mobile__/product.component.html',
    styleUrls: ['./__mobile__/styles/product.component__.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class ProductComponent implements OnInit, OnDestroy 
{
    @ViewChild('phone') phoneEl;

    @ViewChild('yourProduct') yourProduct: ElementRef;
    @ViewChild('quickorderphone') quickorderPosition: ElementRef;

    public productDetails: ProductDetail = null;
    public product: any = null;
    public analogsList: Array<Product> = null;
    public collapsed: boolean = true;
    public readonly limitForAddInfoConst: number = 222;//limit for preview of add info in product.
    public limitForAddInfo: number = this.limitForAddInfoConst;
    @Output() public categoryName: string = "";
    private destroy$: Subject<boolean> = new Subject<boolean>();
    public language: string = "";
    public hasReviews$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public selectedTab$: Subject<string> = new Subject<string>();
    public rtbHouseUrlForCurrentProduct: string = "";
    public isLimit: boolean = false;
    public serverParams :any;

    public headerTabs: Array<TabHeaderItem> = [
        new TabHeaderItem('Основная информация', true),
        new TabHeaderItem('Характеристики'),
        new TabHeaderItem('Аналоги'),
        new TabHeaderItem('Применяемость'),
        new TabHeaderItem('ОЕМ'),
        new TabHeaderItem('Отзывы'),
        new TabHeaderItem('Популярные модели авто')
    ];

    constructor(        
        private serverParamsService: ServerParamsTransfer,
        private _quickOrderService: QuickOrderService,
        @Inject(MainUrlParser) private urlParser: MainUrlParser,
        @Inject(PLATFORM_ID) private platformId,
        private _productService: ProductService,
        private _searchService: SearchService,
        private _lastInfoService: LastInfoService,
        private _areaService: AreaService,
        private _languageService: LanguageService,
        private _gtagService: GtagService,
        private _activatedRoute: ActivatedRoute,
        private favoriteProductService: FavoriteProductService,
        private _breadcrumbsService: McBreadcrumbsService,
        private transferState: TransferState,
        
        private _seoCommonService: SeoCommonService,
        private _scrollService: ScrollService,
        private _productStorageService: ProductInfoStorageService,
        private _linkService: LinkService,
        private _catalogService: CatalogService
    ) {
        this.serverParams = this.serverParamsService.serverParams;
     }

    ngOnInit() {
        this._activatedRoute.params.pipe(takeUntil(this.destroy$)).subscribe(
            params => {
                this.setCategoryName(params['urlEnding']);

                const id = this.urlParser.parseUrlForID(params['urlEnding']).id;

                this._productService.logProductView(id);
              
                if (!this.product) {
                    this._productService.getProductById(id).pipe(takeUntil(this.destroy$)).subscribe(
                        data => {
                            
                            this.product = new Product().deserialize(data);
                            this.checkTextInfo();

                            this._productStorageService.saveProductInfo(data);

                            this.language = this._languageService.getSelectedLanguage().name;
                            this.performTitleTranslation(this.product);
                            this.performAdditionalInfoTranslation(this.product);

                            this.getProductDetailed();
                            this.isLimit = this.checkLimitForAutodocInfo();

                            this.favoriteProductService.loadFavoritProducts().pipe(takeUntil(this.destroy$)).subscribe(favor => {
                                this.product.isFavorite = favor.indexOf(this.product.id) != -1;
                            });

                            this._gtagService.sendRemarketingEventForProduct(this.product.id, this.product.price);
                        });
                }
                else {
                    this.isLimit = this.checkLimitForAutodocInfo();
                    this._productStorageService.saveProductInfo(this.product);
                    this.getProductDetailed();
                    this._seoCommonService.setSeoFriendlyTitle(this.product);
                 }

                this._linkService.addCanonicalLinkForProduct();


            });

        this._areaService.areaChanged.pipe(takeUntil(this.destroy$)).subscribe(area => {
            if (this.product) {
                this.product.setRestInfoForProduct(area);
                this.product = new Product().deserialize(this.product);
            }
        });

        this._languageService.languageChange.pipe(takeUntil(this.destroy$)).subscribe(() => {
            this.language = this._languageService.getSelectedLanguage().name;
            this.performTitleTranslation(this.product);
            this.performAdditionalInfoTranslation(this.product);
        });

        if (!this._catalogService.CatalogTreeModel) {
            this._catalogService.getCatalogTreeModel().subscribe();
        }
    }

    private checkTextInfo() {

        if (this.product.autodocInfo == null) {
            this.product.autodocInfo = "";
        }

        if (this.product.autodocInfoRus == null) {
            this.product.autodocInfoRus = "";
        }

        if (this.product.autodocInfoUkr == null) {
            this.product.autodocInfoUkr = "";
        }
    }

    public IsThisTabDisplayed(index: number): Boolean {
        return this.headerTabs[index].IsShown;
    }

    public onHeaderTabClick(index: number): void {
        this.headerTabs.map(i => i.IsShown = false);
        this.headerTabs[index].IsShown = true;
    }

    ngOnDestroy() {
        this.destroy$.next(true);
        this.destroy$.unsubscribe();
        this._linkService.clearSEOlinks();
    }

    public onDetailedButtonClick(): void {
        this.onHeaderTabClick(1);
    }

    public setHeaderDisplay(): void {
        this.headerTabs[3].IsHeaderShown = this.isDisplayApplicability();
        this.headerTabs[4].IsHeaderShown = this.isDispalyOEM();
    }

    public isDispalyOEM(): Boolean {
        return this.productDetails && this.productDetails.oeCodeList && this.productDetails.oeCodeList.length > 0;
    }

    public isDisplayApplicability(): Boolean {
        return this.productDetails && this.productDetails.applicabilityList && this.productDetails.applicabilityList.length > 0;
    }

    public createQuickOrder() {
        this._quickOrderService.createQuickOrder(this.phoneEl);
    }

    public onAnalogsLoad(event: any): void {
    }

    private getProductDetailed(): void {
        this.performTitleTranslation(this.product);

        this._productService.getProductDetails(this.product.id).pipe(takeUntil(this.destroy$)).subscribe(data => {
            let countryIndex = data.specificationList.findIndex(t => t.sort == -19);
            data.specificationList = data.specificationList.sort((a, b) => a.sort - b.sort);
            data.specificationList.push(data.specificationList.splice(countryIndex, 1)[0]);

            this.productDetails = data;

            this.setHeaderDisplay();

            this.productDetails.productDisplayDescription = this.product.displayDescription.trim();
            this.hasReviews$.next(data.hasReviews);
        });

        let balanceDetailsModel: ArticleBalanceDetail = new ArticleBalanceDetail([this.product.id], []);

        if (this.product.isExpected == -1) {
            balanceDetailsModel.supplierArticleIds.push(this.product.id);
        }


        this._searchService.getCachedOrOriginalPrices(balanceDetailsModel).pipe(takeUntil(this.destroy$)).subscribe(data => {

            let parentproductPrice = data.prices[0] as Price;
            let parentSuplierProductPrice = data.supplierBalanceDetails[0] as AutodocBalanceDetails;

            if (parentproductPrice) {
                this.product.price = data.prices[0].customerPrice;
                this.product.quantityForDiscount = data.prices[0].quantityForDiscount;
                this.product.discountPrice = data.prices[0].discountPrice;

                this.product.oldPrice = parentproductPrice.oldPrice || null;
                this.product.hidePrice = false;
            }

            if (parentSuplierProductPrice && parentSuplierProductPrice.supliersRest && parentSuplierProductPrice.supliersRest[0]) {
                this.product.price = parentSuplierProductPrice.supliersRest[0].customerPrice;
                this.product.quantityForDiscount = data.prices[0].quantityForDiscount;
                this.product.discountPrice = data.prices[0].discountPrice;

                this.product.supplierProductRef_Key = parentSuplierProductPrice.supliersRest[0].supplierProductRef_Key;
                this.product.hidePrice = false;
            }

            this._gtagService.sendRemarketingEventForProduct(this.product.id, this.product.price);
            this._gtagService.viewItem.sendEventViewItem([this.product]);
            this._gtagService.setDataLayer([this.product], 'product');

            this.product.isProductPrice = this.product.isProductPriceDisplayed;
            
            this.product = new Product().deserialize(this.product);
            this.saveToCache(this.product);
        });

        this._searchService.getCachedOrOriginalRests([this.product.id]).pipe(takeUntil(this.destroy$)).subscribe((rests: Rest[]) => {

            let parentProductRest = rests.find(rest => rest.artId == this.product.id) as Rest;
            this.product.rest = parentProductRest;

            this._areaService.getSelectedArea().pipe(takeUntil(this.destroy$), first()).subscribe(selectedArea => {
                this.product.setRestInfoForProduct(selectedArea);
            });

            this.product.isPurchaseProductButtonHidden = this.product.isPurchaseButtonHidden;
            this.product.isAvailableProduct = this.product.isAvailable;
            this.product.inAnotherProductStore = this.product.inAnotherStore;
            this.product.inAnotherProductPartner = this.product.inAnotherPartner;
            this.product.notAvailableProduct = this.product.notAvailable;

            this.product = new Product().deserialize(this.product);
        });
    }

    private saveToCache(product: Product): void {
        if (!product) {
            return;
        }
        this._searchService.setCacheProduct(product);
        this._lastInfoService.updateProductsHistory(product);
    }

    private performTitleTranslation(product: Product): void {
        if (!product) {
            return;
        }
        let language = this._languageService.getSelectedLanguage();
        let langName = language.name || 'RUS';
        this._productService.setTranslatedDescription(product, langName);
    }

    private performAdditionalInfoTranslation(product: Product): void {
        if (!product) {
            return;
        }
        let langName = this.language || 'RUS';
        this._productService.setTranslatedAdditionalInfoForProduct(product, langName);
    }

    public showMore(): void {
        this.collapsed = false;      
        this.limitForAddInfo = this.product.info.length;
        return;
    }

    public hideMore(): void {
        this.collapsed = true;
        this.limitForAddInfo = this.limitForAddInfoConst;
    }

    public checkLimitForAddInfo(): boolean {
        return this.product.info.length > this.limitForAddInfoConst;
    }

    public checkLimitForAutodocInfo(): boolean {
        let autodocInfoLength = this.product.autodocInfo ? this.product.autodocInfo.length : 0;
        let productInfoLength = this.product.info ? this.product.info.length : 0;
        let isNotLimit = (autodocInfoLength + productInfoLength) > this.limitForAddInfoConst;
        return isNotLimit;
    }

    public getAutodocInfo() {
        return (this.product.info && this.language != 'UKR' ? this.product.info + '<br /><br />' : '') + (this.product.autodocInfo ? this.product.autodocInfo + '<br /><br />' : '');
    }

    public showMoreAutodocInfo(): void {
        this.collapsed = false;
        this.limitForAddInfo = this.product.autodocInfo.length + (this.product.info === null ? 0 : this.product.info.length);
    }

    private setCategoryName(urlEnding: string): void {
        let categoryId = this.urlParser.parseUrlForCategoryId(urlEnding);
        this._breadcrumbsService.crumbs$.pipe(takeUntil(this.destroy$)).subscribe(crumbs => {
            let crumb = crumbs.find(x => x.path.includes(categoryId.toString()));
            this.categoryName = (crumb) ? crumb.text : "";
        })
    }

    public getDescription(): string {
        let description = this.categoryName + " " + this.product.lookupNumber + " " + this.product.brand;

        let categoryNameLower = this.categoryName.toLowerCase();
        if ((categoryNameLower.includes('компоненты') || categoryNameLower.includes('комплектующие') || categoryNameLower.includes('детали')) && this.product.displayDescription) {
            description = this.product.displayDescription;
        }
        return description;
    }

    public scrollToReviews(): void {
        this.selectedTab$.next('reviews');
        this._scrollService.scrollToElement(reviewsId);
    }
}

class TabHeaderItem {
    constructor(public HeaderName: string, public IsShown: Boolean = false, public IsHeaderShown: Boolean = true) { }
}
