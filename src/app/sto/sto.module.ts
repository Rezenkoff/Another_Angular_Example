import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { StoRoutingModule } from './sto-routing.module';
import { SharedCommonModule } from '../shared/modules/shared-common.module';
import { SharedModule } from '../shared/modules/shared.module';
import { CommonModule } from '@angular/common';
import { StoComponent } from './sto.component';
import { StoService } from './sto.service';
import { LocationService } from '../location/location.service';
import { LocationModule } from '../location/location.module';
import { DeliveryPointModule } from '../delivery/points/delivery-point.module';
import { PaymentService } from '../payment/payment.service';

@NgModule({
    imports: [
        CommonModule,
        SharedCommonModule,
        SharedModule,
        StoRoutingModule,
        FormsModule,
        LocationModule,
        DeliveryPointModule
    ],
    declarations: [
        StoComponent,
    ],
    entryComponents: [],
    providers: [
        StoService,
        LocationService,
        PaymentService
    ]
})
export class StoModule {

}