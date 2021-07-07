/*MODULES*/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '../translate/translate.module';

/*COMPONENTS*/
import { PravilaPolzovaniaComponent } from './components/pravila-polzovania.component';
import { PravilaPolzovaniaRoutingModule } from './pravila-polzovania-routing.module';

/*PIPES, SERVICES, DIRECTIVES*/

@NgModule({
    imports: [
        CommonModule,
        TranslateModule,
        PravilaPolzovaniaRoutingModule,
    ],
    declarations: [
        PravilaPolzovaniaComponent,
    ],
    entryComponents: [
        PravilaPolzovaniaComponent,
    ],
    exports: [],
    providers: []
})
export class PravilaPolzovaniaModule {
}