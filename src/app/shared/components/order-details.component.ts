import { Component, Input, Inject, EventEmitter, Output, ViewChild, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BaseBlockComponent } from '../../shared/abstraction/base-block.component';
import { Order, InvoiceRow } from '../../models';
import { OrderService } from '../../services/order.service';
import { LanguageService } from '../../services/language.service';
import { APP_CONSTANTS, IAppConstants } from '../../config';
import { LiqpayService } from '../../payment/liqpay/liqpay.service';
import { StatusInvoice } from "../../models/status-invoice.model";
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ShowPointOnMapPopupComponent } from './show-point-on-map-popup.component';
import { OrderDeliveryInfo } from './models/order-delivery-info';
import { GlobalTransportService, ActionEvent } from '../../services/global-flag.service';
import { AuthHttpService } from '../../auth/auth-http.service';
import { StoService } from '../../sto/sto.service';
import { environment } from '../../../environments/environment';

@Component({
    selector: 'order-details',
    templateUrl: './__mobile__/order-details.component.html',
    styleUrls: ['./__mobile__/styles/order-details.component__.scss']
})
export class OrderDetailsComponent extends BaseBlockComponent {
    @Input() order?: Order;
    @Output() afterPayment: EventEmitter<any> = new EventEmitter<any>();
    public rows: InvoiceRow[] = [];
    private total: string;
    private summa: number;
    public invoiceStatus: StatusInvoice[];
    private statusReserved: string = 'H';
    private statusExpected: string = 'P';
    private cartPayment: number = 4;
    private waitForPayment: number = 9;
    private destroy$: Subject<boolean> = new Subject<boolean>();
    public inTransitStatus: number = 4;
    public zoom: number = 12;
    public paymentResult: boolean = false;
    @ViewChild('showpointonmappopup') _showPointOnMapComponent: ShowPointOnMapPopupComponent;
    public stoDeliveryId: number = 4;
    @Output() orderState = new EventEmitter<Order>();
    imgUrl: string = '';
    public orderDeliveryInfo: OrderDeliveryInfo = new OrderDeliveryInfo();

    constructor(
        @Inject(APP_CONSTANTS) constants: IAppConstants,
        private _orderService: OrderService,
        private _liqpayService: LiqpayService,
        private _languageService: LanguageService,
        private _transportService: GlobalTransportService,
        private _authHttpService: AuthHttpService,
        private _stoService: StoService,
        @Inject(PLATFORM_ID) private platformId: Object) {
        super(constants);

        if (this._authHttpService.isAuthenticated()) {

            this._transportService.subscribeToGlobalTransport().pipe(takeUntil(this.destroy$)).subscribe(parcel => {

                if (parcel && parcel.typeFlag == ActionEvent.getOrderInvoices) {

                    let inputOrder = parcel.value as Order;

                    if (inputOrder.id == this.order.id) {

                        if (isPlatformBrowser(this.platformId)) {
                            this._stoService.getOrderDeliveryInfo(this.order.longitudeDP, this.order.latitudeDP).pipe(
                                takeUntil(this.destroy$)
                            ).subscribe((deliveryInfo: OrderDeliveryInfo) => {

                                this.orderDeliveryInfo = deliveryInfo;
                            });
                        }
                        this.loadInvoices();
                        this.getInvoiceStatus();
                    }
                }
            });
        }
    }

    public getImagePreviewUrl(imageUrl: string) {
        let imageName = imageUrl.split('/').pop();
        let imagePreviewName = "Preview_" + imageName;
        let imagePreviewUrl = imageUrl.replace(imageName, imagePreviewName);
        return imagePreviewUrl;
    }

    public statusIsCanceled(): boolean {
        return this.order.statusId == 5 ? true : false;
    }

    public productUrl(TransEnding: string): string {
        return 'product/' + TransEnding;
    }

    toggleCollapse() {
        this.orderState.emit(this.order);
    }

    private countSum() {
        let tempTotal = 0;
        this.rows.forEach(x => tempTotal += x.summa);
        if (this.order.discountAmount) {
            tempTotal -= this.order.discountAmount;
        }
        this.summa = tempTotal;
        this.total = tempTotal.toFixed(2);
    }

