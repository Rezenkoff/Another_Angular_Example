import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EffectsModule } from '@ngrx/effects';
import { PopularProductEffect } from './effects/popular-products.effect';
import { PopularProductService } from './service/popular-products.service';
import { PopularProduct } from './components/popular-products.component';
import { StoreModule } from '@ngrx/store';
import { reducer } from './reducers/popular-products.reducer';
import { RouterModule } from '@angular/router';
import { SharedCommonModule } from '../../modules/shared-common.module';
import { SharedShopingCartModule } from '../../modules/shared-shoping-cart.module';
import { DragScrollModule } from '../../../drag-scroll/ngx-drag-scroll.module';
import { DeferLoadModule } from '../../../defer-loader/defer-load.module';

@NgModule({
    imports: [
        StoreModule.forFeature('popular-product', reducer),
        EffectsModule.forFeature([PopularProductEffect]),
        CommonModule,
        RouterModule,
        SharedCommonModule,
        SharedShopingCartModule,
        DragScrollModule,
        DeferLoadModule
    ],
    declarations: [
        PopularProduct
    ],
    exports: [
        PopularProduct,
        RouterModule
    ],
    providers: [
        PopularProductService
    ],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA
    ]
})
export class PopularProductsModule { }