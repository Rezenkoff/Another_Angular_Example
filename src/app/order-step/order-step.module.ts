import { NgModule } from '@angular/core';
import { OrderStepRoutingModule } from './order-step-routing.module';
import { CommonModule } from '@angular/common';
import { SharedCommonModule } from '../shared/modules/shared-common.module';
import { SharedModule } from '../shared/modules/shared.module';
import { AuthModule } from '../auth/auth.module';
import { GoogleMapsModule } from '../google-maps/google-maps.module';
import { LocationModule } from '../location/location.module';

import { OrderStepService } from './order-step.service';
import { OrderOfferService } from './order-offer.service';
import { VinSearchService } from '../services/vinsearch.service';
import { UserService } from '../services/user.service';
import { GoogleMapsService } from '../google-maps/google-maps.service';
import { OrderService } from '../services/order.service';
import { LastInfoService } from './last-info.service';
import { OrderStepComponent } from './components/order-step.component';
import { OrderStepComponent1 } from './components/order-step1.component';
import { OrderStepComponent2 } from './components/order-step2.component';
import { OrderStepComponent5 } from './components/order-step5.component';
import { FindByVinStepComponent } from './components/find-by-vin-step.component';
import { OrderMainComponent } from './components/order-main.component';
import { SuccessComponent } from './components/success.component';
import { SelectByParamsModalComponent } from './components/select-by-params-modal.component';
import { PaymentModule } from '../payment/payment.module';
import { CarSelectPanelModule } from '../car-select-panel/car-select-panel.module';
import { RefVinSearchComponent } from './components/ref-vinsearch.component';
import { VinSearchHelpCallbackComponent } from '../shared/components/search-help-callback/vinsearch-help-callback.component';

@NgModule({
    imports: [
        GoogleMapsModule,
        CommonModule, 
        SharedCommonModule, 
        SharedModule, 
        OrderStepRoutingModule,
        AuthModule,
        LocationModule, 
        PaymentModule, 
        CarSelectPanelModule
        ],
    declarations: [
        OrderMainComponent,
        OrderStepComponent,
        OrderStepComponent1,
        OrderStepComponent2,
        OrderStepComponent5,
        FindByVinStepComponent,
        SuccessComponent,
        SelectByParamsModalComponent,
        RefVinSearchComponent,
        VinSearchHelpCallbackComponent,
    ],
    entryComponents: [
        OrderStepComponent1,
        OrderStepComponent2,
        OrderStepComponent5,
        FindByVinStepComponent,
        SelectByParamsModalComponent,
    ],
    providers: [
        OrderStepService,
        OrderService,
        OrderOfferService,
        VinSearchService,
        UserService,
        LastInfoService,
        GoogleMapsService
    ],
    exports: []
})
export class OrderStepModule {

}

