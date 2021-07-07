import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductComponent } from './components/product.component';
import { ProductBreadcrumbsResolver } from '../app-routing/product-breadcrumb.resolver';

const productRoutes: Routes = [
    {
        path: '', component: ProductComponent, data: { breadcrumbs: ProductBreadcrumbsResolver }
    }
];
@NgModule({
    imports: [
        RouterModule.forChild(productRoutes)
    ],
    exports: [
        RouterModule
    ]
})
export class ProductRoutingModule {
}