import { NgModule } from '@angular/core';
import { RefundStepMainComponent } from './components/refund-step-main.component';
import { RefundStepComponent } from './components/refund-step.component';
import { RefundStep1Component, RefundStep2Component, RefundStep3Component, RefundStep4Component } from './components/steps'
import { RefundStepRoutingModule } from './refund-step-routing.module';
import { SharedModule } from '../shared/modules/shared.module';
import { CommonModule } from '@angular/common';
import { RefundStepService } from './refund-step.service';
import { SharedCommonModule } from '../shared/modules/shared-common.module';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

@NgModule({
    imports: [
        RefundStepRoutingModule,
        SharedModule,
        CommonModule,
        SharedCommonModule,
        BsDatepickerModule.forRoot()
    ],
    declarations: [
        RefundStepMainComponent,
        RefundStepComponent,
        RefundStep1Component,
        RefundStep2Component,
        RefundStep3Component,
        RefundStep4Component],
    entryComponents: [
        RefundStep1Component,
        RefundStep2Component,
        RefundStep3Component,
        RefundStep4Component
    ],
    providers: [
        RefundStepService
    ]
})

export class RefundStepModule { }