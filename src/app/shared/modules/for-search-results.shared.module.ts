/*MODULES*/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedCommonModule } from './shared-common.module';
import { RouterModule } from '@angular/router';

/*COMPONENTS*/
import { SuitableVehiclesComponent } from '../components/suitable-vehicles/suitable-vehicles.component';

/*SERVICES*/
import { ScrollService } from '../../services/scroll.service';

@NgModule({
    imports: [SharedCommonModule, CommonModule, RouterModule],
    declarations: [SuitableVehiclesComponent],
    exports: [SuitableVehiclesComponent],
    providers: [ScrollService]
})

export class ForSearchResultsSharedModule { }