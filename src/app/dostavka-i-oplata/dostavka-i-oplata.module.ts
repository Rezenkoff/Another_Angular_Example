/*MODULES*/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '../translate/translate.module';
import { DostavkaIOplataComponent } from './components/dostavka-i-oplata.component';
import { DostavkaIOplataRoutingModule } from './dostavka-i-oplata-routing.module';

/*COMPONENTS*/

/*PIPES, SERVICES, DIRECTIVES*/

@NgModule({
    imports: [
        CommonModule,
        TranslateModule,
        DostavkaIOplataRoutingModule,
    ],
    declarations: [
        DostavkaIOplataComponent,
    ],
    entryComponents: [
        DostavkaIOplataComponent,
    ],
    exports: [],
    providers: []
})
export class DostavkaIOplataModule {
}