import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/modules/shared.module';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { RouterModule } from '@angular/router';
import { CarSelectPanelService } from './services/car-select-panel.service';
import { carSelectPanelReducer } from './reducers';
import { EffectsModule } from '@ngrx/effects';
import { CarSelectPanelEffects } from './effects/car-select-panel.effects';
import { FiltersSharedModule } from '../shared/modules/filters.shared.module';
import { CarSelectPanelCommonComponent } from './components/car-select-panel.component';
import { CarSelectPanelHomeComponent } from './components/car-select-panel.home.component';
import { PolisService } from '../polis/polis.service';
import { CarSelectPanelSliderComponent } from './components/car-select-panel-slider.component';
import { CarSelectPanelGarageComponent } from './components/car-select-panel-garage.component';

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        FormsModule,
        RouterModule,
        StoreModule.forFeature('car-filter-panel', carSelectPanelReducer),
        EffectsModule.forFeature([CarSelectPanelEffects]),
        FiltersSharedModule       
    ],
    declarations: [
        CarSelectPanelCommonComponent,
        CarSelectPanelHomeComponent,
        CarSelectPanelSliderComponent
    ],
    exports: [
        CarSelectPanelCommonComponent,
        CarSelectPanelHomeComponent,
        CarSelectPanelSliderComponent
    ],
    providers: [CarSelectPanelService, PolisService]
})

export class CarSelectPanelModule {
}