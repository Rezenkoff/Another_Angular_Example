import { NgModule } from '@angular/core';
import { DeferLoadDirective } from './directives/defer-load.directive';
import { DdeferLoadProductsDirective } from './directives/defer-load-products.directive';

@NgModule({
    declarations: [DeferLoadDirective, DdeferLoadProductsDirective],
    exports: [DeferLoadDirective, DdeferLoadProductsDirective]
})

export class DeferLoadModule {

}