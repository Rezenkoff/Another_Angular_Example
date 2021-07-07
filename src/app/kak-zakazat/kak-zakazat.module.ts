/*MODULES*/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '../translate/translate.module';
import { KakZakazatRoutingModule } from './kak-zakazat-routing.module';

/*COMPONENTS*/
import { KakZakazatComponent } from './components/kak-zakazat.component';

/*PIPES, SERVICES, DIRECTIVES*/

@NgModule({
    imports: [
        CommonModule,
        TranslateModule,
        KakZakazatRoutingModule,
    ],
    declarations: [
        KakZakazatComponent,
    ],
    entryComponents: [
        KakZakazatComponent,
    ],
    exports: [],
    providers: []
})
export class KakZakazatModule {

}