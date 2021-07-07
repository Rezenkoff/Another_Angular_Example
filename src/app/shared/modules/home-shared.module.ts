/*MODULES*/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '../../translate/translate.module';

/*COMPONENTS*/
import { UserCarsListComponent } from '../components/home/user-cars-list.component';
import { VinSearchInputComponent } from '../components/home/vin-search-input.component';

/*PIPES, SERVICES, DIRECTIVES*/
import { VehicleHttpService } from '../../vehicle/services/vehicle-http.service';


@NgModule({
    imports: [
        CommonModule,
        TranslateModule,
        FormsModule,
    ],
    declarations: [
        UserCarsListComponent,
        VinSearchInputComponent,
    ],
    exports: [
        UserCarsListComponent,
        VinSearchInputComponent,
    ],
    providers: [
        VehicleHttpService,
    ],
})
export class HomeSharedModule {

}