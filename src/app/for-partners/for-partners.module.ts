import { NgModule } from '@angular/core';
import { ForPartnersRoutingModule } from './for-partners-routing.module';
import { ForPartnersComponent } from './for-partners.component';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '../translate/translate.module';

@NgModule({
    imports: [
        CommonModule,
        TranslateModule,
        ForPartnersRoutingModule],
    declarations: [ForPartnersComponent],
    entryComponents: [ForPartnersComponent],
    exports: [],
    providers: []
})
export class ForPartnersModule {

}