/*MODULES*/
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { SharedCommonModule } from '../shared/modules/shared-common.module';
import { SharedModule } from '../shared/modules/shared.module';
import { SharedShopingCartModule } from '../shared/modules/shared-shoping-cart.module';
import { OrderCheckoutRoutingModule } from './shoping-cart-routing.module';
import { LocationModule } from '../location/location.module';
import { PaymentModule } from '../payment/payment.module';
import { OrderUserInfoModule } from '../order-user-info/order-user-info.module';

/*COMPONENTS*/
import { OrderCheckoutComponent } from './components/order-checkout.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { OrderCheckoutSuccessComponent } from './components/order-checkout-success.component';
import { ConfirmOrderPopup } from './components/confirm-order-popup.component';
import { CheckAvailability } from './components/check-vailability.component';
import { CheckoutHoverComponent } from './components/checkout-hover.component';
import { OrderCheckoutSuspendedComponent } from './components/order-checkout-suspended.component';
import { QuickOrderFormComponent } from './components/checkout/quick-order-form.component';
import { ExtendedOrderFormComponent } from './components/checkout/extended-order-form.component';
import { ContactInfoStepComponent } from './components/checkout/contact-info-step.component';
import { OrderedProductsComponent } from './components/checkout/ordered-products.component';
import { DeliveryInfoStepComponent } from './components/checkout/delivery-info-step.component';
import { OrderSummaryComponent } from './components/checkout/order-summary.component';
import { SelectedDeliveryPointComponent } from './components/checkout/selected-delivery-point.component';
import { DiscountComponent } from './components/checkout/discount.component';
import { OrderCheckoutWaitingComponent } from './components/order-checkout-waiting.component';

// /*PIPES, SERVICES, DIRECTIVES*/
import { OrderOfferService } from '../order-step/order-offer.service';
import { OrderStepService } from '../order-step/order-step.service';
import { ShopingCartEffects } from './effects/shoping-cart.effect';
import { reducers } from './reducers';
import { UserService } from '../services/user.service';
import { ScrollService } from '../services/scroll.service';
import { DiscountService } from './services/discount.service';
import { ProfileService } from '../cabinet/child/profile/profile.service';
import { UserStorageService } from '../services/user-storage.service';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        SharedCommonModule,
        SharedModule,
        SharedShopingCartModule,
        OrderCheckoutRoutingModule,
        StoreModule.forFeature('shoping-cart', reducers),
        EffectsModule.forFeature([ShopingCartEffects]),
        LocationModule,
        PaymentModule.forRoot(),
        OrderUserInfoModule
    ],
    declarations: [
        OrderCheckoutComponent,
        OrderCheckoutSuccessComponent,
        ConfirmOrderPopup,
        CheckAvailability,
        CheckoutHoverComponent,
        CheckoutComponent,
        OrderCheckoutSuspendedComponent,
        QuickOrderFormComponent,
        ExtendedOrderFormComponent,
        ContactInfoStepComponent,
        OrderedProductsComponent,
        DeliveryInfoStepComponent,
        OrderSummaryComponent,
        DeliveryInfoStepComponent,
        SelectedDeliveryPointComponent,
        DiscountComponent,
        OrderCheckoutWaitingComponent

    ],
    providers: [
        OrderOfferService,
        OrderStepService,
        UserService,
        ScrollService,
        DiscountService,
        ProfileService,
        UserStorageService
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    entryComponents: [ConfirmOrderPopup, CheckAvailability]
})
export class ShopingCartModule { }