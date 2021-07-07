import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CatalogMainComponent } from './components/catalog-main.component';
import { CatalogBreadcrumbsResolver } from '../app-routing/catalog-breadcrumbs.resolver';
import { CatalogBannerCategory } from './components/catalog-banner-category.component';

const routes: Routes = [
    {
        path: '', component: CatalogMainComponent, data: { breadcrumbs: CatalogBreadcrumbsResolver }
    },
    { path: 'banner', component: CatalogBannerCategory }
];
@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [
        RouterModule
    ]
})
export class CatalogRoutingModule { }