/*MODULES*/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeSharedModule } from '../shared/modules/home-shared.module';
import { TranslateModule } from '../translate/translate.module';
import { CarSelectPanelModule } from '../car-select-panel/car-select-panel.module';
import { SharedCommonModule } from '../shared/modules/shared-common.module';

/*COMPONENTS*/
import { PromoSliderComponent } from './components/promo-slider.component';
import { SliderInfoBlockComponent } from './components/slider-info-block.component';
import { SliderMainBlockComponent } from './components/slider-main-block.component';
import { VinSearchTabComponent } from './components/vin-search-tab.component';
import { GarageTabComponent } from './components/garage-tab.component';
import { CarSelectTabComponent } from './components/car-select-tab.component';

/*PIPES, SERVICES, DIRECTIVES*/
import { PromoSliderService } from './promo-slider.service';
import { SharedModule } from '../shared/modules/shared.module';


@NgModule({
    imports: [
        CommonModule,
        TranslateModule,
        CarSelectPanelModule,
        HomeSharedModule,
        SharedCommonModule,
        SharedModule
    ],
    declarations: [
        PromoSliderComponent,
        SliderInfoBlockComponent,
        SliderMainBlockComponent,
        VinSearchTabComponent,
        GarageTabComponent,
        CarSelectTabComponent
        
    ],
    exports: [
        PromoSliderComponent
    ],
    providers: [
        PromoSliderService
    ],
})
export class PromoSliderModule 
{

}