import { Routes, RouterModule } from '@angular/router';
import { RefundStepComponent } from './components/refund-step.component';
import { NgModule } from '@angular/core';
import { RefundStepMainComponent } from '../refund-step/components/refund-step-main.component';

const chaildItem: Routes = [
    { path: 'refund-step', component: RefundStepComponent },
    { path: '', redirectTo: 'refund-step', pathMatch: 'full' }
]

const refundStepRoutes: Routes = [
    { path: '', component: RefundStepMainComponent, children: chaildItem }
]

@NgModule({
    imports: [RouterModule.forChild(refundStepRoutes)],
    exports: [RouterModule]
})

export class RefundStepRoutingModule { }