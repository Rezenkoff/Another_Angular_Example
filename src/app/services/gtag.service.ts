import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CartProduct } from '../shoping-cart/models/shoping-cart-product.model';
import { Product } from '../models/product.model';
import { CategoryInfoService } from './category-info.service';
import { Store } from '@ngrx/store';
import * as fromSearch from '../search/reducers';
import * as fromShopingCart from '../shoping-cart/reducers';
import { first, takeUntil } from 'rxjs/operators';
import { IAppConstants, APP_CONSTANTS } from '../config/app-constants';
import { GtagSenderService } from '../seo/services/gtag-sender.service';
import { BeginCheckout } from '../remarketing/begin-checkout';
import { MainUrlParser } from '../app-root/main-url.parser';
import { CatalogService } from './catalog-model.service';
import { Node } from '../catalog/models';
import { ProgressCheckout } from '../remarketing/progress-checkout';
import { Purchase } from '../remarketing/purchase';
import { CatalogType } from '../catalog/models/catalog-type.enum';
import { AddToWishlist } from '../remarketing/add-to-wishlist';
import { Search } from '../remarketing/search';
import { SignUp } from '../remarketing/sign-up';
import { ViewSearchResult } from '../remarketing/view-search-results';
import { Login } from '../remarketing/login';
import { ViewItemList } from '../remarketing/view-item-list';
import { ViewItem } from '../remarketing/view-item';
import { Subscription, Subject } from 'rxjs';
import { SelectContent } from '../remarketing/select-content';
import { RemoveFromCart } from '../remarketing/remove-from-cart';
import { Router, NavigationEnd } from '@angular/router';
import * as fromPopularProducts from '../shared/components/popular-products/reducers';
import * as popularProductAction from '../shared/components/popular-products/actions/popular-products.action';

declare var dataLayer: any;

@Injectable()
export class GtagService {

    private recepientKeys: string[] = [];
    public beginCheckout: BeginCheckout;
    public progressCheckout: ProgressCheckout;
    public purchase: Purchase;
    public addToWishlist: AddToWishlist;
    public search: Search;
    public signUp: SignUp;
    public viewSearchResult: ViewSearchResult;
    public login: Login;
    public viewItemList: ViewItemList;
    public viewedItemList: Product[] = new Array<Product>();
    public viewItem: ViewItem;
    public selectContent: SelectContent;
    public removeFromCart: RemoveFromCart;
    public routerSub$: Subscription;
    public purchaseProducts: any;
    private ngUnsubscribe: Subject<boolean> = new Subject<boolean>();

    constructor(
        @Inject(APP_CONSTANTS) private _constants: IAppConstants,
        @Inject(PLATFORM_ID) private platformId: Object,
        private searchStore: Store<fromSearch.State>,
        private cartStore: Store<fromShopingCart.State>,
        private categoryInfoService: CategoryInfoService,
        private _sender: GtagSenderService,
        @Inject(MainUrlParser) private urlParser: MainUrlParser,
        public _catalogService: CatalogService,
        private _route: Router,
        private storePopularProduct: Store<fromPopularProducts.State>
    ) {
        this.recepientKeys = [this._constants.GTAG_ANALYTICS_KEY, this._constants.GTAG_AD_WORDS_KEY];
        this.beginCheckout = new BeginCheckout(this._constants, this.platformId, this.cartStore, this.categoryInfoService, this._sender);
        this.progressCheckout = new ProgressCheckout(this._constants, this.platformId, this.cartStore, this.categoryInfoService, this._sender);
        this.purchase = new Purchase(this._constants, this.platformId, this.cartStore, this.categoryInfoService, this._sender);
        this.addToWishlist = new AddToWishlist(this._constants, this.platformId, this.cartStore, this.categoryInfoService, this._sender, this.urlParser, this._catalogService);
        this.search = new Search(this._constants, this.platformId, this._sender);
        this.signUp = new SignUp(this._constants, this.platformId, this._sender);
        this.viewSearchResult = new ViewSearchResult(this._constants, this.platformId, this._sender);
        this.login = new Login(this._constants, this.platformId, this._sender);
        this.viewItemList = new ViewItemList(this._constants, this.platformId, this, this._sender);
        this.selectContent = new SelectContent(this._constants, this.platformId, this, this._sender);
        this.viewItem = new ViewItem(this._constants, this.platformId, this, this._sender);
        this.removeFromCart = new RemoveFromCart(this._constants, this.platformId, this, this._sender);

        this.routerSub$ = this._route.events.subscribe(e => {
            if (e instanceof NavigationEnd) {
                this.setDataLayerOther();
            }
        });
    }

