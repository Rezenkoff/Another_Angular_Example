/*MODULES*/
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { SharedCommonModule } from './shared-common.module';

// /*COMPONENTS*/
import { GoogleAutocomplete } from '../components/google-autocomplete/google-autocomplete.component';
import { BasketComponent } from '../../shoping-cart/components/basket.component';
import { ProductPreviewComponent } from '../../shoping-cart/components/product-preview.component';
import { OrderPopupComponent } from '../../shoping-cart/components/order-popup.component';
import { TotalSumComponent } from '../components/shoping-cart/totalsum.component';
import { TotalSumOrderComponent } from '../components/shoping-cart/totalsum-order.component';
import { TotalItemsComponent } from '../components/shoping-cart/totalitems.component';
import { ProductPreviewListComponent } from '../../shoping-cart/components/product-preview-list.component';
import { NotifyWhenAvailableComponent } from '../../product/components/notify-when-available.component';

// /*PIPES, SERVICES*/
import { ShopingCartModelService } from '../../shoping-cart/services/shoping-cart-model.service';
import { GtagService } from '../../services/gtag.service';
import { CategoryInfoService } from '../../services/category-info.service';
import { ShopingCartEffects } from '../../shoping-cart/effects/shoping-cart.effect';
import { ShopingCartService } from '../../shoping-cart/services/shoping-cart.service';
import { ShopingCartOperationsService } from '../../shoping-cart/services/shoping-cart-operations.service';
import { ShopingCartLocalService } from '../../shoping-cart/services/shoping-cart-local.service';
import { reducers } from '../../shoping-cart/reducers';

@NgModule({
    imports: [
        CommonModule,
        SharedCommonModule,
        RouterModule,
        StoreModule.forFeature('shoping-cart', reducers),
        EffectsModule.forFeature([ShopingCartEffects]),
    ],
    exports: [
        BasketComponent,
        ProductPreviewComponent,
        ProductPreviewListComponent,
        GoogleAutocomplete,
        OrderPopupComponent,
        TotalSumComponent,
        TotalItemsComponent,
        TotalSumOrderComponent,
        NotifyWhenAvailableComponent
    ],
    declarations: [
        BasketComponent,
        ProductPreviewComponent,
        GoogleAutocomplete,
        ProductPreviewListComponent,
        OrderPopupComponent,
        TotalSumComponent,
        TotalItemsComponent,
        TotalSumOrderComponent,
        NotifyWhenAvailableComponent
    ],
    providers: [
        ShopingCartModelService,
        ShopingCartService, 
        ShopingCartOperationsService,
        ShopingCartLocalService, 
        GtagService, 
        CategoryInfoService
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]

})
export class SharedShopingCartModule { }