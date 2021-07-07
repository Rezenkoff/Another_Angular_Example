import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetailGroupsComponent } from './detail-groups.component';

const searchRoutes: Routes = [
    { path: '', component: DetailGroupsComponent, data: { identificator: 499100012, type:1 } }
];
@NgModule({
    imports: [
        RouterModule.forChild(searchRoutes)
    ],
    exports: [
        RouterModule
    ]
})
export class DetailGroupsRoutingModule {
}