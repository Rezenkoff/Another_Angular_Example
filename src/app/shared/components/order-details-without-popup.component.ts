import { Component, Input, Inject, EventEmitter, Output, ViewChild, PLATFORM_ID, OnInit } from '@angular/core';
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
import { ActivatedRoute } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../../environments/environment';

@Component({
    selector: 'order-details-without-popup',
    templateUrl: './__mobile__/order-details-without-popup.component.html'
})
export class OrderDetailsWithoutPopupComponent extends BaseBlockComponent implements OnInit {
    @Input() order?: Order;
    @Output() afterPayment: EventEmitter<any> = new EventEmitter<any>();
    private rows: InvoiceRow[] = [];
    private total: string;
    private summa: number;
    public invoiceStatus: StatusInvoice[];
    private statusReserved: string = 'H';
    private statusExpected: string = 'P';
    private cartPayment: number = 4;
    private waitForPayment: number = 9;
    private destroy$: Subject<boolean> = new Subject<boolean>();
    public inTransitStatus: number = 4;
    public zoom: number = 16;
    public imgUrl: string = this.constants.G_MAPS.AUTODOC_MARKERS + "marker.png";
    @ViewChild('showpointonmappopup') _showPointOnMapComponent: ShowPointOnMapPopupComponent;
    public stoDeliveryId: number = 4;
    public isDataLoad: boolean = true;

    constructor(
        @Inject(APP_CONSTANTS)
        protected constants: IAppConstants,
        @Inject(PLATFORM_ID)
        private platformId: Object,
        private activatedRoute: ActivatedRoute,
        private _orderService: OrderService,
        private _liqpayService: LiqpayService,
        private _languageService: LanguageService) {
        super(constants);
    }

    ngOnInit() {
        let secret = this.activatedRoute.snapshot.params['link'];
        if (isPlatformBrowser(this.platformId))
            //change data type
            this._orderService.getOrderStatus(secret).subscribe((data: any) => {
                this.order = data;
                this.loadInvoices();
                this.getInvoiceStatus();
            });
    }

    public statusIsCanceled(): boolean {
        return this.order.statusId == 5 ? true : false;
    }

    public productUrl(TransEnding: string): string {
        return 'product/' + TransEnding;
    }

    private countSum() {
        let tempTotal = 0;
        this.rows.forEach(x => tempTotal += x.summa);
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
                this._liqpayService.onCallback.pipe(takeUntil(this.destroy$)).subscribe()

                this._liqpayService.onClose.pipe(takeUntil(this.destroy$)).subscribe(data => {
                    this.afterPayment.emit();
                    this.hideWindow();
                })

                this._liqpayService.onReady.pipe(takeUntil(this.destroy$)).subscribe();

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
            if (data.length > 0)
                this.invoiceStatus = data;
            this.isDataLoad = false;
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

        if (this.invoiceStatus.some(x => x.summ === 0 && x.status != this.statusExpected))
            return false;

        if (this.invoiceStatus.some(x => x.status == this.statusExpected)) {
            return true;
        }

        return this.order.orderSum.toFixed() === (this.invoiceStatus.map(x => x.summ).reduce((a, b) => a + b, 0)).toFixed();
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