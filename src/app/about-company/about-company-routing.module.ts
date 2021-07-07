import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutCompanyComponent } from './components/about-company.component';

const routes: Routes = [
    { path: '', component: AboutCompanyComponent, data: { identificator: 499100001, type:1 } }
];
@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [
        RouterModule
    ]
})
export class AboutCompanyRoutingModule {
}