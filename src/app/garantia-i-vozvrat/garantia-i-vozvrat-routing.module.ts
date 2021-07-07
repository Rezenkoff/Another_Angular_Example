import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GarantiaIVozvratComponent } from './components/garantia-i-vozvrat.component';

const routes: Routes = [
    { path: '', component: GarantiaIVozvratComponent, data: { identificator: 499100004, type:1 } }
];
@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [
        RouterModule
    ]
})
export class GarantiaIVozvratRoutingModule {
}