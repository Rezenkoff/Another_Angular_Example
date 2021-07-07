import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CarsCatalogMainComponent, CarsCatalogSubcategoriesComponent } from './components';
import { CatalogBreadcrumbsResolver } from '../app-routing/catalog-breadcrumbs.resolver';

const routes: Routes = [
    {
        path: ':carMark',
        component: CarsCatalogSubcategoriesComponent, data: { breadcrumbs: CatalogBreadcrumbsResolver }
    },
    {
        path: ':carMark/:carSerie',
        component: CarsCatalogSubcategoriesComponent, data: { breadcrumbs: CatalogBreadcrumbsResolver }
    },
    {
        path: '',
        component: CarsCatalogMainComponent, data: { breadcrumbs: CatalogBreadcrumbsResolver }        
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [
        RouterModule
    ]
})
export class CarsCatalogRoutingModule { }