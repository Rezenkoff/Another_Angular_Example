import { Component, Input, Output, OnInit, ViewChild, EventEmitter, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import * as shopingcart from '../../shoping-cart/actions/shoping-cart';
import * as fromShopingCart from '../../shoping-cart/reducers';
import { Store } from '@ngrx/store';
import { OrderPopupComponent } from '../../shoping-cart/components/order-popup.component';
import { CartProduct } from '../../shoping-cart/models/shoping-cart-product.model';
import { Product } from '../../models/product.model';
import { Observable } from 'rxjs';
import { NavigationService } from '../../services/navigation.service';
import { SearchService} from '../../services/search.service';
import { PixelFacebookService } from '../../services/pixel-facebook.service';
import { LanguageService } from '../../services/language.service';
import { AreaService } from '../../location/area/area.service';
import { ProductService } from '../product.service';
import { CdnImageHelper } from '../../app-root/cdn-image-path';
import { GtagService } from '../../services/gtag.service';
import { Rest, Price } from '../../search/models';
import { first } from 'rxjs/operators';
import { ArticleBalanceDetail } from '../../models/article-balance-detail.model';
import { AutodocBalanceDetails } from '../../search/models/autodoc-balance-details.model';
import { LastInfoService } from '../../order-step/last-info.service';
import { BaseLoader } from '../../shared/abstraction/loaderbase.component';

@Component({
    selector: 'analog-tab',
    templateUrl: './__mobile__/analog-tab.component.html',
    styleUrls: ['./__mobile__/styles/analog-tab.component__.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AnalogTabComponent extends BaseLoader implements OnInit {
    @Input() categoryName: string;
    @Input() product: Product;
    @Output() analogsLoadedEvent?: EventEmitter<void> = new EventEmitter<void>();

    @ViewChild("orderpop") private orderPopup: OrderPopupComponent;
    public selectedProduct$: Observable<CartProduct>;
    public products: Product[] = null;
    private iconType: number = 0; //this is small 50x60
    private optionForRemarketingCart = "extended order";
    public eventViewOption: string = "analogs";
    public noAnalogsFound: Boolean = false;
    public isAnalogsAvailableForItem: Boolean = false;

    constructor(private store: Store<fromShopingCart.State>,
        private _searchService: SearchService,
        private _areaService: AreaService,
        private _productService: ProductService,
        private _imagePathResolver: CdnImageHelper,
        private _navigationService: NavigationService,
        private _languageService: LanguageService,
        public _gtagService: GtagService,
        private _lastInfoService: LastInfoService,
        private _faceBookPixelService: PixelFacebookService,
        private cd: ChangeDetectorRef
    ) {
        super();
        this.selectedProduct$ = this.store.select(fromShopingCart.getSelectedProduct);
    }

    ngOnInit(): void {
        this.getAnalogs();
    }

    public getImage(id) {
        return this._imagePathResolver.getImage(id);
    }

    public navigateToProduct(item: any, index: number) {
        if (!item || !item.transliteratedTitle) {
            return;
        }
        let title = item.transliteratedTitle;
        if (title.endsWith(".html")) {
            title = title.substring(0, title.indexOf(".html"));
        }
        this._searchService.setCacheProduct(item);
        this._gtagService.selectContent.sendEventSelectContent([item], index, this.eventViewOption);
        this._navigationService.OpenProductInNewTab(title);
    }

    public onProductAdd(product: Product): void {
        this.store.dispatch(new shopingcart.AddProductAction(product));
        this._gtagService.sendEventAddToCart(product, this.optionForRemarketingCart);
        this._faceBookPixelService.trackAddToCartEvent(product.id, product.displayDescriptionRus, product.transliteratedTitle, product.price);
        this.orderPopup.toggleWindow();
    }

    public addToViewed(index: number) {
        this._gtagService.sendViewedProducts(index, this.products, this.eventViewOption);
    }

    //to service
    private performTitleTranslation(product: Product): void {
        if (!product) {
            return;
        }
        let language = this._languageService.getSelectedLanguage();
        let langName = language.name || 'RUS';

        let transletedProduct  = this._productService.setTranslatedDescription(product, langName);
        Object.assign(product, transletedProduct);        
    }

    private saveToCache(product: Product): void {
        if (!product) {
            return;
        }
        this._searchService.setCacheProduct(product);
        this._lastInfoService.updateProductsHistory(product);
    }

    public getAnalogs(): void {
        this.inProcess = true;
        this._productService.getProductAnalogs(this.product.id, this.product.lookupNumber, this.product.groupId, this.product.brandId).subscribe(
            (data:any) => {
                this.inProcess = false;
                if (!data) {
                    this.products = new Array<Product>();
                    return;
                }

                if (data.length <= 0)
                    this.noAnalogsFound = true;

                this.products = data.products.map(item => new Product().deserialize(item));

                this.isAnalogsAvailableForItem = this.products != null && this.products.length > 0;

                this.analogsLoadedEvent.emit();

                let idsList: ArticleBalanceDetail = new ArticleBalanceDetail(this.products.map(c => c.id), this.products.filter(c => c.isExpected == -1).map(c => c.id));

                if (this.product.isExpected == -1) {
                    idsList.supplierArticleIds.push(this.product.id);
                }

                this.products.forEach(analog => this.performTitleTranslation(analog));

                this._searchService.getCachedOrOriginalPrices(idsList).subscribe(prices => {

                    this.saveToCache(this.product);

                    this._faceBookPixelService.trackProductCardViewEvent(this.product.id, this.product.displayDescriptionRus, this.categoryName, this.product.price);
                    
                    this.products.forEach(analog => {                     
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
                        this.cd.detectChanges();
                        analog.isProductPrice = analog.isProductPriceDisplayed;
                        
                    });                                       
                });

                this._searchService.getCachedOrOriginalRests(idsList.articleIds).subscribe((rests: Rest[]) => {                   
                    this._areaService.getSelectedArea().pipe(first()).subscribe(selectedArea => {
                        this.products.forEach(analog => {
                            let analogRest = rests.find(pr => pr.artId == analog.id);
                            if (analogRest) {
                                analog.rest = analogRest;
                            }
                            analog.setRestInfoForProduct(selectedArea);
                            analog.isPurchaseProductButtonHidden = analog.isPurchaseButtonHidden;
                        })                    
                    });
                });
                
            });
    }
}