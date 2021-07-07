import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BrandsCatalogSubcategoriesComponent  } from './components/brands-catalog-subcategories.component';
import { BrandsCatalogMainComponent,  } from './components/brands-catalog-main.component';
import { CatalogBreadcrumbsResolver } from '../app-routing/catalog-breadcrumbs.resolver';

const routes: Routes = [
    {
        path: ':brand',
        component: BrandsCatalogSubcategoriesComponent, data: { breadcrumbs: CatalogBreadcrumbsResolver }
    },

    {
        path: '',
        component: BrandsCatalogMainComponent, data: { breadcrumbs: CatalogBreadcrumbsResolver }
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
export class BrandsCatalogRoutingModule { }