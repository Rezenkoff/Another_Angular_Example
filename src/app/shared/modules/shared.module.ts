/*MODULES*/
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '../../translate/translate.module';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatInputModule } from '@angular/material/input'; 
import { LiqPayModule } from '../../payment/liqpay/liqpay.module';
import { SharedCommonModule } from './shared-common.module';
import { DragScrollModule } from '../../drag-scroll/ngx-drag-scroll.module';
import { FiltersSharedModule } from './filters.shared.module';
import { SharedShopingCartModule } from './shared-shoping-cart.module';

/*COMPONENTS*/
import { SeoPagingComponent } from '../components/seo-paging.component';
import { DropDownComponent } from '../components/drop-down.component';
import { QuickOrderComponent } from '../components/quick-order.component';
import { SearchParametersPanelComponent } from '../components/search-parameters-panel/search-parameters-panel.component';
import { ContractComponent } from '../components/contract.component';
import { DeliveryPointComponent } from '../components/delivery-point.component';
import { LoginPopupComponent } from '../components/login-popup.component';

/*SERVICES, PIPES*/
import { DocFilterPipe } from '../../shared/pipes/doc-type.pipe';
import { SortByKey } from '../../shared/pipes/sort-by-key.pipe';
import { StepHostDirective } from '../../shared/directives/step-host.directive';
import { VehicleTypeSwitchComponent } from '../components/vehicle-type-switch/vehicle-type-switch.component';
import { CommentComponent } from '../../order-step/components/comment.component';
import { CitySelectComponent } from '../../sto/city-select.component';
import { SettlementComponent } from '../../location';
import { WheelsTabComponent } from '../components/wheels-tab.component';
import { PopularTiresList } from '../components/popular-products/popular-tires/components/popular-tires.component';
import { PopularWheelsList } from '../components/popular-products/popular-wheels/components/popular-wheels.component';
import { PopularBrandsTiresList } from '../components/popular-products/popular-brands-tires/components/popular-brands-tires.component';
import { CarSelectPanelTiresComponent } from '../../car-select-panel/components/car-select-panel-tires.component';
import { CarSelectTiresComponent } from '../../promo-slider/components/car-select-tires.component';
import { TiresTabComponent } from '../../promo-slider/components/tires-tab.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        SharedCommonModule,
        LiqPayModule,
        TranslateModule,
        DragScrollModule,
        SharedShopingCartModule,
        FiltersSharedModule
    ],
    declarations: [
        DocFilterPipe,
        SortByKey,
        StepHostDirective,
        SeoPagingComponent,
        DeliveryPointComponent,
        ContractComponent,       
        QuickOrderComponent,
        SearchParametersPanelComponent, 
        VehicleTypeSwitchComponent,
        DropDownComponent,
        LoginPopupComponent,
        CommentComponent,
        CitySelectComponent,
        SettlementComponent,
        WheelsTabComponent,
        PopularTiresList,
        PopularBrandsTiresList,
        PopularWheelsList,
        TiresTabComponent,
        CarSelectTiresComponent,
        CarSelectPanelTiresComponent
    ],
    exports: [
        DocFilterPipe,
        SortByKey,
        StepHostDirective,
        LiqPayModule,
        SharedCommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatTooltipModule,
        MatInputModule,
        MatDialogModule,
        SeoPagingComponent,
        DeliveryPointComponent,
        TranslateModule,
        ContractComponent,
        QuickOrderComponent,
        SearchParametersPanelComponent,
        VehicleTypeSwitchComponent,
        LoginPopupComponent,
        CommentComponent,
        CitySelectComponent,
        SettlementComponent,
        WheelsTabComponent, 
        PopularTiresList,
        PopularBrandsTiresList,
        PopularWheelsList,
        TiresTabComponent,
        CarSelectTiresComponent,
        CarSelectPanelTiresComponent
    ],
    entryComponents: [
        LoginPopupComponent
    ],
})
export class SharedModule {
    
}