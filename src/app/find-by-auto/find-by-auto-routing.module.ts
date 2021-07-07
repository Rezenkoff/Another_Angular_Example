import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FindByAutoComponent } from './find-by-auto.component';

const searchRoutes: Routes = [
    { path: '', component: FindByAutoComponent, data: { identificator: 499100011, type:1 } }
];
@NgModule({
    imports: [
        RouterModule.forChild(searchRoutes)
    ],
    exports: [
        RouterModule
    ]
})
export class FindByAutoRoutingModule {
}