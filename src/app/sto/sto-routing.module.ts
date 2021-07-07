import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StoComponent } from './sto.component';

const searchRoutes: Routes = [
    { path: '', component: StoComponent, data: {  identificator:499100007 } }
];
@NgModule({
    imports: [
        RouterModule.forChild(searchRoutes)
    ],
    exports: [
        RouterModule
    ]
})
export class StoRoutingModule {
}