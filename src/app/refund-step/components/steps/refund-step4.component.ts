import { Component, Output, EventEmitter } from '@angular/core';
import { IRefundStep } from './refund-step.interface';
import { RefundStepService } from '../../refund-step.service';
import { BaseLoader } from '../../../shared/abstraction/loaderbase.component';
import { RefundStepModel } from '../../models/refund-step.model';

@Component({
    templateUrl: './__mobile__/refund-step4.component.html'
})

export class RefundStep4Component extends BaseLoader implements IRefundStep {
    isValid: boolean = true;
    @Output() change: EventEmitter<any> = new EventEmitter<any>();
    public refundStepModel: RefundStepModel = new RefundStepModel();

    constructor(public _refundStepService: RefundStepService) {
        super();

        this.refundStepModel = _refundStepService.refundStepModel;
    }
}