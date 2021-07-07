import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { PaymentMethod } from '../../payment/models/payment-method.model';
import { Observable, Subject } from 'rxjs';
import { LanguageService } from '../../services/language.service';
import { PaymentService } from '../../payment/payment.service';
import { takeUntil, distinctUntilChanged } from 'rxjs/operators';
import * as defaultPrefs from '../../config/default-user-preferences';

@Component({
    selector: 'payment-order',
    templateUrl: './__mobile__/payment-order.component.html'
})
export class PaymentOrderComponent implements OnDestroy, OnInit {

    @Input() public initialPaymentId: number = defaultPrefs.defaultPaymentMethodId;
    @Input() public paymentId$: Observable<number>;
    @Output() public paymentChanged: EventEmitter<number> = new EventEmitter<number>();

    private paymentId: number;
    public selectedPayment: PaymentMethod;
    public paymentList: PaymentMethod[] = [];
    private _destroy$: Subject<boolean> = new Subject<boolean>();

    constructor(
        private _languageService: LanguageService,
        private _paymentService: PaymentService
    ) { }

    public selectPayment() {
        this.paymentChanged.emit(this.selectedPayment.id);
    }

    ngOnInit(): void {
        this.paymentId = this.initialPaymentId;
        this.loadPaymentOptions();

        this._languageService.getLanguageChangeEmitter()
            .pipe(takeUntil(this._destroy$))
            .subscribe(() => this.loadPaymentOptions());

        this.paymentId$.pipe(takeUntil(this._destroy$), distinctUntilChanged()).subscribe(
            paymentId => {
                paymentId = paymentId || defaultPrefs.defaultPaymentMethodId;
                if (this.paymentId == paymentId) {
                    return;
                }
                this.paymentId = paymentId;
                this.setPaymentMethod();
            });
    }

    private loadPaymentOptions(): void {
        let languageId = this._languageService.getSelectedLanguage().id;
        this._paymentService.getPaymentMethods(languageId).subscribe(
            payments => {
                this.paymentList = payments;
                this.setPaymentMethod();
            });
    }

    private setPaymentMethod() {
        if (!this.paymentList.length) {
            return;
        }
        let selected = this.paymentList.find(p => p.id == this.paymentId);
        this.selectedPayment = (selected) ? selected : this.paymentList[0];
        this.selectPayment();
    }

    ngOnDestroy(): void {
        this._destroy$.next(true);
        this._destroy$.unsubscribe();
    }
}
