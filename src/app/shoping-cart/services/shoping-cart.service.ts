import { Injectable } from '@angular/core';
import { CartProduct, Cart } from '../models/shoping-cart-product.model';
import { ShopingCartLocalService } from './shoping-cart-local.service';
import { AuthHttpService } from '../../auth/auth-http.service';
import { CheckoutModel } from '../models/checkout.model';
import { CheckoutItem } from '../models/checkout-item.model';
import { ShopingCartModelService } from '../services/shoping-cart-model.service';
import { Store } from '@ngrx/store';
import * as fromShopingCart from '../reducers';
import { Observable, of, throwError, Subject } from 'rxjs';
import { map, flatMap, catchError } from 'rxjs/operators';
import { LoggerService } from '../../logger/services/logger.service';
import { ShoppingCartLogRecordModel, LogEntryType } from '../../logger/models';
import { UserStorageService } from '../../services/user-storage.service';
import { LocalCart } from '../models/local-storage-cart.model';
import { ShopingCartEnterRecordModel } from '../../logger/models/shopingCartEnterLogRecord.model';
import { ProductPriceChangedRecordModel } from '../../logger/models/productPriceChangedLogRecord.model';
import { ProductOutOfStockRecordModel } from '../../logger/models/productOutOfStockLogRecord.model';
import { PriceChangeGradesEnum } from '../models/price-change-grades.enum';
import { PixelFacebookService } from '../../services/pixel-facebook.service';
import { BitrixService } from '../../services/bitrix.service';
import { ApiResponse } from '../../models/api-response.model';
import { UtmService } from '../../services/utm.service';
import { UidParams } from '../../services/uid-params.service';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable()
export class ShopingCartService {
    private cart$: Observable<Cart>;
    private cartProducts: Array<CartProduct>;
    private readonly UserLocalCartKey: string = 'LocalCart';
    public CallBackCheckOut: any;
    public timeoutsDict: Object = {};
    public DeliveryAutoKey: number = 4;
    private _dealId: number;
    public sendPurchase$ = new Subject();

    constructor(
        private _http:HttpClient,
        private orderModel: ShopingCartModelService,
        private _localCartService: ShopingCartLocalService,
        private _authService: AuthHttpService,
        private _loggerService: LoggerService,
        private store: Store<fromShopingCart.State>,
        private _userStorage: UserStorageService,
        private _faceBookPixelService: PixelFacebookService,
        private _utmService: UtmService,
        private _bitrixService: BitrixService,
        private _uidParams: UidParams
    ) {
        this.cart$ = store.select(fromShopingCart.getCart);
        this.cart$.subscribe(cart => this.cartProducts = cart.products);
    }

    private isProductInCart(product: CartProduct): boolean {
        return this.cartProducts.map(p => p.articleId).indexOf(product.articleId) > -1;
    }

    public checkoutOrder(): Observable<any> {

        let clientInfo = this.orderModel.Order.clientInfo;

        let shipment = this.orderModel.Order.shipment;
        let city = this.orderModel.Order.shipment.DestinationCity;
        let areaId = city.areaId;

        let payment = this.orderModel.Order.paymentKey;
        let amount = this.orderModel.Order.amount;
        let promo = this.orderModel.Order.promo;
        //city np ref
        let cityRefRecipient = city ? this.orderModel.Order.shipment.DestinationCity.cityKey : null;

        clientInfo.Uid = this._userStorage.getUserUid();

        let checkout = new CheckoutModel(clientInfo, shipment, payment, amount, true, areaId, cityRefRecipient);

        checkout.RefId = this._userStorage.getRefId();
        checkout.DealId = this._dealId;

        checkout.ClientId = this._userStorage.getClientId();
        checkout.UtmFields = this._utmService.GetUtmFieldsFromLocalStorage();
        checkout.Promo = promo;
        let tireFittingDate = clientInfo.TireFittingDate;
        checkout.TireFittingDate = tireFittingDate;

        this.addAreaInCheckoutAddress(checkout);

        this.loadProducts().subscribe(
            cart => {
                this._faceBookPixelService.trackPurchaseOrderEvent(cart.products);
            });

        return this.localBasketProducts().pipe(
            flatMap(products => {
                checkout.ProductList = products;
                if (products.length) {
                    let productsForInstalling = products.filter(x => x.isNeedToInstall);
                    if (productsForInstalling.length) {
                        checkout.ClientInfo.Comment += `\n\nТовары для установки: ${productsForInstalling.map(x => x.Description).join()}`;
                    }
                }
                return this._http.post(environment.apiUrl + 'checkout/create', JSON.stringify(checkout)).pipe(
                    map((resp: any) => {
                        this._userStorage.setRefId(null);
                        this._userStorage.deleteDealId();
                      return resp;
                    }
                    ));
            }));
    }

