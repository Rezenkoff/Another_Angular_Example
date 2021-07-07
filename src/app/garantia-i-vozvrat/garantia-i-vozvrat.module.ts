/*MODULES*/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '../translate/translate.module';
import { GarantiaIVozvratRoutingModule } from './garantia-i-vozvrat-routing.module';

/*COMPONENTS*/
import { GarantiaIVozvratComponent } from './components/garantia-i-vozvrat.component';
import { ScrollService } from '../services/scroll.service';

/*PIPES, SERVICES, DIRECTIVES*/

@NgModule({
    imports: [
        CommonModule,
        TranslateModule,
        GarantiaIVozvratRoutingModule,
    ],
    declarations: [
        GarantiaIVozvratComponent,
    ],
    entryComponents: [
        GarantiaIVozvratComponent,
    ],
    exports: [],
    providers: [
        ScrollService,
    ]
})
export class GarantiaIVozvratModule {

}