    private getParametersModel(products: CartProduct[], transaction_id: string) {

        let total: number = 0;
        products.forEach(p => {
            total += p.price * p.quantity;
        });
        let tax: string = (0.2 * total).toFixed(2);

        let parameters = {
            "transaction_id": transaction_id,
            "value": total,
            "currency": "UAH",
            "tax": tax,
            "items": products.map(p => {
                return {
                    "id": p.articleId,
                    "price": p.price,
                    "quantity": p.quantity,
                    "name": p.displayDescription,
                    "brand": p.brand,
                    "category": p.category || ''
                }
            })
        };
        return parameters;
    }

    public sendRemarketingEventForProduct(productId: number, price: number) {

        if (!isPlatformBrowser(this.platformId) || !productId || !price) {
            return;
        }
        let parameters = {
            'ecomm_pagetype': "product",
            'ecomm_prodid': productId,
            'ecomm_totalvalue': price.toFixed(2)
        };
        this._sender.sendEvent(parameters, this.recepientKeys, 'page_view');
    }

    public sendRemarketingEventForSearch() {

        if (!isPlatformBrowser(this.platformId)) {
            return;
        }
        let pageType = 'searchresults';

        this.searchStore.select(fromSearch.getProducts).pipe(first()).subscribe(products => {
            this.searchStore.select(fromSearch.getSearchParameters).pipe(first()).subscribe(parameters => {
                if (parameters.treeParts.length && parameters.treeParts[0] > 0) {
                    pageType = 'category';
                    this.sendEventWithProducts(pageType, products);
                } else if (products.length === 1 && products[0].analogsCount > 0) {
                    this.sendEventWithProducts(pageType, products, null, [this._constants.GTAG_ANALYTICS_KEY]);
                } else {
                    this.sendEventWithProducts(pageType, products);
                }
            });
        });
    }

    public sendEventWithProducts(pageType: string, products: Array<Product>, total?: number, recepientKeys: string[] = this.recepientKeys): void {

        let prodids: number[] = [];

        products.forEach(p => {
            prodids.push(p.id);
        });

        let parameters = {
            'ecomm_pagetype': pageType,
            'ecomm_prodid': prodids.join(',')
        };
        if (total) {
            parameters['ecomm_totalvalue'] = total.toFixed(2);
        }

        this._sender.sendEvent(parameters, recepientKeys, 'page_view');
    }

    public sendRemarketingEventForCart(): void {

        if (!isPlatformBrowser(this.platformId)) {
            return;
        }
        try {
            this.cartStore.select(fromShopingCart.getCart).pipe(first()).subscribe(cart => {
                
                let productsList = cart.products.map( p => new Product().deserialize({ id:p.articleId, price:p.price }));
                let total = cart.products.reduce((total, product) => total + product.price * product.quantity, 0);
                
                this.sendEventWithProducts('cart', productsList, total);
            });
        } catch (e) {
            return;
        }
    }

    public sendRemarketingEventForPurchase(products: CartProduct[]): void {

        if (!isPlatformBrowser(this.platformId) || !products) {
            return;
        }
        try {
            let productsList = products.map( p => new Product().deserialize({ id:p.articleId, price:p.price }));
            let total = products.reduce((total, product) => total + product.price * product.quantity, 0);           
           
            this.sendEventWithProducts('purchase', productsList, total);
        } catch (e) {
            return;
        }
    }
    
    public sendForCategoryWithoutProducts(): void {
        this.sendEventWithProducts('category', []);
    }

    public sendSearchEventToAdWords(productIds: number[]): void {

        if (!isPlatformBrowser(this.platformId) || !productIds) {
            return;
        }
        let parameters = {
            'ecomm_pagetype': "searchresults",
            'ecomm_prodid': productIds,
        };
        this._sender.sendEvent(parameters, [this._constants.GTAG_AD_WORDS_KEY], 'page_view');
    }