    public loadInvoices() {
        this._orderService.getInvoiceListByOrderId(this.order.id).pipe(takeUntil(this.destroy$))
            .subscribe(data => {
                this.rows = data;
                this.countSum();
                this.translateProducts();
            });
    }

    public download(id: string) {
        this._orderService.downloadFiles(id).pipe(takeUntil(this.destroy$))
            .subscribe(data => data);
    }

    public getLogo(modelId: number): string {
        return `${environment.apiUrl}/vehicle/image?modelId=${modelId}`;
    }

    public pay(): void {
        this._orderService.PayForResurvedRows(this.order.id, this.rows, this.summa).pipe(takeUntil(this.destroy$))
            .subscribe((response: any) => {
                this._liqpayService.onCallback.pipe(takeUntil(this.destroy$)).subscribe(data => data)

                this._liqpayService.onClose.pipe(takeUntil(this.destroy$)).subscribe(data => {
                    this.afterPayment.emit();
                    this.hideWindow();
                })

                this._liqpayService.onReady.pipe(takeUntil(this.destroy$)).subscribe(data => data)

                if (response.success && response.data.signature && response.data.data) {
                    this._liqpayService.initCheckout(response.data, response.data.phone);
                }
            });
    }

    public getInvoiceStatus(): void {
        if (!this.order.id) {
            return;
        }
        this._orderService.GetInvoiceStatus(this.order.id).pipe(takeUntil(this.destroy$)).subscribe(data => {
            if (data.length > 0) {
                this.invoiceStatus = data;
            }

            this.paymentResult = Boolean(
                this.order.statusId == this.waitForPayment
                && this.order.paymentMethodKey == this.cartPayment
                && this.checkStatusAllInvoices()
                && this.checkTotalSum());
        });
    }

    public isPaymentButtonShown(): boolean {
        return Boolean(
            this.order.statusId == this.waitForPayment
            && this.order.paymentMethodKey == this.cartPayment
            && this.checkStatusAllInvoices()
            && this.checkTotalSum());
    }

    public getDescriptionForCar(): string {
        if (this.order.brand)
            return this.order.brand;
        else {
            let language = this._languageService.getSelectedLanguage();
            return (language.name == 'RUS') ? 'Ваш автомобиль' : 'Ваш автомобіль'
        };
    }

    private checkTotalSum(): boolean {
        if (!this.invoiceStatus || this.invoiceStatus.length === 0)
            return false;

        let noSum = this.invoiceStatus.some(x => x.summ == 0 && x.status != this.statusExpected);
        if (noSum) {
            return false;
        }

        if (this.invoiceStatus.some(x => x.status == this.statusExpected)) {
            return true;
        }

        let result = this.order.orderSum.toFixed() === (this.invoiceStatus.map(x => x.summ).reduce((a, b) => a + b, 0)).toFixed();
        return result;
    }

    private checkStatusAllInvoices(): boolean {
        let result: boolean = true;

        if (!this.invoiceStatus || this.invoiceStatus.length === 0)
            return false;

        if (this.invoiceStatus) {
            this.invoiceStatus.forEach(item => {
                if (item.status != this.statusReserved && item.status != this.statusExpected) {
                    result = false;
                }
            });
        }
        return result;
    }

    private translateProducts(): void {
        let language = this._languageService.getSelectedLanguage();
        let languageStr = language.name || 'RUS';

        this.rows.forEach(row => row.artName = (languageStr == 'UKR' && row.artNameUkr) ? row.artNameUkr : row.artNameRus);
    }

    public openDeliveryPointMap() {
        this._showPointOnMapComponent.toggleWindow();
    }

    public getPreviewImg(imageUrl: string) {
        var imgName = imageUrl.split('/').pop();
        var newImgName = `Preview_${imgName}`;
        return imageUrl.replace(imgName, newImgName);
    }

    ngOnDestroy(): void {
        this.destroy$.next(true);
        this.destroy$.unsubscribe();
    }

    public openOriginImage(imageUrl: string) {
        window.open(imageUrl, '_blank');
    }

    public openNovaPoshtaTrackingPage(trackingNumber: string) {
        let url = `https://novaposhta.ua/ru/tracking/?cargo_number=${trackingNumber}&newtracking=1`;
        window.open(url, "_blank");
    }
}