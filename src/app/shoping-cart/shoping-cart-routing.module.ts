import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrderCheckoutComponent } from './components/order-checkout.component';
import { OrderCheckoutSuccessComponent } from './components/order-checkout-success.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { OrderCheckoutSuspendedComponent } from './components/order-checkout-suspended.component';
import { OrderCheckoutWaitingComponent } from './components/order-checkout-waiting.component';


const routesShopingCartChildren = [
    { path: 'order-checkout-success/:orderId/:orderSecretLinkCode', component: OrderCheckoutSuccessComponent },
    { path: 'order-checkout-success/:orderId/:orderSecretLinkCode/:email', component: OrderCheckoutSuccessComponent },
    { path: 'order-checkout-suspended/:orderId/:orderSecretLinkCode', component: OrderCheckoutSuspendedComponent },
    { path: 'order-checkout-waiting', component: OrderCheckoutWaitingComponent },
    { path: 'checkout-in-process', component: CheckoutComponent },
    { path: '', redirectTo: 'checkout-in-process', pathMatch: 'full' }
];

 const routesShopingCart: Routes = [
    { path: '', component: OrderCheckoutComponent, data: { identificator: 499100009, type: 1 }, children: routesShopingCartChildren }    
];

@NgModule({
    imports: [
        RouterModule.forChild(routesShopingCart)
    ],
    exports: [
        RouterModule
    ]
})
export class OrderCheckoutRoutingModule { }