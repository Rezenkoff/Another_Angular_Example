/*MODULES*/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { StoreModule } from '@ngrx/store';
import { filtersReducer } from '../../filters/reducers';
import { EffectsModule } from '@ngrx/effects';
import { FiltersEffects } from '../../filters/effects/filters.effects';

/*COMPONENTS*/
import { FilterDropdownComponent } from '../../filters/components/filter-dropdown.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        StoreModule.forFeature('filters', filtersReducer),
        EffectsModule.forFeature([FiltersEffects]),

    ],
    declarations: [FilterDropdownComponent],
    exports: [FilterDropdownComponent]
})

export class FiltersSharedModule { }