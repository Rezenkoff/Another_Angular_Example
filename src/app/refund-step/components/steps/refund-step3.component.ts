import { Component, Output, EventEmitter, ViewChild } from '@angular/core';
import { IRefundStep } from './refund-step.interface';
import { BaseLoader } from '../../../shared/abstraction/loaderbase.component';
import { RefundStepService } from '../../refund-step.service';

@Component({
    templateUrl: './__mobile__/refund-step3.component.html'
})

export class RefundStep3Component extends BaseLoader implements IRefundStep {

    public isValid: boolean = false;
    public numberPattern: string = '[0-9]';
    public ipnLength: number = 10;
    public ipnPattern: string = `${this.numberPattern}{${this.ipnLength}}`;
    public cartNumberLength: number = 16;
    public cardPattern: string = `${this.numberPattern}{${this.cartNumberLength}}`;
    public mfoLength: number = 6;
    public mfoPattern = `${this.numberPattern}{${this.mfoLength}}`;
    @Output() change: EventEmitter<any> = new EventEmitter<any>();
    public selectedBank: string;
    public emptyNumber: number = 0;
    @ViewChild('card') card;
    @ViewChild('mfo') mfo;

    constructor(public _refundStepService: RefundStepService) {
        super();

        this.selectedBank = this._refundStepService.paymentInfo.isPrivatBank ? 'privatbank' : 'anotherbank';
    }

    ngOnInit() {
        this.onSelectedBank();
    }

    public ngAfterViewInit(): void { }

    public onSelectedBank() {
        if (this.selectedBank == 'privatbank') {
            this._refundStepService.paymentInfo.isPrivatBank = true;
        }
        else {
            this._refundStepService.paymentInfo.isPrivatBank = false;
        }
        this.Validate();
    }

    public Validate(): void {
        this.isValid = this._refundStepService.paymentInfo.CardNumber > this.emptyNumber && !this.card.invalid
            && (this._refundStepService.paymentInfo.isPrivatBank || this._refundStepService.paymentInfo.MFO > this.emptyNumber && this._refundStepService.paymentInfo.MFO.toString().length == this.mfoLength
                && this._refundStepService.paymentInfo.BankName.length > this.emptyNumber
                && this._refundStepService.paymentInfo.IPN > this.emptyNumber);
        this.change.emit(this.isValid);
    }

    public CheckNumbers(event) {
        const charCode = (event.which) ? event.which : event.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            return false;
        }
        return true;
    }
}