    ngOnDestroy() {
        this.sendPurchase$.unsubscribe();
  }

  private addAreaInCheckoutAddress(checkout: CheckoutModel) {

    let user = this._userStorage.getUser();

    checkout.Shipment.DeliveryPoint.addressRus =
      user.userPreferences.areaNameRus != '' && checkout.Shipment.ShypmentType.Id == 8 || checkout.Shipment.ShypmentType.Id == 6 || checkout.Shipment.ShypmentType.Id == 7 ? user.userPreferences.areaNameRus + ', ' + checkout.Shipment.DeliveryPoint.addressRus : checkout.Shipment.DeliveryPoint.addressRus;

    checkout.Shipment.DeliveryPoint.addressUkr =
      user.userPreferences.areaNameUkr != '' && checkout.Shipment.ShypmentType.Id == 8 || checkout.Shipment.ShypmentType.Id == 6 || checkout.Shipment.ShypmentType.Id == 7 ? user.userPreferences.areaNameUkr + ', ' + checkout.Shipment.DeliveryPoint.addressUkr : checkout.Shipment.DeliveryPoint.addressUkr;
  }

    public createCartDeal(transactionId: string): void {
        let clientInfo = this.orderModel.Order.clientInfo;
        let shipment = this.orderModel.Order.shipment;
        let areaId = this.orderModel.Order.nearestStoreAreaId;
        let payment = this.orderModel.Order.paymentKey;
        let amount = this.orderModel.Order.amount;
        let cityRefRecipient = (this.orderModel.Order.shipment && this.orderModel.Order.shipment.DestinationCity)
            ? this.orderModel.Order.shipment.DestinationCity.cityKey
            : "";

        clientInfo.Uid = this._userStorage.getUserUid();

        let checkout = new CheckoutModel(clientInfo, shipment, payment, amount, true, areaId, cityRefRecipient);
        checkout.transactionId = transactionId;
        checkout.ClientId = this._userStorage.getClientId();
        checkout.RefId = this._userStorage.getRefId();
        checkout.UtmFields = this._utmService.GetUtmFieldsFromLocalStorage();

        if (!this._authService.isAuthenticated()) {
            this.createCartDealIdIsNotRegistered(checkout);
        }

        if (this._authService.isAuthenticated()) {
            this.createCartDealIdIsRegistered(checkout);
        }
    }

    private createCartDealIdIsRegistered(checkout: CheckoutModel) {

        this.sendCartDeal(checkout);
    }

    private createCartDealIdIsNotRegistered(checkout: CheckoutModel) {

        const params =  new HttpParams().set('userPhone', checkout.ClientInfo.Phone);
        const options = { params, responseType: 'text' as 'text'};

        this._http.get(environment.apiUrl + "crm/uid/getuid", options).subscribe((uidResult) => {

            let uid = uidResult;
            this._uidParams.setCurrentUnauthorizeUid(uid);
            this._userStorage.checkUidParam();
            this.sendCartDeal(checkout);
        });
    }

    private sendCartDeal(checkout: CheckoutModel) {

        try {
            this.localBasketProducts().pipe(
                flatMap(products => {
                    checkout.ProductList = products;
                    return this.getDeald(checkout).pipe(map(
                        (dealId) => {
                            this._bitrixService.sendOrderInfo(dealId, checkout.ProductList);
                        }
                    ))
                })).subscribe(() => { /*this.sendPurchase$.next();*/ });
        } catch (dealException) {
           
        }
    }

