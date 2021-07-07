/*MODULES*/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '../translate/translate.module';
import { AboutCompanyRoutingModule } from './about-company-routing.module';

/*COMPONENTS*/
import { AboutCompanyComponent } from './components/about-company.component';

/*PIPES, SERVICES, DIRECTIVES*/

@NgModule({
    imports: [
        CommonModule,
        TranslateModule,
        AboutCompanyRoutingModule,
    ],
    declarations: [
        AboutCompanyComponent,
    ],
    entryComponents: [
        AboutCompanyComponent,
    ],
    exports: [],
    providers: []
})
export class AboutCompanyModule {
}