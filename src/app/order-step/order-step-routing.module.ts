import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrderStepComponent } from './components/order-step.component';
import { OrderMainComponent } from './components/order-main.component';
import { SuccessComponent } from './components/success.component';
import { RefVinSearchComponent } from './components/ref-vinsearch.component';

const orderItems: Routes = [
    { path: 'order-step', component: OrderStepComponent, data: { identificator: 499100006, type: 1 } },
    { path: 'base', component: RefVinSearchComponent },
    { path: '', redirectTo: 'order-step', pathMatch: 'full' }
];

const orderStepRoutes: Routes = [
    { path: '', component: OrderMainComponent, children: orderItems },    
    { path: 'success/:orderId', component: SuccessComponent },
    { path: 'success/:orderId/:orderSecretLinkCode', component: SuccessComponent }
];
@NgModule({
    imports: [
        RouterModule.forChild(orderStepRoutes)
    ],
    exports: [
        RouterModule
    ]
})
export class OrderStepRoutingModule { }