    public sendEventAddToCart(product: Product, option: string) {

        if (!isPlatformBrowser(this.platformId) || !product) {
            return;
        }

        let parameters = {
                "value": product.price,
                "currency": "UAH",
                "custom_purchase_type": option,
                "items": [
                    {
                        "id": product.id,
                        "name": product.displayDescription,
                        "brand": product.brand,
                        "category": product.categoryName,
                        "price": product.price
                    }
                ]
        };

        this._sender.sendEvent(parameters, [this._constants.GTAG_ANALYTICS_KEY], 'add_to_cart');
 
    }

    public setUserUid(uid: string): boolean {

        let uidResult = this._sender.setUid(uid, this._constants.GTAG_ANALYTICS_KEY);
        return uidResult;
    }

    public getCurrentNode(transliteratedTitle: string): Node {

        let categoryId = this.urlParser.parseUrlForCategoryId(transliteratedTitle);
        return this._catalogService.getNodeById(categoryId, CatalogType.Full);
    }

    public sendViewedProducts(index: number, productList: Product[], option: string) {

        this.viewedItemList = productList;
        if ((index == 0 || index % 5 == 0) && this.viewedItemList) {
            setTimeout(() => {
                this.viewItemList.sendEventViewItemList(this.viewedItemList.slice(index, index + 5), index, option);
            }, 1000)
        }
    }

    public setDataLayer(productList: Product[], option: string) {

        if (!isPlatformBrowser(this.platformId)) {
            return;
        }

        var params = this.setProductsParams(productList);
        this.setDataLayerObject(option, params.prodid, params.totalvalue);
    }

    public setCartDataLayer(productList: CartProduct[]) {

        if (!isPlatformBrowser(this.platformId)) {
            return;
        }

        var params = this.setCardProductsParams(productList);
        this.purchaseProducts = params;
        this.setDataLayerObject('cart', params.prodid, params.totalvalue);
    }

    public setPurchaseDataLayer() {

        if (!isPlatformBrowser(this.platformId)) {
            return;
        }

        this.setDataLayerObject('purchase', this.purchaseProducts.prodid, this.purchaseProducts.totalvalue);
    }

    private setProductsParams(productList: Product[]): any {

        let total: number = 0;
        productList.forEach(p => {
            total += p.price;
        });

        let ids = productList.map(product => product.id.toString());
        
        return { prodid: ids, totalvalue: total };
    }

    private setCardProductsParams(productList: CartProduct[]): any {

        let total: number = 0;
        productList.forEach(p => {
            total += p.price * p.quantity;
        });
        
        let ids = productList.map(product => product.articleId.toString());
        return { prodid: ids, totalvalue: total };
    }

    private setDataLayerObject(pagetype, prodid, totalvalue) {

        if (!isPlatformBrowser(this.platformId)) {
            return;
        }
        if (typeof(dataLayer) === "undefined") {
            return;
        }

        var param = {
            'ecomm_pagetype': pagetype,
            'ecomm_prodid': prodid,
            'ecomm_totalvalue': totalvalue.toFixed(2)
        };
        dataLayer.push(param);
    }

    private setDataLayerOther() {

        if (!isPlatformBrowser(this.platformId)) {
            return;
        }

        var pagetype = this._route.routerState.snapshot.url;
        if (pagetype == '/') {
            this.storePopularProduct.dispatch(new popularProductAction.Load());
            this.storePopularProduct.select(fromPopularProducts.getPopularProducts)
                .pipe(takeUntil(this.ngUnsubscribe))
                .subscribe(res => {
                    this.setDataLayer(res, 'home');
                });
        }
        if (pagetype.startsWith('/search-result') || pagetype.startsWith('/category') || pagetype.startsWith('/product')
            || pagetype.startsWith('/order-checkout/checkout-in-process') || pagetype.startsWith('/order-checkout/order-checkout-success')) {
            return;
        }
        var param = {
            'ecomm_pagetype': 'other',
            'ecomm_prodid': '',
            'ecomm_totalvalue': ''
        };
        try {
            dataLayer.push(param);
        }
        catch { }
    }

    ngOnDestroy() {
        if (this.routerSub$) {
            this.routerSub$.unsubscribe();
        }
    }
}