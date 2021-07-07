import { Component, Output, EventEmitter, Inject } from '@angular/core';
import { OrderService } from '../../../services/order.service';
import { SearchService } from '../../../services/search.service';
import { InvoiceRow } from '../../../models/invoice-row.model';
import { ActivatedRoute } from '@angular/router';
import { BaseLoader } from '../../../shared/abstraction/loaderbase.component';
import { RefundStepService } from '../../refund-step.service';
import { IRefundStep } from './refund-step.interface';
import { InvoiceRowRefund } from '../../models/invoice-row-refund.model';
import { APP_CONSTANTS, IAppConstants } from '../../../config';
import { RefundStepDataModel } from '../../models/refund-step-data.model';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/internal/operators/finalize';

var LRU = require("lru-cache");

@Component({
    templateUrl: './__mobile__/refund-step1.component.html'
})

export class RefundStep1Component extends BaseLoader implements IRefundStep {

    public rows: InvoiceRowRefund[] = [];
    isValid: boolean = false;
    @Output() change: EventEmitter<any> = new EventEmitter<any>();
    cache: any = null;
    public _refundStepServiceSubscribe: Subscription;
    public emptyOrder: boolean = false;

    constructor(@Inject(APP_CONSTANTS) private _constants: IAppConstants,
        private _orderService: OrderService,
        private activatedRoute: ActivatedRoute,
        private _refundStepService: RefundStepService,
        private _searchService: SearchService) {
        super();

        var options = {
            max: this._constants.CACHE.SIZE,
            maxAge: this._constants.CACHE.MAX_AGE
        };

        this.cache = new LRU(options);
        this.StartSpinning();
        this._refundStepServiceSubscribe = this._refundStepService.refundStepData
            .pipe(finalize(() => this.EndSpinning()))
            .subscribe((data: RefundStepDataModel) => {
                this.rows = data.orderRows;
                if (this.rows.length > 0) {
                    this.emptyOrder = false;                   
                }
                else
                {
                    this.emptyOrder = true;
                }                   
                    this.EndSpinning();
            });
    }

    ngOnInit() {
        this.Validate();
    }

    public ngAfterViewInit(): void {
        this._refundStepService.refundStepModel.OrderId = this.activatedRoute.snapshot.queryParams.id;
        this._refundStepService.getProductListByOrderId(this._refundStepService.refundStepModel.OrderId);
    }

    public changeSelected(row: InvoiceRow) {
        let elemIndex = this._refundStepService.invoiceRows.findIndex(item => item.artId == row.artId);
        if (elemIndex < 0)
            this._refundStepService.invoiceRows.push(row);
        else
            this._refundStepService.invoiceRows.splice(elemIndex, 1);

        this.Validate();
    }

    public checkItem(row: InvoiceRow): Boolean {
        this.Validate();

        if (this._refundStepService.invoiceRows.length > 0) {
            return this._refundStepService.invoiceRows.find(element => { return row.artId === element.artId }) ? true : false;
        }

        return false;
    }

    private Validate(): void {
        this.isValid = this._refundStepService.invoiceRows.length > 0;
        this.change.emit(this.isValid);
    }

    public increment(product: InvoiceRowRefund) {
        if (product.quantityRefund < product.quantity) {
            product.quantityRefund += product.incDecStep;
            this.recountSum(product);
        }
    }

    public decrement(product: InvoiceRowRefund) {
        if (product.quantityRefund > product.incDecStep) {
            product.quantityRefund -= product.incDecStep;
            this.recountSum(product);
        }
    }

    public isDisabled(product: InvoiceRowRefund): string {
        if (product.quantity == product.incDecStep)
            return 'disabled-button';

        return '';
    }

    ngOnDestroy() {
        this._refundStepServiceSubscribe.unsubscribe();
    }

    public recountSum(order: InvoiceRowRefund) {
        order.summa = order.quantityRefund * order.price;
        order.summa = parseFloat(order.summa.toFixed(2));
    }
}