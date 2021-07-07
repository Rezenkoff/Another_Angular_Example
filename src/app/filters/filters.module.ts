import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/modules/shared.module';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FiltersService } from './services/filters.service';
import { FiltersSharedModule } from '../shared/modules/filters.shared.module';
import { CarSelectPanelModule } from '../car-select-panel/car-select-panel.module';
import { GenericFilterComponent } from './components/generic-filter.component';
import { FiltersPanelComponent } from './components/filters-panel.component';    
import { FilterComboboxComponent } from './components/filter-combobox.component';
import { VehicleFilterComponent } from './components/user-vehicle-filter.component';
import { CarFilterPanelComponent } from './components/car-filter-panel.component';
import { SelectedFilterView } from './components/selected-filter-view.component';
import { CarFilterTiresComponent } from './components/car-filter-tires-panel.component';


@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        FormsModule,
        RouterModule,
        FiltersSharedModule,
        CarSelectPanelModule
    ],
    declarations: [
        GenericFilterComponent,
        FiltersPanelComponent,        
        FilterComboboxComponent,
        VehicleFilterComponent,
        CarFilterPanelComponent,
        CarFilterTiresComponent,
        SelectedFilterView
    ],    
    exports: [
        GenericFilterComponent,
        FiltersPanelComponent,        
        FilterComboboxComponent,
        VehicleFilterComponent,
        CarFilterPanelComponent,
        CarFilterTiresComponent,
        SelectedFilterView
    ],
    providers: [ FiltersService ]
})

export class FiltersModule {
}