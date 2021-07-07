/*MODULES*/
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SharedCommonModule } from '../shared/modules/shared-common.module';
import { SharedModule } from '../shared/modules/shared.module';
import { ProductRoutingModule } from './product-routing.module';
import { CommonModule } from '@angular/common';
import { NgxGalleryModule } from '@kolkov/ngx-gallery';
import { SharedShopingCartModule } from '../shared/modules/shared-shoping-cart.module';
import { StoreModule } from '@ngrx/store';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { ReviewsModule } from '../reviews/reviews.module';
import { DeferLoadModule } from '../defer-loader/defer-load.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatExpansionModule } from '@angular/material/expansion';

/*COMPONENTS*/
import { ProductComponent } from './components/product.component';
import { SeoCarouselComponent } from './components/seo-carousel.component';
import { ProductImageComponent } from './components/product-image.component';
import { ProductMainInfoComponent } from './components/product-main-info.component';
import { ApplyVehicleTabComponent } from './tabs/apply-vehicle-tab.component';
import { OeTabComponent } from './tabs/oe-tab.component';
import { AnalogTabComponent } from './tabs/analog-tab.component';
import { ApplicabilityItemComponent } from './tabs/applicability-item.component';
import { ProductQuickOrderComponent } from './components/product-quick-order.component';
import { ExpandComponent } from './tabs/expand.component';
import { ReviewsTabComponent } from './tabs/reviews-tab.component';

/*PIPES, SERVICES, DIRECTIVES*/
import { ScriptService } from '../lazyloading/script.service';
import { ProductService } from './product.service';
import { ScrollService } from '../services/scroll.service';
import { QuickOrderService } from './services/quickorder.service';
import { SeoCommonService } from '../services/seo-common.service';
import { PixelFacebookService } from '../services/pixel-facebook.service';
import { CategoryAutoTabComponent } from './tabs/category-auto-tab.component';

@NgModule({
    imports: [
        CommonModule,
        SharedCommonModule,
        SharedModule,
        FormsModule,
        ProductRoutingModule,
        NgxGalleryModule,
        StoreModule,
        SharedShopingCartModule,
        CarouselModule,
        ReviewsModule,
        DeferLoadModule,
        MatProgressSpinnerModule,
        MatExpansionModule
    ],
    declarations: [
        ProductComponent,
        SeoCarouselComponent,
        ProductImageComponent,
        ProductQuickOrderComponent,
        ExpandComponent,
        ProductMainInfoComponent,
        ApplyVehicleTabComponent,
        ReviewsTabComponent,
        OeTabComponent,
        AnalogTabComponent,
        CategoryAutoTabComponent,
        ApplicabilityItemComponent,
    ],
    entryComponents: [
        ApplyVehicleTabComponent,        
        OeTabComponent,        
        AnalogTabComponent,
        CategoryAutoTabComponent
    ],
    providers: [
        ProductService,
        ScriptService,
        ScrollService,
        SeoCommonService,
        PixelFacebookService,
        QuickOrderService,
    ]
})
export class ProductModule {
}

