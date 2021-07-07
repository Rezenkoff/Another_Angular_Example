import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DetailGroupsRoutingModule } from './detail-groups-routing.module';
import { SharedCommonModule } from '../shared/modules/shared-common.module';

import { SharedModule } from '../shared/modules/shared.module';
import { CommonModule } from '@angular/common';
import { LaximoService } from '../services/laximo.service';
import { DetailGroupsComponent } from './detail-groups.component';
import { DetailsNavigationComponent } from './child/components/detail-navigation.component';
import { DetailInfoComponent } from './child/components/detail-info.component';
import { MappedImageComponent } from './child/components/mapped-image.component';
import { DetailInfoTableComponent } from './child/components/detail-info-table.component';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { SelectMeComponent } from './child/components/select-me.component';
import { SearchSectionComponent } from './child/components/search-section.component';

@NgModule({
    imports: [CommonModule, SharedCommonModule, SharedModule, FormsModule, DetailGroupsRoutingModule, AccordionModule ],
    declarations: [
        DetailGroupsComponent, 
        DetailsNavigationComponent, 
        DetailInfoComponent, 
        MappedImageComponent, 
        DetailInfoTableComponent,
        SelectMeComponent, 
        SearchSectionComponent
    ],
    entryComponents: [],
    providers: [LaximoService],
    exports: [
        SelectMeComponent, 
        SearchSectionComponent
    ]
})
export class DetailGroupsModule {
}