    private getDeald(checkout: CheckoutModel): Observable<number> {
        let dealId: number = this._userStorage.getDealId();

        if (dealId == null) {
            return this._http.post<ApiResponse>(environment.apiUrl + 'crm/deal/cart', JSON.stringify(checkout)).pipe(
                map((response) => {
                    dealId = response.data
                    if (dealId > 0) {
                        this._dealId = dealId
                        this._userStorage.setRefId(null);
                        this._userStorage.setDealId(dealId);
                        return dealId;
                    }

                }));
        }
        else {
            this._dealId = dealId;
            return of<number>(dealId);
        }
    }
    private localBasketProducts(): Observable<Array<CheckoutItem>> {
        return this._localCartService.loadCartProducts().pipe(
            map((cart: Cart) => {
                return cart.products;
            }),
            flatMap((products: CartProduct[]) =>
                of(products.map(p => new CheckoutItem(p.articleId, p.price, p.quantity, p.displayDescription, p.displayDescriptionUkr, p.displayDescriptionRus, p.brand, p.category, p.productLine, p.lookupNumber, p.ref_Key, p.weight, p.isExpected, p.supplierProductRef_Key, p.isNeedToInstall, p.isTire))))
        );

    }

    public loadProducts(): Observable<Cart> {
        if (this._authService.isAuthenticated()) {
            //intercept for auth
            return this._http.get<Cart>(environment.apiUrl + 'cart/products').pipe(
                catchError((error: any) => throwError(error)
                ));
        }
        else {
            return this._localCartService.loadCartProducts();
        }
    }

    public updateProduct(product: CartProduct): Observable<CartProduct> {
        if (this._authService.isAuthenticated()) {
            this.updateAfterTimeout(product);
            return of(product);
        } else {
            return this._localCartService.updateProduct(product);
        }
    }

    public updateAfterTimeout(product: CartProduct): void {
        if (!product || !product.lookupNumber) {
            return;
        }

        if (this.timeoutsDict[product.lookupNumber]) {
            clearTimeout(this.timeoutsDict[product.lookupNumber]);
        }

        this.timeoutsDict[product.lookupNumber] = setTimeout(() => {

            //intercept for auth
            this._http.put(environment.apiUrl + 'cart/products', JSON.stringify({ id: product.id, quantity: product.quantity, isNeedToInstall: product.isNeedToInstall })).subscribe();
        }, 2000);
    }

    public upsertProductArray(products: CartProduct[]): Observable<CartProduct[]> {
        if (this._authService.isAuthenticated()) {
            
            //intercept for auth
            return this._http.post<CartProduct[]>(environment.apiUrl + 'cart/upsetProducts', JSON.stringify(products)).pipe(
                catchError((error: any) => throwError(error)
                ));
        }
        else {
            return this._localCartService.upsertProductArray(products);
        }
    }

    public tryAddProduct(product: CartProduct): Observable<CartProduct> {
        this.saveLogRecord("Добавление в корзину", product);

        if (this.isProductInCart(product)) {
            return of<CartProduct>(product);
        }

        if (this._authService.isAuthenticated()) {

            return this.addProduct(product);

        } else {
            return this._localCartService.addProduct(product);
        }
    }

    public clearCart(): Observable<boolean> {
        if (this._authService.isAuthenticated()) {

            //intercept for auth
            return this._http.get(environment.apiUrl + 'cart/products/clear').pipe(
                map((resp: Response) => true),
                catchError((error: any) => throwError(error)
                ))

        } else {
            return this._localCartService.clearCart();
        }
    }

    public removeProduct(product: CartProduct): Observable<CartProduct> {
        this.saveLogRecord("Удаление товара из корзины", product);

        if (this._authService.isAuthenticated()) {

            const params = new HttpParams().set('id', product.id.toString());

            //intercapt for auth
            return this._http.delete<CartProduct>(environment.apiUrl + 'cart/products', {params} ).pipe(
                
                catchError((error: any) =>
                    throwError(error)
                ));

        } else {
            return this._localCartService.removeProduct(product);
        }
    }

