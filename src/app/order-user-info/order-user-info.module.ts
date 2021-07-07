/*MODULES*/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { SharedCommonModule } from '../shared/modules/shared-common.module';
import { SharedModule } from '../shared/modules/shared.module';
import { SharedShopingCartModule } from '../shared/modules/shared-shoping-cart.module';
import { LocationModule } from '../location/location.module';
import { AgmCoreModule } from '@agm/core';
import { AgmMarkerClustererModule } from '@agm/markerclusterer';
import { NgxMaskModule, IConfig } from 'ngx-mask'

/*COMPONENTS*/
import { CartAuthorizationComponent } from './components/cart-authorization.component';
import { OrderUserInfoComponent } from './components/order-user-info.component';
import { MainUserInfoComponent } from './components/main-user-info.component';
import { DeliveryPointsSelectComponent } from './components/delivery-points-select.component';
import { DeliverySettingsComponent } from './components/delivery-settings.component';
import { DeliveryPointsListComponent } from './components/delivery-points-list.component';
import { DeliveryTypesComponent } from './components/delivery-types.component';
import { PaymentOrderComponent } from './components/payment-order.component';
import { AreaSelectComponent } from './components/area-select.component';
import { CourierDeliverySelectComponent } from './components/courier-delivery-select.component';
import { ProductInstallingComponent } from './components/product-installing.component';
import { DeliveryPointsMapComponent } from './components/delivery-points-map.component';
import { PointsSidebarComponent } from './components/points-sidebar.component';
import { DeliveryMethodLogoComponent } from './components/delivery-methods.logo.component';

/*PIPES, SERVICES, DIRECTIVES*/
import { DeliveryMethodsService } from './services/delivery-method.service';
import { CartAuthorizationService } from './services/cart-authorization.service';
import { GoogleGeocodingService } from '../services/google-geocoding.service';
import { DeliveryPointsService } from '../delivery/points/delivery-points.service';
import { reducers } from './reducer';
import { UserService } from '../services/user.service';

export const options: Partial<IConfig> | (() => Partial<IConfig>) = {};

@NgModule({
    imports: [
        CommonModule,
        SharedCommonModule,
        SharedModule,
        SharedShopingCartModule,
        StoreModule.forFeature('order-user-info', reducers),
        LocationModule,
        AgmCoreModule,
        AgmMarkerClustererModule,
        NgxMaskModule.forRoot(options),
    ],
    declarations: [
        CartAuthorizationComponent,
        OrderUserInfoComponent,
        MainUserInfoComponent,
        DeliveryPointsSelectComponent,
        DeliverySettingsComponent,
        DeliveryPointsListComponent,
        DeliveryTypesComponent,
        PaymentOrderComponent,
        AreaSelectComponent,
        CourierDeliverySelectComponent,
        DeliveryPointsMapComponent,
        PointsSidebarComponent,
        DeliveryMethodLogoComponent,
        ProductInstallingComponent,
    ],
    exports: [
        CartAuthorizationComponent,
        OrderUserInfoComponent,
        MainUserInfoComponent,
        DeliveryPointsSelectComponent,
        DeliverySettingsComponent,
        DeliveryPointsListComponent,
        DeliveryTypesComponent,
        PaymentOrderComponent,
        AreaSelectComponent,
        CourierDeliverySelectComponent,
        ProductInstallingComponent,
    ],
    providers: [
        DeliveryMethodsService,
        UserService,
        CartAuthorizationService,
        GoogleGeocodingService,
        DeliveryPointsService,
    ],
})
export class OrderUserInfoModule { 

}