    public getPricesComparison(products: any[]): { changeGrade: PriceChangeGradesEnum, changeValue: number } {
        let result = true;
        let productsWithChangedPrices: CartProduct[] = [];
        let prevSumm: number = 0;
        let newSumm: number = 0;

        this.cartProducts.forEach(x => {
            prevSumm += x.price * x.quantity;

            let eProd = products.find(y => y.artId == x.articleId);
            if (eProd && (eProd.price != x.price)) {
                result = false;
                productsWithChangedPrices.push(x);
            }
            newSumm += (eProd) ? (eProd.price * eProd.quantity) : (x.price * x.quantity);
        });

        if (!result && productsWithChangedPrices.length) {
            const ids: number[] = productsWithChangedPrices.map(x => x.articleId);
            const log = new ProductPriceChangedRecordModel(ids);
            this._loggerService.logRecord(log);
        }

        return this.getPriceChangeGrade(prevSumm, newSumm);
    }

    private getPriceChangeGrade(prevSumm: number, newSumm: number): { changeGrade: PriceChangeGradesEnum, changeValue: number } {

        if (prevSumm == newSumm) {
            return { changeGrade: PriceChangeGradesEnum.NoChange, changeValue: 0 };
        }

        const priceChangeTresholdPercent: number = 0.5;
        const absoluteValue: number = prevSumm * priceChangeTresholdPercent * 0.01;
        const summDiff: number = newSumm - prevSumm;
        const changeValue = Number(Number(Math.abs(summDiff)).toFixed(2));

        if (summDiff < 0) {
            return { changeGrade: PriceChangeGradesEnum.Decrease, changeValue: changeValue }
        }

        if (changeValue < absoluteValue) {
            return { changeGrade: PriceChangeGradesEnum.SlightIncrease, changeValue: changeValue }
        }

        return { changeGrade: PriceChangeGradesEnum.Increase, changeValue: changeValue }
    }

    private saveLogRecord(operation: string, cartModel: CartProduct): void {
        let logRecord = new ShoppingCartLogRecordModel(operation, cartModel.articleId, LogEntryType.ShoppingCart);
        this._loggerService.logRecord(logRecord);
    }

    public UpsertProduct(): Observable<any> {
        if (this._authService.isAuthenticated()) {
            //insert product from local storage when user authorization
            let localStorageCart = this._userStorage.getData(this.UserLocalCartKey) as LocalCart;
            let currentDate = new Date().getTime();
            //this.store.dispatch(new shopingcart.LoadAction());
            if (localStorageCart != null && localStorageCart.cart.products.length > 0 && localStorageCart.expiresIn > currentDate) {
                //intercepr for auth
                return this._http.post(environment.apiUrl + 'cart/upsetProducts', JSON.stringify(localStorageCart.cart.products)).pipe(map((resp: Response) => {
                    this._userStorage.removeData(this.UserLocalCartKey);
                    return resp;
                }),
                    catchError((error: any) => throwError(error)));
            }
        }

        return of<any>({});
    }

    public addProduct(product: CartProduct): Observable<CartProduct> {
        //intercept for auth
        return this._http.post<CartProduct>(environment.apiUrl + 'cart/products', JSON.stringify(product)).pipe(
            map((resp) => {
                let cartProduct = resp;
                cartProduct.price = product.price;
                cartProduct.discountPrice = product.discountPrice;
                cartProduct.quantityForDiscount = product.quantityForDiscount;
                cartProduct.standardPrice = product.standardPrice;
                return cartProduct;
            }),
            catchError((error: any) => {
                return throwError(error)
            }));
    }

    public logEnterToShopingCart(): void {
        const log = new ShopingCartEnterRecordModel();
        this._loggerService.logRecord(log);
    }

    public logOutOfStockProducts(missedProducts: any[]): void {
        const productIds: number[] = missedProducts.map(p => p.artId);
        const log = new ProductOutOfStockRecordModel(productIds);
        this._loggerService.logRecord(log);
    }

    public clearDeal(): void {
        this._dealId = null;
    }
}
